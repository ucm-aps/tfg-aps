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
        public fechaCrear:string,
        public emailOrigen:string,
        public idAnuncio:string,
        public tituloAnuncio:string
    ){}

    get parsedDateCrear(){
        return moment(this.fechaCrear).format('DD-MM-YYYY');
    }

    
}