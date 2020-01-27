import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ohStorage } from './ohCore/services/oh.core';
import { environment } from 'src/environments/environment';
import { shared } from 'src/environments/environmentShared';
import { OHService } from './tis.ohService';
import { LoginServiceJPO, pDbowevLisMenu } from './service/tis.loginService';
import { INLANDmain } from './firebase/main';
import { AngularFirestore } from '@angular/fire/firestore';
import { FIRECatalogo } from './firebase/catalogo';
import { AngularFireStorage } from '@angular/fire/storage';
import { INLANDimagen } from './firebase/storage_imagen';

declare var apmdata: any;

export interface csConfig { disableSeparator: boolean, jpo: any, formatDate: string, formatDateTime: string, mensajeRecarga: string, openMenu: boolean};

@Injectable({
	providedIn: 'root'
})
export class CoreService {

	precarga : Promise<any>;
	private loginService: LoginServiceJPO;
	public data: any = {};
	public config: csConfig;
	private myStorage: ohStorage;
	public inland_main : INLANDmain;
	public inland_imagen : INLANDimagen;
	public adm_catalogo : FIRECatalogo;

    public params : any = {
        estado : {
            activo : 20253,
            inactivo : 20254
        }
	}
	
	constructor(db: AngularFirestore, private router: Router, private ohService: OHService, fireStore: AngularFireStorage) {

		this.config = {
			disableSeparator: false,
			jpo: null,
			formatDate: "",
			formatDateTime: "",
			mensajeRecarga: "Los cambios que haces no serán guardados",
			openMenu: false
		};
		this.data.onBeforeUnload = false;
		this.myStorage = new ohStorage();
		this.inland_main = new INLANDmain(db, environment.firebase_coleccion_base, shared.firebase_main);
		this.adm_catalogo = new FIRECatalogo(db, environment.firebase_coleccion_base, "ADM");

 		this.precarga = new Promise((resolve, reject) => {
			this.inland_imagen = new INLANDimagen(fireStore, environment.firebase_coleccion_base, ohService);
            resolve();
		});
	}

	private roles: any;
	public buildMenu(companyId?: string, systemId?: string) {
		this.data.user = JSON.parse(localStorage.getItem("APM_DATA"));
		this.roles = [];

		var validSyPr = true;
		var systemIndex = {};
		if (!this.data.user.systemByProfile || (this.data.user.systemByProfile && this.data.user.systemByProfile.length == 1 && this.data.user.systemByProfile[0].systemId.length == 0)) {
			validSyPr = false;
		} else {
			var filtered = this.data.user.systemByProfile.filter(sypr => sypr.profileId == this.data.user.profile);
			for (var e in filtered) {
				systemIndex[filtered[e].systemId] = true;
			}
		}

		for (var i = 0; i < this.data.user.systems.length; i++) {
			var item = this.data.user.systems[i];
			if (item.id && ((validSyPr && systemIndex[item.id.trim()]) || !validSyPr)) {
				this.roles.push({
					id: item.id.trim(),
					type: 1, // PROYECT
					url: item.id.trim(),
					name: item.description,
					icon: item.icon
				});
			}
		}

		if (companyId && systemId) {
			if (this.data.user["subSystems"] && this.data.user["subSystems"][companyId] && this.data.user["subSystems"][companyId][systemId]) {
				var companySystem = this.data.user["subSystems"][companyId][systemId];
				for (i = 0; i < companySystem.length; i++) {
					var item = this.data.user["subSystems"][companyId][systemId][i];
					this.roles.push({
						id: item.id.trim(),
						idParent: item.parentId.trim(),
						type: 2, // PROYECT
						url: item.url.trim(),
						name: item.description,
						icon: item.icon,
						hasId: (item.hasId && item.hasId == '1') ? true : false
					});
				}
			}
		}
		this.data.routeRol = this.buildMenuRouteRol();
		this.myStorage.add("APM_DATA", "routeRol", this.data.routeRol);
		this.data.routeId = {};
		this.data.roles = this.roles;
	}

