const knex = require("../../config");


const daoUsuario = require("./daoUsuario");
const transferNotificacion = require('../transfers/TNotificacion')

//Obtener toda las notificaciones

function obtenerNotificaciones(idUser){
    return knex('notificaciones')
    .where({idDestino: idUser})
    .select('*')
    .then((resultado)=>{
        notificaciones =[]
        for(n of resultado){
            n2 = Object.assign({}, n)
            n3 = new transferNotificacion(n2['id'], n2['idDestino'], n2['leido'])
            notificaciones.push(n3);
        }
        return notificaciones;
    })
    .catch((err)=>{
        console.log(err)
        console.log('Se ha producido error al intentar obtener los notificaciones del usuario')
    })

}

function obtenerOfertaAceptadaServicio(idNotificacion){
    return knex('notificaciones').join("ofertaaceptada", "notificaciones.id","=", "ofertaAceptada.idNotificacion")
    .where({id: idNotificacion})
    .select('*').then((resultado) => {
        return daoUsuario.obtenerUsuarioSinRolPorId(resultado[0].idSocio)
        .then(Origen =>{
            return new transferNotificacion(
                resultado[0]["id"],
                resultado[0]["idDestino"],
                resultado[0]["leido"],
                resultado[0]["titulo"],
                resultado[0]["mensaje"],
                resultado[0]["fecha_fin"],
                Origen["correo"],
                resultado[0]["idOferta"], 
            );
        })

    })
    .catch((err)=>{
        console.log(err)
        console.log("Se ha producido un error al intentar obtener de la base la notificacion con el id ", idNotificacion);
    })
}

module.exports ={
    obtenerNotificaciones,
    obtenerOfertaAceptadaServicio
}