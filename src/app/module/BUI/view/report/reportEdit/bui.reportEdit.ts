import { Component, OnInit, ViewChild } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ADMRolServiceJPO, pSegrolListar } from 'src/app/module/ADM/service/adm.aDMRolService';
import { BUIReporteServiceJPO, pGesreporteEditar, pGesreporteObtener } from '../../../service/bui.bUIReporteService';
import { ActivatedRoute, Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula';

@Component({
	templateUrl: './bui.reportEdit.html'
})
export class ReportEdit extends BUIBase implements OnInit {

	private aDMRolService: ADMRolServiceJPO;
	private bUIReporteService : BUIReporteServiceJPO;

	@ViewChild("modalParametro", { static: true }) modalParametro: NgbModalRef;

	item: any;
	descripConfig: any;
	parametrosFijos: any;
	itemParam: any;
	tipoParam: any;
	roles: any;
	rolesSeleccionados: any;
	
	constructor(private ohService : OHService, public cse : CoreService, public bcs : BUICoreService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal){
		super(ohService, cse, bcs);

		this.aDMRolService = new ADMRolServiceJPO(ohService);
		this.bUIReporteService = new BUIReporteServiceJPO(ohService);

		this.item = {
			estado: "1",
			parametros: []
		};

		this.roles = [];

		this.descripConfig = cse.tinymceConfig;
		this.tipoParam = [];
		this.tipoParam.push({
			id: 1,
			value: "Caja de texto"
		});
		this.tipoParam.push({
			id: 2,
			value: "Valor numérico"
		});
		this.tipoParam.push({
			id: 3,
			value: "Opciones"
		});
		this.tipoParam.push({
			id: 4,
			value: "Fecha"
		});
		this.tipoParam.push({
			id: 5,
			value: "Rango de fechas"
		});
		this.tipoParam.push({
			id: 6,
			value: "Condicional"
		});
		this.tipoParam.push({
			id: 7,
			value: "Busqueda"
		});

		this.parametrosFijos = [];
		this.parametrosFijos.push({
			parametroTipo: "fixed",
			etiqueta: "Unidad de negocio",
			variable: "pf_unidad_negocio_id"
		});
		this.parametrosFijos.push({
			parametroTipo: "fixed",
			etiqueta: "Usuario Código",
			variable: "pf_usuario_id"
		});
		this.parametrosFijos.push({
			parametroTipo: "fixed",
			etiqueta: "Usuario Id",
			variable: "pf_usuario_identificador"
		});
		
		this.menu_proyectos_listar();
	}

	
	sub: any;
	ngOnInit() {
		this.listRoles(() => {
			this.sub = this.route.params.subscribe(params => {
				this.obtener(Number(params['id']));
			});
		});
	}

	obtener(reporte_id: number) {
		this.bUIReporteService.gesreporteObtener({
			reporte_id: reporte_id
		}, (resp: pGesreporteObtener) => {
			this.item = resp.reporte;
			this.item.estado = (this.item.estado) ? '1' : '0';

			var parametros = JSON.parse(this.item.parametros);
			this.item.parametros = parametros.filter(it => it.parametroTipo == "dynamic");

			for (var i in this.parametrosFijos) {
				var fixed = parametros.find(it => it.parametroTipo == "fixed" && it.variable == this.parametrosFijos[i].variable);
				if (fixed) {
					this.parametrosFijos[i].seleccionado = true;
				}
			}

			for (var i in resp.roles) {
				var elem = this.roles.find(item => item.rol_id == resp.roles[i].rol_id);
				if (elem) {
					elem.seleccionado = true;
				}
			}
		});
	}

	register(frmRegister: any) {
		if (frmRegister.valid) {
			var parametros = this.item.parametros.concat(this.parametrosFijos.filter(it => it.seleccionado == true));

			this.bUIReporteService.gesreporteEditar({
				reporte_id: this.item.reporte_id, // Optional
				Menu_id: this.item.menu_id,
				Nombre: this.item.nombre,
				Descripcion: this.item.descripcion,
				Parametros: JSON.stringify(parametros),
				nombre_store: this.item.nombre_store,
				EstadoReporte: this.item.estado,
				Usuario_id: this.cse.data.user.data.userid,
				Roles_id: this.getRoles()
			}, (resp: pGesreporteEditar) => {
				if (resp.estado == 1) {
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.router.navigate(['../../'], { relativeTo: this.route });
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			});
		}
	}

	getRoles(): string {
		var xml = [];
		xml.push("<Roles>");
		for (var i in this.roles) {
			if (this.roles[i].seleccionado) {
				xml.push("<Rol>");
				xml.push("<rol_id>" + this.roles[i].rol_id + "</rol_id>");
				xml.push("</Rol>");
			}
		}
		xml.push("</Roles>");
		return xml.join("");
	}

	parametroNuevo() {
		this.paramIndex = -1;
		this.itemParam = {
			obligatorio: "0",
			parametroTipo: "dynamic",
			opciones: []
		};
		this.abrirModal();
	}

	parametroEliminar(index: number) {
		this.item.parametros.splice(index, 1);
	}

	paramIndex: any;
	parametroEditar(index: number) {
		this.paramIndex = index;
		this.itemParam = Object.assign({}, this.item.parametros[index]);
		this.abrirModal();
	}

	abrirModal() {
		this.modalService.open(this.modalParametro).result.then((result) => {
			if (result == "Save") {
				this.itemParam.tipo_nombre = this.tipoParam.find(it => it.id == this.itemParam.tipo).value;
				if (this.paramIndex == -1) {
					this.item.parametros.push(this.itemParam);
				} else {
					this.item.parametros[this.paramIndex] = this.itemParam;
				}
			}
		}, (reason) => {

		});
	}

	opcionAgregar() {
		this.itemParam.opciones.push({});
	}

	opcionQuitar(index: any) {
		this.itemParam.opciones.splice(index, 1);
	}

	listRoles(call?: any) {
		this.aDMRolService.segrolListar({
		}, (resp: pSegrolListar) => {
			this.roles = resp.roles;
			if (call) {
				call();
			}
		});
	}

	selects() {
		this.rolesSeleccionados = this.roles.filter(rol => rol.seleccionado == true).length;
	}

	clean() {

	}

}
