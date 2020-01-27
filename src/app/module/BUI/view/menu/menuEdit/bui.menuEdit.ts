import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from '../../../bui.coreService';
import { SHACoreService } from 'src/app/module/sharedAdmin/sha.coreService';
import { BUIBuilderMenuBase } from '../../../builder/bui.builder.menuBase';
import { BUIMenuBase } from '../bui.menu.base';
import { pSegmenuObtener, pSegmenuEditar, pSegmenuRegistrar } from '../../../service/bui.bUIMenuService';
import { obtenerArchivos_archivos } from '../../../service/bui.bUIGNPrincipalServiceImp';
import { BUIGNSubProyectoServiceJPO, pBuisubProyectoRegistrar } from '../../../service/bui.bUIGNSubProyectoService';
import { pBuiplantillaMenuRegistrar } from '../../../service/bui.bUIGNPlantillaMenuService';

@Component({
	templateUrl: './bui.menuEdit.html'
})
export class MenuEdit extends BUIMenuBase {

	// origen_id_web : any; -> BUIMenuBase
	web_sub_proyecto_web : any;
	
	precargaParams : any;
	menu_desabilitado : boolean;

	item : any = {};
	
	configuraciones : any;
	//Roles
	roles : any;

	private bUIGNSubProyectoService : BUIGNSubProyectoServiceJPO;
	
	ohBuilderTemp : BUIBuilderMenuBase;

	constructor(private route: ActivatedRoute, private router: Router, private ohService : OHService, public cse : CoreService, public bcs : BUICoreService, public scs : SHACoreService){
		super(ohService, cse, bcs, scs);
		
		this.bUIGNSubProyectoService = new BUIGNSubProyectoServiceJPO(ohService);

		this.roles = [];

		this.item = {
			tiene_id : "0", // Si puede recibir parametros
			estado : "1",
			plantillaML : 100
		}
		
		var precarga = new Promise((resolve, reject) => {
			this.precargaParams = resolve;
		});

		Promise.all([this.precarga, precarga, this.scs.listarArbolMenu(), this.buiplantillaMenuListar()]).then(values => {

			this.origen_id_web = this.bcs.data.origen_id_web;
			this.cargarArbol();

			this.configuraciones = JSON.parse(JSON.stringify(this.bcs.data.catalogo.menu_configuracion));
			if(this.item.menu_id){ // Editar

				this.segmenuObtener(this.item.menu_id);

			} else {

				for(var i in this.configuraciones){
					this.configuraciones[i].seleccionado = true;
				}

			}

			this.ohBuilderTemp = new BUIBuilderMenuBase(this.bcs.data, {
				arbol : this.arbol, 
				plantillas_menu : this.bcs.plantillas_menu,
				origen_web : this.obtenerOrigen(this.origen_id_web),
				sub_proyectos : this.bcs.data.sub_proyectos
			});

			
			if(this.bcs.data.sub_proyectos_web && this.bcs.data.sub_proyectos_web.length == 1){
				this.web_sub_proyecto_web = this.bcs.data.sub_proyectos_web[0].sub_proyecto_id;
				this.subProyectoWebCambiar();
			}
			
		});

	}

	ngOnInit(){
		this.route.params.subscribe(params => {
			if(params && params['id']){
				this.item.menu_id = Number(params['id']);
			}
			this.precargaParams();
		});
	}

	origenWebCambiar(){
		this.coreAgregar("origen_id_web", this.origen_id_web);
		this.ohBuilderTemp.getMenu().setOrigenWeb(this.obtenerOrigen(this.origen_id_web));
	}

	subProyectoWebCambiar(){
		this.ohBuilderTemp.getMenu().setSubProyectoWeb(this.obtenerSubProyecto(this.web_sub_proyecto_web));
	}

