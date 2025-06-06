// File: src/controllers/experienceController.js

const experienceService = require('../services/experienceService');

module.exports = {
  // POST /api/experiences
  async createExperience(req, res) {
    try {
      const userId = req.user.id;
      const { title, description, location, startTime, endTime, maxParticipants } = req.body;

      const exp = await experienceService.create(userId, {
        title,
        description,
        location,
        startTime,
        endTime,
        maxParticipants,
      });
      return res.status(201).json(exp);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  // GET /api/experiences
  async listExperiences(req, res) {
    try {
      const all = await experienceService.listAll();
      return res.json(all);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  // GET /api/experiences/:id
  async getExperience(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const exp = await experienceService.getById(id);
      return res.json(exp);
    } catch (e) {
      return res.status(404).json({ message: e.message });
    }
  },

  // POST /api/experiences/:id/join
  async joinExperience(req, res) {
    try {
      const userId = req.user.id;
      const expId = parseInt(req.params.id, 10);
      const result = await experienceService.join(userId, expId);
      return res.json(result);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },

  // DELETE /api/experiences/:id/leave
  async leaveExperience(req, res) {
    try {
      const userId = req.user.id;
      const expId = parseInt(req.params.id, 10);
      const result = await experienceService.leave(userId, expId);
      return res.json(result);
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  },
};
