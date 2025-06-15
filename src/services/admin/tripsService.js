// src/services/admin/tripsService.js
const Trip = require('../../models/Trip');

module.exports = {
  list() {
    return Trip.query();
  },

  getById(id) {
    return Trip.query().findById(id);
  },

  create(data) {
    // приводим price к number|null
    if (data.price !== undefined) {
      data.price = data.price === '' || data.price === null
        ? null
        : Number(data.price);
    }
    return Trip.query().insertAndFetch(data);
  },

  update(id, data) {
    if (data.price !== undefined) {
      data.price = data.price === '' || data.price === null
        ? null
        : Number(data.price);
    }
    return Trip.query().patchAndFetchById(id, data);
  },

  delete(id) {
    return Trip.query().deleteById(id);
  },
};
