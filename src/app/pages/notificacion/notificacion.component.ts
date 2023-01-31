import { Component, Input, OnInit } from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';
import { Notificacion } from 'src/app/models/notificacion.model';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-notificacion',
    templateUrl: './notificacion.component.html',
    styleUrls: ['./notificacion.component.scss']
})
export class NotificacionComponent implements OnInit{


    public notificacion:Notificacion;

    constructor(public notificacionService:NotificacionService, public activatedRoute:ActivatedRoute, public router:Router, public usuarioService: UsuarioService) {
    }



    ngOnInit(): void {
        this.activatedRoute.params.subscribe(({ id }) => {
            this.cargarNotificacion(id);
        });
    }

    cargarNotificacion(id: string) {
        throw new Error('Method not implemented.');
    }
    
}