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
      description:     data.description || null,
      latitude:        data.latitude,
      longitude:       data.longitude,
      address:         data.address || null,
      start_time:      data.startTime || null,
      end_time:        data.endTime || null,
      max_participants:data.maxParticipants || null,
      image_url:       data.imageUrl || null,
      category:        data.category || null,
      tags:            data.tags || null,
      owner_id:        ownerId,
    });

    // Добавляем создателя как участника
    await EventMember.query().insert({
      event_id: ev.id,
      user_id:  ownerId,
      status:   'accepted',
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
    const ev = await Event.query().findById(eventId);
    if (!ev) throw new Error('Событие не найдено');

    const exists = await EventMember.query()
      .findOne({ eventId, userId });
    if (exists) throw new Error('Вы уже участвуете');

    const rec = await EventMember.query().insertAndFetch({
      event_id: eventId,
      user_id:  userId,
      status:   'accepted',
    });
    return {
      eventId: rec.event_id,
      userId:  rec.user_id,
      status:  rec.status,
      joinedAt: rec.joined_at,
    };
  },

  /**
   * Выход из события
   */
  async leaveEvent(userId, eventId) {
    const deleted = await EventMember.query()
      .delete()
      .where({ eventId, userId });
    if (!deleted) throw new Error('Вы не участник события');
    return { message: 'Вы вышли из события' };
  },
};
