import { Component, HostListener  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from 'src/environments/environment';
import { shared } from 'src/environments/environmentShared';
import { OHService } from 'src/app/tis.ohService';
import { ohStorage } from 'src/app/ohCore/services/storage/oh.storage';
import { UserServiceJPO, pSegusuarioClaveRestaurar, pSegloginAcceder } from 'src/app/service/tis.userService';

declare var AesUtil: any;
declare var apmdata: any;

@Component({
  templateUrl: './ovn.login.html'
})
export class OVNLogin {

	user : any;

	private myStore : ohStorage;
	private userService : UserServiceJPO;
	currentPosition : any;
	sizeW : number;
	sizeWidthImg : string;

	restoreObj : any;

	constructor(private router: Router, private ohService : OHService, private title : Title, private modalService: NgbModal, private route: ActivatedRoute){

		this.myStore = new ohStorage();
		this.userService = new UserServiceJPO(ohService);

		this.user = {};
		this.currentPosition = {
			latitude : "",
			longitude : ""
		};
		if(localStorage.getItem("APM_DATA")){
			//this.router.navigate(['/Inlandnet']);
		}

		this.sizeW = 2;
		this.sizeWidthImg = "100%";

		this.restoreObj = {
			emailRestore : "",
			alertMsj : ""
		};

	}

	ngOnInit() {
		console.log("algo algo")

		this.ohService.getOH().getLoader().close();
		if(this.myStore.has("JPO_VERSION")){
			var myVer = this.myStore.get("JPO_VERSION");
			this.myStore.remove("JPO_VERSION");
			this.doEnter(myVer);
			return;
		} 

		this.title.setTitle(shared.proyect+" - Iniciar sesión");

		var geo_options = {
			enableHighAccuracy: true, 
			maximumAge        : 4000, 
			timeout           : 3000
		};
		
		if(navigator.geolocation) {
			var wpid = navigator.geolocation.watchPosition((position) => {
				this.currentPosition = position.coords;
			}, () => {
				//console.log("error");
			}, geo_options);
		}

		apmdata.render(this, window.innerHeight, window.innerWidth);

		var regId = "APM_LOGIN_SUCCESS";
		if(this.myStore.has(regId)){
			this.ohService.getOH().getAd().success(this.myStore.get(regId));
			this.myStore.remove(regId);
		}

		regId = "APM_CONFIRM_SUCCESS";
		if(this.myStore.has(regId)){
			this.ohService.getOH().getAd().success(this.myStore.get(regId));
			this.myStore.remove(regId);
		}

		regId = "APM_CONFIRM_ALERT";
		if(this.myStore.has(regId)){
			this.ohService.getOH().getAd().warning(this.myStore.get(regId));
			this.myStore.remove(regId);
		}

		regId = "APM_RESTORE_SUCCESS";
		if(this.myStore.has(regId)){
			this.ohService.getOH().getAd().success(this.myStore.get(regId));
			this.myStore.remove(regId);
		}

	}

	ngAfterViewInit(){
		apmdata.background();
	}
	  
	login(){
		var passwordEncripted = new AesUtil().encrypt(this.user.password);

		this.userService.segloginAcceder({
			Usuario : this.user.user,
			ClaveMD5 : passwordEncripted,
			Sistema_id : shared.systemId
		}, {
			AUT : {
				F : {
					clientId : "API_APM_INLANDNET",
					clientSecret : "33caa750333af31d49d39e9251ecb592",
					latitude : this.currentPosition.latitude,
					longitude : this.currentPosition.longitude,
					so : window["browserInfo"]["os"]+" "+window["browserInfo"]["osVersion"],
					browser : window["browserInfo"]["browser"]+" "+window["browserInfo"]["browserVersion"]
				}
			}
		}, (resp : pSegloginAcceder) => {
			
			if(resp.data){
				this.ohService.getOH().getLoader().show();
				resp['profile'] = ""+apmdata.getProfile(resp.profiles);
				resp['password'] = passwordEncripted;
				resp.data.id = resp.data.id.trim();
				resp.data.userid = resp.data.userid.trim();
				resp['sistema_id'] = shared.systemId;
				resp['origin'] = environment.hostLocal;
				
				if(resp.system){
					if(resp.system.version != apmdata.version){
						this.myStore.set("JPO_VERSION", resp);
						window.location.reload(true);
					} else {
						this.doEnter(resp);
					}
				} else {
					this.doEnter(resp);
				}

			} else {
				this.ohService.getOH().getAd().warning("Usuario o contraseña incorrecto");
			}
		})

/*
        this.oHSUserService.segloginAcceder({
            id : this.user.user,
            clave_md5 : passwordEncripted,
            sistema_id : shared.systemId
        }, {
			AUT : {
				F : {
					clientId : "API_APM_INLANDNET",
					clientSecret : "33caa750333af31d49d39e9251ecb592",
					latitude : this.currentPosition.latitude,
					longitude : this.currentPosition.longitude,
					so : window["browserInfo"]["os"]+" "+window["browserInfo"]["osVersion"],
					browser : window["browserInfo"]["browser"]+" "+window["browserInfo"]["browserVersion"]
				}
			}
		}, (resp : pSegloginAcceder) => {
			resp["systemByProfile"] = resp.systembyprofile;
			if(resp.data){
				this.ohService.getOH().getLoader().show();
				resp['profile'] = ""+apmdata.getProfile(resp.profiles);
				resp['password'] = passwordEncripted;
				resp.data.id = resp.data.id.trim();
				resp.data.userid = (""+resp.data.userid).trim();
				resp['origin'] = environment.hostLocal;
				
				if(resp.system){
					if(resp.system.version != apmdata.version){
						this.myStore.set("JPO_VERSION", resp);
						window.location.reload(true);
					} else {
						this.doEnter(resp);
					}
				} else {
					this.doEnter(resp);
				}

			} else {
				this.ohService.getOH().getAd().warning("Usuario o contraseña incorrecto");
			}

		});
		*/
	}

	doEnter(resp : any){
		console.log("test");
		var add = "";
		//f(environment.env=="local"){
		//	var beData = new AesUtil().encrypt(JSON.stringify(resp));
		//	add = "?be="+encodeURIComponent(beData);
		//} else {
			this.myStore.set("APM_DATA", resp);
		//}
		//window.location.href = environment.protocol+"://"+apmdata.host_be+add;
		this.router.navigate(["/be"], { relativeTo: this.route });
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		apmdata.render(this, event.target.innerHeight, event.target.innerWidth);
	}

	openRestorePassword(content) {
		this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
			if(result=="restore"){

			}
		});
	}

	restore(eventClose : any){
		this.userService.segusuarioClaveRestaurar({
			Correo : this.restoreObj.emailRestore,
			Enlace : environment.protocol+"://"+environment.hostLocal+"/#/PasswordRestore"
		}, (resp : pSegusuarioClaveRestaurar)=> {
			if(resp.estado == 1){
				this.ohService.getOH().getAd().success({
					mensaje : resp.mensaje,
					timeSeconds : 7,
					showClose : false
				});
				this.restoreObj = {
					emailRestore : "",
					alertMsj : ""
				};
				eventClose();
			} else {
				if(resp.estado == 0){
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.restoreObj.alertMsj = resp.mensaje;
				}
			}
		})
	}

}