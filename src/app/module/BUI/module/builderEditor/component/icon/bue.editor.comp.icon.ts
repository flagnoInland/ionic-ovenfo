import { Component, Input } from '@angular/core';
import { pConfig_textoColor, pConfig_textoTamano } from '../../util/bue.editor.util';

export const bComponentIcon = {
	id : 17,
	icon : "fab fa-hotjar",
	name : "Ícono",
	isMaxWidh : false,
	viewContent : "span",
	config : {
		id : "",
		value : "fab fa-hotjar",
		titulo : "",
		colorTexto : "",
		tamanoTexto : ""
	}
};

export const fCopyIcon = function(extend : any){
	if(extend.config){
		extend.config = Object.assign({}, bComponentIcon.config, extend.config);
	}
	return Object.assign({}, bComponentIcon, extend);
};

@Component({
  selector: 'bue-ec-iconview',
  templateUrl: './bue.editor.comp.iconView.html'
})
export class EdComIconView {

	@Input() item: any;

}

@Component({
	selector: 'bue-ec-iconconf',
	templateUrl: './bue.editor.comp.iconConf.html'
})
export class EdComIconConf {
	
	@Input() item: any;

	titulo : string;
	colorTexto : any;
	tamanoTexto : any;

	constructor(){
		this.colorTexto = [];
		
		this.colorTexto = pConfig_textoColor;
		this.tamanoTexto = pConfig_textoTamano;
	}

	validarIcono(e){
		if(this.item.config.value){
			if(this.item.config.value.substr(0,2)=="<i"){
				var claseReal = this.item.config.value.split('"')[1];
				this.item.config.value = claseReal;
			}
		}
	}

}