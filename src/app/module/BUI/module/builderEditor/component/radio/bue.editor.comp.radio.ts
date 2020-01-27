import { Component, Input, Output, EventEmitter } from '@angular/core';
import { pConfig_botonColor } from '../../util/bue.editor.util';

export const bComponentRadio = {
	id : 16,
	name : "Radio",
	icon : "fas fa-toggle-on",
	isMaxWidh : true,
	viewContent : "div",
	config : {
		id : "",
		value : {
			esEnlace : false,
			valor : ""
		},
		tipoEnlace : 'enlace',
		for : "", // forBinded
		options : [{
			id : "1",
			value : "Si"
		}, {
			id : "0",
			value : "No"
		}]
	}
};

@Component({
  selector: 'bue-ec-radioview',
  templateUrl: './bue.editor.comp.radioView.html'
})
export class EdComRadioView {

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
				value : "Prueba 1"
			}, {
				id : "2",
				value : "Prueba 2"
			}]
		}
		return myList;
	}

}

@Component({
	selector: 'bue-ec-radioconf',
	templateUrl: './bue.editor.comp.radioConf.html'
})
export class EdComRadioConf {
	
	@Input() item: any;
	@Output() onSearchBind : EventEmitter<any>;
	@Output() onNewBind : EventEmitter<any>;

	btnColors : any;
	
	constructor(){
		this.onSearchBind  = new EventEmitter<any>();
		this.onNewBind  = new EventEmitter<any>();

		this.btnColors = pConfig_botonColor;
	}

	deleteRow(index : number){
		this.item.config.options.splice(index, 1);
	}

	addRow(){
		this.item.config.options.push({
			value : "",
			desc : "Nuevo",
			selected : false
		});
	}

	markOpened(index : number){
		if(this.item.config.options[index].selected){
			for(var i = 0; i < this.item.config.options.length; i++){
				this.item.config.options[i].selected = false;
			}
			this.item.config.options[index].selected = true;
			this.item.config.value = this.item.config.options[index].id;
		} else {
			this.item.config.value = "";
		}
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

	buscarForBind(){
		this.onSearchBind.emit({
			campo : "for",
			tipo : "array"
		});
	}

	nuevoForBind(){
		this.onNewBind.emit({
			tipo : "opcion",
			campo : "for"
		});
	}

}