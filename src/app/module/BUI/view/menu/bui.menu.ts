import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { BUICoreService } from '../../bui.coreService';
import { SHACoreService } from 'src/app/module/sharedAdmin/sha.coreService';
import { pBuiplantillaMenuEliminar } from '../../service/bui.bUIGNPlantillaMenuService';
import { BUIBuilderMenuBase } from '../../builder/bui.builder.menuBase';
import { obtenerArchivos_archivos } from '../../service/bui.bUIGNPrincipalServiceImp';
import { BUIGNSubProyectoServiceJPO, pBuisubProyectoEliminar } from '../../service/bui.bUIGNSubProyectoService';
import { BUIMenuBase } from './bui.menu.base';
import { pSegmenuEliminar, pSegmenuEditarSubir, pSegmenuEditarBajar, pSegmenuEliminarValidar } from '../../service/bui.bUIMenuService';

@Component({
  templateUrl: './bui.menu.html'
})
export class Menu extends BUIMenuBase implements OnInit, OnDestroy {
	
	private bUIGNSubProyectoService : BUIGNSubProyectoServiceJPO;

	@ViewChild("modalConfElim", { static: true }) modalConfElim: TemplateRef<NgbActiveModal>;
	@ViewChild("modalVistaPrevia", { static: true }) modalVistaPrevia: TemplateRef<NgbActiveModal>;
	
	vistaMenu : boolean;

	constructor(private route: ActivatedRoute, private router :Router, private ohService : OHService, private modalService: NgbModal, public cse : CoreService, public bcs : BUICoreService, public scs : SHACoreService){

		super(ohService, cse, bcs, scs);

		this.bUIGNSubProyectoService = new BUIGNSubProyectoServiceJPO(ohService);
		
		this.vistaMenu = true;
		this.proyecto = {};

		Promise.all([this.precarga, this.scs.listarArbolMenu(), this.buiplantillaMenuListar()]).then(values => {
			this.origen_id_web = this.bcs.data.origen_id_web;
			this.cargarArbol();
			this.asociarPlantillaMenu(this.arbol);
		});

	}

	ngOnInit(){
		this.cse.config.disableSeparator = true;
	}

	ngOnDestroy(){
		this.cse.config.disableSeparator = false;
	}

	subProyectoSeleccionar(menu_id : any){
		this.subProyectoObtener(menu_id);
		var sub_proyecto = this.bcs.data.sub_proyectos.find(it => it.menu_id == menu_id);
		if(sub_proyecto){
			this.coreAgregar("sub_proyecto_id", sub_proyecto.sub_proyecto_id);
		}
	}

	private asociarPlantillaMenu(item : any){
		var encontrado = this.bcs.plantillas_menu.find(it => it.menu_id == item.menu_id);
		if(encontrado){
			item.plantillaMenu = encontrado;
		}
		for(var i in item.hijos){
			this.asociarPlantillaMenu(item.hijos[i]);
		}
	}
	
	eventosItem(event : any){

		event.respuesta.editar((menu_id : number) => {
			this.router.navigate(['edit/'+menu_id], { relativeTo: this.route }); 
		});

		event.respuesta.subir((menu_id : number) => {
			this.bUIMenuService.segmenuEditarSubir({
				Menu_id : menu_id
			}, (resp : pSegmenuEditarSubir) => {
				this.eliminarRespuesta(resp);
			});
		});

		event.respuesta.bajar((menu_id : number) => {
			this.bUIMenuService.segmenuEditarBajar({
				Menu_id : menu_id
			}, (resp : pSegmenuEditarBajar) => {
				this.eliminarRespuesta(resp);
			});
		});

		event.respuesta.eliminar((menu_id : number) => {
			this.ohService.getOH().getUtil().confirm("¿Confirma eliminar el item seleccionado?", ()=> {
				this.validarEliminar(menu_id);
			})
		});

		event.respuesta.plantilla((menu_id : number) => {
			this.ohService.getOH().getLoader().show();
			this.router.navigate(['template/'+menu_id], { relativeTo: this.route }); 
		});

		event.respuesta.getInserts((item : any) => {
			this.abrirVistaPrevia(item);
		});

	}

	vistaPreviaSQL_insert : string;
	menu_seleccionado : any;
	abrirVistaPrevia(item : any){
		this.menu_seleccionado = item;
		this.idcounter = 1;
		var menu_base_id = "";
		var text = "";
		if(item.menu_padre_id == null){
			menu_base_id = "null";
		} else {
			var menuItem = this.arbolBuscar(this.arbol, item.menu_base_id);
			text = "DECLARE @menu_base_id INT = (SELECT menu_id FROM seg.menu WHERE plantilla = '"+menuItem.plantilla+"')\n";
			menu_base_id = "@menu_base_id";
		}
		text += "Declare @menu_padre_id_"+(this.idcounter)+" INT = "+item.menu_padre_id+"\n";
		text += this.getQuerys(item, this.idcounter, menu_base_id);
		this.vistaPreviaSQL_insert = text;

		this.modalService.open(this.modalVistaPrevia, { size: 'lg' }).result.then((result) => {
		}, (reason) => {
		});
	}

