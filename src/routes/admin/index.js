// src/routes/admin/index.js
const router    = require('express').Router();
const auth      = require('../../middlewares/authMiddleware');
const adminOnly = require('../../middlewares/adminOnly');

router.use(auth, adminOnly);

router.use('/users',    require('./users'));
router.use('/trips',    require('./trips'));
router.use('/events',   require('./events'));
router.use('/bookings', require('./bookings'));

module.exports = router;
