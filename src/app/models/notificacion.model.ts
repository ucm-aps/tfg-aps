import { environment } from '../../environments/environment';
import { Usuario } from './usuario.model';

import * as moment from 'moment';

const base_url = environment.base_url;

export class Notificacion{
    constructor(
        public id: string,
        public idDestino:string,
        public idOrigen:string,
        public titulo:string,
        public texto:string,
        public fechaCrear:string
    ){}

    get parsedDateCrear(){
        return moment(this.fechaCrear).format('DD-MM-YYYY');
    }

    
}