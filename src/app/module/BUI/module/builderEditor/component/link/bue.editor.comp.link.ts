import { Component, Input } from '@angular/core';
import { pConfig_textoTamano, pConfig_textoColor } from '../../util/bue.editor.util';

export const bComponentLink = {
	id : 4,
	icon : "far fa-hand-pointer",
	name : "Enlace",
	isMaxWidh : true,
	viewContent : "div",
	flagOnClick : true,
	config : {
		id : "",
		value : "Link",
		icon : "far fa-hand-pointer",
		router : "",
		url : "",
		target : "",
		colorTexto : "",
		tamanoTexto : ""
	}
};

export const fCopyLink = function(extend : any){
	return Object.assign({}, bComponentLink, extend);
};

@Component({
  selector: 'bue-ec-linkview',
  templateUrl: './bue.editor.comp.linkView.html'
})
export class EdComLinkView {

	@Input() item: any;

}

@Component({
	selector: 'bue-ec-linkconf',
	templateUrl: './bue.editor.comp.linkConf.html'
})
export class EdComLinkConf {
	
	@Input() item: any;

	targets : any;
	colorTexto : any;
	tamanoTexto : any;

	constructor(){
		this.targets = [];
		this.targets.push({ type : "", name : "Same page" });
		this.targets.push({ type : "_blank", name : "New window" });

		this.colorTexto = pConfig_textoColor;
		this.tamanoTexto = pConfig_textoTamano;
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