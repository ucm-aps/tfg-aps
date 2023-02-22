import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { Partenariado } from '../../../models/partenariado.model';
import * as moment from 'moment';
import { PartenariadoService } from '../../../services/partenariado.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, CanLoad } from '@angular/router';
import { Oferta } from '../../../../app/models/oferta.model';
import { OfertaService } from '../../../../app/services/oferta.service';
import { DemandaService } from '../../../../app/services/demanda.service';
import { first, filter } from 'rxjs/operators';
import { Demanda } from '../../../../app/models/demanda.model';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { Notificacion } from './../../../models/notificacion.model';

@Component({
    selector: 'app-partenariado-crear-profesor',
    templateUrl: './partenariado-profesor-crear.component.html',
    styleUrls: ['./partenariado-profesor-crear.component.scss']
})

export class PartenariadoCrearProfesorComponent implements OnInit {

    public formSubmitted = false;
    public formSending = false;

    public parteneriado_id: string = null;
    public partenariado: Partenariado;
    public oferta: Oferta;
    public demanda: Demanda;
    public notificacion: Notificacion;
    public imagenSubir: File;
    public imagenPreview: any = null;
    public responsable_data: any;
    public crearPartenariadoProfesorForm: FormGroup;
    public writeProfesor: boolean;


    constructor(public fb: FormBuilder, public demandaService: DemandaService, public ofertaService: OfertaService, public partenariadoService: PartenariadoService, public usuarioService: UsuarioService, public fileUploadService: FileUploadService, public router: Router, public activatedRoute: ActivatedRoute
        ,public notificacionService : NotificacionService) {
    }

    dropdownSettings: any = {};
    public profesoresList: any;
    public selProfesores: any;

    async ngOnInit() {
        this.activatedRoute.params.subscribe(({ id }) => {
            if(this.activatedRoute.snapshot.queryParams.notificacion != undefined){
                this.load_oferta(this.activatedRoute.snapshot.queryParams.notificacion)
                
            }
            else if(this.activatedRoute.snapshot.queryParams.Partenariado != undefined){
                this.writeProfesor = this.usuarioService.usuario.rol == 'ROL_SOCIO_COMUNITARIO' ? true : false;
                this.loadPartenariado(this.activatedRoute.snapshot.queryParams.Partenariado, this.activatedRoute.snapshot.queryParams.oferta, this.activatedRoute.snapshot.queryParams.demanda);
            }
            else{
                console.log(this.activatedRoute.snapshot.queryParams.Partenariado);
                this.load(this.activatedRoute.snapshot.queryParams.demanda, this.activatedRoute.snapshot.queryParams.oferta);
            }
        });
    }

