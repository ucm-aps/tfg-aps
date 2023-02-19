
const {Router} = require('express');
const {obtenerNotificaciones, obtenerNotificacion, crearNotificacionOfertaAceptada, rechazarSocio, aceptarSocio, notificarPartenariadoCreado} = require('../controllers/notificaciones');

const router = Router();


router.get('/',[], obtenerNotificaciones);

router.get('/ver/:id',[], obtenerNotificacion);

router.get('/crearOfertaAceptada',[], crearNotificacionOfertaAceptada);

router.get('/respuesta/aceptar',[], aceptarSocio);

router.get('/respuesta/rechazar',[], rechazarSocio);

router.get('/partenariadohecho',[], notificarPartenariadoCreado);


module.exports = router;