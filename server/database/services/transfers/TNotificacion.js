class TNotificacion{
    id;
    idDestino;
    leido;
    titulo;
    mensaje;
    fecha;
    emailOrigen;
    idAnuncio;
    tituloAnuncio
    constructor(id, idDestino, leido, titulo, mensaje, fecha, emailOrigen, idAnuncio, tituloAnuncio){
        this.id=id;
        this.idDestino=idDestino;
        this.leido=leido;
        this.titulo = titulo;
        this.mensaje= mensaje;
        this.fecha = fecha;
        this.emailOrigen = emailOrigen;
        this.idAnuncio = idAnuncio;
        this.tituloAnuncio = tituloAnuncio
    }

    getId(){
        return this.id;
    }
    setId(id){
        this.id=id;
    }
    getIdDestino(){
        return this.idDestino;
    }
    setIdDestino(idDestino){
        this.idDestino = idDestino;
    }
    getLeido(){
        return this.leido;
    }
    setLeido(leido){
        this.leido = leido;
    }
}

module.exports = TNotificacion