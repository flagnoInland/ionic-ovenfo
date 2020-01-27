import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMMonedaServiceJPO, pGesmonedaListar } from '../../service/adm.aDMMonedaService';
import { ADMTipoCambioServiceJPO, pGestipoCambioListar, pGestipoCambioEliminar } from '../../service/adm.aDMTipoCambioService';

@Component({
	templateUrl: './adm.exchangerate.html'
})
export class Exchangerate extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

    private aDMTipoCambioService : ADMTipoCambioServiceJPO;

	public filter: any;
	public pagin: any;

	public items: any[];
	public catalogos: any;
	private aDMMonedaService: ADMMonedaServiceJPO
	monedas: any
	
	constructor(private ohService: OHService, public cse: CoreService, public acs: ADMCoreService) {
		super(ohService, cse, acs);
        this.aDMTipoCambioService = new ADMTipoCambioServiceJPO(ohService);
		this.aDMMonedaService = new ADMMonedaServiceJPO(ohService)
		this.items = [];
		this.filtroTab();
	}

	ngOnInit() {
		this.cse.config.disableSeparator = true;
	}

	ngAfterViewInit() {
	}

	ngOnDestroy() {
		this.cse.config.disableSeparator = false;
	}

	filtroTab(){
		this.pagin = {
			page: 1,
			total: 0,
			size_rows: 10,
		};
		this.filter = {
			startList : false,
			field : {},
			fields : {
				unidad_negocio_id: {
					label: "unidad_negocio_id",
					type: "",
					closeFilter: true,
					beforeFilter : (unidad_negocio_id : any) => {
						let un = this.acs.data.unidad_negocio.find(it => it.unidad_negocio_id == unidad_negocio_id.value);
						if(un){
							unidad_negocio_id.descValue = un.nombre;
						}
					}
				},
				tipo_cambio_id: {
					label: "tipo_cambio_id",
					type: "",
					closeFilter: true
				},
				moneda_primera_id: {
					label: "moneda_primera_id",
					type: "",
					closeFilter: true
				}, 
				moneda_segunda_id: {
					label: "moneda_segunda_id",
					type: "",
					closeFilter: true
				},
				fecha: {
					label: "fecha",
					type: "fechaRango",
					initValue: null,
					endValue: null,
					closeFilter: true,
					collapsed: true
				}
			}
		};
	}

	gesmonedaListar() {
		this.aDMMonedaService.gesmonedaListar({
		}, (resp: pGesmonedaListar) => {
			this.monedas = resp.monedas
		});
	}

	changeRange(element: any) {
		if (element.initValue && element.endValue) {
			element.collapsed = !element.collapsed;
		}
	}

	gestipoCambioListar() {
		this.aDMTipoCambioService.gestipoCambioListar({
			unidad_negocio_id: this.filter.fields.unidad_negocio_id.value,
			tipo_cambio_id: this.filter.fields.tipo_cambio_id.value,
			moneda_primera_id: this.filter.fields.moneda_primera_id.value,
			moneda_segunda_id: this.filter.fields.moneda_segunda_id.value,
			fecha_min: this.ohService.getOH().getUtil().dateToString(this.filter.fields.fecha.initValue),
			fecha_max: this.ohService.getOH().getUtil().dateToString(this.filter.fields.fecha.endValue),
			page: this.pagin.page,
			size: this.pagin.size_rows
		}, (resp: pGestipoCambioListar) => {
			this.items = resp.tipo_cambios;
			this.pagin.total = resp.response.total;
		});
	}

	trackById(index, item) {
		return item.id; // unique id corresponding to the item
	}

	gestipoCambioEliminar(item) {
		this.aDMTipoCambioService.gestipoCambioEliminar({
			tipo_cambio_id: item.tipo_cambio_id // Optional
		}, (resp: pGestipoCambioEliminar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje);
				}
			}
			this.gestipoCambioListar();
		});
	}

}