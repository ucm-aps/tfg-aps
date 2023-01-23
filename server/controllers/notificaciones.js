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

module.exports ={
    obtenerNotificaciones
}