	ohBuilderTemp : BUIBuilderMenuBase;
	elminiarConf : any = {};
	plantillaConfirmarEliminar : boolean;
	private validarEliminar(menu_id : number){

        this.bUIMenuService.segmenuEliminarValidar({
            Menu_id : menu_id
        }, (resp : pSegmenuEliminarValidar) => {

			this.plantillaConfirmarEliminar = false;
			this.elminiarConf = resp;
			
			if(this.bcs.plantillas_menu){
				var menuItem = this.arbolBuscar(this.arbol, menu_id);
				// ohBuilderTemp
				this.ohBuilderTemp = new BUIBuilderMenuBase(this.bcs.data, {
					arbol : this.arbol, 
					plantillas_menu : this.bcs.plantillas_menu,
					origen_web : this.obtenerOrigen(this.origen_id_web),
					sub_proyectos : this.bcs.data.sub_proyectos
				});
				this.ohBuilderTemp.getMenu().obtenerDatos(menu_id);
				this.ohBuilderTemp.menu.setDatos({
					plantilla : menuItem.plantilla,
					esSubroyecto : (menuItem && menuItem.menu_padre_id == null)?true:false
				});
				if(this.bcs.data.sub_proyectos_web && this.bcs.data.sub_proyectos_web.length == 1){
					this.ohBuilderTemp.getMenu().setSubProyectoWeb(this.obtenerSubProyecto(this.bcs.data.sub_proyectos_web[0].sub_proyecto_id));
				}
				this.ohBuilderTemp.getMenu().setItem(menuItem, true);
				this.ohBuilderTemp.getMenu().validarTienePlantilla();
				// ------------

			}
			this.modalService.open(this.modalConfElim).result.then((result) => {
				if(result == "Confirmar"){
					this.eliminar(menu_id);
				}
			}, (reason) => {
	
			});
        });
	}

	private arbolBuscar(item : any, menu_id : number){
		if(item.menu_id == (menu_id!=0?menu_id:null)){
			return item;
		} else {
			var retorno = false;
			for(var i in item.hijos){
				var retorno_hijo = this.arbolBuscar(item.hijos[i], menu_id);
				if(retorno_hijo){
					retorno = retorno_hijo;
					break;
				}
			}
			return retorno;
		}
	}

	private eliminar(menu_id : number){

		this.bUIMenuService.segmenuEliminar({
			Menu_id : menu_id
		}, (resp : pSegmenuEliminar) => {
			if(this.plantillaConfirmarEliminar){
				this.eliminarPlantilla(menu_id);
			} else {
				this.eliminarRespuesta(resp);
			}
		});

	}

	private eliminarPlantilla(menu_id : number){
		
		this.bUIGNPrincipalService.obtenerArchivos({
			archivos : JSON.stringify(this.ohBuilderTemp.consultarArchivos())
		}, (resp: obtenerArchivos_archivos[]) => {

			if(this.ohBuilderTemp.getMenu().esSubroyecto){

				var archivos = this.ohBuilderTemp.rutaObtenerSubProyectoEliminar(resp);
				var sub_proyecto = this.bcs.data.sub_proyectos.find(it => it.menu_id == menu_id);
				this.bUIGNSubProyectoService.buisubProyectoEliminar({
					sub_proyecto_id : sub_proyecto.sub_proyecto_id
				}, {
					archivos_editar : this.ohService.getOH().getUtil().getJSONtoFile(archivos.editar),
					archivos_borrar : this.ohService.getOH().getUtil().getJSONtoFile(archivos.borrar)
				}, (progress : number) => {
				}, (resp : pBuisubProyectoEliminar) => {
					this.eliminarRespuesta(resp);
				});

			} else {

				var archivos = this.ohBuilderTemp.rutaObtenerMenuEliminar(resp);
				var plantilla = this.bcs.plantillas_menu.find(it => it.menu_id == menu_id);
				this.bUIGNPlantillaMenuService.buiplantillaMenuEliminar({
					plantilla_menu_id : plantilla.plantilla_menu_id
				}, {
					archivos_editar : this.ohService.getOH().getUtil().getJSONtoFile(archivos.editar),
					archivos_borrar : this.ohService.getOH().getUtil().getJSONtoFile(archivos.borrar)
				}, (progress : number) => {
				}, (resp : pBuiplantillaMenuEliminar) => {
					this.eliminarRespuesta(resp);
				});
	
			}
			
		})

	}

	private eliminarRespuesta(resp : any){
		if(resp.resp_estado == 1){
			this.ohService.getOH().getAd().success(resp.resp_mensaje);
		} else if(resp.resp_estado == 0) {
			this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
		} else {
			this.ohService.getOH().getAd().warning(resp.resp_mensaje);
		}
		if(resp.resp_estado == 1 || resp.resp_estado == 2){
			Promise.all([this.precarga, this.scs.listarArbolMenu(true), this.buiplantillaMenuListar(true)]).then(values => {
				this.cargarArbol();
				this.asociarPlantillaMenu(this.arbol);
			});
		}
	}

	idcounter : number;
	private getQuerys(item : any, counter : number, menu_base_id : string){
		var query_base = "INSERT INTO seg.menu (menu_padre_id, titulo, descripcion, plantilla, icono, orden, tiene_id, menu_base_id, estado, usuario_registro_id, fecha_registro) VALUES ";
		var query = query_base+"("+("@menu_padre_id_"+counter)+", '"+item.titulo+"', '"+item.descripcion+"', '"+item.plantilla+"', '"+item.icono+"', "+item.orden+", '"+((item.tiene_id)?'1':'0')+"', "+menu_base_id+", '"+((item.estado)?'1':'0')+"', 1, CURRENT_TIMESTAMP)\n";
		
		if(item.hijos && item.hijos.length>0){
			this.idcounter++;
			var myId = this.idcounter;
			query += "Declare @menu_padre_id_"+(myId)+" INT = SCOPE_IDENTITY()\n";
			if(item.menu_padre_id == null){
				menu_base_id = "@menu_padre_id_"+(this.idcounter);
			}
			for(var i in item.hijos){
				query += this.getQuerys(item.hijos[i], myId, menu_base_id);
			}
		}

		return query;
	}

}