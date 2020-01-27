import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Jpo } from './../../ohCore/services/oh.core';

import { OHService } from './../../tis.ohService';
import { CoreService } from './../../ind.coreService';
import { LoginServiceJPO, pDbowevUpdCambioclave } from 'src/app/service/tis.loginService';

declare var AesUtil: any;

@Component({
  templateUrl: './ind.passwordChange.html'
})
export class PasswordChange implements OnInit {

  private loginService : LoginServiceJPO;
  daysChange : number;
  passwords : any;
  jpo : Jpo;

  passwordEncript : string;

	constructor(public coreService : CoreService, private ohService : OHService){
    this.passwords = {};
    this.loginService = new LoginServiceJPO(ohService);
  }
  
  ngOnInit(){
    this.daysChange = this.coreService.data.user.data.daysChangekey;
  }

  submitChangePW(frm: NgForm) {
    if(frm.valid){
      var newPW = new AesUtil().encrypt(this.passwords.new);
      this.loginService.dbowevUpdCambioclave({
        Usuario : this.coreService.data.user.data.userid,
        Clave : newPW,
        Origen : this.coreService.data.user.data.source
      }, (resp: pDbowevUpdCambioclave) => {
        if(resp.estado){
          this.coreService.data.user.data.daysChangekey = 60;
          this.daysChange = 60;
          this.coreService.data.user.password = newPW;
          window.localStorage.setItem("APM_DATA", JSON.stringify(this.coreService.data.user));
          this.ohService.getOH().getAd().success("Contraseña cambiada corréctamente");
          frm.reset();
        } else {
					this.ohService.getOH().getAd().success(resp.mensaje);
        }
      })
    }
  }

}