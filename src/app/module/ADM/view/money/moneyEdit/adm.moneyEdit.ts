import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMMonedaServiceJPO, pGesmonedaObtener, pGesmonedaEditar, pGesmonedaRegistrar } from 'src/app/module/ADM/service/adm.aDMMonedaService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	templateUrl: './adm.moneyEdit.html'
})
export class MoneyEdit extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

	private aDMMonedaService: ADMMonedaServiceJPO;
	item: any;

	constructor(private ohService: OHService, public cse: CoreService, public ccs: ADMCoreService, private route: ActivatedRoute, private router: Router) {
		super(ohService, cse, ccs);
		this.aDMMonedaService = new ADMMonedaServiceJPO(ohService)
		this.item = {}
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			if(params && params['id']){
				this.item.moneda_id = Number(params['id']);
				this.gesmonedaObtener();
			}
		});
	}

	ngAfterViewInit() {

	}

	ngOnDestroy() {

	}

	registrar() {
        (this.item.moneda_id) ? this.gesmonedaEditar() : this.gesmonedaRegistrar()
    }

	gesmonedaObtener() {
		this.aDMMonedaService.gesmonedaObtener({
			moneda_id: this.item.moneda_id
		}, (resp: pGesmonedaObtener) => {
			this.item = resp
		});
	}

	gesmonedaEditar() {
		this.aDMMonedaService.gesmonedaEditar({
			moneda_id: this.item.moneda_id,
			nombre: this.item.nombre,
			abreviatura: this.item.abreviatura,
			simbolo: this.item.simbolo,
			estado: this.item.estado,
			usuario_modificacion_id: this.cse.data.user.data.userid,
			separador_miles: this.item.separador_miles,
			separador_decimales: this.item.separador_decimales,
			precision: this.item.precision,
			ICU: this.item.ICU
		}, (resp: pGesmonedaEditar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				this.router.navigate(['../../'], { relativeTo: this.route });
			} else {
				this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
			}
		});
	}

	gesmonedaRegistrar() {
		this.aDMMonedaService.gesmonedaRegistrar({
			nombre: this.item.nombre,
			abreviatura: this.item.abreviatura,
			simbolo: this.item.simbolo,
			estado: this.item.estado,
			usuario_registro_id: this.cse.data.user.data.userid,
			separador_miles: this.item.separador_miles,
			separador_decimales: this.item.separador_decimales,
			precision: this.item.precision,
			ICU: this.item.ICU
		}, (resp: pGesmonedaRegistrar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				this.router.navigate(['../'], { relativeTo: this.route });
			} else {
				this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
			}
		});
	}

	clearAll() {
		this.item = {}
	}

}