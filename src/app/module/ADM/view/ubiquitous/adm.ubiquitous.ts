import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMUbigeoServiceJPO, pGesubigeoListarAll, pGesubigeoEliminar } from '../../service/adm.aDMUbigeoService';

@Component({
	templateUrl: './adm.ubiquitous.html'
})
export class Ubiquitous extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

	private aDMUbigeoService: ADMUbigeoServiceJPO;
	items: any;

	public filter: any;
	public pagin: any;

	constructor(private ohService: OHService, public cse: CoreService, public acs: ADMCoreService) {
		super(ohService, cse, acs);
		this.aDMUbigeoService = new ADMUbigeoServiceJPO(ohService);
		this.items = [];
		this.filtroTab();
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		this.cse.config.disableSeparator = true;
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
				ubigeo_id : {
					label: "Id",
					type: "",
					closeFilter: true
				}, 
				ubigeo_padre_id : {
					label: "Id padre",
					type: "",
					closeFilter: true
				},
				unidad_negocio_id : {
					label: "Unidad de negocio",
					type: "",
					closeFilter: true,
					beforeFilter : (unidad_negocio_id : any) => {
						let un = this.acs.data.unidad_negocio.find(it => it.unidad_negocio_id == unidad_negocio_id.value);
						if(un){
							unidad_negocio_id.descValue = un.nombre;
						}
					}
				},
				codigo : {
					label: "Código",
					type: "",
					closeFilter: true
				},
				nombre : {
					label: "Nombre",
					type: "",
					closeFilter: true
				},
				estado : {
					label: "Estado",
					type: "",
					closeFilter: true,
					beforeFilter : (estado : any) => {
						if (estado.value != null) {
							estado.descValue = (estado.value == 1) ? 'Activo' : 'Inactivo';
						}
					}
				}
			}
		};
	}

	gesubigeoListarAll() {
		this.aDMUbigeoService.gesubigeoListarAll({
			ubigeo_id: this.filter.fields.ubigeo_id.value,
			ubigeo_padre_id: this.filter.fields.ubigeo_padre_id.value,
			unidad_negocio_id: this.filter.fields.unidad_negocio_id.value,
			codigo: this.filter.fields.codigo.value,
			nombre: this.filter.fields.nombre.value,
			estado: this.filter.fields.estado.value,
            page : this.pagin.page,
            size : this.pagin.size_rows
		}, (resp: pGesubigeoListarAll) => {
            this.pagin.total = resp.resultado.total_registros
			this.items = resp.ubigeos
		});
	}

	gesubigeoEliminar(ubigeoSelected) {
		this.aDMUbigeoService.gesubigeoEliminar({
			ubigeo_id: ubigeoSelected
		}, (resp: pGesubigeoEliminar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				this.gesubigeoListarAll();
			} else {
				this.ohService.getOH().getAd().warning(resp.resp_mensaje);
			}
		});
	}

}