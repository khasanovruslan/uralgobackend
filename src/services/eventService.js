// File: src/services/eventService.js

const Event       = require('../models/Event');
const EventMember = require('../models/EventMember');

module.exports = {
  async joinEvent(userId, eventId) {
    const ev = await Event.query().findById(eventId);
    if (!ev) {
      throw new Error('Мероприятие не найдено');
    }

    const exists = await EventMember.query()
      .where('event_id', eventId)
      .andWhere('user_id', userId)
      .first();
    if (exists) {
      throw new Error('Вы уже участвуете/запрошены в этом мероприятии');
    }

    // Вставляем в snake_case
    const rec = await EventMember.query().insert({
      event_id: eventId,
      user_id:  userId,
      status:   'pending',
    })
    .returning(['event_id','user_id','status','joined_at']);

    // Преобразуем результат в camelCase для клиента:
    return {
      eventId: rec.event_id,
      userId:  rec.user_id,
      status:  rec.status,
      joinedAt: rec.joined_at,
    };
  },

  async leaveEvent(userId, eventId) {
    const numDeleted = await EventMember.query()
      .delete()
      .where('event_id', eventId)
      .andWhere('user_id', userId);

    if (!numDeleted) {
      throw new Error('Вы не участвуете в этом мероприятии');
    }
    return { message: 'Вы успешно вышли из мероприятия' };
  },
};
