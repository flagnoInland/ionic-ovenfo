import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { NgForm, NgModel } from '@angular/forms';
import { ADMRolServiceJPO, pSegrolListar } from 'src/app/module/ADM/service/adm.aDMRolService';

@Component({
	selector: 'sha-rolSearch',
	templateUrl: './sha.rolSearch.html'
})
export class RolSearch {
	
	_roles_list : any;
	_roles_valid : string = "";
	roles: any;

	@Input()
    set roles_list(valor : any) {
		if(valor){
			this.validarRoles(valor, () => {
				this.mapear();
			});
		}
    }
    get roles_list(): any { 
      return this._roles_list; 
    }
	@Output() roles_listChange: EventEmitter<any>;
	
	@Input() roles_array: any;
	@Output() roles_arrayChange: EventEmitter<any>;
	@Input() roles_concat: any;
	@Output() roles_concatChange: EventEmitter<string>;
	@Input() roles_xml: any;
	@Output() roles_xmlChange: EventEmitter<any>;
	
	@Input() required: boolean;
	@Input() form : NgForm;
	@Input() name: string = 'name';
	
	@Input() show_state: boolean = true;
	@Input() show_un: boolean = true;
	@Input() disabled: boolean;

	@ViewChild('inp_select', { static: true }) inp_select: NgModel;

	private aDMRolService : ADMRolServiceJPO;


	private precarga : Promise<any>;

	constructor(private ohService: OHService, public cse: CoreService){
		this.roles_concatChange = new EventEmitter<string>();
		this.roles_listChange = new EventEmitter<any>();
		this.roles_arrayChange = new EventEmitter<any>();
		this.roles_xmlChange = new EventEmitter<any>();
		this.aDMRolService = new ADMRolServiceJPO(ohService);
		this.roles = [];
		this.precarga = new Promise((resolve, reject) => {
			this.segrolListar(resolve);
        });
		
	}

	ngAfterViewInit() {
		if(this.form){
			this.inp_select.name = this.name;
			this.form.addControl(this.inp_select);
		}
	}

    segrolListar(resolve : any){
        this.aDMRolService.segrolListar({}, (resp : pSegrolListar) => {
			for(var item of resp.roles){
				item['unidades_lista'] = this.ohService.getOH().getUtil().StringXMLtoJSONList(item.unidades);
			}
			this.roles = resp.roles;
			resolve();
        });
	}

	validarRoles(roles : any, call : any){
		this.precarga.then(() => {
			for(var item of this.roles){
				if(roles.find(it => it.id == ""+item.rol_id)){
					item['seleccionado'] = true;
				} else {
					item['seleccionado'] = false;
				}
			}
			call();
		})
	}

	seleccionar(){
		this._roles_list = [];
		for (var rol of this.roles) {
			if(rol.seleccionado){
				this._roles_list.push({
					id : rol.rol_id,
					value : rol.nombre
				});
			}
		}
		this.roles_list = this._roles_list;
		this.roles_listChange.emit(this.roles_list);
	}

	mapear(){
		var roles_concat = [];
		var roles_array = [];
		var roles_xml = [];
		for (var rol of this.roles) {
			if(rol.seleccionado){
				roles_concat.push(rol.rol_id);
				roles_array.push(rol.rol_id);
				roles_xml.push({
					rol_id: rol.rol_id
				});
			}
		}
		this._roles_valid = roles_concat.join(",");
		this.roles_concatChange.emit(roles_concat.join(","));
		this.roles_arrayChange.emit(roles_array);
		this.roles_xmlChange.emit(this.ohService.getOH().getUtil().getXMLString(roles_xml, "Rol"));
	}

}