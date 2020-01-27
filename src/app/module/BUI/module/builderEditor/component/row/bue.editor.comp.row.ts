import { Component, Input, Output, EventEmitter } from '@angular/core';
import { claseCol, listaMover } from '../../util/bue.editor.util';

export const bComponentRow = {
	id : 6,
	name : "Fila",
	icon : "fas fa-ellipsis-h",
	isMaxWidh : true,
	viewContent : "div",
	hasChildSelected : true,
	config : {
		id : "",
		rows : [{
			selectedBody : {
				content : []
			},
			width : 0,
			widthSM : -1,
			widthMD : -1,
			widthLG : -1,
			widthXL : -1,
			valueNgFor : {
				esEnlace : false,
				valor : ""
			}
		}]
	}
};

export const fCopyRow = function(extend : any){
	if(extend.config){
		extend.config = Object.assign({}, bComponentRow.config, extend.config);
	}
	return Object.assign({}, bComponentRow, extend);
};

@Component({
  selector: 'bue-ec-rowview',
  templateUrl: './bue.editor.comp.rowView.html'
})
export class EdComRowView {

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
		return claseCol(fila);
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
	selector: 'bue-ec-rowconf',
	templateUrl: './bue.editor.comp.rowConf.html'
})
export class EdComRowConf {
	
	@Input() item: any;

	constructor(){
	}

	deleteColumn(index : number){
		this.item.config.rows.splice(index, 1);
	}

	addColumn(){
		this.item.config.rows.push({
			selectedBody : {
				content : []
			},
			width : 0,
			widthSM : -1,
			widthMD : -1,
			widthLG : -1,
			widthXL : -1,
			valueNgFor : {
				esEnlace : false,
				valor : ""
			}
		});
	}

}