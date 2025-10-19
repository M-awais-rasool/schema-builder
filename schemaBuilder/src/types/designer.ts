export interface SchemaAction {
  type: string;
  data: any;
  tables?: any[];
  relationships?: Relationship[];
}

export interface Relationship {
  id: string;
  from: string;
  to: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  from_port: string;
  to_port: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  schemaAction?: SchemaAction;
}

export interface TableField {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isNotNull: boolean;
  isUnique: boolean;
  defaultValue?: string;
  isForeignKey: boolean;
  references?: {
    tableId: string;
    fieldId: string;
  };
}