import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Notificacion} from '../models/notificacion.model';
import {map} from 'rxjs/operators';
import {UsuarioService} from './usuario.service';
import {FileUploadService} from './file-upload.service';

const base_url = environment.base_url;

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    constructor(private http: HttpClient, private usuarioService: UsuarioService, private fileUploadService: FileUploadService) {
    }

    mapearNotificaciones(notificaciones: any):Notificacion[]{
        return notificaciones.map(
            notificacion => new Notificacion(
                notificacion.id,
                notificacion.idDestino,
                notificacion.idOrigen,
                notificacion.titulo,
                notificacion.texto,
                notificacion.fechaCrear,

            )
        );
    }
    cargarNotificion(skip: number, limit: number, filtros: Object) {
        return this.http.get<{ total: Number, filtradas: Number, notificaciones: Notificacion[] }>(`${base_url}/notificaciones?skip=${skip}&limit=${limit}&filtros=${encodeURIComponent(JSON.stringify(filtros))}&idUser=33`, this.usuarioService.headers)
            .pipe(
                map(resp => {
                    return {total: resp.total, filtradas: limit, notificaciones: this.mapearNotificaciones(resp.notificaciones)};
                })
            );
    }

}