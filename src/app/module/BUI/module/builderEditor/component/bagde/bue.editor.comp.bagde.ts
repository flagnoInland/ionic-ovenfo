import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fCopyOutputText } from '../outputText/bue.editor.comp.outputText';

export const bComponentBagde = {
	id : 24,
	name : "Emblema",
	icon : "fab fa-bandcamp",
	isMaxWidh : true,
	viewContent : "div",
	vistaResponsiva : "",
	selected : {
		content : [
			fCopyOutputText({ config : { value : { valor : "Mensaje"}}})
		]
	},
	config : {
		id : "",
		tipo : "normal",
		color : "badge-primary"
	}
};

export const fCopyBagde = function(extend : any){
	return Object.assign({}, bComponentBagde, extend);
};

@Component({
  selector: 'bue-ec-bagdeview',
  templateUrl: './bue.editor.comp.bagdeView.html'
})
export class EdComBagdeView {

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
	selector: 'bue-ec-bagdeconf',
	templateUrl: './bue.editor.comp.bagdeConf.html'
})
export class EdComBagdeConf {
	
	@Input() item: any;

	color : any;

	constructor(){
		this.color = [];
		this.color.push({nombre : "Primario", valor : "badge-primary"});
		this.color.push({nombre : "Secundario", valor : "badge-secondary"});
		this.color.push({nombre : "Exitoso", valor : "badge-success"});
		this.color.push({nombre : "Peligro", valor : "badge-danger"});
		this.color.push({nombre : "Alerta", valor : "badge-warning"});
		this.color.push({nombre : "Info", valor : "badge-info"});
		this.color.push({nombre : "Claro", valor : "badge-light"});
		this.color.push({nombre : "Oscuro", valor : "badge-dark"});
		this.color.push({nombre : "Primario Ligero", valor : "badge-outline-success"});
		this.color.push({nombre : "Alerta Ligero", valor : "badge-outline-warning"});
		this.color.push({nombre : "Peligro Ligero", valor : "badge-outline-danger"});
	}

}