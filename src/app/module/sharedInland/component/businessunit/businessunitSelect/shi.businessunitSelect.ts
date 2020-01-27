import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { ADMUnidadNegocioServiceJPO, pSegunidadNegocioListar } from 'src/app/module/ADM/service/adm.aDMUnidadNegocioService';

@Component({
	selector: 'shi-businessunitSelect',
	templateUrl: './shi.businessunitSelect.html'
})
export class BusinessunitSelect {
	 
	_unidades_list : any;
	_unidades_valid : string = "";

	@Input()
    set unidades_list(valor : any) {
		if(valor){
			this.validarUnidades(valor, () => {
				this.mapear();
			});
		}
    }
    get unidades_list(): any { 
      return this._unidades_list; 
    }
	@Output() unidades_listChange: EventEmitter<any>;

	@Input() unidad_padre: number = null;
	@Input() tipo_un: number = null;

	@Input() unidades_concat: string;
	@Output() unidades_concatChange: EventEmitter<string>;

	@Input() unidades_xml: any = "";
	@Output() unidades_xmlChange: EventEmitter<any>;

	@Input() unidades_json: any = "";
	@Output() unidades_jsonChange: EventEmitter<any>;
	
	@Input() required: boolean;
	@Input() form : NgForm;
	@Input() name: string;
	
	@ViewChild('inp_select', { static: true }) inp_select: NgModel;
	
    private aDMUnidadNegocioService : ADMUnidadNegocioServiceJPO;

	public unidades: any;
	public precarga : Promise<any>;
	precarga_resolve : any;

	constructor(private ohService: OHService, public cse: CoreService){
		this.unidades_concatChange = new EventEmitter<string>();
		this.unidades_listChange = new EventEmitter<any>();
		this.unidades_xmlChange = new EventEmitter<any>();
		this.unidades_jsonChange = new EventEmitter<any>();
		this.aDMUnidadNegocioService = new ADMUnidadNegocioServiceJPO(ohService);
		this.unidades = [];
		this.precarga = new Promise((resolve, reject) => {
			this.precarga_resolve = resolve;
        });
	}

    ngOnInit() {
		this.segrolListar();
    }

	ngAfterViewInit() {
		if(this.form){
			this.inp_select.name = this.name;
			this.form.addControl(this.inp_select);
		}
	}

    segrolListar(){
        this.aDMUnidadNegocioService.segunidadNegocioListar({
			unidad_padre: this.unidad_padre,
			tipo_un: this.tipo_un,
            page : 1, 
            size : 1000
        }, (resp : pSegunidadNegocioListar) => {
			this.unidades = resp.resultado;
			this.precarga_resolve();
        });
	}

	validarUnidades(unidades : any, call : any){
		this.precarga.then(() => {
			for(var item of this.unidades){
				if(unidades.find(it => it.id == item.unidad_negocio_id)){
					item['seleccionado'] = true;
				} else {
					item['seleccionado'] = false;
				}
			}
			call();
		})
	}

	seleccionar(){
		this._unidades_list = [];
		for (var rol of this.unidades) {
			if(rol.seleccionado){
				this._unidades_list.push({
					id : rol.unidad_negocio_id,
					value : rol.nombre
				});
			}
		}
		this.unidades_list = this._unidades_list;
		this.unidades_listChange.emit(this.unidades_list);
	}

	mapear(){
		
		var unidades_concat = [];
		var unidades_list = [];
		var unidades_xml = [];
		for (var unidad of this.unidades) {
			if(unidad.seleccionado){
				unidades_list.push({
					id : unidad.unidad_negocio_id,
					value : unidad.nombre
				});
				unidades_xml.push({
					unidad_negocio_id: unidad.unidad_negocio_id
				});
				unidades_concat.push(unidad.unidad_negocio_id);
			}
		}
		
		this._unidades_valid = unidades_concat.join(",");
		this.unidades_concatChange.emit(unidades_concat.join(","));
		this.unidades_xmlChange.emit(this.ohService.getOH().getUtil().getXMLString(unidades_xml, "unidad_negocio"));
		this.unidades_jsonChange.emit(JSON.stringify(unidades_xml));
		this.unidades_listChange.emit(this.unidades_list);

	}

}