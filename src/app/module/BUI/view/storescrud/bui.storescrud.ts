import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { BUIStoresServiceJPO, pSegesquemaListar, pSegtablaListar, pSegcolumnaListar } from '../../service/bui.bUIStoresService';
import { BUIReferenciaServiceJPO, pGesreferenciaListar } from '../../service/bui.bUIReferenciaService';
import { NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	templateUrl: './bui.storescrud.html',
	styleUrls: ['./bui.storescrud.css']
})
export class Storescrud extends BUIBase implements OnInit, AfterViewInit, OnDestroy {

	private bUIStoresService: BUIStoresServiceJPO;
	private bUIReferenciaService: BUIReferenciaServiceJPO;

	store: any;
	element_key: any;
	activeTab: string;

	constructor(private ohService: OHService, public cse: CoreService, public ccs: BUICoreService, private modalService: NgbModal) {
		super(ohService, cse, ccs);

		this.bUIStoresService = new BUIStoresServiceJPO(ohService);
		this.bUIReferenciaService = new BUIReferenciaServiceJPO(ohService);

		this.store = {
			schemas: [],
			schema: "",
			tables: [],
			table: "",
			columns: [],
			query_registrar: "\n\n\n\n\n\n\n\n\n\n",
			query_editar: "\n\n\n\n\n\n\n\n\n\n",
			query_eliminar: "\n\n\n\n\n\n\n\n\n\n",
			query_obtener: "\n\n\n\n\n\n\n\n\n\n",
			json_obtener: "\n\n\n\n\n\n\n\n\n\n",
			query_listar: "\n\n\n\n\n\n\n\n\n\n",
			json_listar: "\n\n\n\n\n\n\n\n\n\n",
			filter_ts_listar: "\n\n\n\n\n\n\n\n\n\n",
			filter_html_listar: "\n\n\n\n\n\n\n\n\n\n",
			invalid: true,
			generate: true,
			referenciasList: [],
			foraneasList: [],
			foraneaSelected: {},
			join_options: ["INNER JOIN", "LEFT JOIN", "RIGTH JOIN", "CROSS JOIN"],
			tipo_childs: "JSON",
			model_param: 0,
			fk_index: 0
		}
		this.activeTab = "tabRegistrar";
	}


	ngOnInit() {
		this.segesquemaListar();
	}

	ngAfterViewInit() { }

	ngOnDestroy() { }

	cambiarTab($event: NgbTabChangeEvent) {
		this.activeTab = $event.nextId;
	}

	segesquemaListar() {
		this.bUIStoresService.segesquemaListar((resp: pSegesquemaListar[]) => {
			this.store.schemas = resp;
		});
	}

	segtablaListar() {
		this.cleanColumns();
		this.bUIStoresService.segtablaListar({
			schema: this.store.schema // Optional
		}, (resp: pSegtablaListar[]) => {
			if (resp.length > 0) {
				this.store.tables = resp;
				this.store.tables.push({ nombre: "" });
				this.store.table = "";
				//this.store.tables.splice(-1,1);
			}
		});
	}

	segColumnaListar() {
		this.cleanColumns();
		this.store.invalid = false;
		this.store.generate = false;
		if (!this.store.invalid) {
			if (this.store.schema != "" && this.store.table != "") {
				this.bUIStoresService.segcolumnaListar({
					schema: this.store.schema, // Optional
					table: this.store.table // Optional
				}, (resp: pSegcolumnaListar[]) => {
					this.store.columns = resp;
					for (let index = 0; index < this.store.columns.length; index++) {
						const element = this.store.columns[index];
						if (element.posicion == 1) {
							this.element_key = element;
						}
						// if(element.tamano == -1){
						// 	element.tamano = "MAX"
						// }
						if (element.ref_esquema) {
							this.store.foraneasList.push(element);
						}
						this.store.generate = false;
						element.chk_reg = true;
						element.chk_edi = true;
						element.chk_eli = true;
						element.chk_obt = true;
						element.chk_lis = true;
						if (index == 0) {
							element.chk_reg = false;
						} else {
							element.chk_eli = false;
						}
						if (element.columna.indexOf("usuario_modificacion_id") != -1) {
							element.chk_reg = false;
							element.chk_lis = false;
							element.chk_obt = false;
						}
						if (element.columna.indexOf("usuario_registro_id") != -1) {
							element.chk_edi = false;
							element.chk_lis = false;
							element.chk_obt = false;
						}
						if (element.columna.indexOf("fecha_registro") != -1 || element.columna.indexOf("fecha_modificacion") != -1) {
							element.chk_reg = false;
							element.chk_edi = false;
						}
					}
					this.gesreferenciaListar();
				});
			} else {
				this.ohService.getOH().getAd().warning('Falta seleccionar');
			}
		}
	}

	gesreferenciaListar() {
		this.bUIReferenciaService.gesreferenciaListar({
			owner_in: this.store.schema, // Optional
			tabla_in: this.store.table, // Optional
			//value_in : "" // Optional
		}, (resp: pGesreferenciaListar[]) => {
			this.store.referenciasList = resp;
			for (let index = 0; index < this.store.referenciasList.length; index++) {
				this.bUIStoresService.segcolumnaListar({
					schema: this.store.referenciasList[index].esquema, // Optional
					table: this.store.referenciasList[index].tabla // Optional
				}, (describ: pSegcolumnaListar[]) => {
					this.store.referenciasList[index].describ = describ;
				});
			}
		});
		// for (let index = 0; index < this.store.foraneasList.length; index++) {
		// }
	}

	generateQuerys() {
		if (!this.store.generate) {
			this.generateRegistrarQuery();
			this.generateEditarQuery();
			this.generateEliminarQuery();
			this.generateObtenerQuery();
			this.generateListarQuery();
		}
	}

