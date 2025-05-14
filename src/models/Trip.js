const { Model } = require('objection');

class Trip extends Model {
  static get tableName() {
    return 'trips';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['creator_id', 'origin', 'destination', 'departure_time', 'seats'],
      properties: {
        id: { type: 'integer' },
        creator_id: { type: 'integer' },
        origin: { type: 'string', minLength: 1, maxLength: 255 },
        destination: { type: 'string', minLength: 1, maxLength: 255 },
        departure_time: { type: 'string', format: 'date-time' },
        seats: { type: 'integer' },
        price: { type: ['number', 'null'] },
        description: { type: ['string', 'null'], maxLength: 1000 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        available_seats: { type: 'integer' },
        initial_passengers: { type: 'integer' },
        allow_booking: { type: 'boolean' },
      }
    };
  }

  static get relationMappings() {
    const User = require('./User');
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'trips.creator_id',
          to: 'users.id'
        }
      }
    };
  }
}

module.exports = Trip;
