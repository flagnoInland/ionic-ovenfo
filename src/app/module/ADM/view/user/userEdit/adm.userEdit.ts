import { Component, ViewChild, ElementRef } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { NgForm } from '@angular/forms';
import { ADMUsuarioServiceJPO, pSegusuarioObtenerEditar, pSegusuarioEditarNuevo, pSegusuarioEmailPlantillaRegistrar, pSegusuarioClaveCambiar, pSegusuarioRolRegistrar, pSegusuarioValidar } from 'src/app/module/ADM/service/adm.aDMUsuarioService';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServiceJPO, pSegusuarioFotoAdjuntar, pSegusuarioFotoEliminar } from 'src/app/service/tis.userService';

declare var AesUtil: any;

@Component({
	templateUrl: './adm.userEdit.html'
})
export class UserEdit extends ADMBase {

	private userService: UserServiceJPO;
	private aDMUsuarioService: ADMUsuarioServiceJPO;
	
	usuario: any;
	empresas: any;
	email_config: any;
	roles : any
	editarId : boolean;

	@ViewChild("inp_foto", { static: true }) inp_foto: ElementRef;

	constructor(private router: Router, private route: ActivatedRoute, public coreService: CoreService, private ohService: OHService, public cse: CoreService, public acs: ADMCoreService) {

		super(ohService, cse, acs);
		this.aDMUsuarioService = new ADMUsuarioServiceJPO(ohService);
		this.userService = new UserServiceJPO(ohService);
		this.roles = "";
		this.limpiar();

	}

	sub: any;
	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.obtener(Number(params.id));
		});
	}

	base : any = {
		correo : "",
		id : ""
	};
	
	obtener(usuario_id: number) {
		this.aDMUsuarioService.segusuarioObtenerEditar({
			Usuario_id: usuario_id
		}, (resp: pSegusuarioObtenerEditar) => {
			
			// 1.- Datos de usuario
			this.usuario.datos = resp.usuario;

			this.base.correo = ""+resp.usuario.correo;
			this.base.id = ""+resp.usuario.id;

			this.usuario.datos.estado = Number(this.usuario.datos.estado);

			// 2.- Empresas por usuario
			this.empresas = resp.empresas;
			var empSeleccionada = this.empresas.find(it => it.empresa_id == this.usuario.datos.empresa_id);
			if (empSeleccionada) {
				empSeleccionada.principal = true;
			}

			// 3.- Email config por usuario
			this.email_config = resp.email_disponibles;
			for(var i in resp.email_configuracion){
				var emails = this.email_config.find(it => it.email_plantilla_id == resp.email_configuracion[i].email_plantilla_id);
				if(emails){
					emails["activo"] = true;
					emails["estado"] = resp.email_configuracion[i].estado;
					emails["habilitado"] = resp.email_configuracion[i].habilitado;
				}
			}
			
		});
	}

	limpiar() {
		this.usuario = {
			datos: {
				estado: 1,
				empresa_id : ""
			},
			empresas: "",
			emailConfig : [],
			cambioclave : {}
		};
		this.email_config = [];
	}

	registrar(form: NgForm) {
		if (form.valid) {
			this.aDMUsuarioService.segusuarioEditarNuevo({
				usuario_id: this.usuario.datos.usuario_id,
				id: this.usuario.datos.id,
				editar_id : this.editarId?'1':'0',
				correo: this.usuario.datos.correo,
				nombres: this.usuario.datos.nombres,
				apellido_paterno: this.usuario.datos.apellido_paterno,
				apellido_materno: this.usuario.datos.apellido_materno,
				empresa_id: this.usuario.datos.empresa_id,
				estado_usuario: this.usuario.datos.estado ? this.usuario.datos.estado : '0',
				usuario_edicion_id: this.cse.data.user.data.userid,
				empresas: this.usuario.empresas
			}, (resp: pSegusuarioEditarNuevo) => {
				if (resp.estado == 1) {
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.router.navigate(['../../'], { relativeTo: this.route });
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

	fotoSubir(event: any) {
		this.userService.segusuarioFotoAdjuntar({
			Usuario_id: this.usuario.datos.usuario_id
		}, {
				photo: event.target.files[0]
			}, (percent: number) => {
				//console.log(percent);
			}, (resp: pSegusuarioFotoAdjuntar) => {
				this.usuario.datos.adjunto_id = resp.Adjunto_id;
				this.usuario.fotoBase64 = 'data:image/jpg;base64,' + resp.Archivo_base64;
			})
	}

	fotoEliminar() {
		this.userService.segusuarioFotoEliminar({
			Usuario_id: this.usuario.datos.usuario_id,
			Adjunto_id: this.usuario.datos.adjunto_id
		}, (resp: pSegusuarioFotoEliminar) => {
			if (resp.estado == 1) {
				this.usuario.datos.adjunto_id = null;
				this.inp_foto.nativeElement.src = null;
				this.ohService.getOH().getAd().success(resp.mensaje);
			} else {
				if (resp.estado == 0) {
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			}
		})
	}

	emailActualizar() {

		this.usuario.emailConfig = [];
		for (var i in this.email_config) {
			if(this.email_config[i].activo){
				this.usuario.emailConfig.push({
					email_plantilla_id: this.email_config[i].email_plantilla_id,
					habilitado: (this.email_config[i].habilitado)?'1':'0',
					estado: (this.email_config[i].estado)?'1':'0',
				});
			}
		}

        this.aDMUsuarioService.segusuarioEmailPlantillaRegistrar({
            usuario_id : this.usuario.datos.usuario_id,
            emailconfig : this.ohService.getOH().getUtil().getXMLString(this.usuario.emailConfig, "Email")
        }, (resp : pSegusuarioEmailPlantillaRegistrar) => {
			if (resp.estado == 1) {
				this.ohService.getOH().getAd().success(resp.mensaje);
			} else {
				if (resp.estado == 0) {
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			}
        });

	}

	// 3,- Cambiar clave
	claveCambiar(form: NgForm){
		if(form.valid){
			this.aDMUsuarioService.segusuarioClaveCambiar({
				Usuario_id : this.usuario.datos.usuario_id, 
				Clave : new AesUtil().encrypt(this.usuario.cambioclave.clave),
				Origen : "IND"
			}, (resp : pSegusuarioClaveCambiar) => {
				if (resp.estado == 1) {
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.usuario.datos.caducidad_clave = 60;
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

	// 4,- Accesos
	rolRegistrar(){
		this.aDMUsuarioService.segusuarioRolRegistrar({
            usuario_id : this.usuario.datos.usuario_id,
            roles : this.roles
        }, (resp : pSegusuarioRolRegistrar) => {
			if (resp.estado == 1) {
				this.ohService.getOH().getAd().success(resp.mensaje);
			} else {
				if (resp.estado == 0) {
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			}
        });
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
		//this.validarTipo('correo');
		if(this.editarId){
			this.usuario.datos.id = this.usuario.datos.correo.toUpperCase();
			//this.validarTipo('id');
		}
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
			this.validar[tipo].lista = resp.filter(it => it[tipo] != this.base[tipo]);
			this.validar[tipo].indicador_buscando = false;
			if(this.validar[tipo].indicador_pendiente){
				this.validar[tipo].indicador_pendiente = false;
				this.validarCorreoId(tipo, this.usuario.datos[tipo]);
			}
		});
	}

}