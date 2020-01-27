import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { ADMCoreService } from '../../../adm.coreService';
import { ADMRolServiceJPO, pSegrolObtenerUsuario, pSegrolObtener } from '../../../service/adm.aDMRolService';
import { NgForm, NgModel } from '@angular/forms';
import { SHACoreService } from 'src/app/module/sharedAdmin/sha.coreService';

@Component({
	selector: 'adm-rolSelect',
	templateUrl: './adm.rolSelect.html'
})
export class RolSelect {

	@Input() usuario_id: number;
	@Input() required: boolean;
	@Input() form : NgForm;
	@Input() name: string;
	
	@Input() roles_xml: any = "";
	@Output() roles_xmlChange: EventEmitter<any>;

	@ViewChild('inp_select', { static: true }) inp_select: NgModel;
	
	arbol : any = {
		hijos : []
	};

	roles : any;
	rolesSeleccionados : any;
	
	private aDMRolService : ADMRolServiceJPO;

	rolesMenuBase : any;
	rolesUNBase : any;
	rolesMenuFiltro : any;
	rolesUNFiltro : any;
	rolesFiltroFinal : any;

	UNLista : any;
	UNSeleccionado : any;

	constructor(private ohService: OHService, public cse: CoreService, public acs: ADMCoreService, public scs : SHACoreService){

		this.roles_xmlChange = new EventEmitter<Date>();
		this.roles = [];
		this.rolesSeleccionados = [];
		this.UNLista = [];

		this.aDMRolService = new ADMRolServiceJPO(ohService);
		
		Promise.all([this.scs.listarArbolMenu()]).then(values => {
			this.arbol = JSON.parse(JSON.stringify(this.scs.menuArbol));
			this.rolListar();
		});

	}

	ngAfterViewInit() {
		if(this.form){
			this.inp_select.name = this.name;
			this.form.addControl(this.inp_select);
		}
	}
	
	rolListar(){
		this.aDMRolService.segrolObtenerUsuario({
			usuario_id : this.usuario_id
		}, (resp : pSegrolObtenerUsuario) => {
			
			this.rolesMenuBase = resp.roles_menu;
			this.rolesUNBase = resp.roles_unidades_negocio;

			this.roles = resp.roles;

			for(var i in resp.roles_seleccionados){
				var item = resp.roles_seleccionados[i];
				var rol = this.roles.find(it => it.rol_id == item.rol_id);
				if(rol){
					rol.seleccionado = true;
				}
			}

			this.rolesMenuFiltro = Object.assign([], this.rolesMenuBase);
			this.rolesUNFiltro = Object.assign([], this.rolesUNBase);

			this.rolesSeleccionados = this.roles.filter(it => it.seleccionado == true);
			this.mapearXML();
			
			this.filtrarUnidad();
		});
	}

	eventosItem(event : any){
	}

	seleccionarRol(e : any, index : number){
		
		this.rolesSeleccionados = this.roles.filter(it => it.seleccionado == true);

		if(this.roles[index].seleccionado){
			var buscados = this.rolesMenuBase.filter(it => it.rol_id == this.roles[index].rol_id);
			var buscadosUN = this.rolesUNBase.filter(it => it.rol_id == this.roles[index].rol_id);
					
			if(buscados && buscados.length > 0){
				this.rolesMenuFiltro = this.rolesMenuFiltro.concat(buscados);
				this.rolesUNFiltro = this.rolesUNFiltro.concat(buscadosUN);
				this.filtrarUnidad();
			} else {
				this.aDMRolService.segrolObtener({
					rol_id : this.roles[index].rol_id
				}, (resp : pSegrolObtener) => {
					this.rolesMenuBase = this.rolesMenuBase.concat(resp.menus);
					this.rolesUNBase = this.rolesUNBase.concat(resp.unidad_negocios);
					this.rolesMenuFiltro = this.rolesMenuFiltro.concat(resp.menus);
					this.rolesUNFiltro = this.rolesUNFiltro.concat(resp.unidad_negocios);
					this.filtrarUnidad();
				});
			}
		} else {
			this.rolesMenuFiltro = this.rolesMenuFiltro.filter(it => it.rol_id != this.roles[index].rol_id);
			this.rolesUNFiltro = this.rolesUNFiltro.filter(it => it.rol_id != this.roles[index].rol_id);
			this.filtrarUnidad();
		}

		this.mapearXML();
		
	}

	filtrarUnidad(){
		
		if(this.rolesUNFiltro && this.rolesUNFiltro.length>0 && this.rolesMenuFiltro && this.rolesMenuFiltro.length>0){

			// 1 validamos si existe la un seleccionada sino obtenemos el inicial
			if(!this.UNSeleccionado || !this.rolesUNFiltro.find(it => it.id == this.UNSeleccionado)){
				this.UNSeleccionado = this.rolesUNFiltro[0].id;
			}

			if(this.UNSeleccionado){


				var listaUnidades = [];
				for(var i in this.rolesUNFiltro){
					var un = this.rolesUNFiltro[i];
					if(!listaUnidades.find(it => it.unidad_negocio_id == un.id)){
						var unidad = this.acs.data.unidad_negocio.find(it => it.unidad_negocio_id == un.id);
						listaUnidades.push({
							unidad_negocio_id : unidad.unidad_negocio_id,
							nombre : unidad.nombre,
							estado : (unidad.estado)?'Activo':'Inactivo'
						});
					}
				}
				this.UNLista = listaUnidades;


				var filtroRolUN = this.rolesUNFiltro.filter(it => it.id == this.UNSeleccionado);
				var rolMenuxUN = [];
				for(var i in this.rolesMenuFiltro){
					var itemRol = this.rolesMenuFiltro[i];
					if(filtroRolUN.find(it => it.rol_id == itemRol.rol_id)){
						rolMenuxUN.push(itemRol);
					}
				}
				
				this.rolesFiltroFinal = rolMenuxUN;
				this.buscarMenus();
			}

		} else {

			this.rolesFiltroFinal = [];
			this.UNLista = [];
			this.UNSeleccionado = null;
			this.buscarMenus();

		}

	}

	private buscarMenus(){

		var seleccionados = []
		for(var i in this.rolesFiltroFinal){
			var item = this.rolesFiltroFinal[i];

			if(!seleccionados.find(it => it == item.menu_id)){
				seleccionados.push(item.menu_id);
			}
			
		}

		this.deseleccionar(this.arbol);
		for(var i in seleccionados){
			this.seleccionar(this.arbol, seleccionados[i]);
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

	private mapearXML(){
		var roles_xml = [];
		for(var i in this.rolesSeleccionados){
			roles_xml.push({
				rol_id:  this.rolesSeleccionados[i].rol_id
			});
		}
		this.roles_xml = this.ohService.getOH().getUtil().getXMLString(roles_xml, "Rol");
		this.roles_xmlChange.emit(this.roles_xml);
	}

}