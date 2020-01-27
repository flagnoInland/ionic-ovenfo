import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CoreService } from 'src/app/ind.coreService';

export const bComponentTextBox = {
	id : 1,
	name : "Caja de texto",
	icon : "fas fa-text-width",
	isMaxWidh : true,
	flagOnKey : true,
	viewContent : "div",
	config : {
		id : "",
		value : {
			esEnlace : false,
			valor : ""
		},
		moneyValue : {
			esEnlace : false,
			valor : ""
		},
		placeholder : "",
		type : "text",
		disabled : false,
		readOnly : false,
		required : false,
		minlength : 0,
		maxlength : 0,
		min : 0,
		max : 0,
		step : 0,
		enableRules : false,
		focusOnInit : false,
		pattern : ""
	}
};

@Component({
  selector: 'bue-ec-textboxview',
  templateUrl: './bue.editor.comp.textBoxView.html'
})
export class EdComTextBoxView {

	@Input() item: any;

	constructor(public cse : CoreService){
	}

}

@Component({
	selector: 'bue-ec-textboxconf',
	templateUrl: './bue.editor.comp.textBoxConf.html'
})
export class EdComTextBoxConf {

	inputType : any;
	@Output() onSearchBind : EventEmitter<any>;

	@Input() item: any;

	constructor(){
		this.onSearchBind  = new EventEmitter<any>();
		
		this.inputType = [];
		this.inputType.push({ value : "text", name : "Texto" });
		this.inputType.push({ value : "password", name : "Clave" });
		this.inputType.push({ value : "email", name : "Email" });
		this.inputType.push({ value : "number", name : "Numérico" }); 
		this.inputType.push({ value : "range", name : "Rango" });
		this.inputType.push({ value : "textarea", name : "Area de texto" });
		this.inputType.push({ value : "money", name : "Moneda" });;
		this.inputType.push({ value : "richtext", name : "Texto enriquecido" });
	}

	validRules(){
		if(this.item.config.type == 'number' || this.item.config.type == 'range'){
			this.item.config.maxlength = 0;
		} else {
			this.item.config.min = 0;
			this.item.config.max = 0;
			this.item.config.step = 0;
		}
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

	buscarMoneyBind(){
		if(!this.item.config.moneyValue.esEnlace){
			this.onSearchBind.emit({
				campo : "moneyValue.valor",
				tipo : "item"
			});
		}
		this.item.config.moneyValue.esEnlace = !this.item.config.moneyValue.esEnlace;
	}

}