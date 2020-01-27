import { Component, Input, Output, EventEmitter } from '@angular/core';
import { claseCol, listaMover } from '../../util/bue.editor.util';
import { fCopyOutputText } from '../outputText/bue.editor.comp.outputText';

export const bComponentFormRow = {
	id : 19,
	name : "Formulario Fila",
	icon : "fas fa-long-arrow-alt-right",
	isMaxWidh : true,
	viewContent : "div",
	hasChildSelected : true,
	config : {
		id : "",
		rows : [{
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Campo 1"}}})]
			},
			selectedBody : {
				content : []
			},
			width : 0,
			widthSM : -1,
			widthMD : -1,
			widthLG : -1,
			widthXL : -1
		}]
	}
};

@Component({
  selector: 'bue-ec-formrowview',
  templateUrl: './bue.editor.comp.formRowView.html'
})
export class EdComFormRowView {

	@Input() item: any;
	@Input() bind: any;
	@Input() nameDragula: string;
	@Input() readOnly: boolean;

	@Output() onSelectedItem : EventEmitter<any>;

	constructor(){
		this.onSelectedItem  = new EventEmitter<any>();
	}

	selectedItem : any;

	getSelectedItem(event: any){
		this.onSelectedItem.emit({item : event.item});
	}

	getClase(fila : any){
		return "form-group "+claseCol(fila);
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

}

@Component({
	selector: 'bue-ec-formrowconf',
	templateUrl: './bue.editor.comp.formRowConf.html'
})
export class EdComFormRowConf {
	
	@Input() item: any;

	constructor(){
	}

	deleteFormRow(index : number){
		this.item.config.rows.splice(index, 1);
	}

	addFormRow(){
		this.item.config.rows.push({
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Campo "+(this.item.config.rows.length+1)}}})]
			},
			selectedBody : {
				content : []
			},
			width : 0,
			widthSM : -1,
			widthMD : -1,
			widthLG : -1,
			widthXL : -1
		});
	}

}