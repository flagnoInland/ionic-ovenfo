import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';
import { shared } from 'src/environments/environmentShared';
import { UserServiceJPO, pSegusuarioRegistrar } from 'src/app/service/tis.userService';
import { OHService } from 'src/app/tis.ohService';
import { ohStorage } from 'src/app/ohCore/services/storage/oh.storage';

declare var AesUtil: any;

@Component({
  templateUrl: './ovn.register.html'
})
export class OVNRegister {

	private userService : UserServiceJPO;
	private myStore : ohStorage;

	dateRegister : any = {};

	constructor(private router: Router, private ohService : OHService, private title : Title){

		this.userService = new UserServiceJPO(ohService);
		this.myStore = new ohStorage();

		if(localStorage.getItem("APM_DATA")){
			this.router.navigate(['/Inlandnet']);
		}
		
	}

	ngOnInit() {
		this.title.setTitle(shared.proyect+" - Registrar usuario");
	}

	register(frm: NgForm){
		if(frm.valid){
			var passwordEncripted = new AesUtil().encrypt(this.dateRegister.password);
			this.userService.segusuarioRegistrar({
				Nombre : this.dateRegister.name.toUpperCase(),
				Apellido_paterno : this.dateRegister.lastName.toUpperCase(),
				Apellido_materno : this.dateRegister.middleName.toUpperCase(),
				Correo : this.dateRegister.email.toUpperCase(),
				Clave : passwordEncripted,
				Ruc : this.dateRegister.RUC.toUpperCase(),
				Empresa : this.dateRegister.company.toUpperCase(),
				Enlace : environment.protocol+"://"+environment.hostLocal+"/#/PasswordConfirm",
				Pais_id : 2,
				Origen : "COP"
			}, (resp : pSegusuarioRegistrar) => {
				if(resp.estado == 1){
					frm.resetForm({});
					this.myStore.set("APM_LOGIN_SUCCESS",{
						mensaje : resp.mensaje,
						timeSeconds : 12,
						showClose : false
					});
					this.router.navigate(['/Login']);
				} else {
					if(resp.estado == 0){
						this.ohService.getOH().getLoader().showError(resp.mensaje);
					} else {
						this.ohService.getOH().getAd().warning(resp.mensaje);
					}
				}
			});
		}
	}

}