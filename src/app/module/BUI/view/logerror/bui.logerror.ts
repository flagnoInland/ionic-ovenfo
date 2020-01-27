import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { pSeglogListar } from '../../service/bui.bUIPrincipalService';

@Component({
	templateUrl: './bui.logerror.html'
})
export class Logerror extends BUIBase implements OnInit, AfterViewInit, OnDestroy {

	
	@ViewChild("filterWindow", { static: true }) objFilter: TemplateRef<NgbActiveModal>;
	
	dateList : any = [];
	
	filter : any;
	pagin_page : number;
	pagin_size : number;
	pagin_total : number;

	constructor(private ohService : OHService, public cse : CoreService, public ccs : BUICoreService, private router : Router, private modalService: NgbModal){
		super(ohService, cse, ccs);
		this.pagin_page = 1;
		this.pagin_size = 10;
		this.instanceFilter();
	}


	ngOnInit(){
		this.cse.config.disableSeparator = true;
		this.list();
	}

	ngAfterViewInit(){
	}

	ngOnDestroy(){
		this.cse.config.disableSeparator = false;
	}

	instanceFilter(){
		this.filter = {};
		this.filter.field = {};
		this.filter.fields = {};

		this.filter.fields.usuario_nombre = {
			label : "Nombre de usuario",
			type : "",
			closeFilter : true
		};

		this.filter.fields.origen = {
			label : "Store origen",
			type : "",
			closeFilter : true
		};

		this.filter.fields.mensaje = {
			label : "Mensaje Error",
			type : "",
			closeFilter : true
		};

		this.filter.beforeFilter = () => {
			this.filter.fields = this.filter.field;
			if(this.filter.fields.usuario_nombre.value && this.filter.fields.usuario_nombre.value.length == 0){
				this.filter.fields.usuario_nombre.value = null;
			}
			if(this.filter.fields.origen.value && this.filter.fields.origen.value.length == 0){
				this.filter.fields.origen.value = null;
			}
			if(this.filter.fields.mensaje.value && this.filter.fields.mensaje.value.length == 0){
				this.filter.fields.mensaje.value = null;
			}
     		this.filter.doFilter();
		};

		this.filter.doFilter = () => {
			this.list();
		};

	}

	list(){

		this.bUIPrincipalService.seglogListar({
            usuario_nombre : this.filter.fields.usuario_nombre.value,
            origen : this.filter.fields.origen.value,
            mensaje : this.filter.fields.mensaje.value,
            Page : this.pagin_page,
            Size : this.pagin_size
        }, (resp : pSeglogListar) => {
			this.dateList = resp.lista;
			this.pagin_total = resp.resultado.total;
		});
		
	}

	detalle : string;
	mostrarDetalle(modal : any, index : number){
		this.detalle = this.dateList[index].mensaje;
		this.modalService.open(modal).result.then((result) => {
		}, (reason) => {
		});
	}

}
