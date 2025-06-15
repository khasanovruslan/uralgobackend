const router = require('express').Router();
const ctrl   = require('../../controllers/admin/tripsController');

router.get('/',    ctrl.list);
router.post('/',   ctrl.create);
router.get('/:id', ctrl.get);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);

module.exports = router;
