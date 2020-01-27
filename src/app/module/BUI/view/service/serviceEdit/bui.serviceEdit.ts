import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { pBuiservicioWebRegistrar, pBuiservicioWebObtener, pBuiservicioWebEliminar } from '../../../service/bui.bUIGNServicioWebService';
import { BUIGNServicioWebServiceJPOImp, listarProcedimientosListar, listarProcedimientos_empresas } from '../../../service/bui.bUIGNServicioWebServiceIm';
import { BUIConstructor } from '../../../builder/bui.builder.constructor';

@Component({
	templateUrl: './bui.serviceEdit.html'
})
export class ServiceEdit extends BUIBase implements OnInit, AfterViewInit, OnDestroy {

	private bUIGNServicioWebService : BUIGNServicioWebServiceJPOImp;
	public ohConstructor : BUIConstructor;
	public precargaObtener : Promise<any>;
	public origen_id_web : any;
	public origen_id_rest : any;
	public servicio : any;
	public servicioValidar : any;
	public sp_busqueda : any;
	public sp : any;
	public vista : string;
	public misRoles : any;
	
	@ViewChild("modalConfig", { static: true }) modalConfig: NgbModalRef;
	@ViewChild("modalInfo", { static: true }) modalInfo: NgbModalRef;
	@ViewChild("modalEntradas", { static: true }) modalEntradas: NgbModalRef;
	@ViewChild("modalSalidas", { static: true }) modalSalidas: NgbModalRef;
	
	@ViewChild("inp_base_datos_id", { static: true }) inp_base_datos_id: ElementRef;
	@ViewChild("inp_esquema_id", { static: true }) inp_esquema_id: ElementRef;

	
	constructor(private ohService : OHService, public cse : CoreService, public bcs : BUICoreService, private modalService: NgbModal, private router : Router, private route: ActivatedRoute){
		super(ohService, cse, bcs);

		this.bUIGNServicioWebService = new BUIGNServicioWebServiceJPOImp(ohService);
		
		this.servicio = {
			servicio_web : {
				indicador_oauth2 : '1',
				paquete : "module.",
				origen_datos : ""
			},
			procedimientos : [],
			roles : []
		};
		this.sp = {};

		this.spBusquedaLimpiar();

		this.vista = "";
	}

	ngOnInit(){
		
		this.route.params.subscribe(params => {
			this.precargaObtener = new Promise((resolve, reject) => {
				if(params['id']){
					this.buiservicioWebObtener(resolve, Number(params['id']));
				} else {
					resolve(null);
				}
			});
		});

		this.ohConstructor = new BUIConstructor(this.bcs.data);
		this.origen_id_web = this.bcs.data.origen_id_web;
		this.origen_id_rest = this.bcs.data.origen_id_rest;
		
		Promise.all([this.precarga, this.precargaObtener]).then(values => {

			if(values[1]){ // edit

				let resp = values[1];

				this.servicioValidar = JSON.parse(JSON.stringify(resp));

				for(var i in resp.procedimientos){
					var config = JSON.parse(resp.procedimientos[i].configuraciones);
					this.mapearRoles(config, "oauth2Roles", "oauth2Roles_lista");
					resp.procedimientos[i]['configuraciones'] = config;
					resp.procedimientos[i]['entradas'] = JSON.parse(resp.procedimientos[i].entradas);
					resp.procedimientos[i]['salidas'] = JSON.parse(resp.procedimientos[i].salidas);

					resp.procedimientos[i].estado = 1;
					if(resp.procedimientos[i].sp_id != resp.procedimientos[i].sp_real_id){
						resp.procedimientos[i].estado = 2;
					}
					if(resp.procedimientos[i].sp_real_id == null){
						resp.procedimientos[i].estado = 0;
					}
				}
				this.servicio = resp;
				this.mapearRoles(this.servicio, "roles", "roles_list");
				
				this.servicio.servicio_web.rest_sub_proyecto_id = ""+this.servicio.servicio_web.rest_sub_proyecto_id;
				this.servicio.servicio_web.web_sub_proyecto_id = ""+this.servicio.servicio_web.web_sub_proyecto_id;
	
				this.vistaPrevia();

			} else {

				var subp_rests = this.bcs.data.sub_proyectos.filter(it => it.tipo == 1);
				if(subp_rests && subp_rests.length == 1){
					this.servicio.servicio_web.rest_sub_proyecto_id = subp_rests[0].sub_proyecto_id;
					this.subProyectoRestCambiar();
				}

				var subp_webs = this.bcs.data.sub_proyectos.filter(it => it.tipo == 2);
				if(subp_webs && subp_webs.length == 1){
					this.servicio.servicio_web.web_sub_proyecto_id = subp_webs[0].sub_proyecto_id;
					this.subProyectoWebCambiar();
				}

				this.vistaPrevia();

			}

		})

	}

