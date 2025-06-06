// File: src/models/Event.js

const { Model, snakeCaseMappers } = require('objection');

class Event extends Model {
  static get tableName() {
    return 'events';
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
      required: ['type', 'title', 'latitude', 'longitude', 'ownerId'],
      properties: {
        id: {
          type: 'integer',
        },
        type: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        latitude: {
          type: 'number',
        },
        longitude: {
          type: 'number',
        },
        ownerId: {
          type: 'integer',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    };
  }

  static get relationMappings() {
    const User       = require('./User');
    const EventMember = require('./EventMember');

    return {
      // Владелец мероприятия
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'events.owner_id',
          to:   'users.id',
        },
      },

      // Участники через связь
      members: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'events.id',
          through: {
            from: 'event_members.event_id',
            to:   'event_members.user_id',
          },
          to: 'users.id',
        },
      },

      // Прямая связь с таблицей event_members (для статусов, joined_at)
      eventMembers: {
        relation: Model.HasManyRelation,
        modelClass: EventMember,
        join: {
          from: 'events.id',
          to:   'event_members.event_id',
        },
      },
    };
  }
}

module.exports = Event;
