// File: src/models/Booking.js

const { Model, snakeCaseMappers } = require('objection');

class Booking extends Model {
  static get tableName() {
    return 'bookings';
  }

  static get columnNameMappers() {
  return snakeCaseMappers();
}

  $formatJson(json) {
    json = super.$formatJson(json);
    return json;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'tripId', 'seatsReserved'],
      properties: {
        id: {
          type: 'integer',
        },
        userId: {
          type: 'integer',
        },
        tripId: {
          type: 'integer',
        },
        seatsReserved: {
          type: 'integer',
          minimum: 1,
        },
        status: {
          type: 'string',
          enum: ['pending', 'confirmed', 'canceled'],
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    };
  }

  static get relationMappings() {
    const User = require('./User');
    const Trip = require('./Trip');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'bookings.user_id',
          to: 'users.id',
        },
      },
      trip: {
        relation: Model.BelongsToOneRelation,
        modelClass: Trip,
        join: {
          from: 'bookings.trip_id',
          to: 'trips.id',
        },
      },
    };
  }
}

module.exports = Booking;
