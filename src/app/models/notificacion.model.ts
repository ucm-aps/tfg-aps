import { environment } from '../../environments/environment';
import { Usuario } from './usuario.model';

import * as moment from 'moment';

const base_url = environment.base_url;

export class Notificacion{
    constructor(
        public id: string,
        public idDestino:string,
        public leido: string,
        public titulo:string,
        public mensaje:string,
        public fecha:string,
        public emailOrigen:string,
        public idAnuncio:string,
        public tituloAnuncio:string,
        public pendiente:string
    ){}

    get parsedDateCrear(){
        return moment(this.fecha).format('DD-MM-YYYY');
    }

    
}