	mapearRoles(element : any, roles : string, item : string){
		// [1,2,3] -> [{id:1},{id:2},{id:3}]
		element[item] = [];
		for(var e in element[roles]){
			element[item].push({
				id : element[roles][e]
			});
		}
		// --------
	}

	private buiservicioWebObtener(resolve : any, servicio_web_id : number){
		this.ohService.getOH().getLoader().show();
		this.bUIGNServicioWebService.buiservicioWebObtener({
			servicio_web_id : servicio_web_id,
		}, (resp : pBuiservicioWebObtener) => {
			resolve(resp);
			this.ohService.getOH().getLoader().close();
		});
	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){

	}

	limpiar(){

	}

	spBusquedaListarAtras(){
		if(this.sp_busqueda.pagina > 1){
			this.sp_busqueda.pagina--;
			this.spBusquedaListar();
		}
	}

	spBusquedaListarAdelante(){
		if(this.sp_busqueda.pagina < this.sp_busqueda.total){
			this.sp_busqueda.pagina++;
			this.spBusquedaListar();
		}
	}

	spBusquedaListar(){
		if(!this.servicio.servicio_web.base_datos_id){
			this.inp_base_datos_id.nativeElement.focus();
			return;
		}
		if(!this.servicio.servicio_web.esquema_id){
			this.inp_esquema_id.nativeElement.focus();
			return;
		}
		this.bUIGNServicioWebService.listarProcedimientos({
			esquema_id : this.servicio.servicio_web.esquema_id,
			sp_nombre : this.sp_busqueda.sp_nombre,
			cantidad : this.sp_busqueda.cantidad,
			pagina : this.sp_busqueda.pagina
		}, (resp : listarProcedimientosListar) => {
			this.sp_busqueda.procedimientos = resp.procedimientos;
			if(resp.resultado){
				this.sp_busqueda.total = Math.ceil(Number(resp.resultado.total) / this.sp_busqueda.cantidad);
				this.sp_busqueda.encontrado = true;
				this.spBusquedaValidar();
			}
		})
	}

	spBusquedaLimpiar(){
		this.sp_busqueda = {
			pagina : 1,
			cantidad : 10,
			total : 1,
			encontrado : false,
			procedimientos : []
		};
	}

	spBusquedaSeleccionar(procedimiento : listarProcedimientos_empresas){
		this.servicio.procedimientos.push({
			sp_id : procedimiento.sp_id,
			sp_nombre : procedimiento.sp_nombre,
			sp_esquema : procedimiento.sp_esquema,
			entradas : procedimiento.entradas,
			estado : 3,
			configuraciones : {
				disableView : false,
				showLoader : true,
				setBody : false,
				enableFiles : false,
				linkInternal : false,
				linkExternal : false,
				isSlim : true,
				autocommit : true,
				oauth2Enable : true,
				response : false,
				prefix : "",
				datasource : "",
				oauth2Roles : "",
				oauth2Roles_lista : []
			},
			salidas : []
		});
	}

	spBusquedaValidar(){
		for(var i in this.sp_busqueda.procedimientos){
			var it = this.sp_busqueda.procedimientos[i];
			this.sp_busqueda.procedimientos[i]['seleccionado'] = (this.servicio.procedimientos.find(item => item.sp_id == it.sp_id))?true:false;
		}
	}

