import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { NgForm } from '@angular/forms';
import { ADMUsuarioServiceJPO, pSegusuarioRegistrarNuevo, pSegusuarioValidar } from 'src/app/module/ADM/service/adm.aDMUsuarioService';

declare var AesUtil: any;

@Component({
	templateUrl: './adm.userNew.html'
})
export class UserNew extends ADMBase {

	private aDMUsuarioService: ADMUsuarioServiceJPO;

	usuario: any;

	@ViewChild("inputPhoto", { static: true }) inputPhoto: ElementRef;
	@ViewChild('photo', { static: true }) photo: ElementRef;

	constructor(private router: Router, private route: ActivatedRoute, public coreService: CoreService, private ohService: OHService, public cse: CoreService, public acs: ADMCoreService) {

		super(ohService, cse, acs);
		this.aDMUsuarioService = new ADMUsuarioServiceJPO(ohService);
		this.limpiar();

	}

	ngOnInit() {
	}

	limpiar() {
		this.usuario = {
			datos: {
				estado: 1
			},
			empresas: "",
			empresa_id : ""
		};
	}

	registrar(form: NgForm) {
		if (form.valid) {
			this.aDMUsuarioService.segusuarioRegistrarNuevo({
				id: this.usuario.datos.id,
				correo: this.usuario.datos.correo,
				clave: new AesUtil().encrypt(this.usuario.datos.clave),
				nombres: this.usuario.datos.nombres,
				apellido_paterno: this.usuario.datos.apellido_paterno,
				apellido_materno: this.usuario.datos.apellido_materno,
				empresa_id: this.usuario.empresa_id,
				estado_usuario: this.usuario.datos.estado ? this.usuario.datos.estado : '0',
				usuario_id: this.cse.data.user.data.userid,
				empresas: this.usuario.empresas,
				roles: this.usuario.roles
			}, (resp: pSegusuarioRegistrarNuevo) => {
				if (resp.estado == 1) {
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.router.navigate(['../'], { relativeTo: this.route });
				} else {
					if (resp.estado == 0) {
						this.ohService.getOH().getLoader().showError(resp.mensaje);
					} else {
						this.ohService.getOH().getAd().warning(resp.mensaje);
					}
				}
			});
		}
	}

	validar : any = {
		id : {
			lista : [],
			indicador_buscando : false,
			indicador_pendiente : false
		},
		correo : {
			lista : [],
			indicador_buscando : false,
			indicador_pendiente : false
		}
	}

	correoCambiar(){
		this.usuario.datos.id = this.usuario.datos.correo.toUpperCase();
		//this.validarTipo('correo');
		//this.validarTipo('id');
	}

	validarTipo(tipo : string){
		if(this.usuario.datos[tipo].length >= 2){
			if(!this.validar[tipo].indicador_buscando){
				this.validarCorreoId(tipo, this.usuario.datos[tipo]);
			} else {
				this.validar[tipo].indicador_pendiente = true;
			}
		}
	}

	validarCorreoId(tipo : string, valor : string){
		this.validar[tipo].indicador_buscando = true;
		var busqueda = {};
			busqueda[tipo] = valor;
		this.aDMUsuarioService.segusuarioValidar(busqueda, (resp: pSegusuarioValidar[]) => {
			this.validar[tipo].lista = resp;
			this.validar[tipo].indicador_buscando = false;
			if(this.validar[tipo].indicador_pendiente){
				this.validar[tipo].indicador_pendiente = false;
				this.validarCorreoId(tipo, this.usuario.datos[tipo]);
			}
		});
	}

}