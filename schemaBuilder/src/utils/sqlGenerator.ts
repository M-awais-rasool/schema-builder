import type { Node, Edge } from 'reactflow';
import type { TableField } from '../types/designer';

export const generateSQL = (nodes: Node[], edges: Edge[]): string => {
  const tableStatements = nodes.map((node: Node) => {
    let fieldDefinitions = node.data.fields?.map((field: TableField) => {
      let fieldDef = `  ${field.name} ${field.type}`;
      
      if (field.isNotNull) fieldDef += ' NOT NULL';
      if (field.isUnique && !field.isPrimaryKey) fieldDef += ' UNIQUE';
      if (field.defaultValue) fieldDef += ` DEFAULT '${field.defaultValue}'`;
      
      return fieldDef;
    }) || ['  id INTEGER PRIMARY KEY'];
    
    const primaryKeys = node.data.fields?.filter((field: TableField) => field.isPrimaryKey) || [];
    if (primaryKeys.length > 0) {
      const pkFields = primaryKeys.map((pk: TableField) => pk.name).join(', ');
      fieldDefinitions.push(`  PRIMARY KEY (${pkFields})`);
    }
    
    const fields = fieldDefinitions.join(',\n');
    
    return `CREATE TABLE ${node.data.label} (\n${fields}\n);`;
  }).join('\n\n');

  const foreignKeyStatements = edges.map((edge: Edge) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (!sourceNode || !targetNode) return '';
    
    const sourceField = sourceNode.data.fields?.find((f: TableField) => f.id === edge.sourceHandle);
    const targetField = targetNode.data.fields?.find((f: TableField) => f.id === edge.targetHandle);
    
    if (!sourceField || !targetField) return '';
    
    return `ALTER TABLE ${targetNode.data.label} 
ADD CONSTRAINT FK_${targetNode.data.label}_${targetField.name} 
FOREIGN KEY (${targetField.name}) REFERENCES ${sourceNode.data.label}(${sourceField.name});`;
  }).filter(stmt => stmt !== '').join('\n\n');

  return [tableStatements, foreignKeyStatements].filter(stmt => stmt !== '').join('\n\n');
};