	generateRegistrarQuery() {
		let sql: String;
		var arr_registrar = Array();
		this.store.columns.forEach(function (element) {
			if (element.chk_reg) {
				arr_registrar.push(element);
			}
		}.bind(this));
		sql = "CREATE PROCEDURE " + this.store.schema + "." + this.store.table + "_registrar\n"
			+ "\t--PARAMETROS IN\n";
		for (let index = 0; index < arr_registrar.length; index++) {
			const element = arr_registrar[index];
			sql += "\t@" + element.columna + " "
				+ (element.tipo == "DATETIME" ? "DATE" : element.tipo)
				+ (element.tipo.indexOf("CHAR") != -1 || element.tipo.indexOf("DECIMAL") != -1 ? "(" + element.tamano + ")" : "")
				+ ",\n";
		}
		for (let index = 0; index < this.store.referenciasList.length; index++) {
			var referencia = this.store.referenciasList[index];
			if (referencia.json_reg) {
				sql += "\t@" + referencia.tabla
					+ (this.store.tipo_childs == "JSON" ? " NVARCHAR(MAX)" : " XML")
					+ ", --JSON or XML\n";
			}
		}
		sql += "\t--PARAMETROS OUT\n"
			+ "\t@resp_new_id INT OUT,\n"
			+ "\t@resp_estado INT OUT,\n"
			+ "\t@resp_mensaje NVARCHAR(MAX) OUT\n"
			+ "AS\n"
			+ "BEGIN\n"
			+ "\tSET NOCOUNT ON\n"
			+ "\tBEGIN TRY\n"
			+ "\t\tBEGIN TRANSACTION\n"
			+ "\t\t\tINSERT INTO " + this.store.schema + "." + this.store.table + " (\n"
			+ "\t\t\t\t";

		for (let index = 0; index < arr_registrar.length; index++) {
			sql += arr_registrar[index].columna + (index < arr_registrar.length - 1 ? ", " : "\n");
		}
		sql += "\t\t\t) VALUES (\n"
			+ "\t\t\t\t";
		for (let index = 0; index < arr_registrar.length; index++) {
			sql += "@" + arr_registrar[index].columna + (index < arr_registrar.length - 1 ? ", " : "\n");
		}
		sql += "\t\t\t);\n"
			+ "\t\t\tSET @resp_new_id = @@IDENTITY;\n\n";
		for (let index = 0; index < this.store.referenciasList.length; index++) {
			var referencia = this.store.referenciasList[index];
			if (referencia.json_reg) {
				sql += "\t\t\t--INSERTING DATA INTO " + referencia.describ[0].esquema + "." + referencia.describ[0].tabla + "\n"
					+ "\t\t\tIF @" + referencia.tabla + " IS NOT NULL\n"
					+ "\t\t\tBEGIN\n"
					+ "\t\t\t\tINSERT INTO " + referencia.describ[0].esquema + "." + referencia.describ[0].tabla + " (\n"
					+ "\t\t\t\t\t";
				for (let index = 0; index < referencia.describ.length; index++) {
					if (referencia.describ[index].posicion != 1) {
						sql += referencia.describ[index].columna + (index < referencia.describ.length - 1 ? ", " : "\n");
					}
				};
				sql += "\t\t\t\t) SELECT \n"
					+ "\t\t\t\t\t";
				if (this.store.tipo_childs == "JSON") {
					for (let index = 0; index < referencia.describ.length; index++) {
						if (referencia.columna == referencia.describ[index].columna) {
							sql += '@resp_new_id' + (index < referencia.describ.length - 1 ? ", " : "\n");
						} else if (referencia.describ[index].posicion != 1) {
							sql += referencia.describ[index].columna + (index < referencia.describ.length - 1 ? ", " : "\n");
						}
					};
					sql += "\t\t\t\tFROM OPENJSON(@" + referencia.tabla + ") --JSON FORMAT: [{'field':'value'},{'field':'value'}]\n"
						+ "\t\t\t\tWITH (\n";
					for (let index = 0; index < referencia.describ.length; index++) {
						const element = referencia.describ[index];
						if (referencia.columna != element.columna && referencia.describ[index].posicion != 1) {
							sql += "\t\t\t\t\t" + element.columna + " "
								+ element.tipo
								+ (element.tipo.indexOf("CHAR") != -1 || element.tipo.indexOf("DECIMAL") != -1 ? "(" + element.tamano + ")" : "")
								+ " '$." + element.columna + "'"
								+ (index < referencia.describ.length - 1 ? "," : "")
								+ (element.tipo.indexOf("DATE") != -1 ? "--DATE FORMAT: yyyy-mm-dd" : "") + "\n";
						}
					};
					sql += "\t\t\t\t);\n";
				} else {
					for (let index = 0; index < referencia.describ.length; index++) {
						const element = referencia.describ[index];
						if (referencia.columna == element.columna) {
							sql += '@resp_new_id,\n';
						} else if (element.posicion != 1) {
							sql += "\t\t\t\t\tC.value('" + element.columna + "[1]','"
								+ (element.tipo == "DATETIME" ? "DATE" : element.tipo)
								+ (element.tipo.indexOf("CHAR") != -1 || element.tipo.indexOf("DECIMAL") != -1 ? "(" + element.tamano + ")" : "")
								+ "') AS "
								+ element.columna
								+ (index < referencia.describ.length - 1 ? "," : "")
								+ (element.tipo.indexOf("DATE") != -1 ? "--DATE FORMAT: yyyy-mm-dd" : "") + "\n";
						}
					};
					sql += "\t\t\t\tFROM @" + referencia.tabla + ".nodes('/"
						+ this.formatParametro(referencia.tabla) + "s/"
						+ this.formatParametro(referencia.tabla) + "') AS T(C);\n";
				}
				sql += "\t\t\tEND\n\n";
			}
		}
		sql += "\t\t\tSET @resp_estado = 1;\n"
			+ "\t\t\tSET @resp_mensaje = '" + /*this.store.table.charAt(0).toUpperCase() + this.store.table.slice(1) +*/ "Registro realizado correctamente';\n"
			+ "\t\tCOMMIT TRANSACTION\n"
			+ "\tEND TRY\n"
			+ "\tBEGIN CATCH\n"
			+ "\t\tIF @@TRANCOUNT > 0 ROLLBACK TRANSACTION\n"
			+ "\t\tDECLARE @log_id INT, @el INT = ERROR_LINE(), @en INT = ERROR_NUMBER(), @em NVARCHAR(4000) = ERROR_MESSAGE();\n"
			+ "\t\tEXEC seg.log_registrar @usuario_registro_id, '" + this.store.schema + "." + this.store.table + "_registrar', @el, @en, @em, @log_id OUTPUT;\n"
			+ "\t\tSET @resp_mensaje = CAST(@log_id AS VARCHAR) + ' | ' + ERROR_MESSAGE();\n"
			+ "\t\tSET @resp_estado = 0;\n"
			+ "\t\tSET @resp_new_id = 0;\n"
			+ "\tEND CATCH\n"
			+ "END\n"
			+ "GO\n";
		this.store.query_registrar = sql;
	}

