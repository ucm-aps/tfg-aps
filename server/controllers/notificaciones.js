
const { response } = require("express");
const daoNotificacion = require("./../database/services/daos/daoNotificacion");
const TNotificacion = require("./../database/services/transfers/TNotificacion");


const obtenerNotificaciones = async(req, res = response) =>{
    try{
        let notificaciones = await daoNotificacion.obtenerNotificaciones(req.query.idUser);
        console.log(req.query.idUser);
        return res.status(200).json({
            ok:true,
            notificaciones,
            total:notificaciones.length
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        })
    }
}

const obtenerNotificacion = async (req, res) =>{
    try{
        const id = req.params.id;
        const notificacion = await daoNotificacion.obtenerOfertaAceptadaServicio(id);
        return res.status(200).json({
            ok:true,
            notificacion,
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            ok:false,
            msg:'Error inesperado(al intentar obtenerNotificacion)'
        });
    }
}

const crearNotificacionOfertaAceptada = async (req, res = response) =>{
    try{
        const notificacion = new TNotificacion(
            null,
            null,
            null,
            "Oferta Aceptada",
            "Enhorabuena su oferta ha sido aceptada",
            null,
            null,
            req.query.idOferta,
            null,
            1
        );
        let notificacionid = await daoNotificacion.crearNotificacionOfertaAceptada(notificacion, req.query.idSocio);
        console.log(notificacionid);
        return res.status(200).json({
            ok:true,
            notificacionid
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            ok:false,
            msg:'Error inesperado(al intentar crearNotificacionOfertaAceptada)'
        });
    }
};


const rechazarSocio = async(req, res = response) =>{
    try{
        let ofertaAceptada = await new daoNotificacion.obtenerNotificacionOfertaAceptada(req.query.idNotificacion);
        const notificacion = new TNotificacion(
            null,
            ofertaAceptada[0].idSocio,
            null,
            'Peticion rechazado',
            'OOpps su peticion ha sido rechazado',
            null,
            null,
            ofertaAceptada[0].idOferta,
            null,
            0
        )
        let newNotificacion = await daoNotificacion.crearNotificacionAceptadacionRechazada(notificacion, req.query.idNotificacion);
        return res.status(200).json({
            ok:true
        });
        
    }catch(err){
        console.error(error);
        return res.status(500).json({
            ok:false,
            msg:'Error inesperado(al intentar rechazaSocio)'
        });
    }
}

module.exports ={
    obtenerNotificaciones,
    obtenerNotificacion,
    crearNotificacionOfertaAceptada,
    rechazarSocio,
}