// File: src/models/TripMessage.js

const { Model, snakeCaseMappers } = require('objection');

class TripMessage extends Model {
  static get tableName() {
    return 'trip_messages';
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
      required: ['tripId', 'userId', 'content'],
      properties: {
        id: {
          type: 'integer',
        },
        tripId: {
          type: 'integer',
        },
        userId: {
          type: 'integer',
        },
        content: {
          type: 'string',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    };
  }

  static get relationMappings() {
    const Trip = require('./Trip');
    const User = require('./User');

    return {
      trip: {
        relation: Model.BelongsToOneRelation,
        modelClass: Trip,
        join: {
          from: 'trip_messages.trip_id',
          to:   'trips.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'trip_messages.user_id',
          to:   'users.id',
        },
      },
    };
  }
}

module.exports = TripMessage;
