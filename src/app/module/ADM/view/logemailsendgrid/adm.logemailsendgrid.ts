import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';

import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { pGesemailObtenerEnvio, pGesemailReenviar } from '../../service/adm.aDMPrincipalService';
import { SHACoreService } from 'src/app/module/sharedAdmin/sha.coreService';

@Component({
	templateUrl: './adm.logemailsendgrid.html'
})
export class Logemailsendgrid extends ADMBase implements OnInit, OnDestroy {

	@ViewChild("filterWindow", { static: true }) objFilter: TemplateRef<NgbActiveModal>;
	@ViewChild("modalDetalle", { static: true }) private modalDetalle: NgbModalRef;
	@ViewChild("modalDetalleCorreo", { static: true }) private modalDetalleCorreo: NgbModalRef;
	
	dateResult : any = [];
	dateList : any = [];
	
	filter : any;
	pagin_page : number;
	pagin_size : number;
	pagin_total : number;

	ambitos : any;

	constructor(private ohService : OHService, public cse : CoreService, public acs : ADMCoreService, private modalService: NgbModal){
		
		super(ohService, cse, acs);

		this.pagin_page = 1;
		this.pagin_size = 10;
		this.instanceFilter();
		
		Promise.all([this.precarga]).then(values => {

			this.ambitos = [];
			var ambitosProyecto = [];
			var ambitosKeyId = [];
			
			for(var i in this.acs.data.proyecto_config){
				var item = this.acs.data.proyecto_config[i];
	
				if(item.descripcion == "sendgrid_key_id"){
	
					var proyecto = this.cse.data.user.systems.find(it => it.id == item.id);
	
					if(proyecto){
						this.ambitos.push({
							proyecto : proyecto.description,
							key_id : item.valor,
							seleccionado : true
						})
						ambitosProyecto.push(proyecto.description);
						ambitosKeyId.push('"'+item.valor+'"');
					}
	
				}
			}
	
			this.filter.fields.ambito.descValue = "["+ambitosProyecto.join(",")+"]";
			this.filter.fields.ambito.value = ambitosKeyId.join(",");
	
			this.list();

		});

	}

	ngOnInit(){
		this.cse.config.disableSeparator = true;
	}

	ngOnDestroy(){
		this.cse.config.disableSeparator = false;
	}

	instanceFilter(){

		this.filter = {};
		this.filter.field = {};
		this.filter.fields = {};

		this.filter.fields.ambito = {
			label : "Ámbito(s)",
			type : "",
			closeFilter : false
		};

		this.filter.fields.estado = {
			label : "Estado",
			type : "",
			closeFilter : true
		};

		this.filter.fields.fechaEnvio = {
			label : "Fecha envio",
			type : "fechaRango",
			initValue : null,
			endValue : null,
			closeFilter : true
		};

		this.filter.fields.destinatario = {
			label : "Destinatario",
			type : "",
			closeFilter : true
		};

		this.filter.fields.titulo = {
			label : "Título",
			type : "",
			closeFilter : true
		};
		
		this.filter.beforeFilter = () => {

			this.filter.fields = this.filter.field;

			var seleccionados = this.ambitos.filter(it => it.seleccionado == true);

			var ambitosProyecto = [];
			var ambitosKeyId = [];
			if(seleccionados.length>0){
				for(var i in seleccionados){
					ambitosProyecto.push(seleccionados[i].proyecto);
					ambitosKeyId.push('"'+seleccionados[i].key_id+'"');
				}
				this.filter.fields.ambito.descValue = "["+ambitosProyecto.join(",")+"]";
				this.filter.fields.ambito.value = ambitosKeyId.join(",");
			} else {
				this.filter.fields.ambito.descValue = "";
				this.filter.fields.ambito.value = "";		
			}

			var avisoEstado = "Todos";
			switch(this.filter.field.estado.value){
				case 'processing' : avisoEstado = "En proceso"; break;
				case 'delivered' : avisoEstado = "Enviado"; break;
				case 'not_delivered' : avisoEstado = "No enviado"; break;
			}
			this.filter.fields.estado.descValue = avisoEstado;

			if(this.filter.field.fechaEnvio){
				this.filter.fields.fechaEnvio.initValue = this.filter.field.fechaEnvio.initValue;
				this.filter.fields.fechaEnvio.endValue = this.filter.field.fechaEnvio.endValue;
			}

			if(this.filter.fields.destinatario.value && this.filter.fields.destinatario.value.length == 0){
				this.filter.fields.destinatario.value = null;
			}
			if(this.filter.fields.titulo.value && this.filter.fields.titulo.value.length == 0){
				this.filter.fields.titulo.value = null;
			}
     		this.filter.doFilter();
		};

		this.filter.doFilter = () => {
			this.list();
		};

	}

