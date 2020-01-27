import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { UserServiceJPO, pSegusuarioConfirmar } from 'src/app/service/tis.userService';
import { OHService } from 'src/app/tis.ohService';
import { shared } from 'src/environments/environmentShared';
import { ohStorage } from 'src/app/ohCore/services/storage/oh.storage';

@Component({
  templateUrl: './ovn.passwordConfirm.html'
})
export class OVNPasswordConfirm {

	private userService : UserServiceJPO;
	private myStore : ohStorage;

	constructor(private router: Router, private ohService : OHService, private activatedRoute: ActivatedRoute, private title : Title){

		this.userService = new UserServiceJPO(ohService);
		this.myStore = new ohStorage();

		if(localStorage.getItem("APM_DATA")){
			this.router.navigate(['/Inlandnet']);
		}

		var key = this.activatedRoute.snapshot.queryParams.keyConfirm;
		if(key){
			this.confirm(key);
		}

	}

	ngOnInit() {
		this.title.setTitle(shared.proyect+" - Confirmación de usuario");
	}
	
	confirm(key : string){
		this.userService.segusuarioConfirmar({
			Clave : key,
		}, (resp : pSegusuarioConfirmar) => {
			if(resp.estado == 1){
				this.myStore.set("APM_CONFIRM_SUCCESS", {
					mensaje : resp.mensaje,
					timeSeconds : 5,
					showClose : false
				});
				this.router.navigate(['/Login']);
			} else {
				if(resp.estado == 0){
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.myStore.set("APM_CONFIRM_ALERT", {
						mensaje : resp.mensaje,
						timeSeconds : 5,
						showClose : false
					});
					this.router.navigate(['/Login']);
				}
			}
		});
	}

}