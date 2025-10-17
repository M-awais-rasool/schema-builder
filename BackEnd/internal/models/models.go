package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	CognitoSub string             `bson:"cognito_sub" json:"cognito_sub"`
	Email      string             `bson:"email" json:"email"`
	FirstName  string             `bson:"first_name" json:"first_name"`
	LastName   string             `bson:"last_name" json:"last_name"`
	Username   string             `bson:"username" json:"username"`
	Avatar     string             `bson:"avatar,omitempty" json:"avatar,omitempty"`
	IsVerified bool               `bson:"is_verified" json:"is_verified"`
	CreatedAt  time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt  time.Time          `bson:"updated_at" json:"updated_at"`
}

type CreateUserRequest struct {
	CognitoSub string `json:"cognito_sub" validate:"required"`
	Email      string `json:"email" validate:"required,email"`
	FirstName  string `json:"first_name" validate:"required,min=2,max=50"`
	LastName   string `json:"last_name" validate:"required,min=2,max=50"`
	Username   string `json:"username" validate:"required,min=3,max=30"`
}

type UpdateUserRequest struct {
	FirstName string `json:"first_name" validate:"omitempty,min=2,max=50"`
	LastName  string `json:"last_name" validate:"omitempty,min=2,max=50"`
	Username  string `json:"username" validate:"omitempty,min=3,max=30"`
	Avatar    string `json:"avatar" validate:"omitempty,url"`
}

type Schema struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description,omitempty" json:"description,omitempty"`
	Tables      []Table            `bson:"tables" json:"tables"`
	Version     int                `bson:"version" json:"version"`
	IsPublic    bool               `bson:"is_public" json:"is_public"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at"`
}

type Table struct {
	ID          string       `bson:"id" json:"id"`
	Name        string       `bson:"name" json:"name"`
	Position    Position     `bson:"position" json:"position"`
	Fields      []Field      `bson:"fields" json:"fields"`
	Indexes     []Index      `bson:"indexes,omitempty" json:"indexes,omitempty"`
	Constraints []Constraint `bson:"constraints,omitempty" json:"constraints,omitempty"`
}

type Field struct {
	ID           string `bson:"id" json:"id"`
	Name         string `bson:"name" json:"name"`
	Type         string `bson:"type" json:"type"`
	Length       int    `bson:"length,omitempty" json:"length,omitempty"`
	Precision    int    `bson:"precision,omitempty" json:"precision,omitempty"`
	Scale        int    `bson:"scale,omitempty" json:"scale,omitempty"`
	IsNullable   bool   `bson:"is_nullable" json:"is_nullable"`
	IsPrimaryKey bool   `bson:"is_primary_key" json:"is_primary_key"`
	IsUnique     bool   `bson:"is_unique" json:"is_unique"`
	DefaultValue string `bson:"default_value,omitempty" json:"default_value,omitempty"`
	Comment      string `bson:"comment,omitempty" json:"comment,omitempty"`
}

type Position struct {
	X float64 `bson:"x" json:"x"`
	Y float64 `bson:"y" json:"y"`
}

type Index struct {
	Name     string   `bson:"name" json:"name"`
	Type     string   `bson:"type" json:"type"`
	Fields   []string `bson:"fields" json:"fields"`
	IsUnique bool     `bson:"is_unique" json:"is_unique"`
}

type Constraint struct {
	Name           string `bson:"name" json:"name"`
	Type           string `bson:"type" json:"type"`
	Field          string `bson:"field" json:"field"`
	ReferenceTable string `bson:"reference_table,omitempty" json:"reference_table,omitempty"`
	ReferenceField string `bson:"reference_field,omitempty" json:"reference_field,omitempty"`
	OnUpdate       string `bson:"on_update,omitempty" json:"on_update,omitempty"`
	OnDelete       string `bson:"on_delete,omitempty" json:"on_delete,omitempty"`
	CheckCondition string `bson:"check_condition,omitempty" json:"check_condition,omitempty"`
}

type CreateSchemaRequest struct {
	Name        string  `json:"name" validate:"required,min=1,max=100"`
	Description string  `json:"description" validate:"omitempty,max=500"`
	Tables      []Table `json:"tables" validate:"omitempty,dive"`
	IsPublic    bool    `json:"is_public"`
}

type UpdateSchemaRequest struct {
	Name        string  `json:"name" validate:"omitempty,min=1,max=100"`
	Description string  `json:"description" validate:"omitempty,max=500"`
	Tables      []Table `json:"tables" validate:"omitempty,dive"`
	IsPublic    *bool   `json:"is_public" validate:"omitempty"`
}

type ErrorResponse struct {
	Error   string                 `json:"error"`
	Message string                 `json:"message"`
	Details map[string]interface{} `json:"details,omitempty"`
}

type SuccessResponse struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