	generateObtenerQuery() {
		this.generateRegistrarQuery();
		let sql: String = "";
		let select_list: String = "";
		let select_join: String = "";
		let from_join: String = "";
		let ref_tab: String = "";
		let acronimo: string = this.store.table.substring(0, 3).toUpperCase();
		let json = [{
			name: this.store.table,
			type: "object",
			items: []
		}];
		var arr_obtener = Array();
		this.store.columns.forEach(function (element) {
			if (element.chk_obt) {
				arr_obtener.push(element);
			}
		}.bind(this));
		for (let index = 0; index < arr_obtener.length; index++) {
			select_list += "\t\t" + (index != 0 ? "," : "")
				+ acronimo + "." + arr_obtener[index].columna + ""
				+ "\n";
			json[json.length - 1].items.push({
				name: arr_obtener[index].columna,
				type: this.getTipoForJson(arr_obtener[index].tipo)
			});
		}
		for (let index = 0; index < this.store.foraneasList.length; index++) {
			const element = this.store.foraneasList[index];
			const join_acronimo: string = element.ref_tabla.substring(0, 3) + this.formatChar(index);
			if (element.use_obt_join) {
				element.describ.forEach(function (column) {
					if (column.join_obt) {
						select_join += "\t\t,"
							+ join_acronimo.toUpperCase() + "." + column.columna + " AS "
							+ (column.join_obt_as != "" && column.join_obt_as ? column.join_obt_as : join_acronimo + "_" + column.columna)
							+ "\n";
						json[json.length - 1].items.push({
							name: (column.join_obt_as != "" && column.join_obt_as ? column.join_obt_as : join_acronimo + "_" + column.columna),
							type: this.getTipoForJson(column.tipo)
						});
					}
				}.bind(this));
				from_join += "\t\t" + element.join_obt_type + " " + element.ref_esquema + "." + element.ref_tabla + " AS "
					+ join_acronimo.toUpperCase() + " (NOLOCK) ON "
					+ join_acronimo.toUpperCase() + "." + element.ref_columna + " = " + acronimo + "." + element.columna + "\n";
			}
		}
		for (let index = 0; index < this.store.referenciasList.length; index++) {
			var referencia = this.store.referenciasList[index];
			const join_acronimo: string = referencia.tabla.substring(0, 3) + this.formatChar(index);
			if (referencia.json_obt) {
				json.push({
					name: referencia.tabla + "s",
					type: "list",
					items: []
				})
				let select_ref: String = "";
				for (let index = 0; index < referencia.describ.length; index++) {
					select_ref += "\t\t" + (index == 0 ? "" : ",") + referencia.describ[index].columna + (index < referencia.describ.length - 1 ? "\n" : "\n");
					json[json.length - 1].items.push({
						name: referencia.describ[index].columna,
						type: this.getTipoForJson(referencia.describ[index].tipo)
					});
				};
				ref_tab += "\n\t--GET DATA FROM " + referencia.esquema + "." + referencia.tabla + "\n\tSELECT \n" + select_ref
					+ "\tFROM " + referencia.esquema + "." + referencia.tabla + " AS " + join_acronimo.toUpperCase() + " (NOLOCK)\n"
					+ "\tWHERE " + referencia.columna + " = @" + this.element_key.columna + ";\n";
			}
		}
		sql += "CREATE PROCEDURE " + this.store.schema + "." + this.store.table + "_obtener\n"
			+ "\t--PARAMETROS IN \n"
			+ "\t@" + this.element_key.columna + " " + this.element_key.tipo + "\n"
			+ "AS\n"
			+ "BEGIN\n"
			+ "\tSET NOCOUNT ON\n"
			+ "\tSELECT\n"
			+ select_list
			+ select_join
			+ "\tFROM " + this.store.schema + "." + this.store.table + " AS " + acronimo + " (NOLOCK)\n"
			+ from_join
			+ "\tWHERE " + acronimo + "." + this.element_key.columna + " = @" + this.element_key.columna + ";\n"
			+ ref_tab
			+ "END\n"
			+ "GO\n";
		this.store.query_obtener = sql;
		this.store.json_obtener = JSON.stringify(json, null, "\t");
	}

