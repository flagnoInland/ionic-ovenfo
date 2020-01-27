import { Component, Input, ElementRef, ViewChild, SimpleChanges, EventEmitter, Output, OnChanges, OnInit } from '@angular/core';
import { Util } from '../../services/util/oh.util';

import * as FileSaver from 'file-saver';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
/*
	type : "edit" -> photos = [src1, src2]
	type : "view" -> photos = [{photo : src1, id : 1}]
*/
@Component({
	selector: 'oh-imagePreview',
	templateUrl: './oh.imagePreview.html',
	styleUrls: ['./oh.imagePreview.css']
})

export class ImagePreview implements OnChanges {

	@ViewChild("modalDetail", { static: true }) modalDetail: NgbModalRef;

	@ViewChild("lanePhoto", { static: true }) lanePhoto: ElementRef;
	@Input() photos: any;
	@Input() photosCharge: any;
	@Input() typeView: any; // edit | view | link
	@Input() typeAction: any; // descargar | vista_previa
	@Output() photosChange: EventEmitter<any>; // hace binding al padre.
	@Output() photosChargeChange: EventEmitter<any>; // hace binding al padre.
	@Output() beforeClick: EventEmitter<any>; // hace binding al padre.
	@Output() beforeDelete: EventEmitter<any>; // hace binding al padre.
	hasLoaded: boolean;

	private util: Util;
	foto_vista: any;
	indice: number;

	constructor(private modalService: NgbModal) {
		this.photosChange = new EventEmitter<boolean>();
		this.photosChargeChange = new EventEmitter<boolean>();
		this.beforeClick = new EventEmitter<any>();
		this.beforeDelete = new EventEmitter<any>();
		this.photos = [];
		this.photosCharge = [];
		this.typeView = "edit";
		this.typeAction = "descargar";
		this.util = new Util(null);
		this.hasLoaded = false;
	};



	deletePhoto(index: number) {
		this.photos.splice(index, 1);
		this.photosChange.emit(this.photos);
		this.beforeDelete.emit({
			indice: index
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.photos) {
			// Si es solo vista cargar las fotos
			if (this.typeView == "view" && this.photos && this.photos.length > 0) {
				for (var i = 0; i < this.photos.length; i++) {
					this.vistaPrevia(this.photos[i], i, false);
				}
			}
		}
		if (changes.photos && this.lanePhoto) { // Cuando el campo ya ha sido llenado
			window.setTimeout(() => {
				this.lanePhoto.nativeElement.scrollLeft = this.lanePhoto.nativeElement.scrollWidth;
			});
		}
	}

	// trackById(index, item) {    
	// 	console.log('index, item:', index, item)
	// 	return item ? item.id : index;
	// }

	descargar(photo: any) {
		FileSaver.saveAs(this.util.base64strToBlog(photo.photo), photo.id + ".jpg");
	}
	
	myModal: any;
	vistaPrevia(photo: any, index: number, openFoto: boolean) {
		console.log(photo);
		console.log(index);
		console.log(openFoto);
		this.indice = index;
		if (this.typeAction == "descargar") {
			this.descargar(photo);
		} else {
			if (this.beforeClick.observers.length > 0 && !this.hasLoaded) {
				this.beforeClick.emit({
					fotos: this.photos,
					process: (resp) => {
						if (resp) {
							for (var i in resp) {
								this.photos[i].photo = resp[i]
							}
						}
						this.hasLoaded = true;
						if (openFoto) {
							this.openPhoto(this.photos[0]);
						}
					},
					addItem: (indice: number, data: string) => {
						if (this.photos && this.photos[indice]) {
							this.photos[indice].photo = data;
						}
						if (indice == 0) {
							if (openFoto) {
								this.openPhoto(this.photos[0]);
							}
						}
						if (indice + 1 == this.photos.length) {
							this.hasLoaded = true;
						}
					}
				});
			} else {
				this.openPhoto(photo);
			}
		}
	}

	openPhoto(photo: any) {
		this.foto_vista = photo;
		this.myModal = this.modalService.open(this.modalDetail, { windowClass: 'oh_dark-modal', size: 'lg', scrollable: true });
	}

	atras() {
		this.indice = this.indice - 1;
		this.foto_vista = this.photos[this.indice];
	}

	adelante() {
		this.indice = this.indice + 1;
		this.foto_vista = this.photos[this.indice];
	}

	ngOnDestroy() {
		if (this.myModal) {
			this.myModal.close();
		}
	}

}