	list(){
		
		if(!this.cse.tieneRol(['admin']) && this.ambitos.filter(it => it.seleccionado == true).length == 0){
			this.ohService.getOH().getLoader().showError("No se encuentra una configuración de Sendgrid para algún proyecto, contactar al equipo de TI")
			return;
		}

		var query = [];
		
		if(this.filter.fields.fechaEnvio.initValue && this.filter.fields.fechaEnvio.endValue){
			var desde = this.ohService.getOH().getUtil().dateToStringTwo(this.filter.fields.fechaEnvio.initValue);
			var hasta = this.ohService.getOH().getUtil().dateToStringTwo(this.filter.fields.fechaEnvio.endValue);
			query.push('(last_event_time+BETWEEN+TIMESTAMP+'+encodeURIComponent('"'+desde+'T00:00:00.000Z"')+'+AND+TIMESTAMP+'+encodeURIComponent('"'+hasta+'T23:59:59.999Z"')+')')
		}

		if(this.filter.fields.ambito.value.length>0){
			query.push('(api_key_id+IN+('+encodeURIComponent(this.filter.fields.ambito.value)+'))');
		}
		
		if(this.filter.fields.destinatario.value){
			query.push('(to_email+LIKE+'+encodeURIComponent('"%'+this.filter.fields.destinatario.value+'%"')+')');
		}
		
		if(this.filter.fields.titulo.value){
			query.push('(subject+LIKE+'+encodeURIComponent('"%'+this.filter.fields.titulo.value+'%"')+')');
		}
		
		if(this.filter.fields.estado.value){
			query.push('(status+IN+('+encodeURIComponent('"'+this.filter.fields.estado.value+'"')+'))');
		}

		var myQuery = query.length>0?query.join("+AND+"):"";
		
		this.aDMPrincipalService.seglogEmailListarSendGrid({
            query : myQuery
        }, (resp : any) => {
			var obj = JSON.parse(resp);
			this.dateResult = obj.messages;
			this.pagin_total = this.dateResult.length;
			this.pagin_page = 1;
			this.changeList();
		});
		
	}

	changeList(){
		this.dateList = this.ohService.getOH().getUtil().paginateArray(this.dateResult, this.pagin_size, this.pagin_page);
	}

	correoDetalle : any;
	correoReenviar : boolean;
	correoModal : NgbModalRef;
	mostrarMensaje(msg_id : string){
		this.correoReenviar = false;
		this.aDMPrincipalService.gesemailObtenerEnvio({
            msg_id : msg_id.split(".")[0],
        }, (resp : pGesemailObtenerEnvio) => {
			if(resp){
				this.correoDetalle = resp;
				this.correoModal = this.modalService.open(this.modalDetalleCorreo, { size: 'lg' });
				this.correoModal.result.then((result) => {
				}, (reason) => {
				});
			} else {
				this.ohService.getOH().getAd().warning("El correo no tiene detalle");
			}

		});
	}

	reenviar(){
		this.aDMPrincipalService.gesemailReenviar({
			email_plantilla_id : this.correoDetalle.email_plantilla_id,
			destinatario : this.correoDetalle.destinatario,
			titulo : this.correoDetalle.titulo,
			mensaje : this.correoDetalle.mensaje,
		}, (resp : pGesemailReenviar) => {
			if(resp.resp_estado==1){
				this.correoModal.close();
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
			} else {
				this.ohService.getOH().getLoader().showError(resp.resp_mensaje);
			}
		});
	}

	detalleItem : any;
	verDetalle(msg_id : string){
		this.aDMPrincipalService.seglogEmailDetalle({
            msg_id : msg_id,
        }, (resp : any) => {
			this.detalleItem = JSON.parse(resp);
			var eventsStatus = [];
			for(var i in this.detalleItem.events){
				var item = this.detalleItem.events[i];
				if(item.event_name=="bounce" || item.event_name=="dropped"){
					eventsStatus.push({
						value : this.getEstado(item.event_name),
						status : 'error'
					});
				} else {
					eventsStatus.push({
						value : this.getEstado(item.event_name),
						status : 'complete'
					});
				}
			}
			this.detalleItem.eventsStatus = eventsStatus;
			this.modalService.open(this.modalDetalle, {size: 'lg'}).result.then((result) => {
			}, (reason) => {
			});
		});
	}

	getEstado(tipo : string){
		var estados = {
			processed : "Procesado",
			delivered : "Entregado",
			deferred : "Diferido",
			open : "Abierto",
			click : "Clickeado",
			bounce : "No Entregado",
			dropped : "Borrado"
		};
		return estados[tipo] || tipo;
	}

}