	habilitarRoles : boolean;
	modalConfigAbrir(indice : number){
		this.sp = JSON.parse(JSON.stringify(this.servicio.procedimientos[indice]));
		this.habilitarRoles = this.sp.configuraciones.oauth2Roles_lista.length > 0?true:false;
		this.modalService.open(this.modalConfig, { centered: true, size: 'xl', scrollable: true, backdrop: 'static' }).result.then((resultado) => {
			if(resultado == "guardar"){
				this.servicio.procedimientos[indice] = JSON.parse(JSON.stringify(this.sp));
			}
		}, () => {
			
		});
	}

	validarHabilitarRolStore(){
		if(!this.habilitarRoles){
			this.sp.configuraciones.oauth2Roles_lista = [];
		}
	}

	modalParametrosAbrir(indice : number){
		this.sp = JSON.parse(JSON.stringify(this.servicio.procedimientos[indice]));
		this.modalService.open(this.modalEntradas, { centered: true, size: 'xl', scrollable: true, backdrop: 'static' }).result.then(() => {
		}, () => {
			
		});
	}

	salidaPlantilla : string;
	modalSalidasAbrir(indice : number){
		this.sp = JSON.parse(JSON.stringify(this.servicio.procedimientos[indice]));
		this.salidaPlantilla = "";
		this.modalService.open(this.modalSalidas, { centered: true, size: 'xl', scrollable: true, backdrop: 'static' }).result.then((resultado) => {
			if(resultado == 'SAVE'){
				this.servicio.procedimientos[indice].salidas = JSON.parse(JSON.stringify(this.sp.salidas));
			}
		}, () => {
			
		});
	}

	eliminar(indice : number){
		this.ohService.getOH().getUtil().confirm("¿Desea eliminar el procedimiento seleccionado?", () => {
			this.servicio.procedimientos.splice(indice,1);
			this.spBusquedaValidar();
		})
	}

	abrirInformacion(){
		this.modalService.open(this.modalInfo, { centered: true, size: 'xl', scrollable: true, backdrop: 'static' }).result.then((resultado) => {
		}, () => {
		});
	}

	procedimientoClaseTipoDato(tipo_dato : any){
		var clase = ["badge badge-pill badge-outline-warning", "badge badge-pill badge-outline-success", "badge badge-pill badge-outline-secondary"]
        if(tipo_dato){
            var tipo_datos = { 
                "DATE"      : clase[0], 
                "DATETIME"  : clase[0], 
                "STRING"    : clase[0], 
                "TEXT"      : clase[0], 
                "CHARACTER" : clase[0], 
                "XML"       : clase[0], 
                "DECIMAL"   : clase[1], 
                "INTEGER"   : clase[1], 
                "BIGINTEGER": clase[1], 
                "RESULT"    : clase[2]
            };
            return tipo_datos[tipo_dato];
        }
	}

	baseDatosCambiar(){
		this.servicio.servicio_web.esquema_id = ''; 

		let bd = this.bcs.data.basedatos.find(it => it.base_datos_id == this.servicio.servicio_web.base_datos_id);
		
		this.servicio.servicio_web.bd_tipo = bd.tipo;
		this.servicio.servicio_web.bd_url = bd.url+":"+bd.puerto;
		this.servicio.servicio_web.bd_usuario = bd.usuario;
		this.servicio.servicio_web.bd_clave = bd.clave;

		this.vistaPrevia();
	}

	esquemaCambiar(){
		let esquema = this.bcs.data.esquemas.find(it => it.esquema_id == this.servicio.servicio_web.esquema_id);
		if(esquema){
			this.servicio.servicio_web.base_datos = esquema.nombre;
			this.servicio.servicio_web.origen_datos = esquema.origen_datos;
		}
		this.vistaPrevia();
	}

	// --- SALIDA -----------------------

	salidaAgregar(){
		this.sp.salidas.push({
			name : "fila"+this.sp.salidas.length, 
			type : 'object',
			items : []
		});
	}

	salidaEliminar(index : number){
		this.sp.salidas.splice(index, 1);
	}

