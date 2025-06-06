// File: src/services/experienceService.js

const Experience            = require('../models/Experience');
const ExperienceParticipant = require('../models/ExperienceParticipant');

module.exports = {
  // … ранее были create, listAll, getById …

  async join(userId, expId) {
    // 1) Проверяем, что впечатление существует
    const exp = await Experience.query().findById(expId);
    if (!exp) {
      throw new Error('Впечатление не найдено');
    }

    // 2) Проверяем, не является ли пользователь уже участником
   const exists = await ExperienceParticipant.query()
     .where('experience_id', expId)
     .andWhere('user_id', userId)
     .first();
    if (exists) {
      throw new Error('Вы уже участвуете в этом впечатлении');
    }

    // 3) Считаем текущее количество участников
   const count = await ExperienceParticipant.query()
     .where('experience_id', expId)
     .resultSize();
    if (count >= exp.maxParticipants) {
      throw new Error('Превышено максимально возможное число участников');
    }

    // 4) Создаём запись в experience_participants
    await ExperienceParticipant.query().insert({
      experienceId: expId,
      userId,
    });

    return { message: 'Вы успешно вступили в впечатление' };
  },

  async leave(userId, expId) {
   const deleted = await ExperienceParticipant.query()
     .delete()
     .where('experience_id', expId)
     .andWhere('user_id', userId);

    if (!deleted) {
      throw new Error('Вы не участвуете в этом впечатлении');
    }
    return { message: 'Вы вышли из впечатления' };
  },
};
