// File: src/models/EventMember.js

const { Model, snakeCaseMappers } = require('objection');

console.log('>>> inside EventMember definition; snakeCaseMappers applied:', !!(snakeCaseMappers()));



class EventMember extends Model {
  static get tableName() {
    return 'event_members';
  }

  // 1) PK в таблице – именно эти колонки в БД
  static get idColumn() {
    return ['event_id', 'user_id'];
  }

  // 2) Включаем конвертацию camelCase ↔ snake_case
  static get columnNameMappers() {
    return snakeCaseMappers();
  }
  

  // 3) Убираем требование camelCase-полей и/или добавляем snake_case
  //    Теперь в качестве допустимых ключей для вставки можно использовать
  //    либо eventId/userId (camelCase), либо event_id/user_id (snake_case).
  //
  //    Для простоты мы оставим только свойства в snake_case, а camelCase-поля
  //    в required уберём совсем.
  static get jsonSchema() {
    return {
      type: 'object',
      // Если хотите разрешать оба варианта, можно сделать так:
      // required: ['eventId', 'userId'], 
      // а затем ниже в properties добавить и event_id, и eventId.
      //
      // Но для быстрого решения достаточно не требовать ни camelCase, ни snake_case:
      properties: {
        // Допускаем вставку как camelCase (если когда-нибудь snakeCaseMappers заработает),
        // так и snake_case (для текущего обхода):
        eventId:   { type: 'integer' },  // если вы вставите { eventId: … }
        userId:    { type: 'integer' },  //   — Objection сконвертирует это в event_id/user_id
        event_id:  { type: 'integer' },  // если вставляете { event_id: … } напрямую
        user_id:   { type: 'integer' },  //   — Обход верификации
        status:    { type: 'string', enum: ['pending','confirmed','canceled'] },
        joinedAt:  { type: ['string','null'], format: 'date-time' },
        joined_at: { type: ['string','null'], format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    const Event = require('./Event');
    const User  = require('./User');

    return {
      event: {
        relation: Model.BelongsToOneRelation,
        modelClass: Event,
        join: {
          from: 'event_members.event_id',
          to:   'events.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'event_members.user_id',
          to:   'users.id',
        },
      },
    };
  }
}

module.exports = EventMember;
