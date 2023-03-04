
const {Router} = require('express');
const {obtenerNotificaciones, obtenerNotificacion, crearNotificacionOfertaAceptada, rechazarSocio, aceptarSocio, notificarPartenariadoCreado, notificacionDemandaRespaldado } = require('../controllers/notificaciones');
const { validarJWT, validarEsProfesor, validarEsSocioComunitario } = require('../middlewares/validar-jwt');


const router = Router();


router.get('/',[], obtenerNotificaciones);

router.get('/ver/:id',[], obtenerNotificacion);

router.get('/crearOfertaAceptada',[], crearNotificacionOfertaAceptada);

router.get('/respuesta/aceptar',[], aceptarSocio);

router.get('/respuesta/rechazar',[], rechazarSocio);

router.get('/partenariadohecho',[], notificarPartenariadoCreado);

router.post('/respaldarDemanda',[validarJWT], notificacionDemandaRespaldado);


module.exports = router;