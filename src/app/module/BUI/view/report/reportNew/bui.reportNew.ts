import { Component, OnInit, ViewChild } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { ADMRolServiceJPO, pSegrolListar } from 'src/app/module/ADM/service/adm.aDMRolService';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BUIReporteServiceJPO, pGesreporteRegistrar } from '../../../service/bui.bUIReporteService';
import { ActivatedRoute, Router } from '@angular/router';
import { DragulaService } from 'ng2-dragula';

@Component({
	templateUrl: './bui.reportNew.html'
})
export class ReportNew extends BUIBase implements OnInit {

	private aDMRolService : ADMRolServiceJPO;
	private bUIReporteService : BUIReporteServiceJPO;

	@ViewChild("modalParametro", { static: true }) modalParametro: NgbModalRef;
	item : any;
	descripConfig : any;
	parametrosFijos : any;
	itemParam : any;
	tipoParam : any;
	roles : any;
	rolesSeleccionados : any;

	constructor(private ohService : OHService, public cse : CoreService, public bcs : BUICoreService, private route: ActivatedRoute, private router : Router, private modalService: NgbModal){
		super(ohService, cse, bcs);

		this.aDMRolService = new ADMRolServiceJPO(ohService);
		this.bUIReporteService = new BUIReporteServiceJPO(ohService);
		this.item = {
			estado : "1",
			parametros : []
		};
		
		this.roles = [];

		this.descripConfig = cse.tinymceConfig;
		this.tipoParam = [];
		this.tipoParam.push({
			id : 1,
			value : "Caja de texto"
		});
		this.tipoParam.push({
			id : 2,
			value : "Valor numérico"
		});
		this.tipoParam.push({
			id : 3,
			value : "Opciones"
		});
		this.tipoParam.push({
			id : 4,
			value : "Fecha"
		});
		this.tipoParam.push({
			id : 5,
			value : "Rango de fechas"
		});
		this.tipoParam.push({
			id : 6,
			value : "Condicional"
		});
		this.tipoParam.push({
			id : 7,
			value : "Busqueda"
		});

		this.parametrosFijos = [];
		this.parametrosFijos.push({
			parametroTipo : "fixed",
			etiqueta : "Unidad de negocio",
			variable : "pf_unidad_negocio_id"
		});
		this.parametrosFijos.push({
			parametroTipo : "fixed",
			etiqueta : "Usuario Código",
			variable : "pf_usuario_id"
		});
		this.parametrosFijos.push({
			parametroTipo : "fixed",
			etiqueta : "Usuario Id",
			variable : "pf_usuario_identificador"
		});

		this.menu_proyectos_listar();
	}


	ngOnInit(){
		this.listRoles(() => {

		});
	}

	register(frmRegister : any){
		if(frmRegister.valid){
			var parametros = this.item.parametros.concat(this.parametrosFijos.filter(it => it.seleccionado == true));

			this.bUIReporteService.gesreporteRegistrar({
				Menu_id : this.item.menu_id,
				Nombre : this.item.nombre,
				Descripcion : this.item.descripcion,
				Parametros : JSON.stringify(parametros),
				nombre_store : this.item.nombre_store,
				EstadoReporte : this.item.estado,
				Usuario_id : this.cse.data.user.data.userid,
				Roles_id : this.getRoles()
			}, (resp : pGesreporteRegistrar) => {
				if (resp.estado == 1) {
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.router.navigate(['../'], { relativeTo: this.route });
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			});

		}
	}

	getRoles() : string {
		var xml = [];
		xml.push("<Roles>");
			for(var i in this.roles){
				if(this.roles[i].seleccionado){
					xml.push("<Rol>");
					xml.push("<rol_id>"+this.roles[i].rol_id+"</rol_id>");
					xml.push("</Rol>");
				}
			}
		xml.push("</Roles>");
		return xml.join("");
	}

	parametroNuevo(){
		this.paramIndex = -1;
		this.itemParam = {
			parametroTipo : "dynamic",
			obligatorio : "0",
			opciones : []
		};
		this.abrirModal();
	}

	parametroEliminar(index : number){
		this.item.parametros.splice(index, 1);
	}

	paramIndex : any;
	parametroEditar(index : number){
		this.paramIndex = index;
		this.itemParam = Object.assign({}, this.item.parametros[index]);
		this.abrirModal();
	}

	abrirModal(){
		this.modalService.open(this.modalParametro).result.then((result) => {
			if(result=="Save"){
				this.itemParam.tipo_nombre = this.tipoParam.find(it => it.id == this.itemParam.tipo).value;
				if(this.paramIndex == -1){
					this.item.parametros.push(this.itemParam);
				} else {
					this.item.parametros[this.paramIndex] = this.itemParam;
				}
			} 
		}, (reason) => {

		});
	}

	opcionAgregar(){
		this.itemParam.opciones.push({});
	}

	opcionQuitar(index : any){
		this.itemParam.opciones.splice(index, 1);
	}

	listRoles(call ?: any){
        this.aDMRolService.segrolListar({
        }, (resp : pSegrolListar) => {
			this.roles = resp.roles;
			if(call){
				call();
			}
        });
	}

	selects(){
		this.rolesSeleccionados = this.roles.filter(rol => rol.seleccionado == true).length;
	}

	clean(){
		
	}

}