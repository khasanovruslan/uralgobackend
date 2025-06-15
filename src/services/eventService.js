// src/services/eventService.js
const Event       = require('../models/Event');
const EventMember = require('../models/EventMember');
const chatSvc     = require('./chatEventService');

module.exports = {
  /**
   * Создаёт новое событие, добавляет создателя в участники и создаёт чат
   * @param {number} ownerId
   * @param {object} data
   */
  async createEvent(ownerId, data) {
    // Проверка дубля на тех же координатах
    const dup = await Event.query()
      .where('owner_id', ownerId)
      .andWhere('latitude', data.latitude)
      .andWhere('longitude', data.longitude)
      .first();
    if (dup) throw new Error('Вы уже создали событие в этой точке');

    // Вставка события
    const ev = await Event.query().insertAndFetch({
      type:            data.type,
      title:           data.title,
      description:     data.description,
      address:         data.address,
      start_time:      data.startTime,
      end_time:        data.endTime,
      max_participants:data.maxParticipants,
      category:        data.category,
      tags:            data.tags,
      latitude:        data.latitude,
      longitude:       data.longitude,
      image_url:       data.imageUrl,
      ownerId:         ownerId,
    });

    // Добавляем создателя как участника
    await EventMember.query().insert({
      event_id: ev.id,
      user_id:  ownerId,
      status:   'confirmed',
    });

    // Создаём чат
    await chatSvc.createChatForEvent(ev.id);

    return ev;
  },

  /**
   * Список событий в квадрате bbox = [minLat,minLng,maxLat,maxLng]
   */
  async listEvents({ bbox }) {
    const q = Event.query();
    if (bbox) {
      const [minLat, minLng, maxLat, maxLng] = bbox;
      q.whereBetween('latitude', [minLat, maxLat])
       .andWhereBetween('longitude', [minLng, maxLng]);
    }
    return q;
  },

  /**
   * Полная информация по событию + участники
   */
  async getById(id) {
    const ev = await Event.query()
      .findById(id)
      .withGraphFetched('members(selectBasic)')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'full_name', 'avatar_url');
        },
      });
    if (!ev) throw new Error('Событие не найдено');
    return ev;
  },

  /**
   * Запрос на участие
   */
  async joinEvent(userId, eventId) {
    // 1) Проверяем, что параметры корректны
    if (!Number.isInteger(userId) || !Number.isInteger(eventId)) {
      throw new Error('Неверные параметры userId или eventId');
    }

    // 2) Проверяем, что событие существует
    const ev = await Event.query().findById(eventId);
    if (!ev) {
      throw new Error('Событие не найдено');
    }

    // 3) Проверяем, не состоит ли пользователь уже в событии
    const exists = await EventMember.query()
      .where('event_id', eventId)
      .andWhere('user_id', userId)
      .first();

    if (exists) {
      throw new Error('Вы уже участвуете в этом событии');
    }

    // 4) Вставляем участника (camelCase -> snake_case автоматически)
    const rec = await EventMember.query().insertAndFetch({
      eventId,    // JSON-Schema ждёт именно это поле
      userId,
      status: 'confirmed'
    });

    // 5) Возвращаем клиенту понятный результат
    return {
      eventId:  rec.eventId,
      userId:   rec.userId,
      status:   rec.status,
      joinedAt: rec.joinedAt
    };
  },
 

  async leaveEvent(userId, eventId) {
    const deleted = await EventMember.query()
      .delete()
      .where('event_id', eventId)
    if (!deleted) throw new Error('Вы не участник события');
    return { message: 'Вы вышли из события' };
  },
  async listEvents({ bbox } = {}) {
    let q = Event.query()
      .withGraphFetched('owner(selectBasic)')
      .modifiers({
        selectBasic(builder) {
          // выбираем только id, full_name и photo_url
          builder.select('id', 'full_name', 'photo_url');
        }
      }); // подтягиваем создателя
    if (bbox) {
      const [minLat, minLng, maxLat, maxLng] = bbox;
      q = q
        .whereBetween('latitude', [minLat, maxLat])
        .andWhereBetween('longitude', [minLng, maxLng]);
    }
    return q;
  },
  async listCreated(ownerId) {
    return Event.query()
      .where('owner_id', ownerId)
      .withGraphFetched('[owner(selectBasic)]')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'full_name', 'photo_url');
        }
      });
  },

  // 2) Список, в которых состоит
  async listJoined(userId) {
    return Event.query()
      .joinRelated('eventMembers')
      .where('eventMembers.user_id', userId)
      .andWhereNot('events.owner_id', userId)
      .withGraphFetched('[owner(selectBasic), eventMembers]')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'full_name', 'photo_url');
        }
      });
  },

  // метод получения одного события
  async getEvent(eventId) {
    return Event.query()
      .findById(eventId)
      .withGraphFetched('[owner, members]');
  },
};
