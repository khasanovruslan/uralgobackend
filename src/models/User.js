const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {    
      type: 'object',
      required: ['email'],
      properties: {
        id:            { type: 'integer' },
        name:          { type: ['string','null'], maxLength: 255 },
        email:         { type: 'string', minLength: 1, maxLength: 255 },
        password:      { type: 'string', minLength: 1, maxLength: 255 },
        phone:         { type: ['string','null'], minLength: 10, maxLength: 20 },
        city:          { type: ['string','null'], maxLength: 255 },
        birthDate:     { type: ['string','null'], format: 'date' },
        passport:      { type: ['string','null'], maxLength: 50 },
        isDriver:      { type: 'boolean', default: false },
        driverLicense: { type: ['string','null'], maxLength: 255 },
        createdAt:     { type: ['string','null'], format: 'date-time' },
        updatedAt:     { type: ['string','null'], format: 'date-time' }
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
