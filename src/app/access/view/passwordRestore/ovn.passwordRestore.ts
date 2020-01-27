import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NgForm } from '@angular/forms';
import { UserServiceJPO, pSegusuarioClaveValidar, pSegusuarioClaveReestablecer } from 'src/app/service/tis.userService';
import { OHService } from 'src/app/tis.ohService';
import { shared } from 'src/environments/environmentShared';
import { ohStorage } from 'src/app/ohCore/services/storage/oh.storage';

declare var AesUtil: any;

@Component({
  templateUrl: './ovn.passwordRestore.html'
})
export class OVNPasswordRestore {

	private userService : UserServiceJPO;
	private myStore : ohStorage;

	keyEmail : string;
	showRestore : boolean;
	userName : string;

	dateRestore : any;

	alerted : boolean = false;
	alertedMsj : string;

	constructor(private router: Router, private ohService : OHService, private activatedRoute: ActivatedRoute, private title : Title){

		this.userService = new UserServiceJPO(ohService);
		this.myStore = new ohStorage();

		this.dateRestore = {};

		if(localStorage.getItem("APM_DATA")){
			this.router.navigate(['/Inlandnet']);
		}

		var key = this.activatedRoute.snapshot.queryParams.keyRestore;
		if(key){
			this.validRestore(key);
		}

	}

	ngOnInit() {
		this.title.setTitle(shared.proyect+" - Restablecer contraseña");
	}
	
	validRestore(key : string){
		this.userService.segusuarioClaveValidar({
			Correo : key
		}, (resp : pSegusuarioClaveValidar) => {
			this.keyEmail = key;
			if(resp.estado == 1){
				this.showRestore = true;
				this.userName = resp.mensaje;
			} else {
				if(resp.estado == 0){
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.alerted = true;
					this.alertedMsj = resp.mensaje;
				}
			}
		})
	}

	change(frm: NgForm){
		var passwordEncripted = new AesUtil().encrypt(this.dateRestore.password);
		this.userService.segusuarioClaveReestablecer({
			Correo : this.keyEmail,
			Clave : passwordEncripted,
		}, (resp : pSegusuarioClaveReestablecer) => {
			if(resp.estado == 1){
				frm.resetForm({});
				this.myStore.set("APM_RESTORE_SUCCESS",{
					mensaje : resp.mensaje,
					timeSeconds : 5,
					showClose : false
				});
				this.router.navigate(['/Login']);
			} else {
				if(resp.estado == 0){
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.alerted = true;
					this.alertedMsj = resp.mensaje;
				}
			}
		});
	}

}