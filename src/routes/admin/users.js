// src/routes/admin/users.js
const router = require('express').Router();
const ctrl   = require('../../controllers/admin/usersController');

router.get('/',    ctrl.list);
router.post('/',   ctrl.create);
router.get('/:id', ctrl.get);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
