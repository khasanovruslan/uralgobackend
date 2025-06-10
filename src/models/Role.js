// File: src/models/Role.js

const { Model, snakeCaseMappers } = require('objection');

class Role extends Model {
  static get tableName() {
    return 'roles';
  }

  static get idColumn() {
    return 'id';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: {
          type: 'integer',
        },
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
      },
    };
  }

  static get relationMappings() {
    const User = require('./User');
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          through: {
            from: 'users_roles.role_id',
            to: 'users_roles.user_id',
          },
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Role;
