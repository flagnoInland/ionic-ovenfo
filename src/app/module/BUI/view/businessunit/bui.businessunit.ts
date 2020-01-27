import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { segunidadNegocioListar_resultado, pSegunidadNegocioListar, pSegunidadNegocioEliminarValidar, pSegunidadNegocioEliminar } from '../../service/bui.bUIUnidadNegocioService';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
	templateUrl: './bui.businessunit.html'
})
export class Businessunit extends BUIBase implements OnInit, AfterViewInit, OnDestroy {
	
	@ViewChild("modalConfElim", { static: true }) modalConfElim: TemplateRef<NgbActiveModal>;

	pagin_page : number;
	pagin_size : number;
	pagin_total : number;
	uns : segunidadNegocioListar_resultado[];

	constructor(private ohService : OHService, public cse : CoreService, public ccs : BUICoreService, private router : Router, private modalService: NgbModal){
		super(ohService, cse, ccs);
		this.pagin_page = 1;
		this.pagin_size = 10;
		this.uns = [];
	}

	ngOnInit(){
		this.cse.config.disableSeparator = true;
		this.list();
	}

	ngOnDestroy(){
		this.cse.config.disableSeparator = false;
	}

	ngAfterViewInit(){
	}

	list(){
		this.bUIUnidadNegocioService.segunidadNegocioListar({
            page : this.pagin_page,
            size : this.pagin_size
        }, (resp : pSegunidadNegocioListar) => {
			this.pagin_total = resp.respuesta.total;
			this.uns = resp.resultado;
        });
	}

	eliminar(rol_id : number){
		this.ohService.getOH().getUtil().confirm("¿Confirma eliminar el rol seleccionado?", ()=> {
			this.validarEliminar(rol_id);
		})
	}

	elminiarConf : any = {};
	validarEliminar(unidad_negocio_id : number){
		this.bUIUnidadNegocioService.segunidadNegocioEliminarValidar({
            unidad_negocio_id : unidad_negocio_id
        }, (resp : pSegunidadNegocioEliminarValidar) => {
			if(resp.catalogos || resp.empresas || resp.faqs || resp.roles || resp.terminos || resp.usuarios){
				this.elminiarConf = resp;
				this.modalService.open(this.modalConfElim).result.then((result) => {
					if(result == "Confirmar"){
						this.eliminarUN(unidad_negocio_id);
					}
				}, (reason) => {
		
				});
			} else {
				this.eliminarUN(unidad_negocio_id);
			}
        });
	}

	eliminarUN(unidad_negocio_id : number){
		this.bUIUnidadNegocioService.segunidadNegocioEliminar({
            unidad_negocio_id : unidad_negocio_id,
            Usuario_id : this.cse.data.user.data.userid
        }, (resp : pSegunidadNegocioEliminar) => {
			if(resp.estado == 1){
				this.ohService.getOH().getAd().success(resp.mensaje);
				this.list();
			} else {
				this.ohService.getOH().getAd().warning(resp.mensaje);
			}
        });
	}

}
