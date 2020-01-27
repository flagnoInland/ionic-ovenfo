import { Component, Input, Output, EventEmitter } from '@angular/core';
import { claseCol, listaMover } from '../../util/bue.editor.util';
import { fCopyOutputText } from '../outputText/bue.editor.comp.outputText';

export const bComponentForm = {
	id : 15,
	name : "Formulario",
	icon : "fab fa-wpforms",
	isMaxWidh : true,
	viewContent : "div",
	hasChildSelected : true,
	config : {
		id : "",
		width : 4,
		widthSM : -1,
		widthMD : -1,
		widthLG : -1,
		widthXL : -1,
		rows : [{
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Campo 1"}}})]
			},
			selectedBody : {
				content : []
			}
		}],
		onSubmit : ""
	}
};

@Component({
  selector: 'bue-ec-formview',
  templateUrl: './bue.editor.comp.formView.html'
})
export class EdComFormView {

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
		return "col-form-label "+claseCol(fila);
	}

	getClaseInvertida(fila : any){
		var filaInv = Object.assign({}, fila, {});
		if(filaInv.width>=1){filaInv.width = 12 - filaInv.width;}
		if(filaInv.widthSM>=1){filaInv.widthSM = 12 - filaInv.widthSM;}
		if(filaInv.widthMD>=1){filaInv.widthMD = 12 - filaInv.widthMD;}
		if(filaInv.widthLG>=1){filaInv.widthLG = 12 - filaInv.widthLG;}
		if(filaInv.widthXL>=1){filaInv.widthXL = 12 - filaInv.widthXL;}
		return claseCol(filaInv);
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
	selector: 'bue-ec-formconf',
	templateUrl: './bue.editor.comp.formConf.html'
})
export class EdComFormConf {
	
	@Input() item: any;

	constructor(){
	}

	deleteRow(index : number){
		this.item.config.rows.splice(index, 1);
	}

	addRow(){
		this.item.config.rows.push({
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Campo "+(this.item.config.rows.length + 1)}}})]
			},
			selectedBody : {
				content : []
			}
		});
	}

}