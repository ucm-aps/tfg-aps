import { Component, Input, OnInit } from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';

@Component({
    selector: 'app-notificacion',
    templateUrl: './notificacion.component.html',
    styleUrls: ['./notificacion.component.scss']
})
export class NotificacionComponent implements OnInit{


    constructor(public usuarioService: UsuarioService) {
    }



    ngOnInit(): void {
    }
    
}