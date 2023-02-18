import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Notificacion} from '../models/notificacion.model';
import {map, skip} from 'rxjs/operators';
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
                notificacion.leido,
                notificacion.titulo,
                notificacion.mensaje,
                notificacion.fechaCrear,
                notificacion.emailOrigen,
                notificacion.idAnuncio,
                notificacion.tituloAnuncio,
                notificacion.pendiente,
                notificacion.idPartenariado
            )
        );
    }
    cargarNotificaciones(skip: number, limit: number, filtros: Object, uid: string) {
        return this.http.get<{ total: Number, filtradas: Number, notificaciones: Notificacion[] }>(`${base_url}/notificaciones?skip=${skip}&limit=${limit}&filtros=${encodeURIComponent(JSON.stringify(filtros))}&idUser=${uid}`, this.usuarioService.headers)
            .pipe(
                map(resp => {
                    return {total: resp.total, filtradas: limit, notificaciones: this.mapearNotificaciones(resp.notificaciones)};
                })
            );
    }

    cargarNotificacion(id:string){
        return this.http.get<{ok: boolean, notificacion:Notificacion}>(`${base_url}/notificaciones/ver/${id}`, this.usuarioService.headers)
        .pipe(
            map((resp:{ok:boolean, notificacion: Notificacion}) =>resp.notificacion)

        );
    }

    crearNotificacionOfertaAceptada(idOferta:string, uid:string){
        return this.http.get<{ok: boolean, notificacion:Notificacion}>(`${base_url}/notificaciones/crearOfertaAceptada?idOferta=${idOferta}&idSocio=${uid}`, this.usuarioService.headers)
        .pipe(
            map((resp:{ok:boolean, notificacion:Notificacion}) => resp.ok)
        );
    }

    rechazarSocio(idNotificacion){
        return this.http.get<{ok: boolean}>(`${base_url}/notificaciones/respuesta/rechazar?idNotificacion=${idNotificacion}`,this.usuarioService.headers)
        .pipe(
            map((resp: {ok:boolean}) => resp.ok)
        );
    }
    AceptarSocio(idNotificacion, idPartenariado){
        return this.http.get<{ok: boolean}>(`${base_url}/notificaciones/respuesta/aceptar?idNotificacion=${idNotificacion}&idPartenariado=${idPartenariado}`,this.usuarioService.headers)
        .pipe(
            map((resp: {ok:boolean}) => resp.ok)
        );
    }

    crearpartenariadoRellenado(idPartenariado: string) {
        return this.http.get<{ok: boolean}>(`${base_url}/notificaciones/partenariadohecho?idPartenariado=${idPartenariado}`,this.usuarioService.headers)
        .pipe(
            map((resp: {ok:boolean}) => resp.ok)
        );
    }

}