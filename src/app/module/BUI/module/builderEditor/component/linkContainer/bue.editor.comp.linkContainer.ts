import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fCopyIcon } from '../icon/bue.editor.comp.icon';
import { fCopyOutputText } from '../outputText/bue.editor.comp.outputText';

export const bComponentLinkContainer = {
	id : 26,
	icon : "fas fa-hand-pointer",
	name : "Enlace contenedor",
	isMaxWidh : true,
	viewContent : "div",
	flagOnClick : true,
	selected : {
		content : []
	},
	config : {
		id : "",
		router : "",
		url : "",
		target : ""
	}
};

export const fCopyLinkContainer = function(extend : any){
	return Object.assign({}, bComponentLinkContainer, extend);
};

export const bComponentLinkContainerText = fCopyLinkContainer({	
	name : "Enlace contenedor texto",
	selected : {
		content : [
			fCopyIcon({
				viewContent : 'span',
				spacing : [{
					type : "m",
					area : "r",
					size : 1
				}],
				config : {
					value : "fas fa-hand-pointer"
				}
			}),
			fCopyOutputText({
				config : {
					value : {
						esEnlace : false,
						valor : "enlace"
					}
				}
			})
		]
	}
});

@Component({
  selector: 'bue-ec-linkcontainerview',
  templateUrl: './bue.editor.comp.linkContainerView.html'
})
export class EdComLinkContainerView {

	@Input() item: any;
	@Input() bind: any;
	@Input() nameDragula: string;
	@Input() readOnly: boolean;

	@Output() onSelectedItem : EventEmitter<any>;

	constructor(){
		this.onSelectedItem  = new EventEmitter<any>();
	}
	
	getSelectedItem(event: any){
		this.onSelectedItem.emit({item : event.item});
	}

}

@Component({
	selector: 'bue-ec-linkcontainerconf',
	templateUrl: './bue.editor.comp.linkContainerConf.html'
})
export class EdComLinkContainerConf {
	
	@Input() item: any;

	targets : any;

	constructor(){
		this.targets = [];
		this.targets.push({ type : "", name : "Same page" });
		this.targets.push({ type : "_blank", name : "New window" });

	}

}