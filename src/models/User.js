// src/models/User.js
const { Model, snakeCaseMappers } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  // ← Добавляем этот геттер:
  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get jsonSchema() {
    return {    
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id:             { type: 'integer' },
        name:           { type: ['string','null'], maxLength: 255 },
        email:          { type: 'string', minLength: 1, maxLength: 255 },
        password:       { type: 'string', minLength: 1, maxLength: 255 },
        phone:          { type: ['string','null'], minLength: 10, maxLength: 20 },
        city:           { type: ['string','null'], maxLength: 255 },
        birthDate:      { type: ['string','null'], format: 'date' },
        passport:       { type: ['string','null'], maxLength: 50 },
        isDriver:       { type: 'boolean', default: false },
        driverLicense:  { type: ['string','null'], maxLength: 255 },
        photoUrl:       { type: ['string','null'], maxLength: 512 },
        createdAt:      { type: ['string','null'], format: 'date-time' },
        updatedAt:      { type: ['string','null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Trip = require('./Trip');
    const Role = require('./Role');

    return {
      trips: {
        relation: Model.HasManyRelation,
        modelClass: Trip,
        join: {
          from: 'users.id',
          to:   'trips.creator_id'
        }
      },
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          through: {
            from: 'users_roles.user_id',
            to:   'users_roles.role_id'
          },
          to: 'roles.id'
        }
      }
    };
  }
}

module.exports = User;
