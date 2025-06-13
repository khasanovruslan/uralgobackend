// src/routes/eventChat.js
const router             = require('express').Router({ mergeParams: true });
const auth               = require('../middlewares/authMiddleware');
const controller         = require('../controllers/eventChatController');

router.use(auth);

router.get('/',           controller.getEventChat);
router.post('/messages',  controller.postEventChatMessage);
router.delete('/members/:userId', controller.kickEventMember);

module.exports = router;
