import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { BUICatalogoServiceJPO, pGescatalogoEditar, pGescatalogoEliminar } from '../../../service/bui.bUICatalogoService';
import { BUIReferenciaServiceJPO, pGesreferenciaListar } from '../../../service/bui.bUIReferenciaService';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { pGescatalogoObtener, ADMCatalogoServiceJPO } from 'src/app/module/ADM/service/adm.aDMCatalogoService';

declare var JSONEditor: any;

@Component({
	templateUrl: './bui.catalogEdit.html',
	styles: ['.table thead th {text-align: center;}']
})
export class CatalogEdit extends BUIBase implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild("modalEditor", { static: true }) modalEditor: NgbModalRef;

	private aDMCatalogoService: ADMCatalogoServiceJPO;
	private bUICatalogoService: BUICatalogoServiceJPO;
	private bUIReferenciaService: BUIReferenciaServiceJPO;

	public ohbOptions: any;
	public catalogoObtenerResp: any;
	public catalogo_id: any;

	constructor(private ohService: OHService, public cse: CoreService, public bcs: BUICoreService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal) {
		super(ohService, cse, bcs);

		this.aDMCatalogoService = new ADMCatalogoServiceJPO(ohService);
		this.bUICatalogoService = new BUICatalogoServiceJPO(ohService);
		this.bUIReferenciaService = new BUIReferenciaServiceJPO(ohService);

		this.ohbOptions = [];
		this.ohbOptions["p_gbgiii_option"] = [
			{ id: "1", desc: "Activo", icon: "<i class='far fa-thumbs-up'></i>" },
			{ id: "0", desc: "Inactivo", icon: "<i class='fas fa-thumbs-down'></i>" }
		];
		this.catalogoObtenerResp = new pGescatalogoObtener();
		this.catalogoObtenerResp.catalogo = {};
		this.catalogoObtenerResp.atributos = [];
		this.catalogo_id = 0;
		this.unidad_negocio_listar();
	}


	sub: any;
	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.catalogo_id = Number(params['id']);
			this.gescatalogoObtener();
		});
	}

	ngAfterViewInit() {

	}

	gescatalogoEditar() {
		var catalogo = this.catalogoObtenerResp.catalogo;
		this.bUICatalogoService.gescatalogoEditar({
			catalogo_id: catalogo.catalogo_id,
			descripcion: catalogo.descripcion,
			descricion_larga: catalogo.descricion_larga,
			estado: catalogo.estado,
			usuario_registro_id: this.cse.data.user.data.userid,
			atributos_editar: this.getAtributos('editar'),
			atributos_nuevo: this.getAtributos('nuevo')
		}, (resp: pGescatalogoEditar) => {
			if (resp.resp_estado.estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje.mensaje);
				let catalogo: any;
				catalogo = resp.catalogo_padre;
				this.cse.adm_catalogo.editCatalogo(catalogo)
				resp.catalogo.forEach(element => {
					catalogo = element;
					this.cse.adm_catalogo.editCatalogo(catalogo)
				});
				this.router.navigate(['../../'], { relativeTo: this.route });
			} else {
				this.ohService.getOH().getLoader().showError(resp.resp_mensaje.mensaje);
			}
		});
	}

	ngOnDestroy() {

	}

	guardar() {
		this.gescatalogoEditar();
	}

	reset(){
		this.gescatalogoObtener();
	}

	gescatalogoObtener() {
		this.aDMCatalogoService.gescatalogoObtener({
			catalogo_id: this.catalogo_id
		}, (resp: pGescatalogoObtener) => {
			this.catalogoObtenerResp = resp;
			this.catalogoObtenerResp.catalogo.estado = (this.catalogoObtenerResp.catalogo.estado) ? '1' : '0';
			for (var i in this.catalogoObtenerResp.atributos) {
				this.catalogoObtenerResp.atributos[i].estado = (this.catalogoObtenerResp.atributos[i].estado) ? '1' : '0';
			}
		});
	}

	atributoEliminar(index: number) {
		this.catalogoObtenerResp.atributos.splice(index, 1);
	}

	atributoAgregar() {
		this.catalogoObtenerResp.atributos.push({
			estado: '1'
		});
	}

	getAtributos(tipo: string): string {
		var xml = [];
		for (var i = 0; i < this.catalogoObtenerResp.atributos.length; i++) {
			var item = this.catalogoObtenerResp.atributos[i];
			if ((tipo == 'editar' && item.catalogo_id) || (tipo == 'nuevo' && !item.catalogo_id)) {
				xml.push("<Atributo>");
				xml.push("<catalogo_id>" + item.catalogo_id + "</catalogo_id>");
				if (item.unidad_negocio_id) {
					xml.push("<unidad_negocio_id>" + item.unidad_negocio_id + "</unidad_negocio_id>");
				}
				xml.push("<descripcion>" + item.descripcion + "</descripcion>");
				xml.push("<descricion_larga>" + ((item.descricion_larga) ? item.descricion_larga : '') + "</descricion_larga>");
				if (item.variable_1) {
					xml.push("<variable1>" + item.variable_1 + "</variable1>");
				}
				if (item.variable_2) {
					xml.push("<variable2>" + item.variable_2 + "</variable2>");
				}
				if(item.variable_3 == 0){
					item.variable_3 = '0';
				}
				if (item.variable_3) {
					xml.push("<variable3>" + item.variable_3 + "</variable3>");
				}

				xml.push("<estado>" + item.estado + "</estado>");
				xml.push("</Atributo>");
			}

		}
		return xml.join("");
	}

	atributoEliminarBD(modalConfirmar, indice: number) {
		var catalogo_id = this.catalogoObtenerResp.atributos[indice].catalogo_id;
		this.bUICatalogoService.gescatalogoEliminar({
			catalogo_id: catalogo_id
		}, (resp: pGescatalogoEliminar) => {
			if (resp.resp_estado == 1) {
				this.cse.adm_catalogo.removeCatalogo({
					catalogo_id : catalogo_id
				});
				this.catalogoObtenerResp.atributos.splice(indice, 1);
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
			} else {
				this.eliminarCatalogoConfirmar(modalConfirmar, catalogo_id)
			}
		});
	}

	have_referencia: boolean;
	referenciasList: any;
	eliminarCatalogoConfirmar(modalConfirmar, catalogoSelected: any) {
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

	editor_descripcion: string;
	abrirEditorJSON(indice: number) {
		var jsonEdit: any;
		this.editor_descripcion = this.catalogoObtenerResp.atributos[indice].descripcion;
		try {
			var jsonToEdit = JSON.parse(this.catalogoObtenerResp.atributos[indice].variable_2 || "{}");
			this.modalService.open(this.modalEditor, { size: 'lg' }).result.then((result) => {
				if (result == "guardar") {
					this.catalogoObtenerResp.atributos[indice].variable_2 = JSON.stringify(jsonEdit.get());
				}
			}, () => {
			});

			setTimeout(() => {
				var jsoneditorDiv = document.getElementById("jsoneditor");
				jsonEdit = new JSONEditor(jsoneditorDiv, { modes: ["tree", "view", "code", "text"] });
				jsonEdit.set(jsonToEdit);
			});;
		} catch (e) {
			this.ohService.getOH().getAd().warning("No se puede convertir a JSON");
		}
	}

	childsEditorJSON() {
		var jsonEdit: any;
		this.editor_descripcion = '';
		try {
			var jsonToEdit = this.catalogoObtenerResp.atributos;
			this.modalService.open(this.modalEditor, { size: 'lg' }).result.then((result) => {
				if (result == "guardar") {
					var deletes = this.catalogoObtenerResp.atributos.filter(this.comparer(jsonEdit.get()));
					var news = jsonEdit.get().filter(this.comparer(this.catalogoObtenerResp.atributos));
					this.catalogoObtenerResp.atributos.forEach(element => {
						var element = jsonEdit.get().find((element_edit) => {
							return element_edit.catalogo_id == element.catalogo_id
						});
					});
					if (news.length > 0) {
						this.ohService.getOH().getUtil().confirm("¿Seguro de agregar " + news.length + " childs?", () => {
							news.forEach((element_new) => {
								delete element_new.catalogo_id
								this.catalogoObtenerResp.atributos.push(element_new);
							});
						});
					}
				}
			}, () => {
			});
			setTimeout(() => {
				var jsoneditorDiv = document.getElementById("jsoneditor");
				jsonEdit = new JSONEditor(jsoneditorDiv, { modes: ["tree", "view", "code", "text"] });
				jsonEdit.set(jsonToEdit);
			});;
		} catch (e) {
			this.ohService.getOH().getAd().warning("No se puede convertir a JSON");
		}
	}

	comparer(otherArray) {
		return function (current) {
			return otherArray.filter(function (other) {
				return other.catalogo_id == current.catalogo_id
			}).length == 0;
		}
	}

}
