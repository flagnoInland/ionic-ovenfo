import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ADMFormatoServiceJPO, pGesformatoListar, gesformatoListar_formatos, pGesformatoEliminar } from '../../service/adm.aDMFormatoService';
import { BUIReferenciaServiceJPO, pGesreferenciaListar } from 'src/app/module/BUI/service/bui.bUIReferenciaService';

@Component({
	templateUrl: './adm.emailtemplate.html'
})

export class Emailtemplate extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

	public filter: any;
	public pagin: any;

	/* Lista de adjuntos */
	private aDMFormatoService : ADMFormatoServiceJPO;
	public formatosList : gesformatoListar_formatos[];

	/* Referencias */
	private bUIReferenciaService : BUIReferenciaServiceJPO;
	referenciasList : pGesreferenciaListar[];
	have_referencia : boolean;

	/* Visualizar y Eliminar */
	public formatoSelected : gesformatoListar_formatos;

	constructor(private ohService : OHService, public cse : CoreService, public ccs : ADMCoreService, private modalService: NgbModal){
		super(ohService, cse, ccs);


		this.aDMFormatoService = new ADMFormatoServiceJPO(ohService);
		this.formatosList = [];
		
        this.bUIReferenciaService = new BUIReferenciaServiceJPO(ohService);
		this.have_referencia = false;
		this.filtroTab();
	}

	ngOnInit(){
		this.cse.config.disableSeparator = true;
	}

	ngAfterViewInit(){}

	ngOnDestroy(){
		this.cse.config.disableSeparator = false;
	}

	filtroTab(){
		this.pagin = {
			page: 1,
			total: 0,
			size_rows: 10,
		};
		this.filter = {
			startList : false,
			field : {},
			fields : {
				titulo : {
					label : "Título",
					type : "",
					closeFilter : true
				},
				descripcion : {
					label : "Descripción",
					type : "",
					closeFilter : true
				}
			}
		};
	}

	gesformatoListar(){
        this.aDMFormatoService.gesformatoListar({
            titulo : this.filter.fields.titulo.value,
            descripción : this.filter.fields.descripcion.value,
            page : this.pagin.page,
            size : this.pagin.size_rows
        }, (resp : pGesformatoListar) => {
			this.pagin.total = resp.response.total;
			this.formatosList = resp.formatos;
        });
    }
	
	verFormato(modal, formatoSelected : gesformatoListar_formatos) {
		this.formatoSelected = formatoSelected;
		if	(this.formatoSelected.cotenido_padre != null){
			this.formatoSelected.cotenido_padre = this.formatoSelected.cotenido_padre.replace('cid:LogoAPM.png', 'https://containerservices.inlandservices.com/assets/img/logo-01.svg');
			this.formatoSelected.cotenido_padre = this.formatoSelected.cotenido_padre.replace('${container}', this.formatoSelected.contenido);
		} else {
			this.formatoSelected.cotenido_padre = this.formatoSelected.contenido.replace('cid:LogoAPM.png', 'https://containerservices.inlandservices.com/assets/img/logo-01.svg');;
		}

		this.modalService.open(modal,{size : "lg"}).result.then((result) => {}, (reason) => {});
	}
	
	confirmarFormato(modal, formatoSelected : gesformatoListar_formatos) {
		this.formatoSelected = formatoSelected;
		this.have_referencia = false;
		this.referenciasList = [];
		this.bUIReferenciaService.gesreferenciaListar({
			owner_in: 'ges',
			tabla_in: 'email_plantilla',
			value_in : String(this.formatoSelected.email_plantilla_id)
		}, (resp : pGesreferenciaListar[]) => {
			if	(resp.length > 0){
				this.have_referencia = true;
				this.referenciasList = resp;
			}
			this.modalService.open(modal).result.then((result) => {}, (reason) => {});
		});
	}

	gesformatoEliminar(formatoSelected : gesformatoListar_formatos){
		// console.log(formatoSelected);
		this.formatoSelected = formatoSelected;
		this.aDMFormatoService.gesformatoEliminar({
			formato_id : this.formatoSelected.email_plantilla_id
		}, (resp : pGesformatoEliminar) => {
			this.modalService.dismissAll();
			if(resp.estado == 1){
				this.ohService.getOH().getAd().success(resp.mensaje);
			} else {
				if(resp.estado == 0){
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			}
			this.gesformatoListar();
		});
	}


}