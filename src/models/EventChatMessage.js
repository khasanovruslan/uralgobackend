// src/models/EventChatMessage.js
const { Model, snakeCaseMappers } = require('objection');

class EventChatMessage extends Model {
  static get tableName() {
    return 'event_chat_messages';
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
      required: ['chatId','userId','text'],
      properties: {
        id:        { type: 'integer' },
        chatId:    { type: 'integer' },
        userId:    { type: 'integer' },
        text:      { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    const EventChat = require('./EventChat');
    const User      = require('./User');

    return {
      chat: {
        relation: Model.BelongsToOneRelation,
        modelClass: EventChat,
        join: {
          from: 'event_chat_messages.chat_id',
          to:   'event_chats.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'event_chat_messages.user_id',
          to:   'users.id',
        },
      },
    };
  }
}

module.exports = EventChatMessage;
