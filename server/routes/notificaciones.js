
const {Router} = require('express');
const {obtenerNotificaciones} = require('../controllers/notificaciones');

const router = Router();


router.get('/',[], obtenerNotificaciones);

module.exports = router;