// File: src/models/ExperienceParticipant.js

const { Model, snakeCaseMappers } = require('objection');

class ExperienceParticipant extends Model {
  static get tableName() {
    return 'experience_participants';
  }

  // Указываем Objection, что первичный ключ — composite PK из двух полей БД
  static get idColumn() {
    return ['experience_id', 'user_id'];
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['experienceId', 'userId'],
      properties: {
        experienceId: { type: 'integer' },
        userId:       { type: 'integer' },
        joinedAt:     { type: ['string', 'null'], format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    const Experience = require('./Experience');
    const User       = require('./User');

    return {
      experience: {
        relation: Model.BelongsToOneRelation,
        modelClass: Experience,
        join: {
          from: 'experience_participants.experience_id',
          to:   'experiences.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'experience_participants.user_id',
          to:   'users.id',
        },
      },
    };
  }
}

module.exports = ExperienceParticipant;
