import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ADMCatalogoServiceJPO, pGescatalogoListar, pGescatalogoObtener, pGescatalogoListarAll, gescatalogoListar_respuesta } from '../../service/adm.aDMCatalogoService';

@Component({
	templateUrl: './adm.catalog.html'
})
export class Catalog extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

    private aDMCatalogoService : ADMCatalogoServiceJPO;

    @ViewChild("filterWindow", { static: true }) objFilter: TemplateRef<NgbActiveModal>;
    
    ohbOptions: any;
    enlaceTotal: number;
    enlacePagina: number;
    enlaceTamano: number;
	items : any;
	filter: any;
	
	have_referencia: boolean;
	catalogoSelected: any;
	
	constructor(private ohService : OHService, public cse : CoreService, public acs : ADMCoreService, private modalService: NgbModal){
		super(ohService, cse, acs);

        this.aDMCatalogoService = new ADMCatalogoServiceJPO(ohService);

        this.ohbOptions = [];
        this.enlaceTotal = 1;
        this.enlacePagina = 1;
        this.enlaceTamano = 10;
        this.items = [];
		this.instanceFilter();
		
	}

	ngOnInit(){
		this.cse.adm_catalogo.getCatalogosAll().subscribe(() => {

        })
    }

    ngAfterViewInit() {

        this.cse.config.disableSeparator = true;

    }

    ngOnDestroy() {

        this.cse.config.disableSeparator = false;

    }

    volcarCatalogos() {
        this.ohService.getOH().getUtil().confirm("Confirma volcar la data Catalogo a Firebase?", () => {
            this.aDMCatalogoService.gescatalogoListarAll({},(resp : pGescatalogoListarAll[]) => {
                for(var i in resp){
                    this.cse.adm_catalogo.addCatalogo(resp[i]);
				}
				this.ohService.getOH().getAd().success("Volcado correctamente");
            });
        })
	}
	
	limpiarCatalogo() {
        this.ohService.getOH().getUtil().confirm("Confirma limpiar la data Catalogo de Firebase?", () => {
			this.cse.adm_catalogo.removeAll();
			this.ohService.getOH().getAd().success("Limpiado correctamente");
        })
	}
    
    instanceFilter() {

        this.filter = {};
        this.filter.field = {};
        this.filter.fields = {};


        this.filter.fields.catalogo_id = {
            label: "catalogo_id",
            type: "",
            closeFilter: true
        };
        this.filter.fields.descripcion = {
            label: "Descripcion",
            type: "",
            closeFilter: true
        };
        this.filter.fields.estado = {
            label: "Estado",
            type: "",
            closeFilter: true
        };

        this.filter.beforeFilter = () => {
            this.filter.fields = this.filter.field;
            if (this.filter.fields.estado.value != null) {
                this.filter.fields.estado.descValue = (this.filter.fields.estado.value == 1) ? 'Activo' : 'Inactivo';
            }
            this.filter.doFilter();
        };

        this.filter.doFilter = () => {
            this.gescatalogoListar();
        };

	}
	
    gescatalogoListar() {
        this.aDMCatalogoService.gescatalogoListar({
            catalogo_id: this.filter.fields.catalogo_id.value,
            descripcion: this.filter.fields.descripcion.value,
            estado: this.filter.fields.estado.value,
            Page: this.enlacePagina,
            Size: this.enlaceTamano
        }, (resp: pGescatalogoListar) => {
            this.enlaceTotal = resp.resultado.total;
            this.items = resp.respuesta;
        });
    }

    query_insert: string;
    verDetalle(modalDetalle : any, catalogoSelected: any){
        this.aDMCatalogoService.gescatalogoObtener({
            catalogo_id : catalogoSelected.catalogo_id
        }, (resp : pGescatalogoObtener) => {
			this.catalogoSelected = resp;
            this.modalService.open(modalDetalle, {size : 'lg'}).result.then((result) => { }, (reason) => { });
        });
	}
	
	cargarData(item : gescatalogoListar_respuesta){
		this.aDMCatalogoService.gescatalogoListarAll({
			catalogo_id : item.catalogo_id
		},(resp : pGescatalogoListarAll[]) => {
            this.cse.adm_catalogo.eliminarCatalogoPadre({
                catalogo_id : item.catalogo_id
            }).then(() => {
                for (var i in resp) {
                    this.cse.adm_catalogo.addCatalogo(resp[i]);
                }
            })
			this.ohService.getOH().getAd().success("Cargado correctamente");
		});
	}

}