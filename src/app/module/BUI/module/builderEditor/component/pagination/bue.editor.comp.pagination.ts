import { Component, Input, Output, EventEmitter } from '@angular/core';

export const bComponentPagination = {
	id : 23,
	name : "Paginación",
	icon : "fas fa-sort-numeric-down",
	isMaxWidh : true,
	viewContent : "div",
	config : {
		id : "",
		lista : {
			esEnlace : false,
			valor : ""
		},
		total : {
			esEnlace : false,
			valor : ""
		},
		pagina : {
			esEnlace : false,
			valor : ""
		},
		itemxPagina : {
			esEnlace : false,
			valor : ""
		},
		nroPaginaciones : {
			esEnlace : false,
			valor : ""
		},
		habilitarDireccionales : true,
		habilitarLimites : true,
		habilitarRotacion : true,
		habilitarElipse : false
	}
};

export const fCopyPagination = function(extend : any){
	if(extend.config){
		if(extend.config.lista){
			extend.config.lista = Object.assign({}, bComponentPagination.config.lista, extend.config.lista);
		}
		if(extend.config.total){
			extend.config.total = Object.assign({}, bComponentPagination.config.total, extend.config.total);
		}
		if(extend.config.pagina){
			extend.config.pagina = Object.assign({}, bComponentPagination.config.pagina, extend.config.pagina);
		}
		if(extend.config.itemxPagina){
			extend.config.itemxPagina = Object.assign({}, bComponentPagination.config.itemxPagina, extend.config.itemxPagina);
		}
		if(extend.config.nroPaginaciones){
			extend.config.nroPaginaciones = Object.assign({}, bComponentPagination.config.nroPaginaciones, extend.config.nroPaginaciones);
		}
		extend.config = Object.assign({}, bComponentPagination.config, extend.config);
	}
	return Object.assign({}, bComponentPagination, extend);
};

@Component({
  selector: 'bue-ec-paginationview',
  templateUrl: './bue.editor.comp.paginationview.html'
})
export class EdComPaginationView {

	@Input() item: any;

}

@Component({
	selector: 'bue-ec-paginationconf',
	templateUrl: './bue.editor.comp.paginationConf.html'
})
export class EdComPaginatioConf {
	
	@Input() item: any;
	@Output() onSearchBind : EventEmitter<any>;

	constructor(){
		this.onSearchBind  = new EventEmitter<any>();
	}

	buscarListaBind(){
		if(!this.item.config.lista.esEnlace){
			this.onSearchBind.emit({
				campo : "lista.valor",
				tipo : "array"
			});
		}
		this.item.config.lista.esEnlace = !this.item.config.lista.esEnlace;
	}

	buscarBind(variable : string){
		if(!this.item.config[variable].esEnlace){
			this.onSearchBind.emit({
				campo : variable+".valor",
				tipo : "item"
			});
		}
		this.item.config[variable].esEnlace = !this.item.config[variable].esEnlace;
	}

}