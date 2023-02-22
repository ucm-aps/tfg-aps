const knex = require("../../config");



const daoUsuario = require("./daoUsuario");
const daoOferta = require("./daoOferta");
const daoDemanda = require("./daoDemanda");
const daoColaboracion = require("./daoColaboracion")
const transferNotificacion = require('../transfers/TNotificacion');
const { ConsoleReporter } = require("jasmine");
const { not } = require("@angular/compiler/src/output/output_ast");

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

function cargarNotificacion(idNotificacion){
    return obtenerOfertaAceptadaServicio(idNotificacion).then(result =>{
        if(result == undefined){
            return obtenerNotificacionAceptacionAceptada(idNotificacion).then(result =>{
                if(result == undefined){
                    return obtenerNotificacionAceptacionRechazada(idNotificacion).then(result =>{
                        if(result == undefined){
                            return obtenerNotificacionPartenariadoHecho(idNotificacion);
                        }
                    });
                }
                return result;
            });
        }
        return result;
    })
}

function obtenerOfertaAceptadaServicio(idNotificacion){
    return knex('notificaciones').join("ofertaaceptada", "notificaciones.id","=", "ofertaAceptada.idNotificacion")
    .where({id: idNotificacion})
    .select('*').then((resultado) => {
        if(resultado.length == 0) return;
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
                    null
                );
            })
        })

    })
    .catch((err)=>{
        console.log(err)
        console.log("Se ha producido un error al intentar obtener de la base la notificacion con el id ", idNotificacion);
    })
}

function obtenerNotificacionAceptacionAceptada(idNotificacion){
    return knex('notificaciones').join("aceptacionaceptada", "notificaciones.id","=", "aceptacionaceptada.idNotificacion")
    .join('ofertaaceptada', 'aceptacionaceptada.idNotificacionAceptada', '=', 'ofertaaceptada.idNotificacion')
    .where({'aceptacionaceptada.idNotificacion': idNotificacion})
    .select('*').then((resultado) => {
        if(resultado.length == 0) return;
        return daoOferta.obtenerAnuncioServicio(resultado[0].idOferta).then(Anuncio =>{
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
                    resultado[0].idOferta,
                    Anuncio.titulo, 
                    resultado[0]['pendiente'],
                    resultado[0]['idPartenariado']
                );
            })
        })
        

    })
    .catch((err)=>{
        console.log(err)
        console.log("Se ha producido un error al intentar obtener de la base la notificacion con el id ", idNotificacion);
    })
}

function obtenerNotificacionAceptacionRechazada(idNotificacion){
    return knex('notificaciones').join("aceptacionrechazado", "notificaciones.id","=", "aceptacionrechazado.idNotificacion")
    .join('ofertaaceptada', 'aceptacionrechazado.idNotificacionOferta', '=', 'ofertaaceptada.idNotificacion')
    .where({'aceptacionrechazado.idNotificacion': idNotificacion})
    .select('*').then((resultado) => {
        if(resultado.length == 0) return;
        return daoOferta.obtenerAnuncioServicio(resultado[0].idOferta).then(Anuncio =>{
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
                    resultado[0].idOferta,
                    Anuncio.titulo, 
                    resultado[0]['pendiente'],
                    resultado[0]['idPartenariado']
                );
            })
        })
        

    })
    .catch((err)=>{
        console.log(err)
        console.log("Se ha producido un error al intentar obtener de la base la notificacion con el id ", idNotificacion);
    })
}


function obtenerNotificacionPartenariadoHecho(idnotificacion){
    return knex('notificaciones').join("partenariadorellenado", "notificaciones.id","=", "partenariadorellenado.idNotificacion")
    .where({idNotificacion: idnotificacion})
    .select('*').then(resultado =>{
        if(resultado.length == 0) return;
        console.log(resultado);
        return new transferNotificacion(
            resultado[0].id,
            resultado[0].idDestino,
            resultado[0].leido,
            resultado[0].titulo,
            resultado[0].mensaje,
            resultado[0].fecha_fin,
            null,
            null,
            null,
            resultado[0].pendiente,
            resultado[0].idPartenariado
        );
    })
    .catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta obtener notificacion de partenariadorellenado");
    })
}

function crearNotificacion(notificacion){
    return knex('notificaciones')
        .insert({
            idDestino: notificacion.idDestino,
            titulo:notificacion.titulo,
            mensaje:notificacion.mensaje,
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

function obtenerNotificacionAceptacionAceptadaPorIdPartenariado(idPartenariado){
    return knex('aceptacionaceptada').select('*')
    .where({idPartenariado:idPartenariado}).catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta obtener notificacion de aceptacionaceptada por idPartenariado");
    });
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

function crearNotificacionAceptadacionAceptada(notificacion, idNotificacionOferta, idPartenariado){
    return crearNotificacion(notificacion).then(idNotificacion =>{
        return knex('aceptacionaceptada').insert({
            idNotificacion:idNotificacion,
            idPartenariado:idPartenariado,
            idNotificacionAceptada:idNotificacionOferta
        }).then(result=>{
            FinalizarPendienteNotificacion(idNotificacionOferta);
            return result;
        })
    })
    .catch(err =>{
        console.log(err)
        console.log("Se ha producido un error al intenta crear una notificacion en aceptacionAceptacion");
    })

}

function crearNotificacionPartenariadoHecho(notificacion){
    return crearNotificacion(notificacion).then(idNotificacion =>{
        return knex('partenariadorellenado').insert({
            idNotificacion: idNotificacion,
            idPartenariado: notificacion.idPartenariado
        }).then(result => {
            //Suponiendo que No importa por que ruta va creando un partenariado para cada notificacion 
            return result;
        });
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

function notificarPartenariadoRellenado(notificacion){
    return daoColaboracion.obtenerPartenariado(notificacion.idPartenariado).then(partenariado =>{
        return daoOferta.obtenerOfertaServicio(partenariado.id_oferta).then(oferta =>{
            notificacion.idDestino = oferta.creador.id;
            return crearNotificacionPartenariadoHecho(notificacion).then((idNotificacion)=>{
                return daoDemanda.obtenerDemandaServicio(partenariado.id_demanda).then(demanda =>{
                    notificacion.idDestino = demanda.creador.id;
                    return crearNotificacionPartenariadoHecho(notificacion).then(idNotificacion =>{
                        //Suponiendo que No importa por que ruta va creando un partenariado para cada notificacion 
                        return obtenerNotificacionAceptacionAceptadaPorIdPartenariado(notificacion.idPartenariado).then(notificacionFinalizado=>{
                            console.log(notificacionFinalizado);
                            return FinalizarPendienteNotificacion(notificacionFinalizado[0].idNotificacion);
                        });

                    });
                });
            });


        });
    })
    .catch(err=>{
        console.log(err)
        console.log("Se ha producido un error al intenta notificar una notificacion de partenariadoRellenado");
    })

}

module.exports ={
    obtenerNotificaciones,
    cargarNotificacion,
    obtenerOfertaAceptadaServicio,
    crearNotificacionOfertaAceptada,
    obtenerNotificacionOfertaAceptada,
    crearNotificacionAceptadacionRechazada,
    crearNotificacionAceptadacionAceptada,
    notificarPartenariadoRellenado,

}