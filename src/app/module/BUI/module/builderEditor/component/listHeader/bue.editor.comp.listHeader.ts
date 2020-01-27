import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fCopyOutputText } from '../outputText/bue.editor.comp.outputText';
import { fCopyButton } from '../button/bue.editor.comp.button';
import { fCopyPagination } from '../pagination/bue.editor.comp.pagination';

export const bComponentListHeader = {
	id : 22,
	name : "Listado Encabezado",
	icon : "fas fa-caret-down",
	isMaxWidh : true,
	viewContent : "div",
	hasChildSelected : true,
	config : {
		id : "",
		paginacionHabilitar : true,
		paginacionFiltro : true,
		modalValue : {
			esEnlace : false,
			valor : "salida"
		},
		opciones : [],
		rows : [{
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Título"}, type : "h5"}})]
			},
			selectedBody : {
				content : [
					fCopyButton({
						config : {
							value : "Nuevo",
							icon : "fas fa-plus",
							color : "btn-primary"
						}
					})
				]
			},
			selectedFooter : {
				content : [fCopyPagination({
					config : {
						total : {
							esEnlace : true,
							valor : "ohpag.total"
						},
						pagina : {
							esEnlace : true,
							valor : "ohpag.pagina"
						},
						itemxPagina : {
							esEnlace : true,
							valor : "ohpag.itemxPagina"
						},
						nroPaginaciones : {
							esEnlace : true,
							valor : "ohpag.nroPaginaciones"
						}
					}
				})]
			}
		}]
	}
};

@Component({
  selector: 'bue-ec-listheaderview',
  templateUrl: './bue.editor.comp.listHeaderView.html'
})
export class EdComListHeaderView {

	@Input() item: any;
	@Input() bind: any;
	@Input() nameDragula: string;
	@Input() readOnly: boolean;

	@Output() onSelectedItem : EventEmitter<any>;

	filter : any;

	constructor(){
		this.onSelectedItem  = new EventEmitter<any>();
		this.filter = {};
		this.filter.field = {};
		this.filter.fields = {};
	}

	selectedItem : any;

	getSelectedItem(event: any){
		this.onSelectedItem.emit({item : event.item});
	}

	getBorderReadOnly(){
		if(this.readOnly){
			return "p-1";
		}
	}

}

@Component({
	selector: 'bue-ec-listheaderconf',
	templateUrl: './bue.editor.comp.listHeaderConf.html'
})
export class EdComListHeaderConf {
	
	@Input() item: any;
	@Output() onNewBind : EventEmitter<any>;
	@Output() onSearchBind : EventEmitter<any>;

	showPagination : boolean;

	constructor(){
		this.onNewBind  = new EventEmitter<any>();
		this.onSearchBind  = new EventEmitter<any>();
	}

	deleteRow(index : number){
		this.item.config.opciones.splice(index, 1);
		this.nuevoForBind();
	}

	addRow(){
		this.item.config.opciones.push({
			tipo : "",
			cerrarFiltro : true
		});
		this.nuevoForBind();
	}

	buscarValueBind(){
		if(!this.item.config.modalValue.esEnlace){
			this.onSearchBind.emit({
				campo : "modalValue.valor",
				tipo : "item",
				subTipo : "NgbModalRef"
			});
		}
		this.item.config.modalValue.esEnlace = !this.item.config.modalValue.esEnlace;
	}

	nuevoForBind(){

		var contenido = [];
		var opciones = [];
		var definiciones = {};

		for(var i in this.item.config.opciones){
			var opc = this.item.config.opciones[i];

			if(opc.variable && opc.variable.length>0 && opc.etiqueta && opc.etiqueta.length>0){

				opciones.push("\t\tthis.ohfiltro.fields."+opc.variable+" = {\n");
				opciones.push('\t\t	label : "'+opc.etiqueta+'",\n');
				opciones.push('\t\t	type : "'+opc.tipo+'",\n');
				if(opc.tipo=="fechaRango"){
					opciones.push("\t\t	initValue : null,\n");
					opciones.push("\t\t	endValue : null,\n");
				} else {
					//opciones.push("\t\t	value : null,\n");
				}
				opciones.push("\t\t	closeFilter : "+opc.cerrarFiltro+"\n");
				opciones.push("\t\t};\n\n");

				definiciones[opc.variable] = {
					label : "string",
					type : "string",
					closeFilter : "boolean"
				};

				if(opc.tipo=="fechaRango"){
					definiciones[opc.variable]["initValue"] = "Date";
					definiciones[opc.variable]["endValue"] = "Date";
				} else {
					definiciones[opc.variable]["value"] = "string";
				}

			}
		}

		contenido.push("\n\t\tthis.ohfiltro = {};\n");
		contenido.push("\t\tthis.ohfiltro.field = {};\n");
		contenido.push("\t\tthis.ohfiltro.fields = {};\n\n");
	
		contenido.push(opciones.join(""));
	
		contenido.push("\t\tthis.ohfiltro.beforeFilter = () => {\n");
		contenido.push("\t\t	this.ohfiltro.fields = this.ohfiltro.field;\n");
		contenido.push("\t\t	this.ohfiltro.doFilter();\n");
		contenido.push("\t\t};\n\n");
	
		contenido.push("\t\tthis.ohfiltro.doFilter = () => {\n\n");
		contenido.push("\t\t};\n\n");
	
		contenido.push("\t\tthis.ohfiltro.beforeErase = (key : string) => {\n\n");
		contenido.push("\t\t}\n\n");

		var definition = JSON.stringify({
			field : definiciones
		});
		
		this.onNewBind.emit({
			tipo : "porId",
			entidad : {
				_id : this.item._id,
				readOnly : false,
				name : "ohfiltro",
				type : "any",
				definition : definition,
				decorador : null,
				decorador_id : null,
				isList : false,
				isInput : false,
				isOutput : false,
				value : null
			},
			metodo : {
				_id : this.item._id,
				readOnly : true,
				name : "ohInstanciarFiltro",
				value : contenido.join(""),
				params : []
			}
		});

	}

}