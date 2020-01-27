import { Component, Input } from '@angular/core';
import { fCopyContainer } from '../container/bue.editor.comp.container';
import { fCopyRow } from '../row/bue.editor.comp.row';

export const bComponentLinkBox = {
	id : 25,
	name : "Enlace rectangular",
	icon : "far fa-hand-paper",
	isMaxWidh : true,
	viewContent : "div",
	config : {
		id : "",
		valorLink : {
			esEnlace : false,
			valor : "#"
		},
		valorTexto : {
			esEnlace : false,
			valor : "Enlace"
		},
		valorIcono : {
			esEnlace : false,
			valor : "far fa-hand-pointer"
		}
	}
};

export const fCopyLinkBox = function(extend : any){
	if(extend.config){
		if(extend.config.valorLink){
			extend.config.valorLink = Object.assign({}, bComponentLinkBox.config.valorLink, extend.config.valorLink);
		}
		if(extend.config.valorTexto){
			extend.config.valorTexto = Object.assign({}, bComponentLinkBox.config.valorTexto, extend.config.valorTexto);
		}
		if(extend.config.valorIcono){
			extend.config.valorIcono = Object.assign({}, bComponentLinkBox.config.valorIcono, extend.config.valorIcono);
		}
		extend.config = Object.assign({}, bComponentLinkBox.config, extend.config);
	}
	return Object.assign({}, bComponentLinkBox, extend);
};

export const bComponentLinkBoxChildrens = (prefixURL : any) => {
	return fCopyContainer({	
		name : "Enlace de hijos",
		icon : "far fa-plus-square",
		selected : {
			content : [
				fCopyRow({ 
					config : {
						rows : [{
							selectedBody : {
								content : [
									fCopyLinkBox({
										config : {
											valorLink : {
												esEnlace : true,
												valor : "item.urlTree"
											},
											valorTexto : {
												esEnlace : true,
												valor : "item.name"
											},
											valorIcono : {
												esEnlace : true,
												valor : "item.icon"
											}
										}
									})
								]
							},
							width : 6,
							widthSM : 4,
							widthMD : 3,
							widthLG : -1,
							widthXL : -1,
							valueNgFor : {
								esEnlace : true,
								valor : "let item of cse.getTreeChilds('"+prefixURL+"')"
							}
						}]
					}
				})
			]
		},
		config : {
			id : "",
			type : "div",
			typeDiv : "container-fluid"
		}
	})
};

@Component({
  selector: 'bue-ec-linkboxview',
  templateUrl: './bue.editor.comp.linkBoxView.html'
})
export class EdComLinkBoxView {

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
	selector: 'bue-ec-linkboxconf',
	templateUrl: './bue.editor.comp.linkBoxConf.html'
})
export class EdComLinkBoxConf {
	
	@Input() item: any;

	constructor(){
		
	}

	validarIcono(e){
		if(this.item.config.valorIcono.valor){
			if(this.item.config.valorIcono.valor.substr(0,2)=="<i"){
				var claseReal = this.item.config.valorIcono.valor.split('"')[1];
				this.item.config.valorIcono.valor = claseReal;
			}
		}
	}

}