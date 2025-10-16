// MongoDB initialization script
db = db.getSiblingDB('schema_builder');

// Create application user
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'schema_builder'
    }
  ]
});

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['cognito_sub', 'email', 'first_name', 'last_name', 'username', 'created_at', 'updated_at'],
      properties: {
        cognito_sub: {
          bsonType: 'string',
          description: 'Cognito subject ID is required'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'Valid email is required'
        },
        first_name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 50,
          description: 'First name is required'
        },
        last_name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 50,
          description: 'Last name is required'
        },
        username: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 30,
          description: 'Username is required'
        },
        avatar: {
          bsonType: 'string',
          description: 'Avatar URL'
        },
        is_verified: {
          bsonType: 'bool',
          description: 'Email verification status'
        },
        created_at: {
          bsonType: 'date',
          description: 'Creation timestamp is required'
        },
        updated_at: {
          bsonType: 'date',
          description: 'Update timestamp is required'
        }
      }
    }
  }
});

db.createCollection('schemas', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'name', 'tables', 'version', 'created_at', 'updated_at'],
      properties: {
        user_id: {
          bsonType: 'objectId',
          description: 'User ID is required'
        },
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'Schema name is required'
        },
        description: {
          bsonType: 'string',
          maxLength: 500,
          description: 'Schema description'
        },
        tables: {
          bsonType: 'array',
          description: 'Tables array is required'
        },
        version: {
          bsonType: 'int',
          minimum: 1,
          description: 'Version number is required'
        },
        is_public: {
          bsonType: 'bool',
          description: 'Public visibility flag'
        },
        created_at: {
          bsonType: 'date',
          description: 'Creation timestamp is required'
        },
        updated_at: {
          bsonType: 'date',
          description: 'Update timestamp is required'
        }
      }
    }
  }
});

print('Database initialization completed successfully!');