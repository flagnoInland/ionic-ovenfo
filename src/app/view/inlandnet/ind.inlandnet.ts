import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ohStorage } from '../../ohCore/services/oh.core';
import { SistemaServiceJPO, pSegsistemaValidar } from 'src/app/service/tis.sistemaService';
import { shared } from 'src/environments/environmentShared';
import { OHService } from 'src/app/tis.ohService';
import { Nav } from '../nav/ind.nav';
import { Menu } from '../menu/ind.menu';
import { CoreService } from 'src/app/ind.coreService';
import { Messaging } from 'src/app/ind.messaging';

declare var apmdata: any;

@Component({
  selector: 'ind-inlandnet',
  templateUrl: './ind.inlandnet.html',
  styleUrls: ['./ind.inlandnet.css']
})

export class Inlandnet implements OnInit {

	@ViewChild("objNav", { static: true }) objNav: Nav;
	@ViewChild("objMenu", { static: true }) objMenu: Menu;

	private sistemaService : SistemaServiceJPO;

	public myStorage : ohStorage;
	public currentUrlObj : any;

	constructor(private router :Router, private ohService : OHService, public cse : CoreService, private messagingService: Messaging){

		this.myStorage = new ohStorage();
		this.cse.config.openMenu = true;
		this.renderMenu(window.innerWidth);

		this.cse.data.adds = [];
		this.cse.data.addsNoRead = 0;


		if(this.myStorage.has("APM_DATA")){

			this.cse.setUserOptions(this.cse.getUO());
			this.cse.buildMenu();
			
			var user = this.myStorage.get("APM_DATA");
			
			this.messagingService.subscribirse(() => {
				this.messagingService.recibirMensaje((add) => {
					this.cse.data.adds.push(add);
					this.cse.data.addsNoRead++;
					this.validarAdd();
				});
			}, (add : any) => {
				this.cse.data.adds.push(add);
				this.cse.data.addsNoRead++;
				this.validarAdd();
			});
			
			this.cse.mapRol();
			this.ohService.getOH().setShareConfig({
				token : user.data.token,
				onUnAuthrorized : () => {
					this.objNav.doLogout(false);
				},
				onForbidden : () => {
					this.ohService.getOH().getAd().warning("No tienes permisos, contactar con el administrador");
				}
			})

			this.sistemaService = new SistemaServiceJPO(ohService);

			router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
				var subUrl = e["urlAfterRedirects"].split("/");
				if(this.currentUrlObj !== subUrl){
					if(subUrl.length>=3){
						var systemId = subUrl[2];
						var user = this.cse.data.user;
						var companyId = this.cse.data.user.profile;
						if(user["subSystems"] && user["subSystems"][companyId] && user["subSystems"][companyId][systemId]){
							this.cse.buildMenu(companyId, systemId);
						}
					}
				}

			});
			
			var fire_usuario = user.data;
				fire_usuario.conexion_accion = 1;
			this.cse.inland_main.usuarios_conectados.guardar(fire_usuario).then(() => {
				this.cse.inland_main.usuarios_conectados.enlazar(user.data.token).subscribe((item : any) => {
					// console.log(item);
					if(item.conexion_accion == 2){ // Notificar
						this.validateSend();
						item.conexion_accion = 1;
						this.cse.inland_main.usuarios_conectados.editar(item);
					}
					if(item.conexion_accion == 3){ // Sincronizar
						this.objMenu.sincronizar();
						item.conexion_accion = 1;
						this.cse.inland_main.usuarios_conectados.editar(item);
					}
					if(typeof(item.conexion_accion) == "undefined" || item.conexion_accion == 4){ // Cerrar Sessión
						this.objNav.doLogout(true);
					}
				});
			});
			this.cse.inland_main.enlazar().subscribe((item : any) => {
				this.habilitarLog(item.habilitar_log);
				if(item.version != shared.version){
					if(item.version_actualizacion == 1){ // Force
						if(apmdata.service){
							apmdata.service.update();
							window.setTimeout(() => {
								window.location.reload();
							});
						}
					} else if(item.version_actualizacion == 2){ // Validate
						this.validateSend(); 
					}
				}
			})

		}
	}

	private habilitarLog(habilitar_log : boolean){
		if(this.cse.data.habilitar_log != habilitar_log){
			this.cse.data.habilitar_log = habilitar_log;
		}
		let data = this.myStorage.item("APM_DATA", "data");
		data.habilitar_log = habilitar_log;
		this.myStorage.add("APM_DATA", "data", data);
	}

	ngOnInit(){
		if (this.myStorage.get("APM_FIRST")){ // Ya habia sido cargado
			this.validateSend();
		}
	}

	validateSend(){
		this.sistemaService.segsistemaValidar({
			Usuario_id : (this.cse.data.user.data.source=="IND")?this.cse.data.user.data.userid:null,
			Sistema_id : shared.systemId
		}, (resp: pSegsistemaValidar) => {
			this.doValidateSystem(resp);
		});
	}

	ngAfterViewInit(){
		if (!this.myStorage.get("APM_FIRST")){
			if(!this.cse.data.user.adds){
				this.cse.data.user.adds = [];
			}
			setTimeout(() => {
				this.doValidateSystem({
					system : this.cse.data.user.system,
					adds : this.cse.data.user.adds
				});
				delete this.cse.data.user.system;
				delete this.cse.data.user.adds;
				this.myStorage.set("APM_FIRST", "1");
			});
		}
	}

	doValidateSystem(resp: any){
		this.objNav.closeAdd();
		this.cse.data.addsNoRead = 0;
		this.cse.data.adds = [];
		if(resp.system.version != shared.version){
			this.cse.data.addsNoRead++;
			this.cse.data.adds.push({
				id : 0, 
				type : 1, 
				icon : "fas fa-sync",
				title : "Nueva actualización",
				subtitle : "Se ha identificado una nueva versión v"+resp.system.version+"",
				description : "Estimado usuario si no esta esta una transacción favor de dar click en el enlace que dice 'Actualizar', si el mensaje se vuelve a visualizar dar click en el botón F5 (Computadoras) o deslizar el dedo hacia abajo (Móviles), la versión se verá reflejada en la parte inferior del aplicativo",
				nivel : resp.system.nivel,
				sendDate : resp.system.deploymentDate,
				read : 0
			});
		}

		if(resp.adds && resp.adds.length>0){
			if(!(resp.adds.length == 1 && resp.adds[0].id.length == 0)){
				this.cse.data.adds.push.apply(this.cse.data.adds, resp.adds);
				this.cse.data.addsNoRead += resp.adds.filter(item => item.read == 0).length;
			}
		}
		
		this.validarAdd();

	}

	validarAdd(){
		for(var i = 0; i < this.cse.data.adds.length; i++){
			if(this.cse.data.adds[i].nivel == '2'){
				this.objNav.openAdd(i);
				break;
			}
		}
	}
	
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.renderMenu(event.target.innerWidth);
	}

	renderMenu(innerWidth : number){
		if(innerWidth < 1024){
			this.cse.config.openMenu = false;
		} else {
			this.cse.config.openMenu = true;
		}
	}


}