	generateEditarQuery() {
		this.generateRegistrarQuery();
		let sql: String = "";
		let var_in: String = "";
		let set_upd: String = "\t\t\t\t";
		let ref_tab: String = "";
		var arr_editar = Array();
		this.store.columns.forEach(function (element) {
			if (element.chk_edi) {
				arr_editar.push(element);
			}
		}.bind(this));
		for (let index = 0; index < arr_editar.length; index++) {
			const element = arr_editar[index];
			if (element.chk_edi) {
				var_in += "\t@" + element.columna + " "
					+ (element.tipo == "DATETIME" ? "DATE" : element.tipo)
					+ (element.tipo.indexOf("CHAR") != -1 || element.tipo.indexOf("DECIMAL") != -1 ? "(" + element.tamano + ")" : "")
					+ ",\n";
				if (element.columna != this.element_key.columna) {
					set_upd += ""
						+ element.columna + " = @" + element.columna
						+ "\n"
						+ (index == arr_editar.length - 1 ? "" : "\t\t\t\t,");
				}
			}
		}
		for (let index = 0; index < this.store.referenciasList.length; index++) {
			var referencia = this.store.referenciasList[index];
			if (referencia.json_edi) {
				var_in += "\t@" + referencia.tabla
					+ (this.store.tipo_childs == "JSON" ? " NVARCHAR(MAX)" : " XML")
					+ ", --JSON or XML\n";

				let ins_ref: String = "";
				let json_ref: String = "";
				let xml_ref: String = "";
				let with_ref: String = "";

				for (let index = 0; index < referencia.describ.length; index++) {
					const element = referencia.describ[index];
					if (referencia.columna == element.columna) {
						json_ref += '@' + this.element_key.columna + ', ';
						xml_ref += '@' + this.element_key.columna + ',\n';
						ins_ref += element.columna + (index < referencia.describ.length - 1 ? ", " : "\n");
					} else if (element.posicion != 1) {
						ins_ref += element.columna + (index < referencia.describ.length - 1 ? ", " : "\n");
						json_ref += element.columna + (index < referencia.describ.length - 1 ? ", " : "\n");
						xml_ref += "\t\t\t\t\tC.value('" + element.columna + "[1]', '"
							+ (element.tipo == "DATETIME" ? "DATE" : element.tipo)
							+ (element.tipo.indexOf("CHAR") != -1 || element.tipo.indexOf("DECIMAL") != -1 ? "(" + element.tamano + ")" : "")
							+ "') AS "
							+ element.columna
							+ (index < referencia.describ.length - 1 ? "," : "")
							+ (element.tipo.indexOf("DATE") != -1 ? "--DATE FORMAT: yyyy-mm-dd" : "") + "\n";
						with_ref += "\t\t\t\t\t" + element.columna + " "
							+ element.tipo
							+ (element.tipo.indexOf("CHAR") != -1 || element.tipo.indexOf("DECIMAL") != -1 ? "(" + element.tamano + ")" : "")
							+ " '$." + element.columna + "'"
							+ (index < referencia.describ.length - 1 ? "," : "")
							+ (element.tipo.indexOf("DATE") != -1 ? "--DATE FORMAT: yyyy-mm-dd" : "") + "\n";
					}
				};

				json_ref += "\t\t\t\tFROM OPENJSON(@" + referencia.tabla + ") --JSON FORMAT: [{'field':'value'},{'field':'value'}]\n"
					+ "\t\t\t\tWITH (\n"
					+ with_ref
					+ "\t\t\t\t);\n";

				xml_ref += "\t\t\t\tFROM @" + referencia.tabla + ".nodes('/"
					+ this.formatParametro(referencia.tabla) + "s/"
					+ this.formatParametro(referencia.tabla) + "') AS T(C);\n";

				ref_tab += "\t\t\t--UPDATING DATA IN " + referencia.esquema + "." + referencia.tabla + "\n\t\t\tDELETE FROM " + referencia.esquema + "." + referencia.tabla
					+ " WHERE " + referencia.columna + " = @" + this.element_key.columna + ";\n"
					+ "\t\t\tIF @" + referencia.tabla + " IS NOT NULL\n"
					+ "\t\t\tBEGIN\n"
					+ "\t\t\t\tINSERT INTO " + referencia.esquema + "." + referencia.tabla + " (\n"
					+ "\t\t\t\t\t"
					+ ins_ref
					+ "\t\t\t\t) SELECT \n"
					+ "\t\t\t\t\t"
					+ (this.store.tipo_childs == "JSON" ? json_ref : xml_ref)
					+ "\t\t\tEND\n\n";
			}
		}
		sql += "CREATE PROCEDURE " + this.store.schema + "." + this.store.table + "_editar\n"
			+ "\t--PARAMETROS IN\n"
			+ var_in
			+ "\t--PARAMETROS OUT\n"
			+ "\t@resp_estado INT OUT,\n"
			+ "\t@resp_mensaje NVARCHAR(MAX) OUT\n"
			+ "AS\n"
			+ "BEGIN\n"
			+ "\tSET NOCOUNT ON\n"
			+ "\tBEGIN TRY\n"
			+ "\t\tBEGIN TRANSACTION\n"
			+ "\t\t\tUPDATE " + this.store.schema + "." + this.store.table + "\n"
			+ "\t\t\tSET\n"
			+ set_upd
			+ "\t\t\t\t,fecha_modificacion = CURRENT_TIMESTAMP\n"
			+ "\t\t\tWHERE " + this.element_key.columna + " = @" + this.element_key.columna + ";\n\n"
			+ ref_tab
			+ "\t\t\tSET @resp_estado = 1;\n"
			+ "\t\t\tSET @resp_mensaje = 'Registro" + /*this.store.table.charAt(0).toUpperCase() + this.store.table.slice(1) +*/ " actualizado correctamente';\n"
			+ "\t\tCOMMIT TRANSACTION\n"
			+ "\tEND TRY\n"
			+ "\tBEGIN CATCH\n"
			+ "\t\tIF @@TRANCOUNT > 0 ROLLBACK TRANSACTION\n"
			+ "\t\tDECLARE @log_id INT, @el INT = ERROR_LINE(), @en INT = ERROR_NUMBER(), @em NVARCHAR(4000) = ERROR_MESSAGE();\n"
			+ "\t\tEXEC seg.log_registrar @usuario_modificacion_id, '" + this.store.schema + "." + this.store.table + "_editar', @el, @en, @em, @log_id OUTPUT;\n"
			+ "\t\tSET @resp_mensaje = CAST(@log_id AS VARCHAR) + ' | ' + ERROR_MESSAGE();\n"
			+ "\t\tSET @resp_estado = 0;\n"
			+ "\tEND CATCH\n"
			+ "END\n"
			+ "GO\n";
		this.store.query_editar = sql;
	}

	generateEliminarQuery() {
		this.generateRegistrarQuery();
		let sql: String = "";
		let del_ref: String = "";
		for (let index = 0; index < this.store.referenciasList.length; index++) {
			var referencia = this.store.referenciasList[index];
			if (referencia.json_eli) {
				del_ref += "\t\t\tDELETE FROM " + referencia.esquema + "." + referencia.tabla + " WHERE " + referencia.columna + " = @" + this.element_key.columna + ";\n";
			}
		}
		sql += "CREATE PROCEDURE " + this.store.schema + "." + this.store.table + "_eliminar\n"
			+ "\t--PARAMETROS IN \n"
			+ "\t@" + this.element_key.columna + " " + this.element_key.tipo + ",\n"
			+ "\t--PARAMETROS OUT \n"
			+ "\t@resp_estado INT OUT, \n"
			+ "\t@resp_mensaje NVARCHAR(MAX) OUT\n"
			+ "AS\n"
			+ "BEGIN\n"
			+ "\tSET NOCOUNT ON\n"
			+ "\tBEGIN TRY\n"
			+ "\t\tBEGIN TRANSACTION\n"
			+ (del_ref != "" ? "\t\t\t--DELETING DATA IN REFERENCED TABLES\n" : "")
			+ del_ref
			+ (del_ref != "" ? "\n" : "")
			+ "\t\t\t--DELETING DATA IN TABLE\n"
			+ "\t\t\tDELETE FROM " + this.store.schema + "." + this.store.table + " " + "WHERE " + this.element_key.columna + " = @" + this.element_key.columna + ";\n"
			+ "\t\t\tSET @resp_estado = 1;\n"
			+ "\t\t\tSET @resp_mensaje = 'Registro" + /*this.store.table.charAt(0).toUpperCase() + this.store.table.slice(1) +*/ " eliminado correctamente';\n"
			+ "\t\tCOMMIT TRANSACTION\n"
			+ "\tEND TRY\n"
			+ "\tBEGIN CATCH\n"
			+ "\t\tIF @@TRANCOUNT > 0 ROLLBACK TRANSACTION\n"
			+ "\t\tDECLARE @log_id INT, @el INT = ERROR_LINE(), @en INT = ERROR_NUMBER(), @em NVARCHAR(4000) = ERROR_MESSAGE();\n"
			+ "\t\tEXEC seg.log_registrar 1, '" + this.store.schema + "." + this.store.table + "_eliminar', @el, @en, @em, @log_id OUTPUT;\n"
			+ "\t\tSET @resp_mensaje = CAST(@log_id AS VARCHAR) + ' | ' + ERROR_MESSAGE();\n"
			+ "\t\tSET @resp_estado = 0;\n"
			+ "\tEND CATCH\n"
			+ "END\n"
			+ "GO\n";

		this.store.query_eliminar = sql;
	}

