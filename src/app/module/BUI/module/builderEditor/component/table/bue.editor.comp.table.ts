import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { fCopyOutputText } from '../outputText/bue.editor.comp.outputText';
import { fCopyContainer } from '../container/bue.editor.comp.container';
import { fCopyIcon } from '../icon/bue.editor.comp.icon';
import { fCopyBagde } from '../bagde/bue.editor.comp.bagde';
import { fCopyLink } from '../link/bue.editor.comp.link';
import { listaMover } from '../../util/bue.editor.util';

export const bComponentTable = {
	id : 2,
	name : "Tabla",
	icon : "fas fa-table",
	isMaxWidh : true,
	viewContent : "div",
	hasChildSelected : true,
	config : {
		id : "",
		for : {
			item : "",
			value : "",
			index : ""
		},
		rows : [{
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Fila 1"}}})]
			},
			selectedBody : {
				content : []
			},
			tipoWidth : "",
			width : "",
			medida : "",
			cabeFondo : "",
			cabeAlineo : "",
			detaFondo : "",
			detaAlineo : ""
		}],
		striped : true,
		hover : true,
		bordered : false,
		small : false,
		showTitle : true
	}
};

export const fCopyTable = function(extend : any){
	if(extend.config){
		if(extend.config.for){
			extend.config.for = Object.assign({}, bComponentTable.config.for, extend.config.value);
		}
		extend.config = Object.assign({}, bComponentTable.config, extend.config);
	}
	return Object.assign({}, bComponentTable, extend);
};

export const bComponentTableTemplate = fCopyContainer({	
	name : "Tabla llena",
	icon : "fas fa-table",
	selected : {
		content : [
			fCopyTable({
				config : {
					id : "",
					rows : [
						{
							selectedHead : {
								content : [fCopyOutputText({ config : { value : { valor : "Código"}}})]
							},
							selectedBody : {
								content : [fCopyOutputText({ config : { value : { valor : "1"}}})]
							},
							width : "",
							medida : ""
						},{
							selectedHead : {
								content : [fCopyOutputText({ config : { value : { valor : "Nombre"}}})]
							},
							selectedBody : {
								content : [fCopyOutputText({ config : { value : { valor : "Nombre"}}})]
							},
							width : "",
							medida : ""
						},{
							selectedHead : {
								content : [fCopyOutputText({ config : { value : { valor : "Fecha"}}})]
							},
							selectedBody : {
								content : [fCopyOutputText({ config : { value : { valor : "01/01/2000" }, formato : "fecha"}})]
							},
							width : "",
							medida : ""
						},{
							selectedHead : {
								content : [fCopyOutputText({ config : { value : { valor : "Fecha y Hora"}}})]
							},
							selectedBody : {
								content : [fCopyOutputText({ config : { value : { valor : "01/01/2000 00:00:00"}, formato : "fechaHora"}})]
							},
							width : "",
							medida : ""
						},{
							selectedHead : {
								content : [fCopyOutputText({ config : { value : { valor : "Monto"}}})]
							},
							selectedBody : {
								content : [fCopyOutputText({ config : { value : { valor : "$ 12.345"}, formato : "moneda"}})]
							},
							width : "",
							medida : ""
						},{
							selectedHead : {
								content : [fCopyOutputText({ config : { value : { valor : "Estado"}}})]
							},
							selectedBody : {
								content : [fCopyBagde({
									selected : {
										content : [
											fCopyIcon({config : {value : "fas fa-thumbs-up", titulo : "OK"}, spacing : [{
												type : "m",
												area : "r",
												size : "1"
											}], viewContent : "span"}),
											fCopyOutputText({ config : { value : { valor : "Activo"}}})
										]
									},
									config : {
										tipo : "pildora",
										color : "badge-outline-success"
									}
								})]
							},
							width : "",
							medida : ""
						},{
							selectedHead : {
								content : [fCopyIcon({config : {value : "far fa-edit", titulo : "Editar", colorTexto : "text-muted", tamanoTexto : "text-size-10"}})]
							},
							selectedBody : {
								content : [fCopyLink({config : {value : "", icon : "far fa-edit", url : "#", colorTexto : "text-success", tamanoTexto : "text-size-10"}})]
							},
							width : "1",
							medida : "rem"
						},{
							selectedHead : {
								content : [fCopyIcon({config : {value : "fas fa-file-alt", titulo : "Ver detalle", colorTexto : "text-muted", tamanoTexto : "text-size-10"}})]
							},
							selectedBody : {
								content : [fCopyLink({config : {value : "", icon : "fas fa-file-alt", url : "#",  colorTexto : "text-info", tamanoTexto : "text-size-10"}})]
							},
							width : "1",
							medida : "rem"
						},{
							selectedHead : {
								content : [fCopyIcon({config : {value : "fas fa-eraser", titulo : "Eliminar", colorTexto : "text-muted", tamanoTexto : "text-size-10"}})]
							},
							selectedBody : {
								content : [fCopyLink({config : {value : "", icon : "fas fa-eraser", url : "#",  colorTexto : "text-danger", tamanoTexto : "text-size-10"}})]
							},
							width : "1",
							medida : "rem"
						}
					]
				}
			})
		]
	},
	config : {
		id : "",
		type : "div",
		typeDiv : "container-fluid"
	}
});

