// src/services/admin/usersService.js
const User = require('../../models/User');
module.exports = {
  list() { return User.query().withGraphFetched('roles'); },
  getById(id) { return User.query().findById(id).withGraphFetched('roles'); },
  create(data) { return User.query().insertAndFetch(data); },
  update(id, data) { return User.query().patchAndFetchById(id, data); },
  delete(id) { return User.query().deleteById(id); },
};
