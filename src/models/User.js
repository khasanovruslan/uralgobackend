// File: src/models/User.js

const { Model, snakeCaseMappers } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password;
    delete json.passport;
    return json;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['fullName', 'email', 'password'],
      properties: {
        id: {
          type: 'integer',
        },
        fullName: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        email: {
          type: 'string',
          format: 'email',
          minLength: 1,
          maxLength: 255,
        },
        password: {
          type: 'string',
          minLength: 1,
          maxLength: 255,
        },
        phone: {
          type: ['string', 'null'],
          minLength: 10,
          maxLength: 20,
        },
        city: {
          type: ['string', 'null'],
          maxLength: 255,
        },
        birthDate: {
          type: ['string', 'null'],
          format: 'date',
        },
        passport: {
          type: ['string', 'null'],
          maxLength: 50,
        },
        isDriver: {
          type: 'boolean',
        },
        driverLicense: {
          type: ['string', 'null'],
          maxLength: 255,
        },
        photoUrl: {
          type: ['string', 'null'],
          maxLength: 512,
        },
        avatarUrl: {
          type: ['string', 'null'],
          maxLength: 512,
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
    const Trip                  = require('./Trip');
    const Role                  = require('./Role');
    const Booking               = require('./Booking');
    const TripMessage           = require('./TripMessage');
    const Experience            = require('./Experience');
    const ExperienceParticipant = require('./ExperienceParticipant');

    return {
      // Поездки, которые создал пользователь
      trips: {
        relation: Model.HasManyRelation,
        modelClass: Trip,
        join: {
          from: 'users.id',
          to:   'trips.creator_id',
        },
      },

      // Роли пользователя (многие-ко-многим через users_roles)
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'users.id',
          through: {
            from: 'users_roles.user_id',
            to:   'users_roles.role_id',
          },
          to: 'roles.id',
        },
      },

      // Бронирования пользователя
      bookings: {
        relation: Model.HasManyRelation,
        modelClass: Booking,
        join: {
          from: 'users.id',
          to:   'bookings.user_id',
        },
      },

      // Сообщения пользователя в чатах поездок
      tripMessages: {
        relation: Model.HasManyRelation,
        modelClass: TripMessage,
        join: {
          from: 'users.id',
          to:   'trip_messages.user_id',
        },
      },

      // Впечатления, которые создал пользователь
      experiencesCreated: {
        relation: Model.HasManyRelation,
        modelClass: Experience,
        join: {
          from: 'users.id',
          to:   'experiences.creator_id',
        },
      },

      // Впечатления, в которых пользователь участвует
      experiencesParticipating: {
        relation: Model.ManyToManyRelation,
        modelClass: Experience,
        join: {
          from: 'users.id',
          through: {
            from: 'experience_participants.user_id',
            to:   'experience_participants.experience_id',
          },
          to: 'experiences.id',
        },
      },

      // (Опционально) прямая связь к таблице-связке опытов
      experienceParticipants: {
        relation: Model.HasManyRelation,
        modelClass: ExperienceParticipant,
        join: {
          from: 'users.id',
          to:   'experience_participants.user_id',
        },
      },
    };
  }
}

module.exports = User;
