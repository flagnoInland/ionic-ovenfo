import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { pGesreporteListarFiltrar, pGesreporteBusquedaListar } from 'src/app/service/tis.reporteConsultaService';
import { ReporteConsultaServiceJPOImpl } from 'src/app/service/tis.reporteConsultaServiceImpl';

import * as XLSX from 'xlsx';

@Component({
	templateUrl: './ind.report.html'
})
export class Report implements OnInit, OnDestroy {

	@ViewChild("filterWindow", { static: true }) objFilter: TemplateRef<NgbActiveModal>;

	private reporteConsultaService: ReporteConsultaServiceJPOImpl;

	reportes: any;
	reporte_id: number;
	reporte_obj: pGesreporteListarFiltrar;

	descripcionAbierta: boolean;

	filter: any;
	pagin_page: number;
	pagin_size: number;
	pagin_total: number;

	objetoConsulta: any;

	constructor(private router: Router, private ohService: OHService, public cse: CoreService) {

		this.pagin_page = 1;
		this.pagin_size = 10;
		this.instanceFilter();
		this.objetoConsulta = [];
		this.reporte_obj = new pGesreporteListarFiltrar();
		this.reporte_id = null;
		this.reporteConsultaService = new ReporteConsultaServiceJPOImpl(ohService);
	}

	ngOnInit() {
		this.cse.config.disableSeparator = true;
		this.listarDisponibles();
	}

	ngOnDestroy() {
		this.cse.config.disableSeparator = false;
	}

	listarDisponibles() {
		this.reporteConsultaService.gesreporteListarFiltrar({
			usuario_id: this.cse.data.user.data.userid
		}, (resp: pGesreporteListarFiltrar[]) => {
			this.reportes = resp;
		});
	}

	seleccionarReporte() {

		this.descripcionAbierta = true;
		this.objetoTitulo = {};
		this.objetoConsulta = [];
		this.pagin_total = 0;

		this.reporte_obj = this.reportes.find(it => it.reporte_id == this.reporte_id);
		if (this.reporte_obj) {
			var params = JSON.parse(this.reporte_obj.parametros);

			this.reporte_obj["dynamic"] = params.filter(it => it.parametroTipo == "dynamic");
			this.reporte_obj["fixed"] = params.filter(it => it.parametroTipo == "fixed");

			var obligatorios = false;
			for (var i in this.reporte_obj["dynamic"]) {
				var item = this.reporte_obj["dynamic"][i];

				if (item.tipo == '5') {
					this.filter.fields[item.parametro] = {
						label: item.etiqueta,
						type: "fechaRango",
						initValue: null,
						endValue: null,
						closeFilter: true
					};
				} else {
					this.filter.fields[item.parametro] = {
						label: item.etiqueta,
						type: "",
						closeFilter: true
					}
				}
				if (item.tipo == '7') {
					item.buscarItem = {};
				}

				if (item.obligatorio == '1') {
					obligatorios = true;
				}

			}

			this.descripcionAbierta = true;

			/*if(!obligatorios){
				this.consultarReporte();
			}*/

		}
	}

	objetoTitulo: any;
	consultarReporte(call?: any) {

		var parametrosEnviar = [];
		var parametros = {};

		// 1.- Mapeando parámetros fijos
		if (this.tieneFijo("pf_unidad_negocio_id")) {
			parametros["pf_unidad_negocio_id"] = this.cse.data.user.profile;
			parametrosEnviar.push({
				parametro: "pf_unidad_negocio_id",
				tipo: "INTEGER"
			});
		}

		if (this.tieneFijo("pf_usuario_id")) {
			parametros["pf_usuario_id"] = this.cse.data.user.data.userid;
			parametrosEnviar.push({
				parametro: "pf_usuario_id",
				tipo: "INTEGER"
			});
		}

		if (this.tieneFijo("pf_usuario_identificador")) {
			parametros["pf_usuario_identificador"] = this.cse.data.user.data.id;
			parametrosEnviar.push({
				parametro: "pf_usuario_identificador",
				tipo: "STRING"
			});
		}

		// 2.- Mapeando parámetros dinámicos
		if(this.reporte_obj){

			for (var i in this.reporte_obj["dynamic"]) {
				var item = this.reporte_obj["dynamic"][i];
	
				var tipoParam = "";
				switch (item.tipo) {
					case "1": tipoParam = "STRING"; break;
					case "2": tipoParam = "INTEGER"; break;
					case "3": tipoParam = "STRING"; break;
					case "4": tipoParam = "DATE"; break;
					case "5": tipoParam = "DATE"; break;
					case "6": tipoParam = "CHARACTER"; break;
					case "7": tipoParam = "STRING"; break;
				}
	
				if (item.valor) {
					if (item.tipo == '4') {
						parametros["pd_" + item.parametro] = this.ohService.getOH().getUtil().dateNgbToString(item.valor);
					} else {
						parametros["pd_" + item.parametro] = item.valor;
					}
				}
	
				if (item.valorDesde && item.valorHasta) {
					parametros["pd_" + item.parametro + "_desde"] = this.ohService.getOH().getUtil().dateToString(item.valorDesde);
					parametros["pd_" + item.parametro + "_hasta"] = this.ohService.getOH().getUtil().dateToString(item.valorHasta);
				}
	
				if (item.tipo == '5') {
					parametrosEnviar.push({
						parametro: "pd_" + item.parametro + "_desde",
						tipo: tipoParam
					});
					parametrosEnviar.push({
						parametro: "pd_" + item.parametro + "_hasta",
						tipo: tipoParam
					});
				} else {
					parametrosEnviar.push({
						parametro: "pd_" + item.parametro,
						tipo: tipoParam
					});
				}
	
			}

			// 2.- Mapeando datos de paginacion
			parametros["pagina"] = this.pagin_page;
			parametros["cantidad"] = this.pagin_size;

			this.reporteConsultaService.consultarReporte(parametros, {
				DAT: {
					F: {
						nombre_store: this.reporte_obj.nombre_store,
						parametros: JSON.stringify(parametrosEnviar)
					}
				}
			}, (resp: any) => {
				if (resp && resp[0] && resp[1] && resp[1][0]) {
					if (call) { // Para exportar
						call(resp[0]);
					} else {
						this.objetoTitulo = resp[0][0];
						this.objetoConsulta = resp[0];
						this.pagin_total = resp[1][0][""];
					}
				} else {
					this.objetoTitulo = {};
					this.objetoConsulta = [];
					this.pagin_total = 1;
				}
			})
			
		}

	}