	tmpList: any = [];
	private buildMenuRouteRol() {
		let routeRol: any = {};
		for (var i = 0; i < this.roles.length; i++) {
			this.roles[i].urlTree = '/Be' + this.buildMenuURLTree(this.roles[i].id);
		}
		for (i = 0; i < this.roles.length; i++) {
			this.tmpList = [];
			this.buildMenuTree(this.roles[i].id);
			routeRol[this.roles[i].urlTree] = {
				id: this.roles[i].id,
				list: this.tmpList,
				hasId: this.roles[i].hasId ? true : false
			};
		}
		return routeRol;
	}

	private buildMenuURLTree(id: any) {
		for (var i = 0; i < this.roles.length; i++) {
			if (this.roles[i].id == id) {
				let preUrl: string = "";
				if (this.roles[i].idParent) {
					preUrl += this.buildMenuURLTree(this.roles[i].idParent);
				}
				if (this.roles[i].hasId) {
					preUrl += "/" + this.roles[i].url; // +"/{id}"
				} else {
					preUrl += "/" + this.roles[i].url;
				}
				return preUrl;
			}
		}
	}

	private buildMenuTree(id: any) {
		for (var i = 0; i < this.roles.length; i++) {
			if (this.roles[i].id == id) {
				this.tmpList.push(this.roles[i]);
				if (this.roles[i].idParent) {
					this.buildMenuTree(this.roles[i].idParent);
				}
			}
		}
	}

	public setUserOptions(uo: any) {
		this.data.uo = uo;
		this.data.uo_id = {};
		for (var i = 0; i < uo.length; i++) {
			this.data.uo_id[uo[i].url] = i;
		}
	}

	getUO() {
		let uo: any = [];
		uo.push({
			name: "Preferencias",
			icon: "far fa-address-card",
			url: "/" + shared.baseBackEnd + "/Preferences"
		});
		uo.push({
			name: "Cambiar contraseña",
			icon: "fas fa-key",
			url: "/" + shared.baseBackEnd + "/PasswordChange"
		});
		uo.push({
			name: "Reportes",
			icon: "fas fa-file-excel",
			url: "/" + shared.baseBackEnd + "/Report"
		});
		if (this.data.user.terms) {
			this.data.user.terms.forEach(element => {
				if (element.unidad_negocio_id == this.data.user.profile) {
					uo.push({
						name: "Términos & Condiciones",
						icon: "fas fa-file-contract",
						url: "/" + shared.baseBackEnd + "/TermsConditions"
					});
				}
			});
		}

		if (this.data.user.faqs) {
			this.data.user.faqs.forEach(element => {
				if (element.unidad_negocio_id == this.data.user.profile) {
					uo.push({
						name: "FAQs",
						icon: "fas fa-question-circle",
						url: "/" + shared.baseBackEnd + "/Faqs"
					});
				}
			});
		}
		return uo;
	}

	public getTreeChild(url: string) {
		var treeChild = [];
		if (this.data.routeRol[url]) {
			treeChild.push(Object.assign({}, this.data.routeRol[url].list[0]));
			treeChild[0].isMain = true;
		}

		for (var i in this.data.routeRol) {
			var ind = i.indexOf(url);
			if (ind != -1 && ind == 0) {
				var subPart = i.substr(url.length);
				if (subPart != "") {
					var subParts = subPart.split("/");
					if (subParts.length == 2 && !this.data.routeRol[i].hasId) {
						treeChild.push(this.data.routeRol[i].list[0]);
					}
				}
			}
		}
		return treeChild;
	}

	public getTreeChilds(url: string) {
		var treeChild = [];
		for (var i in this.data.routeRol) {
			var ind = i.indexOf(url);
			if (ind != -1 && ind == 0) {
				var subPart = i.substr(url.length);
				if (subPart != "") {
					var subParts = subPart.split("/");
					if (subParts.length == 2 && !this.data.routeRol[i].hasId) {
						treeChild.push(this.data.routeRol[i].list[0]);
					}
				}
			}
		}
		return treeChild;
	}

	public hasChilds(route: string, urls: string[]): boolean {
		var treeChild = [];
		var tieneHijos = 0;
		for (var i in this.data.routeRol) {
			var ind = i.indexOf(route);
			if (ind != -1 && ind == 0) {
				var subPart = i.substr(route.length);
				if (subPart != "") {
					var subParts = subPart.split("/");
					if (subParts.length == 2 && !this.data.routeRol[i].hasId) {
						if (urls.find(it => it == this.data.routeRol[i].list[0].url)) {
							tieneHijos++;
						}
						treeChild.push(this.data.routeRol[i].list[0]);
					}
				}
			}
		}
		return (tieneHijos > 0) ? true : false;
	}

