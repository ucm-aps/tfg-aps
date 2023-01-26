class TNotificacion{
    id;
    idDestino;
    leido;
    constructor(id, idDestino, leido){
        this.id=id;
        this.idDestino=idDestino;
        this.leido=leido;
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