import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fCopyOutputText } from '../outputText/bue.editor.comp.outputText';

export const bComponentAccordion = {
	id : 11,
	name : "Acordeón",
	icon : "fab fa-audible",
	isMaxWidh : true,
	viewContent : "div",
	hasChildSelected : true,
	config : {
		id : "",
		multiple : false,
		iSel : "acc-0",
		rows : [{
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Acordeón 1"}}})]
			},
			selectedBody : {
				content : []
			},
			opened : true
		}]
	}
};

@Component({
  selector: 'bue-ec-accordionview',
  templateUrl: './bue.editor.comp.accordionView.html'
})
export class EdComAccordionView {

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
	selector: 'bue-ec-accordionconf',
	templateUrl: './bue.editor.comp.accordionConf.html'
})
export class EdComAccordionConf {
	
	@Input() item: any;

	constructor(){
	}

	deleteRow(index : number){

		this.item.config.rows.splice(index, 1);
	}

	addRow(){
		this.item.config.rows.push({
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Acordeón "+(this.item.config.rows.length + 1)}}})]
			},
			selectedBody : {
				content : []
			},
			opened : (this.item.config.rows.length==0)?true:false
		});
	}

	markOpened(index : number){
		if(!this.item.config.multiple){
			if(this.item.config.rows[index].opened == true){
				for(var i = 0 ; i < this.item.config.rows.length; i++){
					this.item.config.rows[i].opened = false;
				}
				this.item.config.rows[index].opened = true;
				this.item.config.iSel = "acc-"+index;
			} else {
				this.item.config.iSel = "";
			}
		} else {
			var openeds = [];
			for(var i = 0 ; i < this.item.config.rows.length; i++){
				if(this.item.config.rows[i].opened){
					openeds.push("acc-"+i);
				}
			}
			this.item.config.iSel = openeds;
		}
	}

	changeIsMultiple(){
		if(!this.item.config.multiple){
			for(var i = 0 ; i < this.item.config.rows.length; i++){
				this.item.config.rows[i].opened = false;
			}
			this.item.config.rows[0].opened = true;
			this.item.config.iSel = "acc-0";
		}
	}

}