	generateListarQuery() {
		let sql: String = "";
		let var_in: String = "";
		let join_count: String = "";
		let where_count: String = "";
		let select_list: String = "";
		let join_list: String = "";
		let where_list: String = "";
		let acronimo: string = this.store.table.substring(0, 3).toUpperCase();
		let json = [
			{
				name: "response",
				type: "object",
				items: [{
					name: "total",
					type: "number",
				}]
			}, {
				name: this.store.table + "s",
				type: "list",
				items: []
			}
		];
		let filter = {
			startList: false,
			field: {},
			fields: {}
		}
		let html_ = '<!-- Filtro -->\n'
			+ '<ng-template #filterWindow let-c="close" let-d="dismiss">\n'
			+ '\t<div class="modal-header d-flex align-items-center">\n'
			+ '\t\t<span class="h5 m-0"><i class="fa fa-filter mr-1"></i>Filtro</span>\n'
			+ '\t\t<button class="close d-flex text-dark m-0 p-0" (click)="d(\'Cross click\')"><i class="fas fa-times text-size-10"></i></button>\n'
			+ '\t</div>\n'
			+ '\t<div class="modal-body">\n';
		let html_count = -1;
		var arr_listar = Array();
		this.store.columns.forEach(function (element) {
			if (element.chk_lis) {
				arr_listar.push(element);
			}
		}.bind(this));
		for (let index = 0; index < arr_listar.length; index++) {
			const element = arr_listar[index];
			// variables in
			var_in += "\t@" + (element.columna)
				+ (element.tipo.indexOf("DATE") != -1 || element.tipo.indexOf("DECIMAL") != -1 ? "_min " : " ")
				+ (element.tipo == "DATETIME" ? "DATE" : element.tipo)
				+ (element.tipo.indexOf("CHAR") != -1 || element.tipo.indexOf("DECIMAL") != -1 ? "(" + element.tamano + ")" : "")
				+ ",\n";
			if (element.tipo.indexOf("DATE") != -1 || element.tipo.indexOf("DECIMAL") != -1) {
				var_in += "\t@" + (element.columna) + "_max "
					+ (element.tipo == "DATETIME" ? "DATE" : element.tipo)
					+ (element.tipo.indexOf("DECIMAL") != -1 ? "(" + element.tamano + ")" : "")
					+ ",\n";
			}
			// where count
			if (element.tipo.indexOf("DATE") != -1 || element.tipo.indexOf("DECIMAL") != -1) {
				where_count += "(@" + (element.columna) + "_min IS NULL AND @" + (element.columna) + "_max IS NULL OR "
					+ acronimo + "." + element.columna + " BETWEEN "
					+ (element.tipo.indexOf("DATE") != -1 ? "CAST(" : "")
					+ "@" + element.columna + "_min"
					+ (element.tipo.indexOf("DATE") != -1 ? " AS NVARCHAR) + ' 00:00:00'" : "")
					+ " AND "
					+ (element.tipo.indexOf("DATE") != -1 ? "CAST(" : "")
					+ "@" + element.columna + "_max"
					+ (element.tipo.indexOf("DATE") != -1 ? " AS NVARCHAR) + ' 23:59:59'" : "")
					+ ")"
					+ "\n"
					+ (index < arr_listar.length - 1 ? "\t\tAND " : "");
			} else {
				where_count += "(@" + (element.columna) + " IS NULL OR "
					+ acronimo + "." + element.columna
					+ " LIKE "
					+ (element.tipo.indexOf("CHAR") != -1 ? "'%' + " : "")
					+ "@" + (element.columna)
					+ (element.tipo.indexOf("CHAR") != -1 ? " + '%'" : "")
					+ ")"
					+ "\n"
					+ (index < arr_listar.length - 1 ? "\t\tAND " : "");
			}
			// select list 
			select_list += "\t\t\t" + (index != 0 ? "," : "") + acronimo + "." + element.columna + "\n";
			// where list
			if (element.tipo.indexOf("DATE") != -1 || element.tipo.indexOf("DECIMAL") != -1) {
				where_list += "(@" + (element.columna) + "_min IS NULL AND @" + (element.columna) + "_max IS NULL OR "
					+ acronimo + "." + element.columna + " BETWEEN "
					+ (element.tipo.indexOf("DATE") != -1 ? "CAST(" : "")
					+ "@" + element.columna + "_min"
					+ (element.tipo.indexOf("DATE") != -1 ? " AS NVARCHAR) + ' 00:00:00'" : "")
					+ " AND "
					+ (element.tipo.indexOf("DATE") != -1 ? "CAST(" : "")
					+ "@" + element.columna + "_max"
					+ (element.tipo.indexOf("DATE") != -1 ? " AS NVARCHAR) + ' 23:59:59'" : "")
					+ ")"
					+ "\n"
					+ (index < arr_listar.length - 1 ? "\t\t\tAND " : "");
			} else {
				where_list += "(@" + (element.columna) + " IS NULL OR "
					+ acronimo + "." + element.columna
					+ " LIKE "
					+ (element.tipo.indexOf("CHAR") != -1 ? "'%' + " : "")
					+ "@" + (element.columna)
					+ (element.tipo.indexOf("CHAR") != -1 ? " + '%'" : "")
					+ ")"
					+ "\n"
					+ (index < arr_listar.length - 1 ? "\t\t\tAND " : "");
			}
			// json bachero
			json[json.length - 1].items.push({
				name: element.columna,
				type: this.getTipoForJson(element.tipo)
			});
			// filter ts
			filter.fields[element.columna] = {
				label: this.formatPropertyFilter(element.columna),
				type: this.getTipoForTs(element.tipo),
				closeFilter: true,
				// beforeFilter : (field : any) => {
				// }
			}
			this.addPropertiesFilter(filter.fields[element.columna]);
			// filter html
			html_ += (html_count % 2 == 0 ? '' : '\t\t' + '<div class="form-group row">' + '\n')
				+ '\t\t\t<label class="col-md-2 col-form-label">' + this.formatPropertyFilter(element.columna) + '</label>\n'
				+ this.getTipoForHtml(element.columna, element.tipo)
				+ (html_count % 2 == 0 ? '\t\t</div>\n' : '')
			html_count++;
		}

		var arr_foraneas = Array();
		this.store.foraneasList.forEach(function (element) {
			if (element.use_lis_join) {
				arr_foraneas.push(element);
			}
		}.bind(this));
		
		if (arr_listar.length % 2 != 0 && arr_foraneas.length == 0){
			html_ += '\t\t</div>\n'
		}

		for (let index = 0; index < arr_foraneas.length; index++) {
			const element = arr_foraneas[index];
			const join_acronimo: string = element.ref_tabla.substring(0, 3) + this.formatChar(index);
			if (element.use_lis_join) {
				element.describ.forEach(function (column) {
					if (column.join_lis) {
						// variables in
						var_in += "\t@" + join_acronimo + "_" + column.columna
							+ (column.tipo.indexOf("DATE") != -1 || column.tipo.indexOf("DECIMAL") != -1 ? "_min " : " ")
							+ (column.tipo == "DATETIME" ? "DATE" : column.tipo)
							+ (column.tipo.indexOf("CHAR") != -1 || column.tipo.indexOf("DECIMAL") != -1 ? "(" + column.tamano + ")" : "")
							+ ",\n";
						if (column.tipo.indexOf("DATE") != -1 || column.tipo.indexOf("DECIMAL") != -1) {
							var_in += "\t@" + join_acronimo + "_" + column.columna + "_max "
								+ (column.tipo == "DATETIME" ? "DATE" : column.tipo)
								+ (column.tipo.indexOf("DECIMAL") != -1 ? "(" + column.tamano + ")" : "")
								+ ",\n";
						}
						// where count
						if (column.tipo.indexOf("DATE") != -1 || column.tipo.indexOf("DECIMAL") != -1) {
							where_count += "\t\tAND (@" + join_acronimo + "_" + column.columna + "_min IS NULL AND @"
								+ join_acronimo + "_" + column.columna + "_max IS NULL OR "
								+ join_acronimo.toUpperCase() + "." + column.columna + " BETWEEN "
								+ (column.tipo.indexOf("DATE") != -1 ? "CAST(" : "")
								+ "@" + join_acronimo + "_" + column.columna + "_min"
								+ (column.tipo.indexOf("DATE") != -1 ? " AS NVARCHAR) + ' 00:00:00'" : "")
								+ " AND "
								+ (column.tipo.indexOf("DATE") != -1 ? "CAST(" : "")
								+ "@" + join_acronimo + "_" + column.columna + "_max"
								+ (column.tipo.indexOf("DATE") != -1 ? " AS NVARCHAR) + ' 23:59:59'" : "")
								+ ")\n";
						} else {
							where_count += "\t\tAND (@" + join_acronimo + "_" + column.columna + " IS NULL OR "
								+ join_acronimo.toUpperCase() + "." + column.columna
								+ " LIKE "
								+ (column.tipo.indexOf("CHAR") != -1 ? "'%' + " : "")
								+ "@" + join_acronimo + "_" + column.columna
								+ (column.tipo.indexOf("CHAR") != -1 ? " + '%'" : "")
								+ ")\n";
						}
						// select list
						select_list += "\t\t\t"
							+ ","
							+ join_acronimo.toUpperCase() + "." + column.columna + " AS "
							+ (column.join_lis_as != "" && column.join_lis_as ? column.join_lis_as : join_acronimo + "_" + column.columna)
							+ "\n";
						// where list
						if (column.tipo.indexOf("DATE") != -1 || column.tipo.indexOf("DECIMAL") != -1) {
							where_list += "\t\t\tAND (@" + join_acronimo + "_" + column.columna + "_min IS NULL AND @"
								+ join_acronimo + "_" + column.columna + "_max IS NULL OR "
								+ join_acronimo.toUpperCase() + "." + column.columna + " BETWEEN "
								+ (column.tipo.indexOf("DATE") != -1 ? "CAST(" : "")
								+ "@" + join_acronimo + "_" + column.columna + "_min"
								+ (column.tipo.indexOf("DATE") != -1 ? " AS NVARCHAR) + ' 00:00:00'" : "")
								+ " AND "
								+ (column.tipo.indexOf("DATE") != -1 ? "CAST(" : "")
								+ "@" + join_acronimo + "_" + column.columna + "_max"
								+ (column.tipo.indexOf("DATE") != -1 ? " AS NVARCHAR) + ' 23:59:59'" : "")
								+ ")"
								+ "\n";
						} else {
							where_list += "\t\t\tAND (@" + join_acronimo + "_" + column.columna + " IS NULL OR "
								+ join_acronimo.toUpperCase() + "." + column.columna
								+ " LIKE "
								+ (column.tipo.indexOf("CHAR") != -1 ? "'%' + " : "")
								+ "@" + join_acronimo + "_" + column.columna
								+ (column.tipo.indexOf("CHAR") != -1 ? " + '%'" : "")
								+ ")"
								+ "\n";
						}
						// json bachero
						let tipo = this.getTipoForJson(column.tipo);
						let name_col = (column.join_lis_as != "" && column.join_lis_as ? column.join_lis_as : join_acronimo.toLowerCase() + "_" + column.columna)
						json[json.length - 1].items.push({
							name: name_col,
							type: tipo
						});
						// filter ts
						filter.fields[name_col] = {
							label: this.formatPropertyFilter(name_col),
							type: this.getTipoForTs(column.tipo),
							closeFilter: true,
							// beforeFilter : (field : any) => {
							// }
						}
						this.addPropertiesFilter(filter.fields[name_col]);
						// filter html
						html_ += (html_count % 2 == 0 ? '' : '\t\t' + '<div class="form-group row">' + '\n')
							+ '\t\t\t<label class="col-md-2 col-form-label">' + this.formatPropertyFilter(name_col) + '</label>\n'
							+ this.getTipoForHtml(name_col, column.tipo)
							+ (html_count % 2 == 0 ? '\t\t</div>\n' : (index == arr_foraneas.length-1 ? '\t\t</div>\n' : ''));
						html_count++;
					}
				}.bind(this));
				// join count
				join_count += "\t\t" + element.join_lis_type + " " + element.ref_esquema + "." + element.ref_tabla + " AS "
					+ join_acronimo.toUpperCase() + " (NOLOCK) ON "
					+ join_acronimo.toUpperCase() + "." + element.ref_columna + " = " + acronimo + "." + element.columna + "\n";
				// join list 
				join_list += "\t\t\t" + element.join_lis_type + " " + element.ref_esquema + "." + element.ref_tabla + " AS "
					+ join_acronimo.toUpperCase() + " (NOLOCK) ON "
					+ join_acronimo.toUpperCase() + "." + element.ref_columna + " = " + acronimo + "." + element.columna + "\n";
			}
		}
		sql += "CREATE PROCEDURE " + this.store.schema + "." + this.store.table + "_listar\n"
			+ "\t--PARAMETROS IN (VAR & FILTER)\n"
			// variables in
			+ var_in
			+ "\t--PARAMETROS IN (PAGIN)\n"
			+ "\t@page INT,\n"
			+ "\t@size INT\n"
			+ "AS\n"
			+ "BEGIN\n"
			+ "\tSET NOCOUNT ON\n"
			+ "\tSELECT COUNT(1) AS total_registros\n"
			+ "\tFROM " + this.store.schema + "." + this.store.table + " AS " + acronimo + " (NOLOCK)\n"
			// join count
			+ join_count
			+ "\tWHERE\n\t\t"
			// where count
			+ where_count.substring(0, where_count.length - 1)
			+ ";\n\n"
			+ "\tIF @page IS NOT NULL and @size IS NOT NULL BEGIN\n"
			+ "\t\tSELECT\n"
			// select list 
			+ select_list
			+ "\t\tFROM " + this.store.schema + "." + this.store.table + " AS " + acronimo + " (NOLOCK)\n"
			// join list
			+ join_list
			+ "\t\tWHERE\n\t\t\t"
			// where list
			+ where_list
			+ "\t\tORDER BY 1 DESC\n"
			+ "\t\tOFFSET ((@page - 1)* @size) ROWS\n"
			+ "\t\tFETCH NEXT @size ROWS ONLY;\n"
			+ "\tEND ELSE BEGIN\n"
			+ "\t\tSELECT\n"
			// select list 
			+ select_list
			+ "\t\tFROM " + this.store.schema + "." + this.store.table + " AS " + acronimo + " (NOLOCK)\n"
			// join list
			+ join_list
			+ "\t\tWHERE\n\t\t\t"
			// where list
			+ where_list
			+ "\t\tORDER BY 1 DESC;\n"
			+ "\tEND\n"
			+ "END\n"
			+ "GO\n";
		this.store.query_listar = sql;
		this.store.json_listar = JSON.stringify(json, null, "\t");

		let ts_ = '/*oh_filter*/\nthis.filter = ' + JSON.stringify(filter, null, "\t") + '\n\n';
			
		let chek_col_date = json[1].items.find(function (element) {
			return element.type == "Date"
		}.bind(this));
		if(chek_col_date != undefined){
			ts_ += '\n/*for collapse date*/\n'
				+ 'changeRange(element: any) {\n'
				+ '\tif (element.initValue && element.endValue) {\n'
				+ '\t\telement.collapsed = !element.collapsed;\n'
				+ '\t}\n'
				+ '}';
		}
		this.store.filter_ts_listar = ts_;

		html_ += '\t</div>\n'
			+ '\t<div class="modal-footer">\n'
			+ '\t\t<button type="button" class="btn btn-outline-dark" (click)="c(\'cancel\')">\n'
			+ '\t\t\t<i aria-hidden="true" class="fa fa-close mr-1"></i>Cancelar\n'
			+ '\t\t</button>\n'
			+ '\t\t<button type="submit" class="btn btn-outline-primary" (click)="c(\'doFilter\')">\n'
			+ '\t\t\t<i aria-hidden="true" class="fa fa-filter mr-1"></i>Filtrar\n'
			+ '\t\t</button>\n'
			+ '\t</div>\n'
			+ '</ng-template>';
		this.store.filter_html_listar = this.escapeHtml(html_);
	}

