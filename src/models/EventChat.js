// src/models/EventChat.js
const { Model, snakeCaseMappers } = require('objection');

class EventChat extends Model {
  static get tableName() {
    return 'event_chats';
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
      required: ['eventId'],
      properties: {
        id:       { type: 'integer' },
        eventId:  { type: 'integer' },
        createdAt:{ type: 'string', format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    const Event                = require('./Event');
    const EventChatMessage     = require('./EventChatMessage');

    return {
      event: {
        relation: Model.BelongsToOneRelation,
        modelClass: Event,
        join: {
          from: 'event_chats.event_id',
          to:   'events.id',
        },
      },
      messages: {
        relation: Model.HasManyRelation,
        modelClass: EventChatMessage,
        join: {
          from: 'event_chats.id',
          to:   'event_chat_messages.chat_id',
        },
      },
    };
  }
}

module.exports = EventChat;
