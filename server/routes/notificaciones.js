
const {Router} = require('express');
const {obtenerNotificaciones, obtenerNotificacion, crearNotificacionOfertaAceptada, rechazarSocio} = require('../controllers/notificaciones');

const router = Router();


router.get('/',[], obtenerNotificaciones);

router.get('/ver/:id',[], obtenerNotificacion);

router.get('/crearOfertaAceptada',[], crearNotificacionOfertaAceptada);

router.get('/respuesta/rechazar',[], rechazarSocio);

router.get('/respuesta/aceptar',[],);

module.exports = router;