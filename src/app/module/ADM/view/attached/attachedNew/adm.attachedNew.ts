import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { NgForm } from '@angular/forms';
import { ADMAdjuntoServiceJPO, pGesadjuntoCargar } from 'src/app/module/ADM/service/adm.aDMAdjuntoService';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FirebaseStorageService } from 'src/app/firebase/storage';

@Component({
	templateUrl: './adm.attachedNew.html',
})

export class AttachedNew extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

	// Servicio
	private aDMAdjuntoService: ADMAdjuntoServiceJPO;

	// Variables de Validación
	public valid_button: boolean = true;
	public valid_message: boolean = false;
	public nombreAdjunto: string = '';

	// public mensajeArchivo = 'No hay un archivo seleccionado';
	// public datosFormulario = new FormData();
	public nombreArchivo = '';
	// public URLPublica = '';
	public porcentaje = 0;
	// public finalizado = false;
	public num_files = 0;
	public files : any;

	constructor(private ohService: OHService, public cse: CoreService, public ccs: ADMCoreService, private route: ActivatedRoute, private router: Router, private http: HttpClient, private firebaseStorage: FirebaseStorageService) {
		super(ohService, cse, ccs);
		this.aDMAdjuntoService = new ADMAdjuntoServiceJPO(ohService);
	}

	ngOnInit() {

	}

	ngAfterViewInit() { }

	ngOnDestroy() { }

	fileAttachChange(event: any) {
		if (event.target.files && event.target.files[0]) {
			this.valid_button = false;
			this.valid_message = false;
			this.nombreAdjunto = event.target.files[0].name;
		} else {
			this.valid_button = true;
			this.valid_message = true;
			this.nombreAdjunto = '';
		}

		this.num_files = event.target.files.length;

		if (event.target.files.length > 0) {
			for (let i = 0; i < event.target.files.length; i++) {
				// this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
				this.nombreArchivo = event.target.files[i].name;
			}
		} else {
			// this.mensajeArchivo = 'No hay un archivo seleccionado';
		}
	}

	//Sube el archivo a Cloud Storage
	public subirArchivo(files?) {
		let archivo = files[0];
		// let refTask = this.firebaseStorage.refCloudStorage(this.nombreAdjunto);
		let uploadTask = this.firebaseStorage.uploadCloudStorage(this.nombreAdjunto, archivo);

		//Cambia el porcentaje
		uploadTask.percentageChanges().subscribe((porcentaje) => {
			this.porcentaje = Math.round(porcentaje);
			console.log('porcentaje:', porcentaje)
			if (this.porcentaje == 100) {
				console.log('porcentaje_fin:', porcentaje)
				// this.finalizado = true;
			}
		});

		// refTask.getDownloadURL().subscribe((URL) => {
		//   console.log('URL:', URL);		  
		// });
	}

	gesadjuntoCargar(frm: NgForm, fileAttachment: any) {
		var files = fileAttachment.files;
		this.subirArchivo(files);
		if (frm.valid && files.length > 0) {
			this.aDMAdjuntoService.gesadjuntoCargar({
				Usuario_id: this.cse.data.user.data.userid, // Optional
				//Archivo_Nombre : files[0].name, // Optional
				//Archivo_Formato : files[0].type, // Optional
				//Archivo_Peso : files[0].size, // Optional
				//Archivo_Ubicacion : files[0].name // Optional
			}, {
				upload: files[0]
			}, (progress: number) => {
				//console.log(progress);			
			}, (resp: pGesadjuntoCargar) => {
				//console.log(resp);
				if (resp.estado == 1) {
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.router.navigate(['../'], { relativeTo: this.route });
				} else {
					if (resp.estado == 0) {
						this.ohService.getOH().getLoader().showError(resp.mensaje);
					} else {
						this.ohService.getOH().getAd().warning(resp.mensaje);
					}
				}
			});
		}
	}

	descargar() {
		let refTask = this.firebaseStorage.refCloudStorage(this.nombreAdjunto);
		// descarga
		refTask.getDownloadURL().subscribe(
			(URL) => {
				console.log('descargarURL:', URL)
				var xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';
				xhr.onload = function (event) {
					var blob = xhr.response;
				};
				xhr.open('GET', URL);
				xhr.send();
				// window.open(URL);
			},
			(error) => {
				console.log('error:', error);
			}
		);
	}

}
