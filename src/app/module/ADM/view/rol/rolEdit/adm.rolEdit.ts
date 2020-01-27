import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMRolServiceJPO, pSegrolObtener, pSegrolEditar, pSegrolRegistrar } from 'src/app/module/ADM/service/adm.aDMRolService';
import { SHACoreService } from 'src/app/module/sharedAdmin/sha.coreService';

@Component({
  templateUrl: './adm.rolEdit.html'
})
export class RolEdit extends ADMBase {

	private aDMRolService : ADMRolServiceJPO;
	precargaParams : any;
	
	arbol : any = {
		hijos : []
	};

	item : any = {};
	unidades : any;
	unidades_xml : any;
	
	constructor(private route: ActivatedRoute, private router :Router, private ohService : OHService, public cse : CoreService, public acs : ADMCoreService, public scs : SHACoreService){
		super(ohService, cse, acs);

		this.aDMRolService = new ADMRolServiceJPO(ohService);

		this.item = {};

		var precarga = new Promise((resolve, reject) => {
			this.precargaParams = resolve;
		});
		Promise.all([this.precarga, precarga, this.scs.listarArbolMenu()]).then(values => {
			this.arbol = JSON.parse(JSON.stringify(this.scs.menuArbol));
			this.obtener();
		});

	}

	ngOnInit(){
		this.route.params.subscribe(params => {
			if(params && params['id']){
				this.item.rol_id = Number(params['id']);
			}
			this.precargaParams();
		});
	}
	
	private obtener(){
		if(this.item.rol_id){
			this.aDMRolService.segrolObtener({
				rol_id : this.item.rol_id
			}, (resp : pSegrolObtener) => {
				this.item = resp.rol;
				this.item.estado = (this.item.estado)?'1':'0';
	
				this.unidades = resp.unidad_negocios;
	
				this.seleccionados = [];
				if(resp.menus && resp.menus.length>0){
					for(var i in resp.menus){
						this.seleccionados.push(resp.menus[i].menu_id);
					}
				}
				this.buscarMenus(this.seleccionados);
				this.item.menus_id = this.seleccionados.join(",");
			});
		}
	}

	private buscarMenus(menus : any){
		this.deseleccionar(this.arbol);
		for(var i in menus){
			this.seleccionar(this.arbol, menus[i]);
		}
	}

	private deseleccionar(item : any){
		item.seleccionado = false;
		item.hide = false;
		for(var i in item.hijos){
			this.deseleccionar(item.hijos[i]);
		}
	}

	private seleccionar(item : any, menu_id : number){
		if(item.menu_id == menu_id){
			item.seleccionado = true;
			item.hide = true;
		} else {
			for(var i in item.hijos){
				this.seleccionar(item.hijos[i], menu_id);
			}
		}
	}

	seleccionados : any;
	eventosItem(event : any){
		this.seleccionados = [];
		this.obtenerRoles(this.arbol);
		this.item.menus_id = this.seleccionados.join(",");
	}

	private obtenerRoles(item : any){
		if(item.seleccionado == true){
			this.seleccionados.push(item.menu_id);
		}
		for(var i in item.hijos){
			this.obtenerRoles(item.hijos[i]);
		}
	}

	editar(frmRegister : any){
		if(frmRegister.valid){

			if(this.item.rol_id){

				this.aDMRolService.segrolEditar({
					rol_id : this.item.rol_id,
					nombre : this.item.nombre,
					id : this.item.id,
					estadoRol : this.item.estado,
					menu_ids : this.getMenusIDs(),
					unidad_negocio_ids : this.unidades_xml,
					Usuario_id : this.cse.data.user.data.userid
				}, (resp : pSegrolEditar) => {
					if(resp.estado==1){
						this.ohService.getOH().getAd().success(resp.mensaje);
						this.router.navigate(['../../'], { relativeTo: this.route }); 
					} else {
						this.ohService.getOH().getLoader().showError(resp.mensaje);
					}
				});

			} else {

				this.aDMRolService.segrolRegistrar({
					nombre : this.item.nombre,
					id : this.item.id,
					estadoRol : this.item.estado,
					menu_ids : this.getMenusIDs(),
					unidad_negocio_ids : this.unidades_xml,
					Usuario_id : this.cse.data.user.data.userid
				}, (resp : pSegrolRegistrar) => {
					if(resp.estado==1){
						this.ohService.getOH().getAd().success(resp.mensaje);
						this.router.navigate(['../'], { relativeTo: this.route }); 
					} else {
						this.ohService.getOH().getLoader().showError(resp.mensaje);
					}
				});

			}

		}
	}

	private getMenusIDs() : string {
		var xml = [];
		for(var i in this.seleccionados){
			xml.push("<Menu><Menu_id>"+this.seleccionados[i]+"</Menu_id></Menu>");
		}
		return xml.join("");
	}

}