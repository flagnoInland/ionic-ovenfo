import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BUIReferenciaServiceJPO, pGesreferenciaListar } from 'src/app/module/BUI/service/bui.bUIReferenciaService';
import { ADMMonedaServiceJPO, pGesmonedaEliminar, pGesmonedaListar } from '../../service/adm.aDMMonedaService';

@Component({
	templateUrl: './adm.money.html'
})
export class Money extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

	private bUIReferenciaService : BUIReferenciaServiceJPO;
	private aDMMonedaService: ADMMonedaServiceJPO

	public filter: any;
	public pagin: any;

	referenciasList : pGesreferenciaListar[];
    have_referencia : boolean;
    
    monedaSelected: any;

    items: any;
	constructor(private ohService: OHService, public cse: CoreService, private modalService: NgbModal, public ccs: ADMCoreService){
		super(ohService, cse, ccs);
		this.bUIReferenciaService = new BUIReferenciaServiceJPO(ohService);
		this.aDMMonedaService = new ADMMonedaServiceJPO(ohService)
        this.items = [];
        this.filtroTab();
	}

	ngOnInit(){
		this.cse.config.disableSeparator = true;
	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){
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
				estado : {
					label: "Estado",
					type: "",
					closeFilter: true,
					beforeFilter : (estado : any) => {
						let un = this.acs.data.catalogo.estado.find(it => it.catalogo_id == estado.value);
						if(un){
							estado.descValue = un.descripcion;
						}
					}
				},
				nombre : {
					label: "Nombre",
					type: "",
					closeFilter: true
				},
				abreviatura : {
					label: "Abreviatura",
					type: "",
					closeFilter: true
				}
			}
		};
	}

	eliminarMonedaConfirmar(modalConfirmar, monedaSelected: any) {
        this.have_referencia = false;
        this.referenciasList = [];
        this.bUIReferenciaService.gesreferenciaListar({
            owner_in: "ges",
            tabla_in: "moneda",
            value_in: String(monedaSelected.moneda_id) // Optional
        }, (resp: pGesreferenciaListar[]) => {
            this.have_referencia = true;
            this.referenciasList = resp;
            this.modalService.open(modalConfirmar).result.then((result) => { }, (reason) => { });
        });
    }
    gesEliminarSeguro(modalConfirmar, monedaSelected: any) {
        this.monedaSelected = monedaSelected;
        this.aDMMonedaService.gesmonedaEliminar({
            moneda_id: monedaSelected.moneda_id
        }, (resp: pGesmonedaEliminar) => {
            if (resp.resp_estado == 1) {
                this.ohService.getOH().getAd().success(resp.resp_mensaje);
                this.gesmonedaListar();
            } else {
                this.eliminarMonedaConfirmar(modalConfirmar, monedaSelected)
            }
        });
    }

    gesmonedaListar(){
        this.aDMMonedaService.gesmonedaListar({
            estado : this.filter.fields.estado.value, // Optional
            nombre : this.filter.fields.nombre.value, // Optional
            abreviatura : this.filter.fields.abreviatura.value, // Optional
            page : this.pagin.page,
            size : this.pagin.size_rows // Optional
        }, (resp : pGesmonedaListar) => {
            this.items = resp.monedas
            this.pagin.total = resp.response.total
        });
    }

}
