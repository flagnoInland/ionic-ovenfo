import { Component, Input, Output, EventEmitter } from '@angular/core';

export const bComponentSelect = {
	id : 13,
	name : "Opción de selección",
	icon : "fas fa-sort-amount-down",
	isMaxWidh : true,
	viewContent : "div",
	flagOnChange : true,
	config : {
		id : "",
		value : {
			esEnlace : false,
			valor : ""
		},
		tipoEnlace : 'enlace',
		onChange : "",
		for : "", // forBinded
		options : [{
			id : "1",
			value : "Opcion 1"
		}, {
			id : "2",
			value : "Opcion 2"
		}],
		disabled : false,
		required : false,
		enableRules : false
	}
};

@Component({
  selector: 'bue-ec-selectview',
  templateUrl: './bue.editor.comp.selectView.html'
})
export class EdComSelectView {

	@Input() item: any;
	@Input() bind: any;

	getListBind(){
		var myList = [];
		if(this.item.config.for && this.item.config.for.length>0){
			var parts = this.item.config.for.split(".");
			if(parts.length>1){
				myList = this.bind.entities;
				for(var i = 0; i < parts.length; i++){
					if(i == 0){
						var list = myList.find(item => item.name == parts[i]);
						if(list){
							myList = JSON.parse((list.value=="")?"{}":list.value);
						}
					} else{ 
						if(myList[parts[i]]){
							myList = myList[parts[i]];
						} else {
							myList = [];
						}
					}
				}
			}
		}
		if(myList.length==0){
			myList = [{
				id : "1",
				value : "Opcion prueba 1"
			}, {
				id : "2",
				value : "Opcion prueba 2"
			}]
		}
		return myList;
	}

}

@Component({
	selector: 'bue-ec-selectconf',
	templateUrl: './bue.editor.comp.selectConf.html'
})
export class EdComSelectConf {
	
	@Input() item: any;
	@Output() onSearchBind : EventEmitter<any>;
	@Output() onNewBind : EventEmitter<any>;

	constructor(){
		this.onSearchBind  = new EventEmitter<any>();
		this.onNewBind  = new EventEmitter<any>();
	}

	deleteRow(index : number){
		this.item.config.options.splice(index, 1);
	}

	addRow(){
		this.item.config.options.push({
			id : "",
			desc : ""
		});
	}

	buscarForBind(){
		this.onSearchBind.emit({
			campo : "for",
			tipo : "array"
		});
	}

	buscarValueBind(){
		if(!this.item.config.value.esEnlace){
			this.onSearchBind.emit({
				campo : "value.valor",
				tipo : "item"
			});
		}
		this.item.config.value.esEnlace = !this.item.config.value.esEnlace;
	}

	nuevoForBind(){
		this.onNewBind.emit({
			tipo : "opcion",
			campo : "for"
		});
	}

}