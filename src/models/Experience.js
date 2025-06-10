// File: src/models/Experience.js

const { Model, snakeCaseMappers } = require('objection');

class Experience extends Model {
  static get tableName() {
    return 'experiences';
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
      required: ['creatorId', 'title', 'location', 'startTime', 'maxParticipants'],
      properties: {
        id: {
          type: 'integer',
        },
        creatorId: {
          type: 'integer',
        },
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        description: {
          type: ['string', 'null'],
        },
        location: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        startTime: {
          type: 'string',
          format: 'date-time',
        },
        endTime: {
          type: ['string', 'null'],
          format: 'date-time',
        },
        maxParticipants: {
          type: 'integer',
          minimum: 1,
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
    const User                  = require('./User');
    const ExperienceParticipant = require('./ExperienceParticipant');

    return {
      // Создатель впечатления
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'experiences.creator_id',
          to:   'users.id',
        },
      },

      // Прямая связь к таблице experience_participants
      experienceParticipants: {
        relation: Model.HasManyRelation,
        modelClass: ExperienceParticipant,
        join: {
          from: 'experiences.id',
          to:   'experience_participants.experience_id',
        },
      },

      // Список участников через many-to-many (без extra)
      participants: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'experiences.id',
          through: {
            from: 'experience_participants.experience_id',
            to:   'experience_participants.user_id',
            // Убрали extra: ['status','joined_at']
          },
          to: 'users.id',
        },
      },
    };
  }
}

module.exports = Experience;
