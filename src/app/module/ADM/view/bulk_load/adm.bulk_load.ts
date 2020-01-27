import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ADMCargaServiceJPO, pSegcargaMasivaMaster } from '../../service/adm.aDMCargaService';

@Component({
	templateUrl: './adm.bulk_load.html'
})
export class Bulk_load extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

	private aDMCargaService: ADMCargaServiceJPO;
	public bulk: any;
	public nombreAdjunto: string = '';
	public billDetail: any = {};
	public file: File;
	public arrayBuffer: any;

	constructor(private ohService: OHService, public cse: CoreService, public acs: ADMCoreService) {
		super(ohService, cse, acs);
		this.aDMCargaService = new ADMCargaServiceJPO(ohService);
		this.bulk = {
			list_validate: []
		}
	}

	ngOnInit() { }

	ngAfterViewInit() { }

	ngOnDestroy() { }

	trackById(index, item) {
		return item.id; // unique id corresponding to the item
	}

	cambiarTab($event: NgbTabChangeEvent) {
		// console.log('$event:', $event)
	}

	cleanFile() {
		this.nombreAdjunto = null;
		this.bulk.files = null;
	}

	openXLS(event: any) {
		this.bulk.list_validate = [];
		// XLS NAME
		this.file = event.target.files[0];
		let input = event.target;
		if (input.files && input.files[0] != null) {
			if (input.files[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || input.files[0].type == "application/vnd.ms-excel") {
				this.nombreAdjunto = input.files[0].name;
				this.validSheets();
			} else {
				this.cleanFile();
				this.ohService.getOH().getAd().warning("El archivo adjuntado no tiene el formato correcto (.xlsx, .xls)");
			}
		}
	}

	validSheets() {
		this.bulk.list_validate = [];
		this.bulk.config = JSON.parse(this.bulk.option.variable_2);
		let fileReader = new FileReader();
		fileReader.onload = (e) => {
			this.arrayBuffer = fileReader.result;
			var data = new Uint8Array(this.arrayBuffer);
			var arr = new Array();
			for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			var bstr = arr.join("");
			var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
			// var workbook = XLSX.read(data, {
			// 	type: 'binary',
			// 	cellDates: true,
			// 	cellNF: false,
			// 	cellText: false
			// });
			let json_data = {};
			let count_sheet: number = 0;
			for (let index = 0; index < this.bulk.config.sheet.length; index++) {
				const sheet = this.bulk.config.sheet[index];
				for (let i = 0; i < workbook.SheetNames.length; i++) {
					if (workbook.SheetNames[i].toUpperCase() == sheet.name.toUpperCase()) {
						var first_sheet_name = workbook.SheetNames[i];
						count_sheet++;
						break;
					}
				}
				var worksheet = workbook.Sheets[first_sheet_name];
				var data_xlsx = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: null });
				data_xlsx.forEach(element => {
					var key_ = Object.keys(element);
					key_.forEach(property => {
						if (element[property] == null && property.indexOf('__EMPTY') != -1) {
							delete element[property];
						}
					});
				});
				json_data[sheet.name] = (data_xlsx.length > 0 ? data_xlsx : []);
			}
			if (count_sheet != this.bulk.config.sheet.length) {
				this.cleanFile();
				this.ohService.getOH().getAd().warning('Formato de Excel Inválido (Hojas necesarias no coinciden)');
			}
			console.log('json_data:', json_data)
		}
		fileReader.readAsArrayBuffer(this.file)
	}

	validateExcel() {
		this.bulk.list_validate = [];
		this.bulk.config = JSON.parse(this.bulk.option.variable_2);
		let fileReader = new FileReader();
		fileReader.onload = (e) => {
			this.arrayBuffer = fileReader.result;
			var data = new Uint8Array(this.arrayBuffer);
			var arr = new Array();
			for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			var bstr = arr.join("");
			var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
			let json_data = {};

			for (let index = 0; index < this.bulk.config.sheet.length; index++) {
				const sheet = this.bulk.config.sheet[index];
				for (let i = 0; i < workbook.SheetNames.length; i++) {
					if (workbook.SheetNames[i].toUpperCase() == sheet.name.toUpperCase()) {
						var first_sheet_name = workbook.SheetNames[i];
						break;
					}
				}
				var worksheet = workbook.Sheets[first_sheet_name];
				var data_xlsx = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: null });
				data_xlsx.forEach(element => {
					var key_ = Object.keys(element);
					key_.forEach(property => {
						if (element[property] == null && property.indexOf('__EMPTY') != -1) {
							delete element[property];
						}
					});
				});
				json_data[sheet.name] = (data_xlsx.length > 0 ? data_xlsx : []);
				if (data_xlsx.length > 0) {
					this.bulk.list_validate.push({
						sheet: sheet.name,
						data: data_xlsx
					});
				}
			}
			this.bulk.data_xlsx = json_data
			this.validar();
		}
		fileReader.readAsArrayBuffer(this.file)
	}

	validar() {
		this.aDMCargaService.segcargaMasivaMaster({
			stored_valid: this.bulk.config.valid_stored, // Optional
			json_data: JSON.stringify(this.bulk.data_xlsx), // Optional
			unidad_negocio: this.cse.data.user.profile,
			usuario_carga_id: this.cse.data.user.data.userid
		}, (resp: pSegcargaMasivaMaster) => {
			console.log('resp:', resp)
			for (let index = 0; index < this.bulk.config.sheet.length; index++) {
				var key = this.bulk.config.sheet[index].key;
				var name = this.bulk.config.sheet[index].name;
				console.log('name:', name)
				var list_ = this.bulk.list_validate.find(function (element) {
					return element.sheet == name;
				}.bind(this));
				list_.data.forEach((element, idx) => {
					if (resp.result[name]) {
						element.result = 'No validado .(revise formato de entrada o respuesta .0)';
						element.opcion = 0;
						var arr_elm = resp.result[name];
						var aux_valid = 0;
						for (let index = 0; index < key.length; index++) {
							for (let id_x = 0; id_x < arr_elm.length; id_x++) {
								var r_element = arr_elm[id_x];
								if (element[key[index]] == r_element[key[index]]) {
									aux_valid++;
									break;
								}
							}
						}
						if (key.length == aux_valid) {
							element.result = r_element.result
							element.opcion = r_element.opcion
						}
					} else {
						element.result = 'No validado .(revise formato de entrada o respuesta .1)';
						element.opcion = 0;
					}
				});
			}
		});
	}

	checkValue(val: any) {
		return val instanceof Date ? this.ohService.getOH().getUtil().dateTimeToString(val) : val;
	}

	selectIns(sheet: any) {
		sheet.data.forEach((element, idx) => {
			element.chk_send = (element.opcion == 1);
		});
	}

	countIns(sheet: any) {
		var count: number = 0;
		var count_check: number = 0;
		sheet.data.forEach((element, idx) => {
			if (element.opcion == 1) count++;
			if (element.opcion == 1 && element.chk_send) count_check++;
		});
		return count == count_check ? true : (count == 0);
	}

	unselect(sheet: any) {
		sheet.data.forEach((element, idx) => {
			element.chk_send = false;
		});
	}

	countCheck(sheet: any) {
		var count: number = 0;
		sheet.data.forEach((element, idx) => {
			if (element.chk_send) count++;
		});
		return count == 0;
	}

	selectUpd(sheet: any) {
		sheet.data.forEach((element, idx) => {
			element.chk_send = (element.opcion == 2);
		});
	}

	countUpd(sheet: any) {
		var count: number = 0;
		var count_check: number = 0;
		sheet.data.forEach((element, idx) => {
			if (element.opcion == 2) count++;
			if (element.opcion == 2 && element.chk_send) count_check++;
		});
		return count == count_check ? true : (count == 0);
	}

	selectAll(sheet: any) {
		sheet.data.forEach((element, idx) => {
			element.chk_send = (element.opcion != 0);
		});
	}

	countAll(sheet: any) {
		var count: number = 0;
		var count_check: number = 0;
		sheet.data.forEach((element, idx) => {
			if (element.opcion != 0) count++;
			if (element.chk_send) count_check++;
		});
		return count == count_check ? true : (count == 0);
	}

	countAllCheck() {
		var count: number = 0;
		for (let index = 0; index < this.bulk.config.sheet.length; index++) {
			const sheet = this.bulk.config.sheet[index];
			var list_ = this.bulk.list_validate.find(function (element) {
				return element.sheet == sheet.name;
			}.bind(this));
			list_.data.forEach((element, idx) => {
				if (element.chk_send) count++;
			});
		}
		return count == 0;
	}

	sendData() {
		let json_data = {};
		for (let index = 0; index < this.bulk.config.sheet.length; index++) {
			const sheet = this.bulk.config.sheet[index];
			var list_ = this.bulk.list_validate.find(function (element) {
				return element.sheet == sheet.name;
			}.bind(this));
			var arr_ = [];
			list_.data.forEach((element, idx) => {
				if (element.chk_send) {
					// element.usuario_carga_id = this.cse.data.user.data.userid;
					arr_.push(element);
				}
			});
			json_data[sheet.name] = arr_;
		}
		// console.log('json_data:', json_data);
		this.aDMCargaService.segcargaMasivaMaster({
			stored_bulk: this.bulk.config.bulk_stored,
			json_data: JSON.stringify(json_data), // Optional
			unidad_negocio: this.cse.data.user.profile,
			usuario_carga_id: this.cse.data.user.data.userid
		}, (resp: pSegcargaMasivaMaster) => {
			console.log('resp:', resp)
			if (resp.result.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.result.resp_mensaje);
				this.validateExcel();
			} else {
				if (resp.result.resp_estado == 0) {
					this.ohService.getOH().getLoader().showError(resp.result.resp_mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.result.resp_mensaje);
				}
			}
		});
	}
}
