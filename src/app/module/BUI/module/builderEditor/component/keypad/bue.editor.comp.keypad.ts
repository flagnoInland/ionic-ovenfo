import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fCopyButton } from '../button/bue.editor.comp.button';

export const bComponentKeypad = {
	id : 8,
	name : "Botonera",
	icon : "fas fa-bookmark",
	isMaxWidh : true,
	viewContent : "div",
	selected : {
		content : []
	},
	config : {
		id : ""
	}
};

export const bComponentKeypadReg = {
	id : 8,
	name : "Botonera Registro",
	icon : "fas fa-bookmark",
	isMaxWidh : true,
	selected : {
		content : [
			fCopyButton({
				config : {
					value : "Grabar",
					icon : "far fa-save",
					color : "btn-primary"
				}
			}),
			fCopyButton({
				config : {
					value : "Limpiar",
					icon : "fas fa-eraser",
					color : "btn-outline-secondary"
				}
			}),
			fCopyButton({
				config : {
					value : "Volver",
					icon : "fas fa-reply",
					color : "btn-outline-warning"
				}
			})
		]
	},
	config : {
		id : ""
	}
};

@Component({
  selector: 'bue-ec-keypadview',
  templateUrl: './bue.editor.comp.keypadView.html'
})
export class EdComKeypadView {

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
	selector: 'bue-ec-keypadconf',
	templateUrl: './bue.editor.comp.keypadConf.html'
})
export class EdComKeypadConf {
	
	@Input() item: any;

}