	salidaSubir(index : number){
		var before = this.sp.salidas[index-1];
		var current = this.sp.salidas[index];
		this.sp.salidas[index-1] = current;
		this.sp.salidas[index] = before;
	}

	salidaBajar(index : number){
		var current = this.sp.salidas[index];
		var after = this.sp.salidas[index+1];
		this.sp.salidas[index] = after;
		this.sp.salidas[index+1] = current;
	}

	salidaAgregarHijos(index : number){
		this.sp.salidas[index].items.push({
			name : "item"+this.sp.salidas[index].items.length,
			type : "string"
		})
	}

	salidaHijoIzquierda(indexOut : number, indexItem : number){
		var before = this.sp.salidas[indexOut].items[indexItem-1];
		var current = this.sp.salidas[indexOut].items[indexItem];
		this.sp.salidas[indexOut].items[indexItem-1] = current;
		this.sp.salidas[indexOut].items[indexItem] = before;
	}

	agregarHijoIzquierda(indexOut : number, indexItem : number){
		this.sp.salidas[indexOut].items.splice(indexItem, 0, {
			name : "item"+(indexItem-1)+""+indexItem,
			type : "string"
		});
	}

	salidaHijoDerecha(indexOut : number, indexItem : number){
		var current = this.sp.salidas[indexOut].items[indexItem];
		var after = this.sp.salidas[indexOut].items[indexItem+1];
		this.sp.salidas[indexOut].items[indexItem] = after;
		this.sp.salidas[indexOut].items[indexItem+1] = current;
	}

	agregarHijoDerecha(indexOut : number, indexItem : number){
		this.sp.salidas[indexOut].items.splice(indexItem+1, 0, {
			name : "item"+(indexItem+1)+""+(indexItem+2),
			type : "string"
		});
	}

	salidaHijoEliminar(indexOut : number, indexItem : number){
		this.sp.salidas[indexOut].items.splice(indexItem, 1);
	}

	salidaCopiar(){
		var salidaPlantilla : any = document.getElementById("inp_salidaPlantilla");
		salidaPlantilla.value = JSON.stringify(this.sp.salidas);
		salidaPlantilla.select();
		document.execCommand("copy");
		this.ohService.getOH().getAd().success("Copiado correctamente");
	}

	salidaPegar(){
		var salidaPlantilla : any = document.getElementById("inp_salidaPlantilla");
		this.sp.salidas = JSON.parse(salidaPlantilla.value);
		this.ohService.getOH().getAd().success("Pegado corréctamente");
	}

	subProyectoRestCambiar(){
		
		let sub_proyecto_rest = this.bcs.data.sub_proyectos.find(it => it.sub_proyecto_id == this.servicio.servicio_web.rest_sub_proyecto_id);
	
		this.servicio.servicio_web.rest_url_fuente = sub_proyecto_rest.url_fuente;
		this.servicio.servicio_web.rest_abreviatura = sub_proyecto_rest.abreviatura;
		this.servicio.servicio_web.rest_es_submodulo = sub_proyecto_rest.es_submodulo;
		
		this.servicio.servicio_web.prefijo = sub_proyecto_rest.abreviatura.toUpperCase();
		this.precargarRest();
		
	}

	subProyectoWebCambiar(){
		let sub_proyecto_web = this.bcs.data.sub_proyectos.find(it => it.sub_proyecto_id == this.servicio.servicio_web.web_sub_proyecto_id);
	
		this.servicio.servicio_web.web_url_fuente = sub_proyecto_web.url_fuente;
		this.servicio.servicio_web.web_abreviatura = sub_proyecto_web.abreviatura;
		this.servicio.servicio_web.web_es_submodulo = sub_proyecto_web.es_submodulo;
	}

	// --- VALIDACIONES VISTA REST -----------------------

	vistaPrevia(){		
		this.vista = this.ohConstructor.obtenerVistaPreviaRest(this.servicio.servicio_web);
	}