	segmenuObtener(menu_id: number) {
		this.bUIMenuService.segmenuObtener({
			menu_id: menu_id
		}, (resp: pSegmenuObtener) => {
			
			this.item = resp.menu;
			this.item.tiene_id = (resp.menu.tiene_id) ? '1' : '0';
			this.item.estado = (resp.menu.estado) ? '1' : '0';

			var roles = [];
			for(var i in resp.roles){
				roles.push({
					id : resp.roles[i].rol_id
				});
			}
			this.roles = roles;

			if(resp.menu_config){
				
				for(var i in resp.menu_config){
					var item = this.configuraciones.find(it => it.catalogo_id == resp.menu_config[i].tipo_configuracion);
					if(item){
						item.seleccionado = true;
						item.valor = resp.menu_config[i].valor
					}
				}
			}

			this.arbolSeleccionar(this.arbol, resp.menu.menu_padre_id);
			this.menu_desabilitado = true;

		});
	}

	eventosItem(event : any){
		event.respuesta.seleccionar((menu_id : number) => {
			this.arbolSeleccionar(this.arbol, menu_id);
			this.ohBuilderTemp.getMenu().obtenerDatos(menu_id);
		});
	}

	plantillaCambiar(){
		this.ohBuilderTemp.menu.ohbItem.ruta = this.item.plantilla;
	}
	

	arbolSeleccionar(arbolItem : any, menu_id : number){
		if(arbolItem.menu_id == menu_id){
			arbolItem.seleccionado = true;
			if(arbolItem.menu_id){
				this.item.menu_padre_id = arbolItem.menu_id;
				this.item.plantillaML = 100;
			} else { // null
				this.item.menu_padre_id = 0;
				this.item.tiene_id = '0';
				this.item.plantillaML = 3; // Max length para plantilla 3 proy 100 normal
				if(this.item.plantilla && this.item.plantilla.length>3){
					this.item.plantilla = this.item.plantilla.substr(0,3);
				}
			}
		} else {
			arbolItem.seleccionado = false;
		}
		for(var i in arbolItem.hijos){
			this.arbolSeleccionar(arbolItem.hijos[i], menu_id);
		}
	}
	
	arbolBuscar(arbolItem : any, menu_id : number, menu_base_id : number){
		if(arbolItem.menu_id == menu_id){
			return {
				item : arbolItem,
				base_id : menu_base_id
			};
		} else {
			if(arbolItem.hijos.length>0){
				for(var i in arbolItem.hijos){
					var idBase = null;
					if(arbolItem.menu_id == null){
						idBase = arbolItem.hijos[i].menu_id
					} else {
						idBase = menu_base_id;
					}
					var resultado = this.arbolBuscar(arbolItem.hijos[i], menu_id, idBase);
					if(resultado != null){
						return resultado;
					}
				}
			} else {
				return null;
			}
		}
	}

	register(){

		this.ohService.getOH().getUtil().confirm("Confirma grabar el menú", () => {

			var menu_padre_id: number, menu_base_id: number, plantilla : string, orden: number;

			if(this.item.menu_padre_id==0){ // SubProyecto
				menu_padre_id = null;
				menu_base_id = null;
				plantilla = this.item.plantilla.toLowerCase();
				orden = this.scs.menuArbol.hijos.length+1;
				this.ohBuilderTemp.menu.setDatos({
					plantilla : this.item.plantilla,
					esSubroyecto : true
				})
			} else {
				menu_padre_id = this.item.menu_padre_id;
				var itemElemento = this.arbolBuscar(this.scs.menuArbol, this.item.menu_padre_id, null);
				menu_base_id = itemElemento.base_id;
				plantilla = this.item.plantilla;
				orden = itemElemento.item.hijos.length+1;
				this.ohBuilderTemp.menu.setDatos({
					plantilla : this.item.plantilla,
					esSubroyecto : false
				})
			}

			if(this.item.menu_id){

				this.bUIMenuService.segmenuEditar({
					menu_id : this.item.menu_id,
					titulo : this.item.titulo,
					descripcion : this.item.descripcion,
					plantilla : plantilla,
					icono : this.item.icono,
					tiene_id : this.item.tiene_id,
					estado : this.item.estado,
					usuario_id : this.cse.data.user.data.userid,
					configuracion : this.getConfiguraciones(),
					roles_id : this.item.roles_xml
				}, (resp : pSegmenuEditar) => {

					if(resp.resp_estado==1){
	
						this.ohService.getOH().getAd().success(resp.resp_mensaje);
						this.retornar('../../');
					
					} else {
						this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
					}

				});

			} else {

				var validar_nombres = this.ohBuilderTemp.getMenu().validarNombres(this.item.menu_padre_id);
				if(validar_nombres != ""){
					this.ohService.getOH().getAd().warning(validar_nombres);
					return;
				}
				this.bUIMenuService.segmenuRegistrar({
					menu_padre_id : menu_padre_id,
					menu_base_id : menu_base_id, 
					plantilla : plantilla,
					orden : orden,
					titulo : this.item.titulo,
					descripcion : this.item.descripcion,
					icono : this.item.icono,
					tiene_id : this.item.tiene_id,
					estado : this.item.estado,
					configuracion : this.getConfiguraciones(),
					roles_id: this.item.roles_xml,
					usuario_id : this.cse.data.user.data.userid
				}, (resp : pSegmenuRegistrar) => {
					
					if(resp.resp_estado==1){
	
						this.ohService.getOH().getAd().success(resp.resp_mensaje);

						if(!this.ohBuilderTemp.menu.ohbItem.habilitar){

							this.retornar('../');

						} else {

							this.guardarPlantilla(resp.resp_new_id);
						}

					} else {
						this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
					}
	
				});

			}

		})

	}

