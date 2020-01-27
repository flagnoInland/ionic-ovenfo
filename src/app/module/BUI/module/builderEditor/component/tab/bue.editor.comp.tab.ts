import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fCopyOutputText } from '../outputText/bue.editor.comp.outputText';

export const bComponentTab = {
	id : 12,
	name : "Tab",
	icon : "fas fa-columns",
	isMaxWidh : true,
	viewContent : "div",
	hasChildSelected : true,
	config : {
		id : "",
		iSel : "tab-0",
		typeTab : "tabs",
		justify : "start",
		orientation : "horizontal",
		rows : [{
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Tab 1"}}})]
			},
			selectedBody : {
				content : []
			},
			opened : true,
			enable : true
		}]
	}
};

@Component({
  selector: 'bue-ec-tabview',
  templateUrl: './bue.editor.comp.tabView.html'
})
export class EdComTabView {

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

}

@Component({
	selector: 'bue-ec-tabconf',
	templateUrl: './bue.editor.comp.tabConf.html'
})
export class EdComTabConf {
	
	@Input() item: any;
	opcMultiples : any;

	constructor(){
		this.opcMultiples = [];
		this.opcMultiples.push({ value : "start", name : "Inicial" });
		this.opcMultiples.push({ value : "center", name : "Central" });
		this.opcMultiples.push({ value : "end", name : "Final" });
		this.opcMultiples.push({ value : "fill", name : "Llenar" });
		this.opcMultiples.push({ value : "justified", name : "Justificado" });
	}

	deleteRow(index : number){
		this.item.config.rows.splice(index, 1);
	}

	addRow(){
		this.item.config.rows.push({
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Tab "+(this.item.config.rows.length + 1)}}})]
			},
			selectedBody : {
				content : []
			},
			opened : (this.item.config.rows.length==0)?true:false,
			enable : true
		});
	}

	markOpened(index : number){
		for(var i = 0 ; i < this.item.config.rows.length; i++){
			this.item.config.rows[i].opened = false;
		}
		this.item.config.rows[index].opened = true;
		this.item.config.iSel = "tab-"+index;
	}

}