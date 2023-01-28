const { RSA_NO_PADDING } = require("constants");
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

module.exports ={
    obtenerNotificaciones,
    obtenerNotificacion
}