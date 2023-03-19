//let matching = require("...");
process.env.MYSQL_IP = "localhost";
process.env.MYSQL_PORT = "3306";
process.env.MYSQL_USER = "MYSQL_USER";
process.env.MYSQL_PASSWORD = "aps";
process.env.MYSQL_DATABASE = "aps";

let daoOferta = require("./database/services/daos/daoOferta.js");
let daoDemanda = require("./database/services/daos/daoDemanda.js");
let matching = require("./controllers/matching.js")
let config = require("./configuracion.json");

(async function() {
    let oferta = await daoOferta.obtenerOfertaServicio(110);
    let demanda = await daoDemanda.obtenerDemandaServicio(109);
    matching.hacerMatch("../tfg-aps/server/configuracion.txt", oferta, demanda);
  })();



