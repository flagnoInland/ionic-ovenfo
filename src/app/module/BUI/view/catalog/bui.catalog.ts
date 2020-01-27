import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BUICatalogoServiceJPO, pGescatalogoEliminar } from '../../service/bui.bUICatalogoService';
import { BUIReferenciaServiceJPO, pGesreferenciaListar } from '../../service/bui.bUIReferenciaService';
import { ADMCatalogoServiceJPO, pGescatalogoListar, pGescatalogoListarAll, pGescatalogoObtener, gescatalogoListar_respuesta } from 'src/app/module/ADM/service/adm.aDMCatalogoService';

declare var JSONEditor: any;

@Component({
    templateUrl: './bui.catalog.html'
})
export class Catalog extends BUIBase implements OnInit, AfterViewInit, OnDestroy {

    private aDMCatalogoService: ADMCatalogoServiceJPO;
    private bUICatalogoService: BUICatalogoServiceJPO;
    private bUIReferenciaService: BUIReferenciaServiceJPO;

    public items: any;
    
	pagin: any;
    filter : any;
    
    public referenciasList: pGesreferenciaListar[];
    public have_referencia: boolean;
    public catalogoSelected: any;

    constructor(private ohService: OHService, public cse: CoreService, public bcs: BUICoreService, private modalService: NgbModal) {
        super(ohService, cse, bcs);

        this.aDMCatalogoService = new ADMCatalogoServiceJPO(ohService);
        this.bUICatalogoService = new BUICatalogoServiceJPO(ohService);
        this.bUIReferenciaService = new BUIReferenciaServiceJPO(ohService);

        this.items = [];
        this.filtroTab();

    }

