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
    // Удаляем snake_case-поля, если они появились рядом с camelCase
    delete json.start_time;
    delete json.end_time;
    delete json.max_participants;
    delete json.image_url;
    return json;
  }


    static get jsonSchema() {
     return {
       type: 'object',
      required: ['type', 'title', 'latitude', 'longitude', 'ownerId'],
       properties: {
         id:           { type: 'integer' },
         type:         { type: 'string', minLength: 1, maxLength: 50 },
         title:        { type: 'string', minLength: 1, maxLength: 255 },
        description:  { type: ['string','null'] },
        latitude:     { type: 'number' },
        longitude:    { type: 'number' },
        address:      { type: ['string','null'] },
        startTime:    { type: ['string','null'], format: 'date-time' },
        endTime:      { type: ['string','null'], format: 'date-time' },
        maxParticipants: { type: ['integer','null'] },
        imageUrl:     { type: ['string','null'], maxLength: 255 },
        category:     { type: ['string','null'], maxLength: 100 },
        tags:         { type: ['array','null'], items: { type: 'string' } },
        createdAt:    { type: 'string', format: 'date-time' },
        updatedAt:    { type: 'string', format: 'date-time' },
        ownerId:      { type: 'integer' },
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
      // Чат события (1:1)
      chat: {
        relation: Model.HasOneRelation,
        modelClass: require('./EventChat'),
        join: {
          from: 'events.id',
          to:   'event_chats.event_id',
        },
      },
    };
  }
}

module.exports = Event;
