const Booking = require('../models/Booking');

module.exports = {
  async findByUser(userId, statuses = []) {
    const q = Booking.query().where('user_id', userId);
    if (statuses.length) {
      q.whereIn('status', statuses);
    }
    return await q;
  },
  // … другие методы, если нужны
};