	logoutHref() {
		var org = this.myStorage.get("ORG");
		if (org && org.origin) {
			window.location.href = environment.protocol + "://" + org.origin;
		} else {
			window.location.href = environment.protocol + "://" + apmdata.host_or;
		}
	}

	validateBeforeUnload(urlId: string) {
		if (this.data.onBeforeUnload) {
			this.ohService.getOH().getUtil().confirm("¿Desea salir de la pantalla actual?", () => {
				this.data.onBeforeUnload = false;
				this.router.navigate([urlId]);
			});
			return false;
		} else {
			return true;
		}
	}

	toLoadModule(rol: any) {
		this.loginService = new LoginServiceJPO(this.ohService);
		this.ohService.getOH().getLoader().show();
		var user = this.data.user;
		var companyId = this.data.user.profile;
		if (user["subSystems"] && user["subSystems"][companyId] && user["subSystems"][companyId][rol.id]) {
			this.router.navigate([rol.urlTree]);
		} else {

			this.loginService.dbowevLisMenu({
				Origen: this.data.user.data.source,
				Usuario: this.data.user.data.userid,
				Empresa: companyId,
				Sistema: rol.id
			}, (resp: pDbowevLisMenu[]) => {
				if (resp && resp.length > 0) {
					this.ohService.getOH().getLoader().show();
					for (var u = 0; u < resp.length; u++) {
						resp[u].id = "" + resp[u].id;
						resp[u].parentId = "" + resp[u].parentId;
					}
					if (!user["subSystems"]) {
						user.subSystems = {};
					}
					if (!user["subSystems"][companyId]) {
						user.subSystems[companyId] = {};
					}
					if (!user["subSystems"][companyId][rol.id]) {
						user.subSystems[companyId][rol.id] = resp;
					}
					window.localStorage.setItem("APM_DATA", JSON.stringify(user));
					this.router.navigate([rol.urlTree]);
				} else {
					this.ohService.getOH().getAd().warning("No cuentas con submódulos en '" + rol.name + "'");
				}
			});

		}

	}
	arrayRemover(arr,key, value ) {
        return arr.filter((element) => {
            return element[key] != value
        })
	}
	arrayRemoverExcept(arr,key, value ) {
        return arr.filter((element) => {
            return element[key] == value
        })
	}
	arrayRemoverExcept2(arr,key, value1,value2 ) {
        return arr.filter((element) => {
            return element[key] == value1 || element[key] == value2
        })
	}
	
	getZxingError(nro: number) {
		if (nro == 1) {
			return "Funcionalidad permitida sólo para dispositivos Android";
		}
		if (nro == 2) {
			return "Funcionalidad permitida sólo en Chrome";
		}
		if (nro == 3) {
			return "El App Barcode Scanner no se encuentra en tu dispositivo, instálelo primero";
		}
	}

	tinymceConfig = {
		height: 300,
		plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help code',
		toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat code',
		tinymceScriptURL: 'assets/tinymce/tinymce.min.js',
		baseURL: 'assets/js/tinymce',
		skin_url: '/assets/js/tinymce/skins/lightgray',
		theme_url: '/assets/js/tinymce/themes/modern/theme.min.js'
	};

	mapRol(){
		this.data.roles_id = {};
		if(this.data.user.roles){
			for(var i in this.data.user.roles){
				let rol = this.data.user.roles[i];
				if(rol.id_){
					this.data.roles_id[rol.id_] = rol;
				}
			}
		}
	}

	tieneRol(roles : any){
		if(typeof(roles)=="string"){
			return this.data.roles_id[roles]?true:false;
		} else {
			var tieneRol = 0;
			for(var i in roles){
				if(this.data.roles_id[roles[i]]){
					tieneRol++;
				}
			}
			return tieneRol>0?true:false;
		}
	}

	obtenerPerfil(profiles){
		var defaultProfile = profiles[0].id;
		var finded = profiles.filter((profile) => profile.default == "1");
		if(finded.length>0){
			return finded[0].id;
		}
		return defaultProfile;
	};
	
}