	escapeHtml(unsafe: string) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	verTablaForanea(modal, foraneaSelected: any, index: number, num: number) {
		this.store.foraneaSelected = foraneaSelected;
		this.store.fk_index = index;
		this.store.model_param = num;
		if (this.store.foraneaSelected.describ) {
			this.modalService.open(modal, { centered: true, size: 'xl', scrollable: true, backdrop: 'static' }).result.then((result) => { }, (reason) => { });
		} else {
			this.bUIStoresService.segcolumnaListar({
				schema: this.store.foraneaSelected.ref_esquema, // Optional
				table: this.store.foraneaSelected.ref_tabla // Optional
			}, (describ: pSegcolumnaListar[]) => {
				for (let index = 0; index < describ.length; index++) {
					if (this.store.foraneaSelected.ref_columna == describ[index].columna) {
						describ.splice(index, 1);
					}
				}
				this.store.foraneaSelected.describ = describ;
				this.store.foraneaSelected.join_obt_type = (this.store.foraneaSelected.join_obt_type ? this.store.foraneaSelected.join_obt_type : "INNER JOIN");
				this.store.foraneaSelected.join_lis_type = (this.store.foraneaSelected.join_lis_type ? this.store.foraneaSelected.join_lis_type : "INNER JOIN");
				this.modalService.open(modal, { centered: true, size: 'xl', scrollable: true, backdrop: 'static' }).result.then((result) => { }, (reason) => { });
			});
		}
	}

