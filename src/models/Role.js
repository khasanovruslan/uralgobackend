// src/models/Role.js
const { Model } = require('objection');

class Role extends Model {
  static get tableName() {
    return 'roles';
  }
  static get idColumn() {
    return 'id';
  }
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id:   { type: 'integer' },
        name: { type: 'string', maxLength: 50 }
      }
    };
  }
}

module.exports = Role;