@Component({
  selector: 'bue-ec-tableview',
  templateUrl: './bue.editor.comp.tableView.html'
})
export class EdComTableView {

	@Input() item: any;
	@Input() bind: any;
	@Input() nameDragula: string;
	@Input() readOnly: boolean;

	@Output() onSelectedItem : EventEmitter<any>;

	constructor(private _sanitizer: DomSanitizer){
		this.onSelectedItem  = new EventEmitter<any>();
	}

	selectedItem : any;

	getSelectedItem(event: any){
		this.onSelectedItem.emit({item : event.item});
	}

	moveLeft(index : any){
		if(index > 0){
			listaMover(this.item.config.rows, index, index - 1);
		}
	}

	delete(index : any){
		this.item.config.rows.splice(index, 1);
	}

	moveRight(index : any){
		if(index < this.item.config.rows.length - 1){
			listaMover(this.item.config.rows, index, index + 1);
		}
	}

	getWidth(row : any){
		return this._sanitizer.bypassSecurityTrustStyle(((!row.tipoWidth || row.tipoWidth == '') && row.width && row.medida)?row.width+row.medida:'');
	}

	getMinWidth(row : any){
		var minWidth = (row.tipoWidth && row.tipoWidth == 'min' && row.width && row.medida)?row.width+row.medida:'';
		return this._sanitizer.bypassSecurityTrustStyle(minWidth);
	}

	getMaxWidth(row : any){
		var maxWidth = (row.tipoWidth && row.tipoWidth == 'max' && row.width && row.medida)?row.width+row.medida:'';
		//console.log(maxWidth);
		return this._sanitizer.bypassSecurityTrustStyle(maxWidth);
	}

}

@Component({
	selector: 'bue-ec-tableconf',
	templateUrl: './bue.editor.comp.tableConf.html'
})
export class EdComTableConf {
	
	@Input() item: any;
	@Output() onSearchBind : EventEmitter<any>;
	@Output() onNewBind : EventEmitter<any>;

	medida : any;
	tipoWidth : any;
	fondo : any;
	alineo : any;

	constructor(){

		this.onSearchBind  = new EventEmitter<any>();
		this.onNewBind  = new EventEmitter<any>();

		this.medida = [];
		this.medida.push({ tipo : "%", nombre : "%" });
		this.medida.push({ tipo : "px", nombre : "px" });
		this.medida.push({ tipo : "rem", nombre : "rem" });
		
		this.tipoWidth = [];
		this.tipoWidth.push({ tipo : "min", nombre : "Mínimo" });
		this.tipoWidth.push({ tipo : "", nombre : "Normal" });
		this.tipoWidth.push({ tipo : "max", nombre : "Máximo" });
		
		this.fondo = [];
		this.fondo.push({ clase : "", nombre : "" });
		this.fondo.push({ clase : "table-active", nombre : "Activo" });
		this.fondo.push({ clase	: "table-primary", nombre : "Primario" });
		this.fondo.push({ clase : "table-secondary", nombre : "Secundario" });
		this.fondo.push({ clase : "table-success", nombre : "Exitoso" });
		this.fondo.push({ clase	: "table-danger", nombre : "Peligro" });
		this.fondo.push({ clase : "table-warning", nombre : "Alerta" });
		this.fondo.push({ clase : "table-info", nombre : "Informativo" });
		this.fondo.push({ clase	: "table-light", nombre : "Ligero" });
		this.fondo.push({ clase : "table-dark", nombre : "Negro" });

		this.alineo = [];
		this.alineo.push({ clase : "", nombre : "" });
		this.alineo.push({ clase : "text-justify", nombre : "Justificado" });
		this.alineo.push({ clase : "text-left", nombre : "Izquierda" });
		this.alineo.push({ clase : "text-center", nombre : "Centrado" });
		this.alineo.push({ clase : "text-right", nombre : "Derecha" });
	}

	deleteRow(index : number){
		this.item.config.rows.splice(index, 1);
	}

	addRow(){
		this.item.config.rows.push({
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Fila "+(this.item.config.rows.length + 1)}}})]
			},
			selectedBody : {
				content : []
			},
			width : "",
			medida : ""
		});
	}

	nuevoForBind(){
		this.onNewBind.emit({
			tipo : "tabla",
			campo : "for"
		});
	}

	buscarForBind(){
		this.onSearchBind.emit({
			tipo : "array",
			campo : "for",
			bindTipo : "tabla"
		});
	}

}