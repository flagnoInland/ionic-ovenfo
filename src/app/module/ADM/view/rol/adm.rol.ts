import { Component, AfterViewInit, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Router } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMRolServiceJPO, pSegrolListar, segrolListar_roles, pSegrolEliminarValidar, pSegrolEliminar } from 'src/app/module/ADM/service/adm.aDMRolService';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './adm.rol.html'
})
export class Rol extends ADMBase implements OnInit, AfterViewInit {

	@ViewChild("modalConfElim", { static: true }) modalConfElim: TemplateRef<NgbActiveModal>;
	private aDMRolService : ADMRolServiceJPO;

	pagin: any;
	filter : any;

	roles : segrolListar_roles[];

	constructor(private router :Router, private ohService : OHService, public cse : CoreService, public acs : ADMCoreService, private modalService: NgbModal){
		super(ohService, cse, acs);
		this.aDMRolService = new ADMRolServiceJPO(ohService);
		this.roles = [];
		this.filtroTab();
	}

	ngOnInit(){
		this.cse.config.disableSeparator = true;
	}

	ngOnDestroy(){
		this.cse.config.disableSeparator = false;
	}

	ngAfterViewInit(){
		this.filter.startList = true;
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
				nombre : {
					label : "Nombre",
					type : "",
					closeFilter : true
				},
				id : {
					label : "Id",
					type : "",
					closeFilter : true
				},
				unidades : {
					label : "Unidades",
					type : "list",
					closeFilter : true
				}
			}
		};
	}

	list(){
		this.ohService.getOH().getLoader().show();
        this.aDMRolService.segrolListar({
            nombre : this.filter.fields.nombre.value,
			id : this.filter.fields.id.value,
			unidades : this.filter.fields.unidades.concatValue,
            page : this.pagin.page,
            size : this.pagin.size_rows
        }, (resp : pSegrolListar) => {
			this.ohService.getOH().getLoader().close();
			for(var item of resp.roles){
				item['unidades_lista'] = this.ohService.getOH().getUtil().StringXMLtoJSONList(item.unidades);
			}
			this.pagin.total = resp.response.total;
			this.roles = resp.roles;
		});
	}

	eliminar(rol_id : number){
		this.ohService.getOH().getUtil().confirm("¿Confirma eliminar el rol seleccionado?", ()=> {
			this.validarEliminar(rol_id);
		})
	}

	elminiarConf : any = {};
	validarEliminar(rol_id : number){
        this.aDMRolService.segrolEliminarValidar({
            rol_id : rol_id
        }, (resp : pSegrolEliminarValidar) => {
			if(resp.menus || resp.notificaciones || resp.reportes || resp.unidades_negocio || resp.usuarios){
				this.elminiarConf = resp;
				this.modalService.open(this.modalConfElim).result.then((result) => {
					if(result == "Confirmar"){
						this.eliminarRol(rol_id);
					}
				}, (reason) => {
		
				});
			} else {
				this.eliminarRol(rol_id);
			} 
        });
	}

	eliminarRol(rol_id : number){
        this.aDMRolService.segrolEliminar({
            rol_id : rol_id,
            Usuario_id : this.cse.data.user.data.userid
        }, (resp : pSegrolEliminar) => {
			if(resp.estado == 1){
				this.ohService.getOH().getAd().success(resp.mensaje);
				this.list();
			} else {
				this.ohService.getOH().getAd().warning(resp.mensaje);
			}
        });
	}

}