    async load_oferta(notificacion: string){
        await this.notificacionService.cargarNotificacion(notificacion).pipe(first()).toPromise().then((resp: any) =>{
            this.notificacion = this.notificacionService.mapearNotificaciones([resp])[0];
        });
        await this.obtenerOferta(Number(this.notificacion.idAnuncio));
        await this.obtenerProfesores();

        this.oferta.area_servicio = ['1'];

        this.crearPartenariadoProfesorForm = this.fb.group({
            anioAcademico: [this.oferta.anio_academico || '', Validators.required],
            titulo: [this.oferta.titulo || '', Validators.required],
            descripcion: [this.oferta.descripcion || '', Validators.required],
            cuatrimestre: [this.oferta.cuatrimestre || '', Validators.required],
            responsable: ['', Validators.required],
            externos: [false],
            id_oferta: [this.oferta.id || ''],
            ofertaObservacionesTemporales: [this.oferta.observaciones, Validators.required],
            asignaturaObjetivo: [this.oferta.asignatura_objetivo || 'Nada', Validators.required],
            ofertaAreaServicio: [this.oferta.area_servicio, Validators.required],
            profesores: [new FormControl(''), Validators.required],
            fecha_limite: [this.oferta.fecha_limite, Validators.required],
        });

        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'nombreCompleto',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 10,
            allowSearchFilter: true
        };
        
    }

    async load(demanda: number, oferta: number) {
        await this.cargarPartenariado();
        await this.obtenerOferta(oferta);
        await this.obtenerDemanda(demanda);
        await this.obtenerProfesores();

        // TODO: only to testing
        this.oferta.area_servicio = ['1'];

        this.crearPartenariadoProfesorForm = this.fb.group({
            anioAcademico: [this.oferta.anio_academico || '', Validators.required],
            titulo: [this.demanda.titulo + ' | ' + this.oferta.titulo || '', Validators.required],
            descripcion: [this.demanda.descripcion + ' | ' + this.oferta.descripcion || '', Validators.required],
            socio: [this.demanda.creador || ''],
            necesidadSocial: [this.demanda.necesidad_social || ''],
            finalidad: [this.demanda.objetivo || ''],
            comunidadBeneficiaria: [this.demanda.comunidadBeneficiaria || ''],
            cuatrimestre: [this.oferta.cuatrimestre || '', Validators.required],
            responsable: ['', Validators.required],
            ciudad: [this.demanda.ciudad || ''],
            externos: [false],
            id_demanda: [this.demanda.id || ''],
            id_oferta: [this.oferta.id || ''],
            ofertaObservacionesTemporales: [this.oferta.observaciones, Validators.required],
            demandaObservacionesTemporales: [this.demanda.observacionesTemporales || ''],
            asignaturaObjetivo: [this.oferta.asignatura_objetivo || 'Nada', Validators.required],
            titulacionesLocales: [this.demanda.titulacion_local || ''],
            ofertaAreaServicio: [this.oferta.area_servicio, Validators.required],
            demandaAreaServicio: [this.demanda.area_servicio || ''],
            periodo_definicion_fin: [this.demanda.periodoDefinicionFin || ''],
            periodo_definicion_ini: [this.demanda.periodoDefinicionIni || ''],
            periodo_ejecucion_fin: [this.demanda.periodoEjecucionFin || ''],
            periodo_ejecucion_ini: [this.demanda.periodoEjecucionIni || ''],
            profesores: [new FormControl(''), Validators.required],
            fecha_limite: [this.oferta.fecha_limite, Validators.required],
            fecha_fin: [this.demanda.fechaFin || '']
        });

        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'nombreCompleto',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 10,
            allowSearchFilter: true
        };
    }

    async loadPartenariado(idPartenariado, idOferta, idDemanda){
        await this.obtenerPartenariado(idPartenariado);
        await this.obtenerOferta(Number(idOferta));
        await this.obtenerDemanda(Number(idDemanda));
        await this.obtenerProfesores();


        this.oferta.area_servicio = ['1'];
        this.crearPartenariadoProfesorForm = this.fb.group({
            responsable: [this.obtenerNombreResponsable(this.partenariado.idresponsable).nombreCompleto , Validators.required],
            anioAcademico: [this.oferta.anio_academico || '', Validators.required],
            titulo: [this.partenariado.titulo, Validators.required],
            descripcion: [this.partenariado.descripcion , Validators.required],
            socio: [this.demanda.creador || ''],
            necesidadSocial: [this.demanda.necesidad_social || ''],
            finalidad: [this.demanda.objetivo || ''],
            comunidadBeneficiaria: [this.demanda.comunidadBeneficiaria || ''],
            cuatrimestre: [this.oferta.cuatrimestre || '', Validators.required],
            ciudad: [this.demanda.ciudad || ''],
            externos: [false],
            id_demanda: [this.demanda.id || ''],
            id_oferta: [this.oferta.id || ''],
            ofertaObservacionesTemporales: [this.oferta.observaciones, Validators.required],
            demandaObservacionesTemporales: [this.demanda.observacionesTemporales || ''],
            asignaturaObjetivo: [this.oferta.asignatura_objetivo || 'Nada', Validators.required],
            titulacionesLocales: [this.demanda.titulacion_local || ''],
            ofertaAreaServicio: [this.oferta.area_servicio, Validators.required],
            demandaAreaServicio: [this.demanda.area_servicio || ''],
            periodo_definicion_fin: [this.demanda.periodoDefinicionFin || ''],
            periodo_definicion_ini: [this.demanda.periodoDefinicionIni || ''],
            periodo_ejecucion_fin: [this.demanda.periodoEjecucionFin || ''],
            periodo_ejecucion_ini: [this.demanda.periodoEjecucionIni || ''],
            profesores: [new FormControl(''), Validators.required],
            fecha_limite: [this.oferta.fecha_limite, Validators.required],
            fecha_fin: [this.demanda.fechaFin || '']
        });

        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'nombreCompleto',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 10,
            allowSearchFilter: true
        };
    }


    async cargarPartenariado() {
        this.partenariado = new Partenariado('', '', '', '', '', '', '', '', null, null, null, null, null, null,null,null, null);
    }

    async obtenerPartenariado(id: string ){
        await this.partenariadoService.cargarPartenariado(id).pipe(first()).toPromise().then((resp: any) =>{
            this.partenariado = resp;
        });
    }

    async obtenerOferta(id: number) {


        await this.ofertaService.obtenerOferta(id).pipe(first()).toPromise().then((resp: any) => {
            let value = resp.oferta;
            let arrayP = [];
            for (let val of value.profesores) {
                arrayP.push({
                    id: val.id,
                    nombreCompleto: val.nombre + ' ' + val.apellidos
                });
            }
            this.selProfesores = arrayP;
            console.log(this.selProfesores);

            let fecha_fin = moment(value.fecha_limite).format('YYYY-MM-DD');
            this.oferta = new Oferta(value.id, value.titulo, value.descripcion, value.imagen, value.created_at, value.upload_at, value.cuatrimestre,
                value.anio_academico, fecha_fin, value.observaciones_temporales, value.creador, value.area_servicio, value.asignatura_objetivo, value.profesores, value.tags)
            ;
            console.log(this.oferta);
        });
    }

    async obtenerProfesores() {
        return this.partenariadoService.obtenerProfesores()
            .subscribe((resp: any) => {
                let arrayProfesores = [];
                for (let value of resp.profesores) {
                    arrayProfesores.push({
                        id: value.id,
                        nombreCompleto: value.nombre + ' ' + value.apellidos
                    });
                }
                this.profesoresList = arrayProfesores;
                return arrayProfesores;
            });
    }

    async obtenerDemanda(id: number) {
        await this.demandaService.obtenerDemanda(id).pipe(first()).toPromise().then((resp: any) => {
            let value = resp.demanda;
            let periodo_definicion_ini = moment(value.periodo_definicion_ini).format('YYYY-MM-DD');
            let periodo_definicion_fin = moment(value.periodo_definicion_fin).format('YYYY-MM-DD');
            let periodo_ejecucion_ini = moment(value.periodo_ejecucion_ini).format('YYYY-MM-DD');
            let periodo_ejecucion_fin = moment(value.periodo_ejecucion_fin).format('YYYY-MM-DD');
            let fecha_fin = moment(value.fecha_fin).format('YYYY-MM-DD');
            this.demanda = new Demanda(value.id, value.titulo, value.descripcion, value.imagen, value.ciudad, value.finalidad, value.area_servicio,
                periodo_definicion_ini, periodo_definicion_fin, periodo_ejecucion_ini, periodo_ejecucion_fin,
                fecha_fin, value.observaciones_temporales, value.necesidad_social, value.titulacionlocal,
                value.creador, value.comunidad_beneficiaria, value.created_at, value.upload_at);
        });

    }

    observableEnviarPartenariado() {
        this.partenariadoService.crearPartenariadoProfesor(this.crearPartenariadoProfesorForm.value).subscribe(async resp => {
            if(resp.ok){
                Swal.fire('Ok', 'Partenariado creado correctamente', 'success');
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.notificacionService.AceptarSocio(this.notificacion.id, resp.id[0]).subscribe((ok)=>{

                });
                this.router.navigate(['/']);

                this.formSubmitted = false;
                this.formSending = false;

            }

            
        }, err => {
            console.log(err);

            let msg = [];
            if (err.error.errors) {
                Object.values(err.error.errors).forEach(error_entry => {
                    msg.push(error_entry['msg']);
                });
            } else {
                msg.push(err.error.msg);
            }

            Swal.fire('Error', msg.join('<br>'), 'error');
            this.formSubmitted = false;
            this.formSending = false;
        });
    }

    actualizarPartenariado() {
        this.partenariadoService.actualizarPartenariado(this.crearPartenariadoProfesorForm.value, this.partenariado._id).subscribe(async resp => {
            if(resp){
                this.notificacionService.crearpartenariadoRellenado(this.partenariado._id);
                Swal.fire('Ok', 'Partenariado actualizado correctamente', 'success');
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['/']);

                this.formSubmitted = false;
                this.formSending = false;

            }

            
        }, err => {
            console.log(err);

            let msg = [];
            if (err.error.errors) {
                Object.values(err.error.errors).forEach(error_entry => {
                    msg.push(error_entry['msg']);
                });
            } else {
                msg.push(err.error.msg);
            }

            Swal.fire('Error', msg.join('<br>'), 'error');
            this.formSubmitted = false;
            this.formSending = false;
        });
    }

    enviarPartenariado() {

        this.formSubmitted = true;

        if (this.crearPartenariadoProfesorForm.invalid) {
            return;
        }

        let id_responsable = this.obtenerIdResponsable();
        if (id_responsable == -1) {
            let msg = [];
            msg.push('El responsable debe ser un valor válido');
            Swal.fire('Error', msg.join('<br>'), 'error');
            this.formSubmitted = false;
            this.formSending = false;
        }
        this.crearPartenariadoProfesorForm.get('responsable').setValue(id_responsable);
        this.formSending = true;
        this.partenariado == undefined ? this.observableEnviarPartenariado() : this.actualizarPartenariado();
    }

    obtenerIdResponsable() {
        let i = 0;
        let resp = this.crearPartenariadoProfesorForm.get('responsable').value;
        while (i < this.selProfesores.length &&
        this.selProfesores[i].nombreCompleto != resp) {
            i++;
        }
        return (i < this.selProfesores.length) ? this.selProfesores[i].id : -1;
    }

    obtenerNombreResponsable(id){
        return this.selProfesores.filter(n => n.id == id)[0];
    }

    campoNoValido(campo): String {

        let invalido = this.crearPartenariadoProfesorForm.get(campo) && this.crearPartenariadoProfesorForm.get(campo).invalid;

        if (invalido) {
            switch (campo) {
                case 'terminos_aceptados':
                    return 'Es obligatorio aceptar las condiciones de uso';
                default:
                    return `El campo ${campo} es obligatorio`;
            }
        }

        return '';
    }

    subirFichero(file: File) {
        if (!file) {
            return;
        }

        this.fileUploadService
            .subirFichero(file, 'archivos', 'partenariados', this.partenariado._id)
            .then(resp => {
                const { ok, msg, upload_id } = resp;
                if (ok) {
                    this.cargarPartenariado();
                    Swal.fire('Ok', 'Fichero subido correctamente', 'success');
                } else {
                    Swal.fire('Error', msg, 'error');
                }
            });
    }

    borrarFichero(id: string) {

        if (id == '') {
            Swal.fire('Error', 'No hay ninguna imagen definida para la oferta.', 'error');
            return;
        }

        this.fileUploadService
            .borrarFichero(id)
            .then(resp => {
                const { ok, msg } = resp;
                if (ok) {
                    this.cargarPartenariado();
                    Swal.fire('Ok', 'Fichero borrado correctamente', 'success');
                } else {
                    Swal.fire('Error', msg, 'error');
                }
            });
        (<HTMLInputElement>document.getElementById('file-upload-2')).value = '';
    }

    cambiarImagen(file: File) {

        if (!file) {
            return;
        }

        this.imagenSubir = file;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            this.imagenPreview = reader.result;
        };
    }

    actualizarImagen() {
        this.fileUploadService
            .subirFichero(this.imagenSubir, 'default', 'ofertas', this.partenariado._id)
            .then(resp => {
                const { ok, msg, upload_id } = resp;
                if (ok) {
                    this.cargarPartenariado();
                    Swal.fire('Ok', 'Imagen de partenariado actualizada correctamente', 'success');
                } else {
                    Swal.fire('Error', msg, 'error');
                }

                this.imagenSubir = null;
                this.imagenPreview = null;
            });
    }

    get getItems() {
        return this.profesoresList.reduce((acc, curr) => {
            acc[curr.id] = curr;
            return acc;
        }, {});
    }

    onItemSelect(item: any) {
        console.log('onItemSelect', item);
    }

    onSelectAll(items: any) {
        console.log('onSelectAll', items);
    }
}