    ngOnInit() {
        this.cse.adm_catalogo.getCatalogosAll().subscribe(() => { })
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
				estado : {
					label : "Estado",
					type : "",
					closeFilter : true,
					beforeFilter : (estado : any) => {
                        if (estado.value != null) {
                            estado.descValue = (estado.value == 1) ? 'Activo' : 'Inactivo';
                        }
					}
				},
				catalogo_id : {
                    label: "catalogo_id",
                    type: "",
                    closeFilter: true
                },
				catalogo_hijo_id : {
                    label: "catalogo_hijo_id",
                    type: "",
                    closeFilter: true
                },
                descripcion : {
                    label: "Descripcion",
                    type: "",
                    closeFilter: true
                },
                descricion_larga : {
                    label: "Descripcion larga",
                    type: "",
                    closeFilter: true
                }
			}
		};
	}

    gescatalogoListar() {
        this.aDMCatalogoService.gescatalogoListar({
            catalogo_id: this.filter.fields.catalogo_id.value,
            catalogo_hijo_id : this.filter.fields.catalogo_hijo_id.value,
            descripcion: this.filter.fields.descripcion.value,
            descricion_larga: this.filter.fields.descricion_larga.value,
            estado: this.filter.fields.estado.value,
            Page: this.pagin.page,
            Size: this.pagin.size_rows
        }, (resp: pGescatalogoListar) => {
            this.pagin.total = resp.resultado.total;
            this.items = resp.respuesta;
        });
    }

    volcarCatalogos() {
        this.ohService.getOH().getUtil().confirm("Confirma volcar la data a Firebase?", () => {
            this.aDMCatalogoService.gescatalogoListarAll({}, (resp: pGescatalogoListarAll[]) => {
                for (var i in resp) {
                    this.cse.adm_catalogo.addCatalogo(resp[i]);
                }
            });
        })
    }

    gesEliminarSeguro(modalConfirmar, catalogoSelected: any) {
        this.catalogoSelected = catalogoSelected;
        this.bUICatalogoService.gescatalogoEliminar({
            catalogo_id: catalogoSelected.catalogo_id
        }, (resp: pGescatalogoEliminar) => {
            if (resp.resp_estado == 1) {
                this.ohService.getOH().getAd().success(resp.resp_mensaje);
                this.cse.adm_catalogo.removeCatalogo(catalogoSelected)
                this.gescatalogoListar();
            } else {
                this.eliminarCatalogoConfirmar(modalConfirmar, catalogoSelected)
            }
        });
    }
        
    private eliminarCatalogoConfirmar(modalConfirmar, catalogoSelected: any) {
        this.have_referencia = false;
        this.referenciasList = [];
        this.bUIReferenciaService.gesreferenciaListar({
            owner_in: "ges",
            tabla_in: "catalogo",
            value_in: String(catalogoSelected.catalogo_id) // Optional
        }, (resp: pGesreferenciaListar[]) => {
            this.have_referencia = true;
            this.referenciasList = resp;
            this.modalService.open(modalConfirmar).result.then((result) => { }, (reason) => { });
        });
    }


    query_insert: string;
    listarInserts(modalInsert, catalogoSelected: any) {

        this.aDMCatalogoService.gescatalogoObtener({
            catalogo_id: catalogoSelected.catalogo_id
        }, (resp: pGescatalogoObtener) => {
            this.catalogoSelected = resp;
            var query = [];
            query.push("SET IDENTITY_INSERT ges.catalogo ON" + "\n");
            query.push("INSERT INTO ges.catalogo (catalogo_id, unidad_negocio_id, catalogo_padre_id, descripcion, descricion_larga, estado, fecha_registro, usuario_registro_id) VALUES (" + resp.catalogo.catalogo_id + ", NULL, NULL, '" + resp.catalogo.descripcion + "', '" + (resp.catalogo.descricion_larga ? resp.catalogo.descricion_larga : '') + "', '" + ((resp.catalogo.estado) ? '1' : '0') + "', CURRENT_TIMESTAMP, 1)" + "\n");
            for (var i in resp.atributos) {
                query.push("INSERT INTO ges.catalogo (catalogo_id, unidad_negocio_id, catalogo_padre_id, descripcion, descricion_larga, estado, fecha_registro, usuario_registro_id, variable_1, variable_2, variable_3) VALUES (" + resp.atributos[i].catalogo_id + ", " + (resp.atributos[i].unidad_negocio_id ? resp.atributos[i].unidad_negocio_id : 'NULL') + ", " + resp.catalogo.catalogo_id + ", '" + resp.atributos[i].descripcion + "', " + (resp.atributos[i].descricion_larga ? "'" + resp.atributos[i].descricion_larga + "'" : 'NULL') + ", '" + (resp.atributos[i].estado ? '1' : '0') + "', CURRENT_TIMESTAMP, 1, null, null, null)" + "\n");
            }
            query.push("SET IDENTITY_INSERT ges.catalogo OFF");

            this.query_insert = query.join("");
            this.modalService.open(modalInsert, { size: 'lg' }).result.then((result) => { }, (reason) => { });
        });
    }

    cargarData(item: gescatalogoListar_respuesta) {
        this.ohService.getOH().getUtil().confirm("Confirma actualizar servicios de firebase", () => {
            this.aDMCatalogoService.gescatalogoListarAll({
                catalogo_id: item.catalogo_id
            }, (resp: pGescatalogoListarAll[]) => {
                this.cse.adm_catalogo.eliminarCatalogoPadre({
                    catalogo_id : item.catalogo_id
                }).then(() => {
                    for (var i in resp) {
                        this.cse.adm_catalogo.addCatalogo(resp[i]);
                    }
                })
                this.ohService.getOH().getAd().success("Cargado correctamente");
            });
        })
    }

	limpiarCatalogo() {
        this.ohService.getOH().getUtil().confirm("Confirma limpiar la data Catalogo de Firebase?", () => {
			this.cse.adm_catalogo.removeAll();
			this.ohService.getOH().getAd().success("Limpiado correctamente");
        })
    }

    verDetalle(modalDetalle : any, catalogoSelected: any){
        this.aDMCatalogoService.gescatalogoObtener({
            catalogo_id : catalogoSelected.catalogo_id
        }, (resp : pGescatalogoObtener) => {
			this.catalogoSelected = resp;
            this.modalService.open(modalDetalle, {size : 'xl'}).result.then((result) => { }, (reason) => { });
            setTimeout(() => {
                for(var i in resp.atributos){
                    var jsonEdit = new JSONEditor(document.getElementById("jsoneditor_"+i), {modes : ["view"]});
                    jsonEdit.set(""+resp.atributos[i].variable_2);
                }
            });
        });
	}
    
}