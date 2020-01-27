import { Component, Input, Output, EventEmitter } from '@angular/core';

export const bComponentAlert = {
	id : 10,
	name : "Alerta",
	icon : "fas fa-exclamation-circle",
	isMaxWidh : true,
	flagOnClose : true,
	viewContent : "div",
	config : {
		id : "",
		value : {
			esEnlace : false,
			valor : "salida"
		},
		color : "success",
		isDismissible : true,
		onClose : ""
	}
};

@Component({
  selector: 'bue-ec-alertview',
  templateUrl: './bue.editor.comp.alertView.html'
})
export class EdComAlertView {

	@Input() item: any;

}

@Component({
	selector: 'bue-ec-alertconf',
	templateUrl: './bue.editor.comp.alertConf.html'
})
export class EdComAlertConf {
	
	@Input() item: any;
	@Output() onSearchBind : EventEmitter<any>;

	alertType : any;

	constructor(){
		
		this.onSearchBind  = new EventEmitter<any>();
		
		this.alertType = [];
		this.alertType.push({ type : "success", name : "Exitoso" });
		this.alertType.push({ type : "info", name : "Informativo" });
		this.alertType.push({ type : "warning", name : "Alerta" });
		this.alertType.push({ type : "danger", name : "Peligro" });
		this.alertType.push({ type : "primary", name : "Primario" });
		this.alertType.push({ type : "secondary", name : "Secundario" });
		this.alertType.push({ type : "light", name : "Claro" });
		this.alertType.push({ type : "dark", name : "Negro" });
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

}