	addColJoin(col: any) {
		if (this.store.model_param == 0) {
			col.join_obt_as_default = '';
			if (col.join_obt) {
				col.join_obt_as_default = col.tabla.substring(0, 3) + this.formatChar(this.store.fk_index) + "_" + col.columna;
			}
		} else {
			col.join_lis_as_default = '';
			if (col.join_lis) {
				col.join_lis_as_default = col.tabla.substring(0, 3) + this.formatChar(this.store.fk_index) + "_" + col.columna;
			}
		}
	}

	useFK(foraneaSelected: any) {
		this.store.foraneaSelected = foraneaSelected;
		if (this.store.model_param == 0) {
			this.store.foraneaSelected.use_obt_join = true;
		} else {
			this.store.foraneaSelected.use_lis_join = true;
		}
		this.modalService.dismissAll();
		this.generateQuerys();
	}

	clearFK(foraneaSelected: any) {
		this.store.foraneaSelected = foraneaSelected;
		if (this.store.model_param == 0) {
			this.store.foraneaSelected.use_obt_join = false;
			for (let index = 0; index < this.store.foraneaSelected.describ.length; index++) {
				this.store.foraneaSelected.describ[index].join_obt = false;
				this.store.foraneaSelected.describ[index].join_obt_as_default = '';
			}
		} else {
			this.store.foraneaSelected.use_lis_join = false;
			for (let index = 0; index < this.store.foraneaSelected.describ.length; index++) {
				this.store.foraneaSelected.describ[index].join_lis = false;
				this.store.foraneaSelected.describ[index].join_lis_as_default = '';
			}
		}
		this.modalService.dismissAll();
		this.generateQuerys();
	}

	cleanColumns() {
		this.store.columns = [];
		this.store.referenciasList = [];
		this.store.foraneasList = [];
		this.store.query_registrar = "\n\n\n\n\n\n\n\n\n\n";
		this.store.query_editar = "\n\n\n\n\n\n\n\n\n\n";
		this.store.query_eliminar = "\n\n\n\n\n\n\n\n\n\n";
		this.store.query_obtener = "\n\n\n\n\n\n\n\n\n\n";
		this.store.json_obtener = "\n\n\n\n\n\n\n\n\n\n";
		this.store.query_listar = "\n\n\n\n\n\n\n\n\n\n";
		this.store.json_listar = "\n\n\n\n\n\n\n\n\n\n";
		this.store.filter_ts_listar = "\n\n\n\n\n\n\n\n\n\n";
		this.store.filter_html_listar = "\n\n\n\n\n\n\n\n\n\n";
		this.store.invalid = true;
		this.store.generate = true;
	}

	getTipoForJson(tipo) {
		switch (true) {
			case tipo.indexOf("CHAR") != -1 || tipo == "DECIMAL":
				return "string"
			case tipo.indexOf("DATE") != -1:
				return "Date"
			case tipo.indexOf("INT") != -1 || tipo == "NUMERIC":
				return "number"
			case tipo == "BIT":
				return "boolean"
			default:
				return "string"
		}
	}

