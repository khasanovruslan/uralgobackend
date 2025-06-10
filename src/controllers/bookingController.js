// File: src/controllers/bookingController.js

const bookingService = require('../services/bookingService');

module.exports = {
  // POST /api/bookings
  async createBooking(req, res) {
    try {
      const userId = req.user.id;
      const { tripId, seatsReserved } = req.body;
      const booking = await bookingService.create(userId, { tripId, seatsReserved });
      return res.status(201).json(booking);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  // GET /api/bookings
  async getUserBookings(req, res) {
    try {
      const userId = req.user.id;
      const bookings = await bookingService.getByUser(userId);
      return res.json(bookings);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  // DELETE /api/bookings/:id
  async cancelBooking(req, res) {
    try {
      const userId = req.user.id;
      const bookingId = parseInt(req.params.id, 10);
      await bookingService.cancel(userId, bookingId);
      return res.json({ message: 'Бронирование успешно отменено' });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },
};
