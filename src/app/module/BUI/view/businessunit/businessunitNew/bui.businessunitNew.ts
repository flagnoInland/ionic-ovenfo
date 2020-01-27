import { Component, OnInit } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { pSegunidadNegocioRegistrar, pSegunidadNegocioOpciones } from '../../../service/bui.bUIUnidadNegocioService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	templateUrl: './bui.businessunitNew.html'
})
export class BusinessunitNew extends BUIBase implements OnInit {

	item : any = {};
	configuraciones : any;
	monedas : any;

	unidades : any;
	
	constructor(private ohService : OHService, public cse : CoreService, public ccs : BUICoreService, private route: ActivatedRoute, private router : Router){
		super(ohService, cse, ccs);
		this.item = {
			estado : '1'
		};

		this.unidades = [];
		this.configuraciones = [];
		this.monedas = [];

	}

	ngOnInit(){
        this.bUIUnidadNegocioService.segunidadNegocioOpciones((resp : pSegunidadNegocioOpciones) => {
			this.configuraciones = resp.configuraciones;
			for(var i in this.configuraciones){
				this.configuraciones[i].seleccionado = true;
			}

			this.monedas = resp.monedas;
        });
		this.unidad_negocio_listar();
	}

	register(frmRegister : any){
		if(frmRegister.valid){
			let unidad_negocio_padre_id = ''==this.item.unidad_negocio_padre_id ? null :this.item.unidad_negocio_padre_id
			this.bUIUnidadNegocioService.segunidadNegocioRegistrar({
				nombre : this.item.nombre,
				estadoUN : this.item.estado,
				configuracion : this.getConfiguraciones(),
				moneda : this.getMonedas(),
				usuario_id : this.cse.data.user.data.userid,
				unidad_negocio_padre_id:unidad_negocio_padre_id
			}, (resp : pSegunidadNegocioRegistrar) => {
				if(resp.estado==1){
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.router.navigate(['../'], { relativeTo: this.route }); 
				} else {
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				}
			});
		}
	}

	getConfiguraciones() : string {
		var xml = [];
		for(var i in this.configuraciones){
			xml.push("<UN>")
			xml.push("<tipo_configuracion>"+this.configuraciones[i].catalogo_id+"</tipo_configuracion>")
			xml.push("<valor>"+((this.configuraciones[i].valor)?this.configuraciones[i].valor:'')+"</valor>")
			xml.push("<estado>"+((this.configuraciones[i].seleccionado)?'1':'0')+"</estado>")
			xml.push("</UN>")
		}
		return xml.join("");
	}

	getMonedas() : string {
		var xml = [];
		for(var i in this.monedas){
			xml.push("<MONEDA>")
			xml.push("<moneda_id>"+this.monedas[i].moneda_id+"</moneda_id>")
			xml.push("</MONEDA>")
		}
		return xml.join("");
	}

}