	getTipoForTs(tipo) {
		switch (true) {
			case tipo == "DECIMAL":
				return "decimalRango"
			case tipo.indexOf("DATE") != -1:
				return "fechaRango"
			default:
				return ""
		}
	}

	addPropertiesFilter(obj) {
		if (obj.type == "decimalRango" || obj.type == "fechaRango") {
			obj.initValue = null;
			obj.endValue = null;
		}
		if (obj.type == "fechaRango") {
			obj.collapsed = true;
		}
	}

	formatPropertyFilter(field: String) {
		let string_out: String = "";
		let arr_aux = field.split("_");
		for (let index = 0; index < arr_aux.length; index++) {
			const element = arr_aux[index];
			string_out += element.charAt(0).toUpperCase() + element.slice(1) + (index == arr_aux.length - 1 ? '' : ' ');
		}
		return string_out;
	}

	getTipoForHtml(col, tipo) {
		switch (true) {
			case tipo.indexOf("DATE") != -1:
				return '\t\t\t<div class="col-md-4">\n'
					+ '\t\t\t\t<div class="input-group" style="max-width: 474px;">\n'
					+ '\t\t\t\t\t<input class="form-control" placeholder="dd/mm/yyyy - dd/mm/yyyy" name="' + col + '" required="true" [value]="(filter.field.' + col + '.initValue ? (filter.field.' + col + '.initValue | date: cse.config.formatDate) + \' - \' : \'\') + '
					+ '(filter.field.' + col + '.endValue ? (filter.field.' + col + '.endValue | date: cse.config.formatDate) : \'\')">\n'
					+ '\t\t\t\t\t<div class="input-group-append">\n'
					+ '\t\t\t\t\t\t<button type="button" class="btn btn-outline-light" (click)="filter.field.' + col + '.collapsed = !filter.field.' + col + '.collapsed" [attr.aria-expanded]="!filter.field.' + col + '.collapsed" aria-controls="collapse_' + col + '" style="color: #000;border: 1px solid #dacece;">\n'
					+ '\t\t\t\t\t\t\t<i class="far fa-calendar-alt" aria-hidden="true"></i>\n'
					+ '\t\t\t\t\t\t</button>\n'
					+ '\t\t\t\t\t</div>\n'
					+ '\t\t\t\t</div>\n'
					+ '\t\t\t\t<div id="collapse_' + col + '" [ngbCollapse]="filter.field.' + col + '.collapsed" style="position: absolute;background: #FFF;z-index: 99999;">\n'
					+ '\t\t\t\t\t<oh-dateranges [(from)]="filter.field.' + col + '.initValue" [(to)]="filter.field.' + col + '.endValue" (onChange)="changeRange(filter.field.' + col + ')"></oh-dateranges>\n'
					+ '\t\t\t\t</div>\n'
					+ '\t\t\t</div>\n';
			case tipo == "DECIMAL":
				return '\t\t\t<div class="col-md-2">\n'
					+ '\t\t\t\t<span style="position: absolute;left: 96.5%;font-size: 22px;font-weight: 700;">-</span>\n'
					+ '\t\t\t\t<input name="longitud_min" class="form-control" [(ngModel)]="filter.field.longitud.initValue" type="number" min="1" + step="any" (change)="valid_range(filter.field.longitud)">\n'
					+ '\t\t\t</div>\n'
					+ '\t\t\t<div class="col-md-2">\n'
					+ '\t\t\t\t<input name="longitud_max" class="form-control" [(ngModel)]="filter.field.longitud.endValue" type="number" min="1" + step="any" (change)="valid_range(filter.field.longitud)">\n'
					+ '\t\t\t</div>\n';
			// case tipo.indexOf("CHAR") != -1:
			// case tipo.indexOf("INT") != -1:
			// case tipo == "NUMERIC":
			default:
				return '\t\t\t<div class="col-md-4">\n'
					+ '\t\t\t\t<input name="' + col + '" class="form-control" [(ngModel)]="filter.field.' + col + '.value" type="text" placeholder="">\n'
					+ '\t\t\t</div>\n'
		}
	}



	formatParametro(parametro: String) {
		let string_out: String = "";
		let arr_aux = parametro.split("_");
		for (let index = 0; index < arr_aux.length; index++) {
			const element = arr_aux[index];
			string_out += element.charAt(0).toUpperCase() + element.slice(1);
		}
		return string_out;
	}

	formatChar(n: number) {
		return String.fromCharCode(97 + n);
	}

	copy() {
		if (this.store.schema != "" && this.store.table != "") {
			switch (this.activeTab) {
				case "tabRegistrar":
					var copyText: any = document.getElementById("textRegistrar");
					break;
				case "tabEditar":
					var copyText: any = document.getElementById("textEditar");
					break;
				case "tabEliminar":
					var copyText: any = document.getElementById("textEliminar");
					break;
				case "tabObtener":
					var copyText: any = document.getElementById("textObtener");
					break;
				case "tabListar":
					var copyText: any = document.getElementById("textListar");
					break;
			}
			copyText.select();
			document.execCommand("copy");
			this.ohService.getOH().getAd().success("Copiado corréctamente");
		} else {
			this.ohService.getOH().getAd().warning('Falta seleccionar');
		}
	}

	copy_json() {
		if (this.store.schema != "" && this.store.table != "") {
			switch (this.activeTab) {
				case "tabObtener":
					var copyText: any = document.getElementById("jsonObtener");
					break;
				case "tabListar":
					var copyText: any = document.getElementById("jsonListar");
					break;
			}
			copyText.select();
			document.execCommand("copy");
			this.ohService.getOH().getAd().success("Copiado corréctamente");
		} else {
			this.ohService.getOH().getAd().warning('Falta seleccionar');
		}
	}

	copy_(event: any) {
		var target = event.target || event.srcElement || event.currentTarget;
		target = (target.type == 'button' ? target : target.parentNode);
		target = (target.type == 'button' ? target : target.parentNode);
		let id_copied = target.attributes.for.nodeValue;
		console.log('id_copied:', id_copied)
		if (this.store.schema != "" && this.store.table != "") {
			var copyText: any = document.getElementById(id_copied);
			copyText.select();
			document.execCommand("copy");
			this.ohService.getOH().getAd().success("Copiado corréctamente");
		} else {
			this.ohService.getOH().getAd().warning('Falta seleccionar');
		}
	}

	toggleShort(event: any){
		var target = event.target || event.srcElement || event.currentTarget;
		target = (target.tagName == 'DIV' ? target : target.parentNode);
		target = (target.tagName == 'DIV' ? target : target.parentNode);
		target = (target.tagName == 'DIV' ? target : target.parentNode);
		target.classList.toggle('short');
	}

	saveStores() {
		console.log(this.store);
	}

}
