import { Component, AfterViewInit, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Router } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ADMBase } from '../../adm.base';
import { ADMCoreService } from '../../adm.coreService';
import { pSeglogEmailListar, pSeglogEmailReenviar } from '../../service/adm.aDMPrincipalService';

@Component({
  templateUrl: './adm.logemaillocal.html'
})
export class Logemaillocal extends ADMBase implements OnInit, AfterViewInit {

	@ViewChild("filterWindow", { static: true }) objFilter: TemplateRef<NgbActiveModal>;
	@ViewChild("modalDetalle", { static: true }) private modalDetalle: NgbModalRef;
	
	dateList : any = [];
	
	filter : any;
	pagin_page : number;
	pagin_size : number;
	pagin_total : number;

	constructor(private router :Router, private modalService: NgbModal, private ohService : OHService, public cse : CoreService, public acs : ADMCoreService){
		super(ohService, cse, acs);
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

		this.filter.fields.destinatario = {
			label : "Destinatario",
			type : "",
			closeFilter : true
		};

		this.filter.fields.copia = {
			label : "Copia",
			type : "",
			closeFilter : true
		};

		this.filter.fields.copia_oculta = {
			label : "Copia oculta",
			type : "",
			closeFilter : true
		};

		this.filter.fields.titulo = {
			label : "Título",
			type : "",
			closeFilter : true
		};
		
		this.filter.beforeFilter = () => {
			this.filter.fields = this.filter.field;
			if(this.filter.fields.destinatario.value && this.filter.fields.destinatario.value.length == 0){
				this.filter.fields.destinatario.value = null;
			}
			if(this.filter.fields.copia.value && this.filter.fields.copia.value.length == 0){
				this.filter.fields.copia.value = null;
			}
			if(this.filter.fields.copia_oculta.value && this.filter.fields.copia_oculta.value.length == 0){
				this.filter.fields.copia_oculta.value = null;
			}
			if(this.filter.fields.titulo.value && this.filter.fields.titulo.value.length == 0){
				this.filter.fields.titulo.value = null;
			}
     		this.filter.doFilter();
		};

		this.filter.doFilter = () => {
			this.list();
		};

	}

	list(){

		this.aDMPrincipalService.seglogEmailListar({
            destinatario : this.filter.fields.destinatario.value,
            copia : this.filter.fields.copia.value,
            copia_oculta : this.filter.fields.copia_oculta.value,
            titulo : this.filter.fields.titulo.value,
            Page : this.pagin_page,
            Size : this.pagin_size
        }, (resp : pSeglogEmailListar) => {
			this.dateList = resp.lista;
			this.pagin_total = resp.resultado.total;
		});
		
	}

	detalle : string;
	subtitulo : string;
	mostrarDetalle(detalle : string, subtitulo : string){
		this.detalle = detalle;
		this.subtitulo = subtitulo;
		var tamano = {};
		if(this.subtitulo=="mensaje"){
			tamano = { size: 'lg' };
		}
		this.modalService.open(this.modalDetalle, tamano).result.then((result) => {
		}, (reason) => {
		});
	}

	reenviar(log_id : number){
		this.ohService.getOH().getUtil().confirm("¿Confirma reenviar el correo seleccionado?", ()=> {
			this.aDMPrincipalService.seglogEmailReenviar({
				usuario_id : this.cse.data.user.data.userid,
				log_id : log_id
			}, (resp : pSeglogEmailReenviar) => {
				if(resp.estado==1){
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.list();
				} else {
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				}
			});
		})
	}

}