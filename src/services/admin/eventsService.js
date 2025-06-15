// src/services/admin/eventsService.js
const Event = require('../../models/Event');

module.exports = {
  list() {
    return Event.query();
  },

  getById(id) {
    return Event.query().findById(id);
  },

  create(data) {
    // здесь можно валидировать/нормализовать поля, например даты
    return Event.query().insertAndFetch(data);
  },

  update(id, data) {
    return Event.query().patchAndFetchById(id, data);
  },

  delete(id) {
    return Event.query().deleteById(id);
  },
};