	tieneFijo(parametro: string) {
		return (this.reporte_obj && this.reporte_obj["fixed"].find(it => it.variable == parametro)) ? true : false;
	}

	instanceFilter() {

		this.filter = {};
		this.filter.field = {};
		this.filter.fields = {};

		this.filter.beforeFilter = () => {

			if(this.reporte_obj){
				
				for(var i in this.reporte_obj["dynamic"]) {

					var item = this.reporte_obj["dynamic"][i];
	
					if (item.valor) {
						this.filter.field[item.parametro].value = item.valor;
					}
	
					if (item.tipo == '3' && item.valor) {
						this.filter.field[item.parametro].descValue = item.opciones.find(it => it.valor == item.valor).descripcion;
					}
	
					if (item.tipo == '4' && item.valor) {
						this.filter.field[item.parametro].descValue = this.ohService.getOH().getUtil().dateNgbToString(item.valor);
					}
	
					if (item.tipo == '5' && item.valorDesde && item.valorHasta) {
						this.filter.field[item.parametro].initValue = item.valorDesde;
						this.filter.field[item.parametro].endValue = item.valorHasta;
					}
	
					if (item.tipo == '6' && item.valor) {
						this.filter.field[item.parametro].descValue = (item.valor == "1") ? "Si" : "No";
					}
	
					if (item.tipo == '7' && item.valor) {
						this.filter.field[item.parametro].descValue = item.valorDescripcion;
					}
	
				}
				
			}

			this.filter.fields = this.filter.field;

			this.filter.doFilter();
		};

		this.filter.beforeErase = (campo: string) => {
			var elemento = this.reporte_obj["dynamic"].find(it => it.parametro == campo);
			delete elemento.valor;
			delete elemento.valorDesde;
			delete elemento.valorHasta;
			delete elemento.valorDescripcion;
			elemento.buscarItem = {
				lista: [],
				encontrados: [],
				paginaActual: 1,
				paginaTotales: 1
			}
		}

		this.filter.doFilter = () => {
			this.pagin_page = 1;
			this.consultarReporte();
		};

	}

	itemBusquedaBuscar(item: any) {
		this.reporteConsultaService.gesreporteBusquedaListar({
			unidad_negocio_id: this.cse.data.user.profile,
			buscar: item.buscarItem.buscar,
			tipo_busqueda: item.tipo_busqueda
		}, (resp: pGesreporteBusquedaListar[]) => {
			item.buscarItem.lista = resp;
			item.buscarItem.paginaActual = 1;
			item.buscarItem.paginaTotales = Math.ceil(resp.length / 5);
			item.buscarItem.encontrados = this.itemPaginar(item.buscarItem.lista, 5, item.buscarItem.paginaActual);
		});
	}

	itemBusquedaSeleccionar(item: any, index: any) {
		var indeLista = (item.buscarItem.paginaActual - 1) * 5 + index;
		for (var i in item.buscarItem.lista) {
			item.buscarItem.lista[i].seleccionado = (i == indeLista) ? true : false;
		}
		for (var i in item.buscarItem.encontrados) {
			if (i != index) {
				item.buscarItem.encontrados[i].seleccionado = false;
			} else {
				item.valor = item.buscarItem.encontrados[i].valor;
				item.valorDescripcion = item.buscarItem.encontrados[i].descripcion;
			}
		}
	}

	itemPaginar(array, page_size, page_number) {
		--page_number; // because pages logically start with 1, but technically with 0
		return array.slice(page_number * page_size, (page_number + 1) * page_size);
	}

	itemBusquedaAntes(item: any) {
		--item.buscarItem.paginaActual;
		item.buscarItem.encontrados = this.itemPaginar(item.buscarItem.lista, 5, item.buscarItem.paginaActual);
	}

	itemBusquedaDespues(item: any) {
		item.buscarItem.paginaActual++;
		item.buscarItem.encontrados = this.itemPaginar(item.buscarItem.lista, 5, item.buscarItem.paginaActual);
	}

	itemBusquedaLimpiar(item) {
		item.buscarItem.buscar = "";
		item.buscarItem.encontrados = [];
	}

	exportar(fields: any) {
		var actual = this.pagin_page;
		this.pagin_page = 1;
		this.pagin_size = this.pagin_total;
		this.consultarReporte((objetoConsulta: any) => {
			this.pagin_page = actual;
			this.pagin_size = 10;
			this.exportAsExcelFile(objetoConsulta, "REPORTE");
		});
	}

	public exportAsExcelFile(json: any[], fileName: string): void {
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, { dateNF: "YYYY-MM-DD HH:mm:ss" });
		const workbook: XLSX.WorkBook = { Sheets: { 'REPORTE': worksheet }, SheetNames: ['REPORTE'] };
		XLSX.writeFile(workbook, fileName + '_' + new Date().getTime() + '.xlsx');
	}

}