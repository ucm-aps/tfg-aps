const mysql = require ('mysql');
const knex = require("knex")({
    client: "mysql",
    connection: "postgres://root:@localhost:3306/aps",
    pool : { min:0, max:10 }
});

// Devuelve todos los uploads que coincidan con los ids idUploads
function obtenerUploads(idUploads){
    return 0;
}

// Devuelve todos los mensajes que coincidan con los ids idMensajes
function obtenerMensajes(idMensajes){
    return 0;
}

module.exports = {knex, obtenerUploads, obtenerMensajes};