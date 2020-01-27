import { Component, Input, Output, EventEmitter } from '@angular/core';
import { pConfig_textoColor, pConfig_textoTamano } from '../../util/bue.editor.util';

export const bComponentOutputText = {
	id : 9,
	icon : "fas fa-font",
	name : "Texto",
	isMaxWidh : false,
	viewContent : "span",
	vistaResponsiva : "",
	config : {
		id : "",
		value : {
			esEnlace : false,
			valor : "salida"
		},
		simboloValue : {
			esEnlace : false,
			valor : ""
		},
		formatoValue : {
			esEnlace : false,
			valor : ""
		},
		formato : "texto",
		type : "span",
		colorTexto : "",
		tamanoTexto : "",
		tranforamcion : "",
		grosor : "",
		esItalica : false,
		esFuenteCodigo : false
	}
};

export const fCopyOutputText = function(extend : any){
	if(extend.config){
		if(extend.config.value){
			extend.config.value = Object.assign({}, bComponentOutputText.config.value, extend.config.value);
		}
		extend.config = Object.assign({}, bComponentOutputText.config, extend.config);
	}
	return Object.assign({}, bComponentOutputText, extend);
};

@Component({
  selector: 'bue-ec-outputtextview',
  templateUrl: './bue.editor.comp.outputTextView.html'
})
export class EdComOutputTextView {

	@Input() item: any;
	@Input() readOnly: boolean;

}

@Component({
	selector: 'bue-ec-outputtextconf',
	templateUrl: './bue.editor.comp.outputTextConf.html'
})
export class EdComOutputTextConf {
	
	@Input() item: any;
	@Output() onSearchBind : EventEmitter<any>;

	type : any;
	colorTexto : any;
	tamanoTexto : any;
	formato : any;
	transformacion : any;
	grosor : any;

	constructor(){
		
		this.onSearchBind  = new EventEmitter<any>();

		this.type = [];
		this.type.push({ value : "span", name : "Span" });
		this.type.push({ value : "h1", name : "Encabezado 1" });
		this.type.push({ value : "h2", name : "Encabezado 2" });
		this.type.push({ value : "h3", name : "Encabezado 3" }); 
		this.type.push({ value : "h4", name : "Encabezado 4" });
		this.type.push({ value : "h5", name : "Encabezado 5" });
		this.type.push({ value : "h6", name : "Encabezado 6" });
		
		this.formato = [];
		this.formato.push({ value : "texto", name : "Texto" });
		this.formato.push({ value : "fecha", name : "Fecha" });
		this.formato.push({ value : "fechaHora", name : "Fecha y Hora" });
		this.formato.push({ value : "moneda", name : "Moneda" }); 
		
		this.transformacion = [];
		this.transformacion.push({ clase : "", nombre : "" });
		this.transformacion.push({ clase : "text-lowercase", nombre : "Minpúscula" });
		this.transformacion.push({ clase : "text-uppercase", nombre : "Mayúscula" });
		this.transformacion.push({ clase : "text-capitalize", nombre : "Capitalizable" }); 
		
		this.grosor = [];
		this.grosor.push({ clase : "", nombre : "" });
		this.grosor.push({ clase : "font-weight-bold", nombre : "Grueso" });
		this.grosor.push({ clase : "font-weight-bolder", nombre : "Grueso relativo" });
		this.grosor.push({ clase : "font-weight-normal", nombre : "Normal" }); 
		this.grosor.push({ clase : "font-weight-light", nombre : "Ligero" }); 
		this.grosor.push({ clase : "font-weight-lighter", nombre : "Ligero relativo" }); 
		
		this.colorTexto = pConfig_textoColor;
		this.tamanoTexto = pConfig_textoTamano;

	}

	buscarValueBind(){
		if(!this.item.config.value.esEnlace){
			this.onSearchBind.emit({
				campo : "value.valor",
				tipo : "item"
			});
		}
		this.item.config.value.esEnlace = !this.item.config.value.esEnlace;
	}

	buscarSimboloBind(){
		if(!this.item.config.simboloValue.esEnlace){
			this.onSearchBind.emit({
				campo : "simboloValue.valor",
				tipo : "item"
			});
		}
		this.item.config.simboloValue.esEnlace = !this.item.config.simboloValue.esEnlace;
	}

	buscarFormatoBind(){
		if(!this.item.config.formatoValue.esEnlace){
			this.onSearchBind.emit({
				campo : "formatoValue.valor",
				tipo : "item"
			});
		}
		this.item.config.formatoValue.esEnlace = !this.item.config.formatoValue.esEnlace;
	}

}