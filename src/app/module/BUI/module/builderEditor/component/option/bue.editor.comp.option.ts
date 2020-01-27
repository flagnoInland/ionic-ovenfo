import { Component, Input, Output, EventEmitter } from '@angular/core';

export const bComponentOption = {
	id : 20,
	name : "Opción",
	icon : "far fa-check-square",
	isMaxWidh : true,
	viewContent : "div",
	config : {
		id : "",
		type : "simple",
		desc : "Opción",
		value : {
			esEnlace : false,
			valor : "true"
		},
		onChange : ""
	}
};

@Component({
  selector: 'bue-ec-optionview',
  templateUrl: './bue.editor.comp.optionView.html'
})
export class EdComOptionView {

	@Input() item: any;

}

@Component({
	selector: 'bue-ec-optionconf',
	templateUrl: './bue.editor.comp.optionConf.html'
})
export class EdComOptionConf {
	
	@Input() item: any;
	@Output() onSearchBind : EventEmitter<any>;

	constructor(){
		this.onSearchBind  = new EventEmitter<any>();
	}

	buscarForBind(){
		this.onSearchBind.emit({
			campo : "for",
			tipo : "array"
		});
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

}