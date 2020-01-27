import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fCopyOutputText } from '../outputText/bue.editor.comp.outputText';

export const bComponentCard = {
	id : 21,
	name : "Tarjeta",
	icon : "far fa-window-maximize",
	isMaxWidh : true,
	viewContent : "div",
	hasChildSelected : true,
	config : {
		id : "",
		showHeader : true,
		showBody : true,
		showFooter : true,
		title : "div",
		background : "bg-white",
		rows : [{
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Título"}}})]
			},
			selectedBody : {
				content : []
			},
			selectedFooter : {
				content : []
			}
		}]
	}
};

@Component({
  selector: 'bue-ec-cardview',
  templateUrl: './bue.editor.comp.cardView.html'
})
export class EdComCardView {

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

	getBorderReadOnly(){
		if(this.readOnly){
			return "p-1";
		}
	}

}

@Component({
	selector: 'bue-ec-cardconf',
	templateUrl: './bue.editor.comp.cardConf.html'
})
export class EdComCardConf {
	
	@Input() item: any;

	title : any;
	background: any;

	constructor(){
		this.title = [];
		this.title.push({ value : "div", name : "Div" });
		this.title.push({ value : "h1", name : "Encabezado 1" });
		this.title.push({ value : "h2", name : "Encabezado 2" });
		this.title.push({ value : "h3", name : "Encabezado 3" }); 
		this.title.push({ value : "h4", name : "Encabezado 4" });
		this.title.push({ value : "h5", name : "Encabezado 5" });
		this.title.push({ value : "h6", name : "Encabezado 6" });

		this.background = [];
		this.background.push({ value : "", name : "" });
		this.background.push({ value : "bg-primary", name : "Primario" });
		this.background.push({ value : "bg-secondary", name : "Secundario" });
		this.background.push({ value : "bg-success", name : "Exitoso" });
		this.background.push({ value : "bg-danger", name : "Peligro" }); 
		this.background.push({ value : "bg-warning", name : "Alerta" });
		this.background.push({ value : "bg-info", name : "Informativo" });
		this.background.push({ value : "bg-light", name : "Claro" });
		this.background.push({ value : "bg-dark", name : "Negro" });
		this.background.push({ value : "bg-white", name : "Blanco" });
	}

}