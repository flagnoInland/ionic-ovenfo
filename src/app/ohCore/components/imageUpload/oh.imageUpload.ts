import { Component, Input, ElementRef, ViewChild, SimpleChanges, EventEmitter, Output, OnChanges, OnInit } from '@angular/core';
import { Util } from '../../services/util/oh.util';

import * as FileSaver from 'file-saver';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireStorage } from '@angular/fire/storage';
import { OHService } from 'src/app/tis.ohService';
import { MainService } from '../../services/oh.mainService';
/*
	type : "edit" -> photos = [src1, src2]
	type : "view" -> photos = [{photo : src1, id : 1}]
*/
@Component({
  selector: 'oh-imageUpload',
  templateUrl: './oh.imageUpload.html',
	styleUrls: ['./oh.imageUpload.css']
})

export class ImageUpload  {

	private ohMainService: MainService;
	
	private _fotos : any;

	@Input() vista: string = "lista";  				// Defecto 'lista' | 'vistaPrevia' | 'boton' solo un boton | 'botonActivo'
	@Input() cantidad: number = 1;     				// Defecto 1
	@Input() autocerrarcompleto: boolean = true;  	// Defecto Si     | Valida si al completar de cargar la foto se cierra

	@Input('config')
	set config(config: any) {
	  if (config) {
		if (config.vista) {
		  this.vista = config.vista;
		}
		if (config.cantidad) {
		  this.cantidad = config.cantidad;
		}
		if (config.autocerrarcompleto) {
		  this.autocerrarcompleto = config.autocerrarcompleto;
		}
	  }
	}
	
	@Input('fotos')
	set adjuntos(fotos: any) {
	  this._fotos = fotos;
	}

	@Output() eventoEliminar: EventEmitter<any>; // hace binding al padre.

	@Input() ruta: any;

	constructor(private ohCore: OHService, private fireStorage: AngularFireStorage) {
		this.ohMainService = ohCore.getOH();
		this._fotos = [];
		this.eventoEliminar = new EventEmitter<any>();
	}

	abrirCamara(){
		this.ohMainService.getCamera().open({
			source : this._fotos,
			closeOnFull : this.autocerrarcompleto,
			size : this.cantidad,
			onClose : (fotos : any) => {
				//this.revision.fotos = fotos;
				
				/*if(!this._fotos){
					this._fotos = [];
				}
				for(var i in fotos){
					if(!this._fotos[i]){
						this._fotos[i] = {
							porcentaje : 0,
							cargado : false
						};
					}
				}

				this.fotoFbInicializar(this.revision, 'fotosCharge', fotos);



				this.fotoCargando = true;
				this.fotoFbRegistrar(this.revision.fotos, this.revision.fotosCharge, 0, () => {
					this.fotoCargando = false;
				});*/
			},
			onDelete : (indice : number) => {
				//this.fotoFbEliminar({indice : indice}, this.revision.fotosCharge);
			}
		})
	}

	fotoEliminar(){

	}

	vistaPrevia(){

	}

}