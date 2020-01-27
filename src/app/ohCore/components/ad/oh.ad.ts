import { Component } from '@angular/core';
import { ohTopAd } from './../../animations/oh.core';
// <oh-aviso #avisoEid></oh-aviso>
// this.ohService.getOH().getAd().success("EIR 0000624076 generado corréctamente");
// this.ohService.getOH().getAd().loading();
// this.ohService.getOH().getAd().close();
@Component({
  selector: 'oh-ad',
  templateUrl: './oh.ad.html',
  animations: [ohTopAd],
  styleUrls: ['./oh.ad.css']
})

export class Ad {

	ohAd: any;

	constructor(){
		this.ohAd = {};
		this.ohAd.show = false;
		this.ohAd.mensaje = "";
		this.ohAd.showClose = true;
	}

	public loading(call?: Function){
		this.ohAd.show = true;
		this.ohAd.view = 'C';
		setTimeout(() => {
			if(call){
				call();
			}
		}, 500);
	}

	public success(mensaje?: string | {
		mensaje ?: string,
		timeSeconds ?: number,
		showClose ?: boolean,
		size ?: string
    } | any){
		this.ohAd.view = 'S';
		this.showMessage(mensaje);
	}

	public warning(mensaje?: string | {
		mensaje ?: string,
		timeSeconds ?: number,
		showClose ?: boolean,
		size ?: string
    } | any){
		this.ohAd.view = 'W';
		this.showMessage(mensaje);
	}

	private showMessage(mensaje?: string | {
		mensaje ?: string,
		timeSeconds ?: number,
		showClose ?: boolean,
		size ?: string
    } | any){

		var defaultConfig = {
			mensaje : "",
			timeSeconds : 3,
			showClose : true,
			size : ""
		}

		if(typeof(mensaje) == "string"){
			defaultConfig.mensaje = mensaje;
		} else {
			Object.assign(defaultConfig, mensaje);
		}
		
		this.ohAd.show = true;
		this.ohAd.mensaje = defaultConfig.mensaje;
		this.ohAd.showClose = defaultConfig.showClose;
		setTimeout(() => {
			this.ohAd.mensaje = "";
			this.close();
		}, (defaultConfig.timeSeconds * 1000));
	}

	public close(call?: Function){
		this.ohAd.view = '';
		setTimeout(() => {
			this.ohAd.show = false;
			if(call){
				call();
			}
		}, 499);
	}

	private closeAd($event){
		$event.preventDefault();
		this.close();
	}

}
