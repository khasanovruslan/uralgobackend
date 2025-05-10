const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {    
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id: { type: 'integer' },
        name: { type: ['string', 'null'], maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 }, // bcrypt хэш
        phone: { type: ['string', 'null'], minLength: 10, maxLength: 20 },
        created_at: { type: ['string', 'null'], format: 'date-time' },
        updated_at: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Trip = require('./Trip');
    return {
      trips: {
        relation: Model.HasManyRelation,
        modelClass: Trip,
        join: {
          from: 'users.id',
          to: 'trips.creator_id'
        }
      }
    };
  }
}

module.exports = User;
