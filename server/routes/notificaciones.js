
const {Router} = require('express');
const {obtenerNotificaciones, obtenerNotificacion} = require('../controllers/notificaciones');

const router = Router();


router.get('/',[], obtenerNotificaciones);

router.get('/:id',[], obtenerNotificacion);

module.exports = router;