import { Component,  AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ohTransition } from './../../animations/oh.core';
// <oh-loader #loaderId></oh-loader>
// this.loader.show();
// this.loader.close();
// this.loader.showError("");
// this.ohService.getOH().getLoader().show();
@Component({
  selector: 'oh-loader',
  templateUrl: './oh.loader.html',
  animations: [ohTransition],
  styleUrls: ['./oh.loader.css']
})

export class Loader implements AfterViewChecked {

	public ohCarg: any;
	public show_var_aux = false; // add one more property

	constructor(private cdRef : ChangeDetectorRef){
		this.ohCarg = {};
		this.ohCarg.show = false;
		this.ohCarg.emailAdm = "error@admin.com";
		this.ohCarg.number = "123456789";
		this.ohCarg.annexed = "1122";
		this.ohCarg.title = "Software Dummy";
	}
	
	ngAfterViewChecked() {
		let show = this.isShow();
		if (show != this.show_var_aux) { // check if it change, tell CD update view
			this.show_var_aux = show;
			this.cdRef.detectChanges();
		}
	}

	isShow(){
		return this.ohCarg.show && this.ohCarg.view == 'C'
	}

	public setAttributes(attributes : any){
		Object.assign(this.ohCarg, attributes);
	}

	public show(call?: Function){
		this.ohCarg.show = true;
		this.ohCarg.view = 'C';
		setTimeout(() => {
			if(call){
				call();
			}
		}, 500);
	}

	public showUnService(call?: Function){
		this.ohCarg.show = true;
		this.ohCarg.view = 'F';
		setTimeout(() => {
			if(call){
				call();
			}
		}, 500);
	}

	public showError(message : any, call?: Function){
		this.ohCarg.show = true;
		this.ohCarg.errorDetail = false;
		this.ohCarg.view = 'E';
		if(message){
			if(typeof(message)=="string"){
				this.ohCarg.error = message;
			} else {
				this.ohCarg.error = message.error;
				this.ohCarg.errorCodigo = message.errorCodigo;
			}
		}
		setTimeout(() => {
			if(call){
				call();
			}
		}, 500);
	}

	public close(call?: Function){
		this.ohCarg.show = false;
		this.ohCarg.view = '';
		setTimeout(() => {
			if(call){
				call();
			}
		}, 500);
	}

	private closeModal($event){
		$event.preventDefault();
		this.close();
	}

	private showDetail($event){
		$event.preventDefault();
		this.ohCarg.errorDetail = true;
	}

	private getBodyError(texto){
		var errorGet = encodeURI(texto);
		return errorGet.length>1840?errorGet.substr(0, 1840)+" Mas contenido...":errorGet;
	}

}