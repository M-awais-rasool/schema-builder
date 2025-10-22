package services

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"github.com/sirupsen/logrus"
	"google.golang.org/api/option"

	"schema-builder-backend/internal/config"
	"schema-builder-backend/internal/models"
	"schema-builder-backend/pkg/logger"
)

type AIService struct {
	client *genai.Client
	log    *logrus.Logger
}

type ChatRequest struct {
	Message   string `json:"message" validate:"required,max=2000"`
	SessionID string `json:"session_id,omitempty"`
}

type ChatResponse struct {
	Message      string        `json:"message"`
	SessionID    string        `json:"session_id"`
	SchemaAction *SchemaAction `json:"schema_action,omitempty"`
}

type SchemaAction struct {
	Type          string                 `json:"type"` 
	Data          map[string]interface{} `json:"data"`
	Tables        []models.Table         `json:"tables,omitempty"`
	Relationships []Relationship         `json:"relationships,omitempty"`
}

type Relationship struct {
	ID       string `json:"id"`
	From     string `json:"from"`
	To       string `json:"to"`
	Type     string `json:"type"`
	FromPort string `json:"from_port"`
	ToPort   string `json:"to_port"`
}

func NewAIService(cfg *config.Config) (*AIService, error) {
	log := logger.GetLogger()

	if cfg.AI.GeminiAPIKey == "" {
		return nil, fmt.Errorf("gemini API key is required")
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(cfg.AI.GeminiAPIKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create Gemini client: %v", err)
	}

	return &AIService{
		client: client,
		log:    log,
	}, nil
}

func (s *AIService) Chat(ctx context.Context, req *ChatRequest) (*ChatResponse, error) {
	s.log.Infof("Processing chat request: %s", req.Message)

	model := s.client.GenerativeModel("gemini-2.0-flash")

	model.SystemInstruction = &genai.Content{
		Parts: []genai.Part{genai.Text(`You are a database schema design assistant. Your job is to help users create database schemas through natural language.

When a user asks to create tables, models, or database structures:

1. First, provide a friendly explanation of what you're creating
2. Break down the table structure step by step
3. Always end your response with a JSON schema definition wrapped in <SCHEMA_JSON> tags

IMPORTANT: Do NOT put the <SCHEMA_JSON> tags inside code blocks. Use them directly in your response.

The JSON format should be:
<SCHEMA_JSON>
{
  "action": "create_schema",
  "tables": [
    {
      "id": "unique_table_id",
      "name": "table_name",
      "position": {"x": 100, "y": 100},
      "fields": [
        {
          "id": "field_id",
          "name": "field_name",
          "type": "VARCHAR(255)",
          "is_primary_key": true,
          "is_not_null": true,
          "is_unique": false,
          "is_foreign_key": false
        }
      ]
    }
  ],
  "relationships": [
    {
      "id": "relationship_id",
      "from": "source_table_id",
      "to": "target_table_id",
      "type": "one-to-many",
      "from_port": "source_field_id",
      "to_port": "target_field_id"
    }
  ]
}
</SCHEMA_JSON>

Field types should be standard SQL types like:
- INTEGER, BIGINT
- VARCHAR(length), TEXT
- BOOLEAN
- TIMESTAMP, DATE, TIME
- DECIMAL(precision, scale)
- JSON

Always include an 'id' field as the primary key unless the user specifically requests otherwise.

For relationships:
- one-to-one: Each record in table A relates to exactly one record in table B
- one-to-many: Each record in table A can relate to multiple records in table B
- many-to-many: Records in both tables can relate to multiple records in the other table

When creating relationships, ensure foreign key fields exist and are properly typed.

Position tables in a grid layout, spacing them 300px apart horizontally and 200px apart vertically.

Be conversational and helpful, explaining your design decisions.`)},
	}

	cs := model.StartChat()

	resp, err := cs.SendMessage(ctx, genai.Text(req.Message))
	if err != nil {
		s.log.Errorf("Failed to send message to Gemini: %v", err)
		return &ChatResponse{
			Message:   "I'm sorry, I encountered an error processing your request. Please try again.",
			SessionID: req.SessionID,
		}, nil
	}

	var responseText string
	for _, candidate := range resp.Candidates {
		if candidate.Content != nil {
			for _, part := range candidate.Content.Parts {
				if textPart, ok := part.(genai.Text); ok {
					responseText += string(textPart)
				}
			}
		}
	}

	s.log.Infof("Gemini response: %s", responseText)

	schemaAction, cleanText := s.extractSchemaAction(responseText)

	s.log.Infof("Extracted schema action: %+v", schemaAction)
	if schemaAction != nil {
		s.log.Infof("Schema action type: %s", schemaAction.Type)
		s.log.Infof("Number of tables: %d", len(schemaAction.Tables))
	}

	return &ChatResponse{
		Message:      cleanText,
		SessionID:    req.SessionID,
		SchemaAction: schemaAction,
	}, nil
}

func (s *AIService) extractSchemaAction(text string) (*SchemaAction, string) {
	re := regexp.MustCompile("(?s)(?:```json\\s*)?<SCHEMA_JSON>(.*?)</SCHEMA_JSON>(?:\\s*```)?")
	matches := re.FindStringSubmatch(text)

	if len(matches) < 2 {
		s.log.Warn("No SCHEMA_JSON tags found in response")
		s.log.Infof("Response text: %s", text)
		return nil, text
	}

	jsonStr := strings.TrimSpace(matches[1])
	cleanText := re.ReplaceAllString(text, "")
	cleanText = strings.TrimSpace(cleanText)

	var actionData map[string]interface{}
	if err := json.Unmarshal([]byte(jsonStr), &actionData); err != nil {
		s.log.Errorf("Failed to parse schema JSON: %v", err)
		s.log.Errorf("JSON string was: %s", jsonStr)
		return nil, cleanText
	}

	action := &SchemaAction{
		Type: "create_schema",
		Data: actionData,
	}

	if tablesData, ok := actionData["tables"].([]interface{}); ok {
		for _, tableData := range tablesData {
			if tableMap, ok := tableData.(map[string]interface{}); ok {
				table := s.convertToTable(tableMap)
				if table != nil {
					action.Tables = append(action.Tables, *table)
				}
			}
		}
	}

	if relationshipsData, ok := actionData["relationships"].([]interface{}); ok {
		for _, relationshipData := range relationshipsData {
			if relationshipMap, ok := relationshipData.(map[string]interface{}); ok {
				relationship := s.convertToRelationship(relationshipMap)
				if relationship != nil {
					action.Relationships = append(action.Relationships, *relationship)
				}
			}
		}
	}

	return action, cleanText
}

func (s *AIService) convertToRelationship(data map[string]interface{}) *Relationship {
	relationship := &Relationship{}

	if id, ok := data["id"].(string); ok {
		relationship.ID = id
	}
	if from, ok := data["from"].(string); ok {
		relationship.From = from
	}
	if to, ok := data["to"].(string); ok {
		relationship.To = to
	}
	if relType, ok := data["type"].(string); ok {
		relationship.Type = relType
	}
	if fromPort, ok := data["from_port"].(string); ok {
		relationship.FromPort = fromPort
	}
	if toPort, ok := data["to_port"].(string); ok {
		relationship.ToPort = toPort
	}

	return relationship
}

func (s *AIService) convertToTable(data map[string]interface{}) *models.Table {
	table := &models.Table{}

	if id, ok := data["id"].(string); ok {
		table.ID = id
	}
	if name, ok := data["name"].(string); ok {
		table.Name = name
	}

	if posData, ok := data["position"].(map[string]interface{}); ok {
		if x, ok := posData["x"].(float64); ok {
			table.Position.X = x
		}
		if y, ok := posData["y"].(float64); ok {
			table.Position.Y = y
		}
	}

	if fieldsData, ok := data["fields"].([]interface{}); ok {
		for _, fieldData := range fieldsData {
			if fieldMap, ok := fieldData.(map[string]interface{}); ok {
				field := s.convertToField(fieldMap)
				if field != nil {
					table.Fields = append(table.Fields, *field)
				}
			}
		}
	}

	return table
}

func (s *AIService) convertToField(data map[string]interface{}) *models.Field {
	field := &models.Field{}

	if id, ok := data["id"].(string); ok {
		field.ID = id
	}
	if name, ok := data["name"].(string); ok {
		field.Name = name
	}
	if fieldType, ok := data["type"].(string); ok {
		field.Type = fieldType
	}
	if isPrimaryKey, ok := data["is_primary_key"].(bool); ok {
		field.IsPrimaryKey = isPrimaryKey
	}
	if isNotNull, ok := data["is_not_null"].(bool); ok {
		field.IsNotNull = isNotNull
	}
	if isUnique, ok := data["is_unique"].(bool); ok {
		field.IsUnique = isUnique
	}
	if isForeignKey, ok := data["is_foreign_key"].(bool); ok {
		field.IsForeignKey = isForeignKey
	}
	if defaultValue, ok := data["default_value"].(string); ok {
		field.DefaultValue = defaultValue
	}

	if referencesData, ok := data["references"].(map[string]interface{}); ok {
		references := &models.Reference{}
		if tableID, ok := referencesData["table_id"].(string); ok {
			references.TableID = tableID
		}
		if fieldID, ok := referencesData["field_id"].(string); ok {
			references.FieldID = fieldID
		}
		field.References = references
	}

	return field
}

func (s *AIService) Close() error {
	if s.client != nil {
		return s.client.Close()
	}
	return nil
}
