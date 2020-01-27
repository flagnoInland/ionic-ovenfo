import { Component, Input, Output, EventEmitter } from '@angular/core';
import { fCopyOutputText } from '../outputText/bue.editor.comp.outputText';
import { fCopyButton } from '../button/bue.editor.comp.button';

export const bComponentModal = {
	id : 18,
	name : "Modal",
	icon : "far fa-clone",
	isMaxWidh : true,
	viewContent : "div",
	hasChildSelected : true,
	config : {
		id : "",
		centrado : false,
		tamano : "lg",
		escape : true,
		backdrop : true,
		rows : [{
			selectedHead : {
				content : [fCopyOutputText({ config : { value : { valor : "Título"}}})]
			},
			selectedBody : {
				content : []
			},
			selectedFooter : {
				content : [
					fCopyButton({
						config : {
							value : "Nuevo",
							icon : "far fa-save",
							color : "btn-primary",
							onClick : "di('desestimar')"
						}
					}),
					fCopyButton({
						config : {
							value : "Cancelar",
							icon : "fas fa-times-circle",
							color : "btn-outline-secondary",
							onClick : "cl('cerrar')"
						}
					})
				]
			}
		}]
	}
};

@Component({
  selector: 'bue-ec-modalview',
  templateUrl: './bue.editor.comp.modalView.html'
})
export class EdComModalView {

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

}

@Component({
	selector: 'bue-ec-modalconf',
	templateUrl: './bue.editor.comp.modalConf.html'
})
export class EdComModalConf {
	
	@Input() item: any;
	@Output() onNewBind : EventEmitter<any>;

	constructor(){
		this.onNewBind  = new EventEmitter<any>();
	}

	nuevoForBind(configId : string){

		var pModalOpciones = [];
                if(this.item.config.centrado){
                    pModalOpciones.push("centered : true");
                }
                    pModalOpciones.push("size : '"+this.item.config.tamano+"'");
                if(!this.item.config.escape){
                    pModalOpciones.push("keyboard : false");
                }
                if(!this.item.config.backdrop){
                    pModalOpciones.push("backdrop : 'static'");
				}
		var idModal = configId+"Abrir";

		var metodoContenido = [];
			metodoContenido.push("\t\tthis.modalService.open(this."+configId+", {"+pModalOpciones.join(", ")+"}).result.then(result, reason);\n");

		this.onNewBind.emit({
			tipo : "porId",
			entidad : {
				_id : this.item._id,
				readOnly : true,
				name : configId,
				type : "NgbModalRef",
				definition : null,
				decorador : "ViewChild",
				decorador_id : configId,
				isList : false,
				isInput : false,
				isOutput : false,
				value : null
			},
			metodo : {
				_id : this.item._id,
				readOnly : true,
				name : idModal,
				value : metodoContenido.join(""),
				params : [
					{
						name : "result",
						type : "any",
						isOptional : true
					},
					{
						name : "reason",
						type : "any",
						isOptional : true
					}
				]
			}
		});

	}

}