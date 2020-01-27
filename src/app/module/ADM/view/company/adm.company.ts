import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BUIReferenciaServiceJPO, pGesreferenciaListar } from 'src/app/module/BUI/service/bui.bUIReferenciaService';
import { ADMEmpresaServiceJPO, pGesempresaEliminar, pGesempresaListar } from '../../service/adm.aDMEmpresaService';

@Component({
    templateUrl: './adm.company.html'
})
export class Company extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

    private aDMEmpresaService: ADMEmpresaServiceJPO;
    private bUIReferenciaService: BUIReferenciaServiceJPO;

    public referenciasList: pGesreferenciaListar[];
    public have_referencia: boolean;
    public empresaSelected: any;
    public roles_empresa: any;
    public ohbOptions: any;
    public filter: any;
    public pagin: any;
    public items: any;

    constructor(private ohService: OHService, public cse: CoreService, private modalService: NgbModal, public acs: ADMCoreService) {
        super(ohService, cse, acs);
        this.aDMEmpresaService = new ADMEmpresaServiceJPO(ohService);
        this.bUIReferenciaService = new BUIReferenciaServiceJPO(ohService);
		this.pagin = {
			page: 1,
			total: 0,
			size_rows: 10,
		}
        this.items = [];
        this.roles_empresa = [];
        
        Promise.all([this.precarga]).then(values => {
            this.filtroTab();
            this.filter.fields.unidad_negocio_id.value = this.cse.data.user.profile;
            this.unidad_negocio_selected();
        });

    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.cse.config.disableSeparator = true;
    }

    ngOnDestroy() {
        this.cse.config.disableSeparator = false;
    }

    gesempresaListar() {
        this.aDMEmpresaService.gesempresaListar({
            documento: this.filter.fields.documento.value,
            razon_social: this.filter.fields.razon_social.value,
            razon_comercial: this.filter.fields.razon_comercial.value,
            estado: this.filter.fields.estado.value,
            unidad_negocio_id: this.filter.fields.unidad_negocio_id.value,
            roles: this.filter.fields.roles.concatValue,
            page: this.pagin.page,
            size: this.pagin.size_rows
        }, (resp: pGesempresaListar) => {
            for (var item of resp.empresas) {
                item['roles_lista'] = this.ohService.getOH().getUtil().StringXMLtoJSONList(item.roles);
            }
            this.items = resp.empresas;
            this.pagin.total = resp.response.total
        });
    }

    eliminarEmpresaConfirmar(modalConfirmar, empresaSelected: any) {
        this.have_referencia = false;
        this.referenciasList = [];
        this.bUIReferenciaService.gesreferenciaListar({
            owner_in: "ges",
            tabla_in: "empresa",
            value_in: String(empresaSelected.empresa_id) // Optional
        }, (resp: pGesreferenciaListar[]) => {
            this.have_referencia = true;
            this.referenciasList = resp;
            this.modalService.open(modalConfirmar).result.then((result) => { }, (reason) => { });
        });
    }

    gesEliminarSeguro(modalConfirmar, empresaSelected: any) {
        this.empresaSelected = empresaSelected;
        this.aDMEmpresaService.gesempresaEliminar({
            empresa_id: empresaSelected.empresa_id
        }, (resp: pGesempresaEliminar) => {
            if (resp.resp_estado == 1) {
                this.ohService.getOH().getAd().success(resp.resp_mensaje);
                this.gesempresaListar();
            } else {
                //this.ohService.getOH().getAd().warning(resp.resp_mensaje);
                this.eliminarEmpresaConfirmar(modalConfirmar, empresaSelected)
            }
        });
    }

    filtroTab() {
        this.pagin = {
            page: 1,
            total: 0,
            size_rows: 10,
        };
        this.filter = {
            startList: false,
            field: {},
            fields: {
                estado: {
                    label: "Estado",
                    type: "",
                    closeFilter: true,
                    beforeFilter: (estado: any) => {
                        if (estado.value != null) {
                            estado.descValue = (estado.value == 1) ? 'Activo' : 'Inactivo';
                        }
                    }
                },
                unidad_negocio_id: {
                    label: "Unidad de Negocio",
                    type: "",
                    closeFilter: true,
                    beforeFilter: (unidad_negocio_id: any) => {
                        let un = this.acs.data.unidad_negocio.find(it => it.unidad_negocio_id == unidad_negocio_id.value);
                        if (un) {
                            unidad_negocio_id.descValue = un.nombre;
                        }
                    }
                },
                documento: {
                    label: "Documento",
                    type: "",
                    closeFilter: true
                },
                razon_social: {
                    label: "razon_social",
                    type: "",
                    closeFilter: true
                },
                razon_comercial: {
                    label: "razon_comercial",
                    type: "",
                    closeFilter: true
                },
                roles: {
                    label: "Roles",
                    type: "list",
                    closeFilter: true
                }
            },
            beforeFilter: () => {
                if (this.filter.field.unidad_negocio_id.value && this.filter.field.roles.value && this.roles_empresa.length == 0) {
                    this.unidad_negocio_selected();
                    for (var i in this.roles_empresa) {
                        if (this.filter.field.roles.value.find(it => it.id == this.roles_empresa[i].catalogo_id)) {
                            this.roles_empresa[i].seleccionado = true;
                        }
                    }
                }
            }
        };
    }

    unidad_negocio_selected() {
        this.roles_empresa = JSON.parse(JSON.stringify(this.acs.data.catalogo.rol_empresa.filter(it => it.unidad_negocio_id == this.filter.fields.unidad_negocio_id.value)));
    }

    seleccionarRol() {
        var selec = this.roles_empresa.filter(it => it.seleccionado == true);
        var seleccionados = [];
        for (var i in selec) {
            seleccionados.push({
                id: selec[i].catalogo_id,
                value: selec[i].descripcion
            });
        }
        this.filter.field.roles.value = seleccionados;
    }

}