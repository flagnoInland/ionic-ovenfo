import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMEmpresaServiceJPO, pGesempresaObtener, pGesempresaEditar, pGesempresaRegistrar } from 'src/app/module/ADM/service/adm.aDMEmpresaService';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	templateUrl: './adm.companyEdit.html',
	styleUrls: ['./../../../css/dss.structure.css']
})
export class CompanyEdit extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

	precargaParams: any;

	@ViewChild("modalContacto", { static: true }) modalContacto: NgbModalRef;
	@ViewChild("modalDireccion", { static: true }) modalDireccion: NgbModalRef;

	//Services
	private aDMEmpresaService: ADMEmpresaServiceJPO;

	public item: any;
	public roles_empresa: any;
	public rolesSeleccionados: any;
	public configuraciones: any;

	public contacto: any;
	public contactos: any;
	public contactoIndex: any;

	public direccion: any;
	public direcciones: any;
	public direccionIndex: any;

	public tipo_doc_un: any;

	public ubigeo_dist_id: any;

	constructor(private ohService: OHService, public cse: CoreService, private modalService: NgbModal, public acs: ADMCoreService, private route: ActivatedRoute, private router: Router) {
		super(ohService, cse, acs);

		this.aDMEmpresaService = new ADMEmpresaServiceJPO(ohService);
		this.item = {
			estado: '1',
			suspendido: '0'
		}
		this.roles_empresa = [];
		this.contacto = {};
		this.contactos = [];
		this.direccion = {};
		this.direcciones = [];
		this.contactoIndex = -1;
		this.direccionIndex = -1;

		var precarga = new Promise((resolve, reject) => {
			this.precargaParams = resolve;
		});
		Promise.all([this.precarga, precarga]).then(values => {
			this.configuraciones = JSON.parse(JSON.stringify(this.acs.data.catalogo.empresa_config));
			this.gesempresaObtener(this.item.empresa_id);
		});

	}
	sub: any;
	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			if (params && params['id']) {
				this.item.empresa_id = Number(params['id']);
			}
			this.precargaParams();
		});
	}

	ngAfterViewInit() {
	}

	ngOnDestroy() {
	}

	trackById(index, item) {
		return item.id;
	}

	trackByFn(index, item) {
		return item.id;
	}

	public gesempresaObtener(empresa_id) {
		if (this.item.empresa_id) {
			this.aDMEmpresaService.gesempresaObtener({
				empresa_id: empresa_id
			}, (resp: pGesempresaObtener) => {
				console.log('resp:', resp)
				this.item = resp.empresa;
				this.item.estado = (this.item.estado) ? '1' : '0';
				this.item.suspendido = (this.item.suspendido) ? '1' : '0';
				this.direcciones = resp.direcciones;
				this.contactos = resp.contactos;
				this.unidad_negocio_selected();

				this.roles_empresa.forEach(function (val1) {
					resp.roles.forEach(function (val2) {
						if (val1.catalogo_id == val2.tipo_rol_id) {
							val1.seleccionado = true;
						}
					})
				});

				this.configuraciones.forEach(function (itemConf) {
					resp.configuracion.forEach(function (item) {
						if (itemConf.catalogo_id == item.tipo_configuracion_id) {
							itemConf.valor = item.valor;
						}
					})
				});
			});
		} else {
			this.item.unidad_negocio_id = this.cse.data.user.profile;
			this.unidad_negocio_selected();
		}
	}

	public unidad_negocio_selected() {
		this.tipo_doc_un = this.acs.data.catalogo.documento_unidad_negocio.filter(it => it.unidad_negocio_id == this.item.unidad_negocio_id);
		this.roles_empresa = JSON.parse(JSON.stringify(this.acs.data.catalogo.rol_empresa.filter(it => it.unidad_negocio_id == this.item.unidad_negocio_id)));
	}

	gesempresaEditar() {
		this.ohService.getOH().getUtil().confirm("Confirma guardar los datos", () => {

			if (this.item.empresa_id) {
				this.aDMEmpresaService.gesempresaEditar({
					empresa_id: this.item.empresa_id,
					documento: this.item.documento,
					razon_social: this.item.razon_social,
					razon_comercial: this.item.razon_comercial,
					direccion: this.item.direccion,
					longitud: this.item.longitud,
					latitud: this.item.latitud,
					usuario_modificacion_id: this.cse.data.user.data.userid,
					unidad_negocio_id: this.item.unidad_negocio_id,
					tipo_documento: this.item.tipo_documento,
					telefono: this.item.telefono,
					correo: this.item.correo,
					abreviatura: this.item.abreviatura,
					estado: this.item.estado,
					suspendido: this.item.suspendido,
					direcciones: this.getDirecciones(),
					contactos: this.getContactos(),
					roles: this.getRoles(),
					configuraciones: this.getConfiguraciones()
				}, (resp: pGesempresaEditar) => {
					this.responseMethod(resp, '../../');
				});
			} else {
				this.aDMEmpresaService.gesempresaRegistrar({
					documento: this.item.documento,
					razon_social: this.item.razon_social,
					razon_comercial: this.item.razon_comercial,
					direccion: this.item.direccion,
					longitud: this.item.longitud,
					latitud: this.item.latitud,
					usuario_registro_id: this.cse.data.user.data.userid,
					usuario_modificacion_id: this.cse.data.user.data.userid,
					unidad_negocio_id: this.item.unidad_negocio_id,
					tipo_documento: this.item.tipo_documento,
					telefono: this.item.telefono,
					correo: this.item.correo,
					abreviatura: this.item.abreviatura,
					direcciones: this.getDirecciones(),
					contactos: this.getContactos(),
					roles: this.getRoles(),
					configuraciones: this.getConfiguraciones()
				}, (resp: pGesempresaRegistrar) => {
					this.responseMethod(resp, '../');
				});

			}

		})

	}

	responseMethod(resp: any, lk_rt) {
		if (resp.resp_estado == 1) {
			this.ohService.getOH().getAd().success(resp.resp_mensaje);
			this.router.navigate([lk_rt], { relativeTo: this.route });
		} else {
			if (resp.resp_estado == 0) {
				this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
			} else {
				this.ohService.getOH().getAd().warning(resp.resp_mensaje);
			}
		}
	}

	public getRoles(): string {
		var xml = [];
		xml.push("<Roles>");
		for (var i in this.roles_empresa) {
			if (this.roles_empresa[i].seleccionado) {
				xml.push("<Rol>");
				xml.push("<tipo_rol_id>" + this.roles_empresa[i].catalogo_id + "</tipo_rol_id>");
				xml.push("</Rol>");
			}
		}
		xml.push("</Roles>");
		return xml.join("");
	}

	public getContactos(): string {
		var xml = [];
		xml.push("<Contactos>");
		for (var i in this.contactos) {
			xml.push("<Contacto>");
			xml.push("<tipo_contacto_id>" + this.contactos[i].tipo_contacto_id + "</tipo_contacto_id>");
			xml.push("<nombres>" + this.contactos[i].nombres + "</nombres>");
			xml.push("<apellido_paterno>" + this.contactos[i].apellido_paterno + "</apellido_paterno>");
			xml.push("<apellido_materno>" + this.contactos[i].apellido_materno + "</apellido_materno>");
			xml.push("<telefono>" + this.contactos[i].telefono + "</telefono>");
			xml.push("<correo>" + this.contactos[i].correo + "</correo>");
			xml.push("<empresa_contacto_id>" + this.contactos[i].empresa_contacto_id + "</empresa_contacto_id>");
			xml.push("</Contacto>");
		}
		xml.push("</Contactos>");
		return xml.join("");
	}

	public getDirecciones(): string {
		var xml = [];
		xml.push("<Direcciones>");
		for (var i in this.direcciones) {
			xml.push("<empresa_direccion>");
			xml.push("<empresa_direccion_id>" + this.direcciones[i].empresa_direccion_id + "</empresa_direccion_id>");
			xml.push("<ubigeo_id>" + ((this.direcciones[i].ubigeo_id) ? this.direcciones[i].ubigeo_id : 1) + "</ubigeo_id>");
			xml.push("<direccion>" + this.direcciones[i].direccion + "</direccion>");
			xml.push( this.direcciones[i].telefono != '' ? "<telefono>" + this.direcciones[i].telefono + "</telefono>" : '');
			xml.push( this.direcciones[i].correo != '' ? "<correo>" + this.direcciones[i].correo + "</correo>" : '');
			xml.push("<longitud>" + this.direcciones[i].longitud + "</longitud>");
			xml.push("<latitud>" + this.direcciones[i].latitud + "</latitud>");
			xml.push("<nombre>" + this.direcciones[i].nombre_lugar + "</nombre>");
			xml.push("<action>" + this.direcciones[i].action + "</action>");
			xml.push("<tipo_direccion_id>" + this.direcciones[i].tipo_direccion_id + "</tipo_direccion_id>");
			xml.push("</empresa_direccion>");
		}
		xml.push("</Direcciones>");
		return xml.join("");
	}

	public getConfiguraciones(): string {
		var xml = [];
		xml.push("<Configs>");
		for (var i in this.configuraciones) {
			if (this.configuraciones[i].valor && this.configuraciones[i].valor.length > 0) {
				xml.push("<Config>");
				xml.push("<tipo_configuracion_id>" + this.configuraciones[i].catalogo_id + "</tipo_configuracion_id>");
				xml.push("<valor>" + this.configuraciones[i].valor + "</valor>");
				xml.push("</Config>");
			}
		}
		xml.push("</Configs>");
		return xml.join("");
	}

	abrirModalContacto() {
		this.modalService.open(this.modalContacto).result.then((result) => {
			if (result == "Save") {
				if (this.contactoIndex == -1) {
					var dir = this.acs.data.catalogo.tipo_contacto.find(it => +it.catalogo_id == +this.contacto.tipo_contacto_id);
					this.contacto.tipo_contacto = dir.descripcion;
					this.contactos.push(this.contacto);
					this.contacto = {};
				} else {
					this.contactos[this.contactoIndex] = this.contacto;
					this.contactoIndex = -1;
					this.contacto = {};
				}
			}
		}, (reason) => {

		});

	}
	abrirModalDireccion(edit?) {
		if(!edit){
			this.direccion = {}
		}
		this.modalService.open(this.modalDireccion, { centered: true, size: 'lg', scrollable: true, backdrop: 'static' }).result.then((result) => {
			if (result == "Save") {
				if (this.direccionIndex == -1) {
					var dir = this.acs.data.catalogo.tipo_direccion.find(it => +it.catalogo_id == +this.direccion.tipo_direccion_id);
					this.direccion.tipo_direccion = dir.descripcion;
					console.log(this.direccion);
					this.direccion.action = 'I';
					this.direcciones.push(this.direccion);
					this.direccion = {};
				} else {
					this.direcciones[this.direccionIndex] = this.direccion;
					this.direccionIndex = -1;
					this.direccion = {};
				}
			}
		}, (reason) => {

		});
	}

	contactoEliminar(index: number) {
		this.contactos.splice(index, 1);
	}

	direccionEliminar(index: number) {
		if (this.direcciones[index].action == 'U') {
			this.direcciones[index].action = 'D';
		} else {
			this.direcciones.splice(index, 1);
		}
	}

	contactoEditar(index: number) {
		this.contactoIndex = index;
		this.contacto = Object.assign({}, this.contactos[index]);
		this.abrirModalContacto();
	}

	direccionEditar(index: number) {
		this.direccionIndex = index;
		this.direccion = Object.assign({}, this.direcciones[index]);
		this.abrirModalDireccion("editable");
	}
}
