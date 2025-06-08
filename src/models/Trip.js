// File: src/models/Trip.js

const { Model, snakeCaseMappers } = require('objection');

class Trip extends Model {
  static get tableName() {
    return 'trips';
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
      required: [
        'origin',
        'destination',
        'departureTime',
        'seats'
      ],
      properties: {
        id: {
          type: 'integer',
        },
        creatorId: {
          type: 'integer',
        },
        origin: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        destination: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        departureTime: {
          type: 'string',
          format: 'date-time',
        },
        seats: {
          type: 'integer',
          minimum: 1,
        },
        availableSeats: {
          type: 'integer',
          minimum: 0,
        },
        allowBooking: {
          type: 'boolean',
        },
        price: {
          type: ['number', 'null'],
        },
        description: {
          type: ['string', 'null'],
          maxLength: 1000,
        },
        status: {
          type: 'string',
          enum: ['planned', 'in_progress', 'finished', 'canceled'],
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
    const User        = require('./User');
    const Booking     = require('./Booking');
    const TripMessage = require('./TripMessage');

    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'trips.creator_id',
          to: 'users.id',
        },
      },
      bookings: {
        relation: Model.HasManyRelation,
        modelClass: Booking,
        join: {
          from: 'trips.id',
          to: 'bookings.trip_id',
        },
      },
      messages: {
        relation: Model.HasManyRelation,
        modelClass: TripMessage,
        join: {
          from: 'trips.id',
          to: 'trip_messages.trip_id',
        },
      },
    };
  }
}

module.exports = Trip;
