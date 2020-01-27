import { Component, Input } from '@angular/core';

export const bComponentSearchRow = {
	id : 7,
	icon : "fab fa-sistrix",
	name : "Fila de búsqueda",
	isMaxWidh : true,
	flagOnClick : true,
	flagOnKey : true,
	viewContent : "div",
	config : {
		id : "",
		placeholder : "Buscar...",
		value : "Buscar",
		enableScan : true,
		onSearch : ""
	}
};

@Component({
  selector: 'bue-ec-searchrowview',
  templateUrl: './bue.editor.comp.searchRowView.html'
})
export class EdComSearchRowView {

	@Input() item: any;

}

@Component({
	selector: 'bue-ec-searchrowconf',
	templateUrl: './bue.editor.comp.searchRowConf.html'
})
export class EdComSearchRowConf {
	
	@Input() item: any;

	constructor(){
	}

}