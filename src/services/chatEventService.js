// src/services/chatEventService.js
const EventChat        = require('../models/EventChat');
const EventChatMessage = require('../models/EventChatMessage');
const EventMember      = require('../models/EventMember');
const Event            = require('../models/Event'); // Добавил импорт

module.exports = {
  /**
   * Создаёт чат для события
   * @param {number} eventId
   */
  async createChatForEvent(eventId) {
    let chat = await EventChat.query()
      .where('event_id', eventId)
      .first();

    if (!chat) {
      chat = await EventChat.query().insertAndFetch({ eventId });
    }

    return chat;
  },

  /**
   * Возвращает чат и все сообщения с авторами
   * @param {number} eventId
   */
  async getChatWithMessages(eventId) {
    const chat = await EventChat.query()
      .where('event_id', eventId)
      .withGraphFetched('messages(orderByTime).[user(selectBasic)]')
      .modifiers({
        // сортировка сообщений
        orderByTime(builder) {
          builder.orderBy('created_at', 'asc');
        },
        // только id, full_name, avatar_url пользователя
        selectBasic(builder) {
          builder.select('id', 'full_name', 'avatar_url');
        }
      })
      .first();

    if (!chat) {
      throw new Error('Чат для этого события не найден');
    }

    return chat;
  },

  /**
   * Публикует новое сообщение в чате
   * @param {number} eventId
   * @param {number} userId
   * @param {string} text
   */
  async postMessage(eventId, userId, text) {
    const chat = await EventChat.query().where('event_id', eventId).first();
    if (!chat) throw new Error('Чат для этого события не найден');

    // Получаем событие для проверки owner
    const event = await Event.query().findById(eventId);
    if (!event) throw new Error('Событие не найдено');

    // Проверяем организатор ИЛИ участник
    const isOwner = event.ownerId === userId;
    const isMember = await EventMember.query()
      .where('event_id', eventId)
      .andWhere('user_id', userId)
      .first();

    if (!isOwner && !isMember) throw new Error('Вы не участник этого события');

    const msg = await EventChatMessage.query().insertAndFetch({
      chatId: chat.id,
      userId,
      text,
    });

    return EventChatMessage.query()
      .findById(msg.id)
      .withGraphFetched('user(selectBasic)')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'full_name', 'avatar_url');
        },
      });
  },

  /**
   * Исключает участника из события
   * @param {number} eventId
   * @param {number} userId
   */
  async kickMember(eventId, userId) {
    const deleted = await EventMember.query()
      .delete()
      .where('event_id', eventId)
      .andWhere('user_id', userId);

    if (!deleted) throw new Error('Этот пользователь не состоит в событии');
    return { message: 'Пользователь исключён из события' };
  },
};
