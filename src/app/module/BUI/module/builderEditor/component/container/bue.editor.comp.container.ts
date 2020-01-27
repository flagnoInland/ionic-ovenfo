import { Component, Input, Output, EventEmitter } from '@angular/core';

export const bComponentContainer = {
	id : 3,
	name : "Contenedor",
	icon : "fas fa-desktop",
	isMaxWidh : true,
	viewContent : "div",
	vistaResponsiva : "",
	selected : {
		content : []
	},
	config : {
		id : "",
		type : "div",
		typeDiv : "container",
		external : ""
	}
};

export const fCopyContainer = function(extend : any){
	if(extend.config){
		extend.config = Object.assign({}, bComponentContainer.config, extend.config);
	}
	return Object.assign({}, bComponentContainer, extend);
};

@Component({
  selector: 'bue-ec-containerview',
  templateUrl: './bue.editor.comp.containerView.html'
})
export class EdComContainerView {

	@Input() item: any;
	@Input() bind: any;
	@Input() nameDragula: string;
	@Input() readOnly: boolean;

	@Output() onSelectedItem : EventEmitter<any>;

	constructor(){
		this.onSelectedItem  = new EventEmitter<any>();
	}
	
	getSelectedItem(event: any){
		this.onSelectedItem.emit({item : event.item});
	}

}

@Component({
	selector: 'bue-ec-containerconf',
	templateUrl: './bue.editor.comp.containerConf.html'
})
export class EdComContainerConf {
	
	@Input() item: any;

	constructor(){
		
	}

}