import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIBase } from 'src/app/module/BUI/bui.base';
import { ohStorage } from 'src/app/ohCore/services/oh.core';
import { NgbModalRef, NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { BUIGNServicioWebServiceJPO, pBuiservicioWebListar, buiservicioWebListar_servicios_web, pBuiservicioWebObtener, pBuiservicioWebEliminar, pBuiservicioWebSincronizar } from '../../service/bui.bUIGNServicioWebService';
import { Router, ActivatedRoute } from '@angular/router';
import { BUIBuilderServicioBase } from '../../builder/bui.builder.servicioBase';

@Component({
	templateUrl: './bui.service.html'
})
export class Service extends BUIBase implements OnInit, AfterViewInit, OnDestroy {

	private bUIGNServicioWebService : BUIGNServicioWebServiceJPO;
	
	@ViewChild("modalVistaPrevia", { static: true }) modalVistaPrevia: NgbModalRef;
	@ViewChild("modalTesting", { static: true }) modalTesting: NgbModalRef;

	ohConstructor : BUIBuilderServicioBase;
	sub_proyecto_id : number;

	sub_proyectosBase : any;
	sub_proyectos : any;
	store_filtro : any;
	origen_id_web : any;
	origen_id_web_disabled : boolean;
	origen_id_rest : any;
	origen_id_rest_disabled : boolean;

	vistaPrevia : any;

	constructor(private ohService : OHService, public cse : CoreService, public bcs : BUICoreService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal){
		super(ohService, cse, bcs);

		this.bUIGNServicioWebService = new BUIGNServicioWebServiceJPO(ohService);
		this.storage = new ohStorage();
		this.sub_proyectos = [];

		this.vistaPrevia = {
			imp : {},
			fuentes : {}
		};

		this.precarga.then(() => {

			if(!bcs.data.usuariobui){
				ohService.getOH().getAd().warning("No cuentas con acceso al módulo");
				this.router.navigate(['../'], { relativeTo: this.route });
			}

			this.ohConstructor = new BUIBuilderServicioBase(bcs.data);
			
			this.sub_proyecto_id = this.bcs.data.sub_proyecto_id || this.bcs.config.sub_proyecto_inlandnet;
			this.origen_id_web = this.bcs.data.origen_id_web;
			this.origen_id_rest = this.bcs.data.origen_id_rest;
			
			this.listar();
		})

	}

	ngOnInit(){

	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){

	}

	modalVistaPreviaAbrir(result ?: any, reason ?: any){
		this.modalService.open(this.modalVistaPrevia, { centered: true, size: 'xl', scrollable: true, backdrop: 'static' }).result.then(result, reason);
	}
	
	listar(){
        this.bUIGNServicioWebService.buiservicioWebListar({
            proyecto_id : this.bcs.config.proyecto_id,
			sub_proyecto_id : this.sub_proyecto_id,
			usuario_id : this.bcs.data.usuariobui.usuario_id
        }, (resp : pBuiservicioWebListar) => {
			this.sub_proyectosBase = resp.servicios_web;
			this.filtrarLista();
        });
	}

	filtrarLista(){
		if(this.store_filtro){
			this.sub_proyectos = this.sub_proyectosBase.filter(it => it.procedimientos.toLowerCase().indexOf(this.store_filtro.toLowerCase()) >= 0);
		} else {
			this.sub_proyectos = Object.assign([], [], this.sub_proyectosBase);
		}
	}

	subProyectoIdCambiar(e : any){
		this.coreAgregar("sub_proyecto_id", this.sub_proyecto_id);
		this.listar();
	}

	origenWebCambiar(e : any){
		this.coreAgregar("origen_id_web", this.origen_id_web);
	}

	origenRestCambiar(e : any){
		this.coreAgregar("origen_id_rest", this.origen_id_rest);
	}

	reprocesar(servicio_web : buiservicioWebListar_servicios_web){
		this.ohService.getOH().getLoader().show();
		this.buiservicioWebObtener(servicio_web.servicio_web_id, (resp : pBuiservicioWebObtener) => {
			console.log(resp);
			console.log(JSON.stringify(resp));
			this.sincronizarServicioWeb(servicio_web.servicio_web_id, this.ohConstructor.obtenerProcedimientos(resp), () => {
				this.ohService.getOH().getAd().success("Procesado correctamente");
				this.listar();
			});
		})
	}

	reprocesos : any;
	reprocesarTodos(){
		this.reprocesos = [];
		this.ohService.getOH().getUtil().confirm("¿Desea reprocesar todos los servicios?", () => {

			this.ohService.getOH().getLoader().show();

			for(var i = 0; i < this.sub_proyectos.length; i++){
				this.reprocesos.push(new Promise((resolve, reject) => { 
					var servicio_id = this.sub_proyectos[i].servicio_web_id;
					this.buiservicioWebObtener(servicio_id, (resp : pBuiservicioWebObtener) => {
						this.sincronizarServicioWeb(servicio_id, this.ohConstructor.obtenerProcedimientos(resp), () => {
							resolve();
						});
					})					
				}))
			}

			Promise.all(this.reprocesos).then(values => { 
				this.ohService.getOH().getAd().success("Procesados correctamente");
				this.listar();
			}, reason => {
				this.ohService.getOH().getAd().warning("Ha ocurrido un problema");
				this.ohService.getOH().getLoader().close();
			});
		})
	}

		private buiservicioWebObtener(servicio_web_id : number, call : any){
			this.bUIGNServicioWebService.buiservicioWebObtener({
				servicio_web_id : servicio_web_id,
			}, (resp : pBuiservicioWebObtener) => {
				for(var i in resp.procedimientos){
					resp.procedimientos[i]['configuraciones'] = JSON.parse(resp.procedimientos[i].configuraciones);
					resp.procedimientos[i]['entradas'] = JSON.parse(resp.procedimientos[i].entradas);
					resp.procedimientos[i]['salidas'] = JSON.parse(resp.procedimientos[i].salidas);
				}
				call(resp);
			});
		}

		private sincronizarServicioWeb(servicio_web_id : number, archivos : any, call ?: any){
			this.bUIGNServicioWebService.buiservicioWebSincronizar({
				servicio_web_id : servicio_web_id,
				uid : this.ohService.getOH().getUtil().getUID(),
				comentario : "",
				usuario_id : this.bcs.data.usuariobui.usuario_id
			}, {
				archivos : this.ohService.getOH().getUtil().getJSONtoFile(archivos)
			}, (progress : number) => {
				
			}, (resp : pBuiservicioWebSincronizar) => {
				if (resp.resp_estado == 1) {
					if(call){
						call();
					}
				} else {
					if (resp.resp_estado == 0) {
						this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
					} else {
						this.ohService.getOH().getAd().warning(resp.resp_mensaje);
					}
				}
			});
		}

	abrirVistaPrevia(servicio_web : buiservicioWebListar_servicios_web){
		this.ohService.getOH().getLoader().show();
		this.buiservicioWebObtener(servicio_web.servicio_web_id, (resp : pBuiservicioWebObtener) => {
			this.vistaPrevia = {
				resp : resp,
				imp : this.ohConstructor.obtenerImplementacion(resp),
				test : {},
				cargado : false
			};
			this.ohService.getOH().getLoader().close();
			this.modalVistaPreviaAbrir();
		});
	}

	eliminar(servicio_web : buiservicioWebListar_servicios_web){

		this.ohService.getOH().getUtil().confirm("¿Desea elimina el servicio seleccionado?", () => {

			this.ohService.getOH().getLoader().show();
			this.buiservicioWebObtener(servicio_web.servicio_web_id, (resultado : pBuiservicioWebObtener) => {

				this.bUIGNServicioWebService.buiservicioWebEliminar({
					servicio_web_id : servicio_web.servicio_web_id
				}, {
					archivos : this.ohService.getOH().getUtil().getJSONtoFile(this.ohConstructor.eliminarProcedimientos(resultado))
				}, (progress : number) => {
					
				}, (resp : pBuiservicioWebEliminar) => {
					if (resp.resp_estado == 1) {
						this.ohService.getOH().getAd().success(resp.resp_mensaje);
						this.listar();
					} else {
						if (resp.resp_estado == 0) {
							this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
						} else {
							this.ohService.getOH().getAd().warning(resp.resp_mensaje);
						}
					}
				});
			
			})

		})

	}

	copiar(element : any){
		var copiar : any = document.getElementById(element);
		copiar.select();
		document.execCommand("copy");		
		this.ohService.getOH().getAd().success("Copiado correctamente");
	}

	vistaCambio($event: NgbTabChangeEvent){
		if ($event.nextId === 'tab_fue') {
			if(!this.vistaPrevia.cargado){
				let imple = this.ohConstructor.obtenerProcedimientos(this.vistaPrevia.resp);
				this.vistaPrevia.cargado = true;
				this.vistaPrevia.fuentes = {
					web : imple[2].source,
					rest : imple[0].source,
					restImp : imple[1].source
				}
			}
		}
	}

	probar(){

	}

}