	precargarRest(){
		if(this.servicio.servicio_web.prefijo){
			this.servicio.servicio_web.paquete = "module."+this.servicio.servicio_web.prefijo.toLowerCase();
			this.servicio.servicio_web.clase = ""+this.servicio.servicio_web.prefijo.toUpperCase();
		}
		this.vistaPrevia();
	}

	validarHabilitarRol(){
		if(!this.servicio.roles_habilitar){
			this.servicio.roles = [];
			this.servicio.roles_list = [];
			this.servicio.rolesb = [];
			this.servicio.roles_listb = [];
		}
	}

	// --- GUARDAR -----------------------------------------

	guardar(){

		if(this.servicio.servicio_web.servicio_web_id){

			var archivosEliminar = {};

			if(!(this.servicioValidar.servicio_web.paquete == this.servicio.servicio_web.paquete && this.servicioValidar.servicio_web.clase == this.servicio.servicio_web.clase)){
				this.ohService.getOH().getUtil().confirm("¿Confirma recrear el servicio, se borrará la clase Implementación?", () => {
					this.guardarEditar(this.ohService.getOH().getUtil().getJSONtoFile(this.ohConstructor.eliminarProcedimientos(this.servicioValidar)));
				});
			} else {
				this.ohService.getOH().getUtil().confirm("¿Confirma editar el servicio?", () => {
					this.guardarEditar(null);
				});
			}
		
		} else {
			
			this.ohService.getOH().getUtil().confirm("¿Confirma registrar un nuevo servicio?", () => {

				this.bUIGNServicioWebService.buiservicioWebRegistrar({
					servicio_web : JSON.stringify(this.servicio.servicio_web),
					roles : JSON.stringify(this.servicio.roles),
					procedimientos : this.obtenerProcedimientos(),
					uid : this.ohService.getOH().getUtil().getUID(),
					comentario : this.servicio.servicio_web.comentario,
					usuario_id : this.bcs.data.usuariobui.usuario_id
				}, {
					archivos : this.ohService.getOH().getUtil().getJSONtoFile(this.ohConstructor.obtenerProcedimientos(this.servicio))
				}, (progress : number) => {
		
				}, (resp : pBuiservicioWebRegistrar) => {
					if (resp.resp_estado == 1) {
						this.ohService.getOH().getAd().success("Servicio creado correctamente");
						this.router.navigate(['../'], { relativeTo: this.route });
					} else {
						if (resp.resp_estado == 0) {
							this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
						} else {
							this.ohService.getOH().getAd().warning(resp.resp_mensaje);
						}
					}
				});
	
			});

		}

	}

	guardarEditar(archivosEliminar : any){
		this.bUIGNServicioWebService.buiservicioWebEditar({
			servicio_web_id : this.servicio.servicio_web.servicio_web_id,
			servicio_web : JSON.stringify(this.servicio.servicio_web),
			roles : JSON.stringify(this.servicio.roles),
			procedimientos : this.obtenerProcedimientos(),
			uid : this.ohService.getOH().getUtil().getUID(),
			comentario : this.servicio.servicio_web.comentario,
			usuario_id : this.bcs.data.usuariobui.usuario_id
		}, {
			archivos : this.ohService.getOH().getUtil().getJSONtoFile(this.ohConstructor.obtenerProcedimientos(this.servicio)),
			archivosEliminar : archivosEliminar
		}, (progress : number) => {

		}, (resp : pBuiservicioWebRegistrar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success("Servicio editado correctamente");
				this.router.navigate(['../../'], { relativeTo: this.route });
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje);
				}
			}
		});
	}

	obtenerProcedimientos(){
		var procedimientos = [];
		for(var item of this.servicio.procedimientos){
			var config = JSON.parse(JSON.stringify(item.configuraciones));
			delete config.oauth2Roles_lista;
			procedimientos.push({
				sp_id : item.estado == 2 ? item.sp_real_id : item.sp_id,
				sp_nombre : item.sp_nombre,
				sp_esquema : item.sp_esquema,
				configuraciones : JSON.stringify(config),
				salidas : JSON.stringify(item.salidas)
			});
		}
		return JSON.stringify(procedimientos);
	}

}