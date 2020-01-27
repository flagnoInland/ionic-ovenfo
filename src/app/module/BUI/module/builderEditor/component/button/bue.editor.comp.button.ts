import { Component, Input } from '@angular/core';
import { pConfig_botonColor } from '../../util/bue.editor.util';

export const bComponentButton = {
	id : 5,
	name : "Botón",
	icon : "fas fa-hand-pointer",
	isMaxWidh : false,
	flagOnClick : true,
	viewContent : "span",
	config : {
		id : "",
		value : "Botón",
		icon : "far fa-hand-pointer",
		color : "btn-primary",
		size : "",
		whenDisabled : "",
		onClick : "",
		router : ""
	}
};

export const fCopyButton = function(extend : any){
	if(extend.config){
		extend.config = Object.assign({}, bComponentButton.config, extend.config);
	}
	return Object.assign({}, bComponentButton, extend);
};

@Component({
  selector: 'bue-ec-buttonview',
  templateUrl: './bue.editor.comp.buttonView.html'
})
export class EdComButtonView {

	@Input() item: any;

	getClaseButton(item : any){
		var myClass = "btn ";
		if(item.config.color){
			myClass += item.config.color+" ";
		}
		if(item.config.size){
			myClass += item.config.size;
		}
		return myClass;
	}

}

@Component({
	selector: 'bue-ec-buttonconf',
	templateUrl: './bue.editor.comp.buttonConf.html'
})
export class EdComButtonConf {
	
	@Input() item: any;

	btnColors : any;
	btnSizes : any;

	constructor(){
		this.btnColors = pConfig_botonColor;

		this.btnSizes = [];
		this.btnSizes.push({ class : "", name : "Normal" });
		this.btnSizes.push({ class : "btn-sm", name : "Pequeño" });
		this.btnSizes.push({ class : "btn-lg", name : "Grande" });
	}

	validarIcono(e){
		if(this.item.config.icon){
			if(this.item.config.icon.substr(0,2)=="<i"){
				var claseReal = this.item.config.icon.split('"')[1];
				this.item.config.icon = claseReal;
			}
		}
	}

}