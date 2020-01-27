import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMMonedaServiceJPO, pGesmonedaListar } from 'src/app/module/ADM/service/adm.aDMMonedaService';
import { ActivatedRoute, Router } from '@angular/router';
import { ADMTipoCambioServiceJPO, pGestipoCambioObtener, pGestipoCambioRegistrar, pGestipoCambioEditar } from '../../../service/adm.aDMTipoCambioService';

@Component({
    templateUrl: './adm.exchangerateEdit.html'
})

export class ExchangerateEdit extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

    private aDMTipoCambioService : ADMTipoCambioServiceJPO;
	private aDMMonedaService: ADMMonedaServiceJPO
	
    monedas: any
	item: any
	
    constructor(private ohService: OHService, public cse: CoreService, public acs: ADMCoreService, private route: ActivatedRoute, private router: Router) {
        super(ohService, cse, acs);
        this.aDMTipoCambioService = new ADMTipoCambioServiceJPO(ohService);
        this.aDMMonedaService = new ADMMonedaServiceJPO(ohService)
        this.monedas = [];
		this.item = {}
		this.gesmonedaListar();
    }

    ngOnInit() {
		this.route.params.subscribe(params => {
			if(params && params['id']){
				this.item.tipo_cambio_id = Number(params['id']);
				this.gestipoCambioObtener();
			}
		});
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
    }

    gestipoCambioObtener() {
        this.aDMTipoCambioService.gestipoCambioObtener({
            tipo_cambio_id: this.item.tipo_cambio_id // Optional
        }, (resp: pGestipoCambioObtener) => {
            this.item = resp
            this.item.fecha = this.ohService.getOH().getUtil().dateToNgb(resp.fecha);
        });
    }

    tmscambioventaForm() {
        (this.item.tipo_cambio_id) ? this.gestipoCambioEditar() : this.gestipoCambioRegistrar()
    }

    gestipoCambioRegistrar() {
        this.aDMTipoCambioService.gestipoCambioRegistrar({
            moneda_primera_id: this.item.moneda_primera_id, // Optional
            moneda_segunda_id: this.item.moneda_segunda_id, // Optional
            cambio_venta: this.item.cambio_venta, // Optional
            fecha: this.ohService.getOH().getUtil().dateNgbToString(this.item.fecha),
            usuario_registro_id: this.cse.data.user.data.userid, // Optional
            unidad_negocio_id: this.item.unidad_negocio_id // Optional
        }, (resp: pGestipoCambioRegistrar) => {
            if (resp.resp_estado == 1) {
                this.ohService.getOH().getAd().success(resp.resp_mensaje)
                this.router.navigate(['../'], { relativeTo: this.route })
            } else {
                if (resp.resp_estado == 0) {
                    this.ohService.getOH().getLoader().showError(resp.resp_mensaje)
                } else {
                    this.ohService.getOH().getAd().warning(resp.resp_mensaje)
                }
            }
        });
    }

    gestipoCambioEditar() {
        this.aDMTipoCambioService.gestipoCambioEditar({
            tipo_cambio_id: this.item.tipo_cambio_id, // Optional
            moneda_primera_id: this.item.moneda_primera_id, // Optional
            moneda_segunda_id: this.item.moneda_segunda_id, // Optional
            cambio_venta: this.item.cambio_venta, // Optional
            fecha: this.ohService.getOH().getUtil().dateNgbToString(this.item.fecha),
            unidad_negocio_id: this.item.unidad_negocio_id // Optional
        }, (resp: pGestipoCambioEditar) => {
            if (resp.resp_estado == 1) {
                this.ohService.getOH().getAd().success(resp.resp_mensaje)
                this.router.navigate(['../../'], { relativeTo: this.route })
            } else {
                if (resp.resp_estado == 0) {
                    this.ohService.getOH().getLoader().showError(resp.resp_mensaje)
                } else {
                    this.ohService.getOH().getAd().warning(resp.resp_mensaje)
                }
            }
        });
    }

    gesmonedaListar() {
        this.aDMMonedaService.gesmonedaListar({
        }, (resp: pGesmonedaListar) => {
            this.monedas = resp.monedas
        });
    }

    return() {
        if (this.item.tipo_cambio_id) {
            this.router.navigate(['../../'], { relativeTo: this.route })
        } else {
            this.router.navigate(['../'], { relativeTo: this.route })
        }
    }

}
