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

module.exports ={
    obtenerNotificaciones
}