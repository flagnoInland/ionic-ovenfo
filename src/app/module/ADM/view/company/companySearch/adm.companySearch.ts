import { Component, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMEmpresaServiceJPO, pGesempresaListar } from 'src/app/module/ADM/service/adm.aDMEmpresaService';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, NgModel } from '@angular/forms';

@Component({
	selector: 'adm-companySearch',
	templateUrl: './adm.companySearch.html'
})
export class CompanySearch {

	@ViewChild("tabEmpresaListar", { static: true }) public tabEmpresaListar: NgbTabset;
	@ViewChild('inp_select', { static: true }) inp_select: NgModel;
	
	@Input() mapearDefecto: boolean;
	@Input() required: boolean;
	@Input() form : NgForm;
	@Input() name: string;

	@Input() empresa_id: number;
	@Output() empresa_idChange: EventEmitter<number>;

	@Input() empresas: any;
	@Output() empresasChange: EventEmitter<any>;

	@Input() empresas_xml: any = "";
	@Output() empresas_xmlChange: EventEmitter<any>;

	@Input() empresas_concat: string;
	@Output() empresas_concatChange: EventEmitter<string>;

	private aDMEmpresaService : ADMEmpresaServiceJPO;

	buscarEmpresa: any;

	constructor(private ohService: OHService, public cse: CoreService){
		this.empresa_idChange = new EventEmitter<number>();
		this.empresasChange = new EventEmitter<any>();
		this.empresas_xmlChange = new EventEmitter<Date>();
		this.empresas_concatChange = new EventEmitter<string>();
		this.aDMEmpresaService = new ADMEmpresaServiceJPO(ohService);
		this.empresas = [];
		this.empresaLimpiar();
	}

	ngAfterViewInit() {
		if(this.form){
			this.inp_select.name = this.name;
			this.form.addControl(this.inp_select);
		}
	}

	ngOnChanges(changes: SimpleChanges){
		if(changes.empresas && changes.empresas.currentValue && changes.empresas.currentValue.length>0){
			setTimeout(() => {
				this.tabEmpresaListar.select("tab-seleccionados");
				this.mapearEmpresas();
			})
		}
	}

	empresaBuscar(orden?: string) {

		if(!this.empresas){
			this.empresas = [];
		}

		if (orden) {
			if (orden == "back" && this.buscarEmpresa.paginaActual != 1) {
				this.buscarEmpresa.paginaActual--;
			} else if (orden == "next" && this.buscarEmpresa.paginaActual != this.buscarEmpresa.paginaTotales) {
				this.buscarEmpresa.paginaActual++;
			}
		}

		this.aDMEmpresaService.gesempresaListar({
			razon_social: this.buscarEmpresa.buscar,
			page: this.buscarEmpresa.paginaActual,
			size: this.buscarEmpresa.paginaCantidad,
		}, (resp: pGesempresaListar) => {
			this.buscarEmpresa.empresas = resp.empresas;
			for (var i in resp.empresas) {
				var finded = this.empresas.find(item => item.empresa_id == resp.empresas[i].empresa_id);
				if (finded) {
					this.buscarEmpresa.empresas[i].elegido = true;
					this.buscarEmpresa.empresas[i].seleccionado = true;
				}
			}
			this.buscarEmpresa.paginaTotales = Math.ceil(resp.response.total / this.buscarEmpresa.paginaCantidad);
			this.buscarEmpresa.buscado = true;
		});

	}

	empresaSeleccionar(index: number) {
		this.buscarEmpresa.empresas[index].elegido = true;
		var empresa = Object.assign({}, this.buscarEmpresa.empresas[index]);
		if(this.empresas.length == 0){
			empresa.principal = true;
		}
		this.empresas.push(empresa);
		this.mapearEmpresas();
		if(this.empresas.length == 1){
			this.empresaPrincipal(0);
		}
	}

	private mapearEmpresas(){
		var empresas_xml = [];
		var empresas_contact = [];
		for (var empresa of this.empresas) {
			empresas_xml.push({
				empresa_id: empresa.empresa_id
			});
			empresas_contact.push(empresa.empresa_id);
		}

		this.empresasChange.emit(this.empresas);

		this.empresas_xml = this.ohService.getOH().getUtil().getXMLString(empresas_xml, "Empresa");
		this.empresas_xmlChange.emit(this.empresas_xml);

		this.empresas_concat = empresas_contact.join(",");
		this.empresas_concatChange.emit(this.empresas_concat);
	}

	empresaPrincipal(index: any) {
		this.empresa_id = this.empresas[index].empresa_id;
		this.empresa_idChange.emit(this.empresa_id);
		for (var i in this.empresas) {
			if (i != index) {
				this.empresas[i].principal = false;
			}
		}
	}

	empresaQuitar(index: number) {
		if (this.empresas[index].principal) {
			this.empresa_id = null;
			this.empresa_idChange.emit(this.empresa_id);
		}
		var finded = this.buscarEmpresa.empresas.find(item => item.empresa_id == this.empresas[index].empresa_id);
		if (finded) {
			finded.elegido = false;
			finded.seleccionado = false;
		}
		this.empresas.splice(index, 1);
		this.mapearEmpresas();
	}

	empresaLimpiar() {
		this.empresas = [];
		this.buscarEmpresa = {
			buscar: "",
			buscado: false,
			paginaActual: 1,
			paginaCantidad: 10,
			paginaTotales: 1,
			empresas: []
		};
	}

}