const knex = require("../../config");


const daoUsuario = require("./daoUsuario");
const daoOferta = require("./daoOferta");
const transferNotificacion = require('../transfers/TNotificacion');
const { ConsoleReporter } = require("jasmine");

//Obtener toda las notificaciones

function obtenerNotificaciones(idUser){
    return knex('notificaciones')
    .where({idDestino: idUser})
    .select('*')
    .then((resultado)=>{
        notificaciones =[]
        for(n of resultado){
            n2 = Object.assign({}, n)
            console.log(n);
            n3 = new transferNotificacion(n2['id'], n2['idDestino'], n2['leido'],n2['titulo'], n2['mensaje'], n2['fecha_fin'], n2['pendiente'])
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
            return daoOferta.obtenerAnuncioServicio(resultado[0].idOferta).then(Anuncio =>{
                return new transferNotificacion(
                    resultado[0]["id"],
                    resultado[0]["idDestino"],
                    resultado[0]["leido"],
                    resultado[0]["titulo"],
                    resultado[0]["mensaje"],
                    resultado[0]["fecha_fin"],
                    Origen["correo"],
                    resultado[0].idOferta,
                    Anuncio.titulo, 
                    resultado[0]['pendiente'],
                );
            })
        })

    })
    .catch((err)=>{
        console.log(err)
        console.log("Se ha producido un error al intentar obtener de la base la notificacion con el id ", idNotificacion);
    })
}

function crearNotificacion(notificacion){
    return knex('notificaciones')
        .insert({
            idDestino: notificacion.idDestino,
            titulo:notificacion.titulo,
            mensaje:notificacion.mensaje,
            fecha_fin: '2023-01-28',
            pendiente: notificacion.pendiente
        }).then(idNotificacion => {
            return idNotificacion;
        })
    .catch(error =>{
            console.log(error)
            console.log("Se ha producido un error al intenta crear una notificacion en notificaciones ");
    })
}

function crearNotificacionOfertaAceptada(notificacion, idSocio){
    return daoOferta.obtenerOfertaServicio(notificacion.idAnuncio)
    .then(result =>{
        notificacion.idDestino = result.creador.id;
        console.log(notificacion);
        crearNotificacion(notificacion).then(idNotificacion =>{
            return knex('ofertaaceptada').insert({
                idNotificacion:idNotificacion,
                idOferta:notificacion.idAnuncio,
                idSocio:idSocio
            })})
    }).catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta crear una notificacion en ofertaaceptada");
    })
}

function obtenerNotificacionOfertaAceptada(idnotificacion){
    return knex('ofertaaceptada').select('*')
    .where({idNotificacion: idnotificacion}).catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta obtener notificacion de ofertaAceptada");
    })
}


function crearNotificacionAceptadacionRechazada(notificacion, idNotificacionOferta){
    return crearNotificacion(notificacion).then(idNotificacion =>{
        return knex('aceptacionrechazado').insert({
            idNotificacion:idNotificacion,
            idNotificacionOferta:idNotificacionOferta
        }).then(result =>{
            FinalizarPendienteNotificacion(idNotificacionOferta);
            return result;
        })
    }).catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta crear una notificacion en aceptacionRechazada");
    })

}

function FinalizarPendienteNotificacion(idNotificacion){
    return knex('notificaciones').where({
        id:idNotificacion
    }).update({
        pendiente:'0'
    }).catch(err=>{
        console.log(err)
        console.log("Se ha producido un error al intenta finalizar una notificacion");
    })
}

module.exports ={
    obtenerNotificaciones,
    obtenerOfertaAceptadaServicio,
    crearNotificacionOfertaAceptada,
    obtenerNotificacionOfertaAceptada,
    crearNotificacionAceptadacionRechazada,
}