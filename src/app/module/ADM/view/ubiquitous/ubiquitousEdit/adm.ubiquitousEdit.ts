import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMUbigeoServiceJPO, pGesubigeoEditar, pGesubigeoRegistrar, pGesubigeoObtener, pGesubigeoListarAll } from 'src/app/module/ADM/service/adm.aDMUbigeoService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	templateUrl: './adm.ubiquitousEdit.html'
})
export class UbiquitousEdit extends ADMBase implements OnInit, AfterViewInit, OnDestroy {
	
	private aDMUbigeoService: ADMUbigeoServiceJPO;
	item: any;
	items: any;
	edit: boolean;
	
	constructor(private ohService: OHService, public cse: CoreService, public ccs: ADMCoreService, private route: ActivatedRoute, private router: Router) {
		super(ohService, cse, ccs);
		this.aDMUbigeoService = new ADMUbigeoServiceJPO(ohService);
		this.item = {}
		this.items = []
		this.edit = false;
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			if(params && params['id']){
				this.item.ubigeo_id = params['id'];
				this.gesubigeoObtener(this.item.ubigeo_id);
			}
		});
	}

	ngAfterViewInit() {

	}

	ngOnDestroy() {

	}

	gesubigeoObtener(id) {
		this.aDMUbigeoService.gesubigeoObtener({
			ubigeo_id: id // Optional
		}, (resp: pGesubigeoObtener) => {
			this.item = resp;
			this.buscarLista();
		});
	}

	buscarLista() {
		this.aDMUbigeoService.gesubigeoListarAll({
			unidad_negocio_id : this.item.unidad_negocio_id,
            page : 1, // Optional
            size : 99999 // Optional
		}, (resp: pGesubigeoListarAll) => {
			this.items = resp.ubigeos
		});
	}

	registrar(){
		(this.item.ubigeo_id) ? this.gesubigeoEditar() : this.gesubigeoRegistrar()
	}

	gesubigeoEditar() {
		this.aDMUbigeoService.gesubigeoEditar({
			ubigeo_id: this.item.ubigeo_id, // Optional
			ubigeo_padre_id: this.item.ubigeo_padre_id, // Optional
			unidad_negocio_id: this.item.unidad_negocio_id, // Optional
			codigo: this.item.codigo, // Optional
			nombre: this.item.nombre, // Optional
			estado: this.item.estado, // Optional
			usuario_modificacion_id: this.cse.data.user.data.userid // Optional
		}, (resp: pGesubigeoEditar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				this.router.navigate(['../../'], { relativeTo: this.route });
			} else {
				this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
			}
		});
	}

	gesubigeoRegistrar() {
		this.aDMUbigeoService.gesubigeoRegistrar({
			ubigeo_padre_id: this.item.ubigeo_padre_id, // Optional
			unidad_negocio_id: this.item.unidad_negocio_id, // Optional
			codigo: this.item.codigo, // Optional
			nombre: this.item.nombre, // Optional
			estado: this.item.estado, // Optional
			usuario_registro_id: this.cse.data.user.data.userid // Optional
		}, (resp: pGesubigeoRegistrar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				this.router.navigate(['../'], { relativeTo: this.route });
			} else {
				this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
			}
		});
	}

}