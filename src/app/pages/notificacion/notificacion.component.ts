import { Component, Input, OnInit } from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import { Notificacion } from 'src/app/models/notificacion.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificacionService } from 'src/app/services/notificacion.service';


@Component({
    selector: 'app-notificacion',
    templateUrl: './notificacion.component.html',
    styleUrls: ['./notificacion.component.scss']
})
export class NotificacionComponent implements OnInit{


    public notificacion: Notificacion;

    constructor(public notificacionService: NotificacionService, public activatedRoute: ActivatedRoute, public router: Router, public usuarioService: UsuarioService) {
    }



    ngOnInit(): void {
        this.activatedRoute.params.subscribe(({ id }) => {
            this.cargarNotificacion(id);
        });
    }

    cargarNotificacion(id: string){
        this.notificacionService.cargarNotificacion(id).subscribe((notificacion : Notificacion) =>{
            if(!notificacion){
                return this.router.navigateByUrl(`/mi-resumen`);
            }
            this.notificacion = this.notificacionService.mapearNotificaciones([notificacion])[0];
        });
    }

    AceptacionRechazada(){
        this.notificacion.pendiente = '0';
        this.notificacionService.rechazarSocio(this.notificacion.id).subscribe((ok: boolean)=>{
            if(ok){
                this.ngOnInit();
            }
        });
        
    }

    AceptacionAceptada(){
        this.notificacion.pendiente = "0";

    }




    
}