	guardarPlantilla(menu_id : number){

		this.bUIGNPrincipalService.obtenerArchivos({
			archivos : JSON.stringify(this.ohBuilderTemp.consultarArchivos())
		}, (resp: obtenerArchivos_archivos[]) => {

			if(this.ohBuilderTemp.menu.esSubroyecto){

				var abr = this.item.plantilla.toUpperCase();

				var sub_proyecto = {
					proyecto_id : this.bcs.config.proyecto_id,
					nombre : abr+" - "+this.item.titulo,
					url_fuente : "Module"+abr,
					tipo : this.bcs.config.sub_proyecto_tipo.rest,
					abreviatura : abr,
					menu_id : menu_id,
					es_submodulo : this.bcs.config.sub_proyecto_sub_modulo.si,
					usuario_id : this.bcs.data.usuariobui.usuario_id
				}
				
				this.bUIGNSubProyectoService.buisubProyectoRegistrar(sub_proyecto, {
					archivos : this.ohService.getOH().getUtil().getJSONtoFile(this.ohBuilderTemp.rutaObtenerSubProyectoEditar(this.item.plantilla, resp))
				}, (progress : number) => {
				}, (resp : pBuisubProyectoRegistrar) => {
					sub_proyecto['sub_proyecto_id'] = resp.resp_new_id;
	
					this.bcs.data.sub_proyectos.push(sub_proyecto);
					this.storage.add("APM_BUI_DATA", "sub_proyectos", this.bcs.data.sub_proyectos);

					this.retornar('../');
	
				});
	
			} else {
				
				this.bUIGNPlantillaMenuService.buiplantillaMenuRegistrar({
					proyecto_id : this.bcs.config.proyecto_id,
					menu_id : menu_id,
					folder : this.ohBuilderTemp.menu.ohbItem.ruta,
					usuario_id : this.bcs.data.usuariobui.usuario_id
				}, {
					archivos : this.ohService.getOH().getUtil().getJSONtoFile(this.ohBuilderTemp.rutaObtenerMenuEditar(this.item, resp))
				}, (progress : number) => {
				}, (resp : pBuiplantillaMenuRegistrar) => {

					this.retornar('../');

				});

			}

		})

	}

	private retornar(referencia : string){
		Promise.all([this.scs.listarArbolMenu(true), this.buiplantillaMenuListar(true)]).then(values => {
			this.router.navigate([referencia], { relativeTo: this.route }); 
		});
	}

	private getConfiguraciones() : string {
		var xml = [];
		if(this.item.menu_padre_id == 0){
			for(var i in this.configuraciones){
				xml.push("<Config>")
				xml.push("<tipo_configuracion>"+this.configuraciones[i].catalogo_id+"</tipo_configuracion>")
				xml.push("<valor>"+((this.configuraciones[i].valor)?this.configuraciones[i].valor:'')+"</valor>")
				xml.push("<estado>"+((this.configuraciones[i].seleccionado)?'1':'0')+"</estado>")
				xml.push("</Config>")
			}
		}
		return xml.join("");
	}
	
}