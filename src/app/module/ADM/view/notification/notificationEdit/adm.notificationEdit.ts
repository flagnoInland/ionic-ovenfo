import { Component, AfterViewInit, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from './../../../adm.coreService';
import { ADMBase } from './../../../adm.base';
import { ADMNotificationServiceJPO, pSegnotificacionObtener, pSegnotificacionRegistrar, pSegnotificacionEditar } from '../../../service/adm.aDMNotificationService';
import { ADMUsuarioServiceJPO, pSegusuarioListar } from '../../../service/adm.aDMUsuarioService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './adm.notificationEdit.html'
})
export class NotificationEdit extends ADMBase implements OnInit, AfterViewInit {
	
	@ViewChild('modalPrueba', { static: true }) modalPrueba : ElementRef;
	
	private aDMUsuarioService : ADMUsuarioServiceJPO;
	private aDMNotificationService : ADMNotificationServiceJPO;
	
	objAdd : any;
	isEdit : boolean;
	
	roles_list : any;
	roles_xml : any;
	roles_concat : any;

	descripConfig : any;

	constructor(private router :Router, private route: ActivatedRoute, private ohService : OHService, public cse : CoreService, public acs : ADMCoreService, private modalService: NgbModal){
		super(ohService, cse, acs);
		
		this.aDMUsuarioService = new ADMUsuarioServiceJPO(ohService);
		this.aDMNotificationService = new ADMNotificationServiceJPO(ohService);

		this.objAdd = {
			nivel : true,
			unica_vez : false,
			unica_alerta : false,
			estado : true,
			instanteNotification : true,
			hora_caducidad : {hour: 23, minute: 59}
		};
		this.roles_list = [];
		this.roles_xml = "";

		this.descripConfig = cse.tinymceConfig;

	}

	sub : any;
	ngOnInit(){

		this.sub = this.route.params.subscribe(params => {
			if(params.id){
				this.aDMNotificationService.segnotificacionObtener({
					Notificacion_id : params.id
				}, (resp : pSegnotificacionObtener) => {
					this.isEdit = true;
					this.objAdd = resp.add;
					this.objAdd.nivel = (this.objAdd.nivel=='2')?true:false;
					this.objAdd.unica_vez = (this.objAdd.unica_vez=='1')?true:false;
					this.objAdd.unica_alerta = (this.objAdd.unica_alerta=='1')?true:false;
					this.objAdd.estado = (this.objAdd.estado=='1')?true:false;
					var listRol = [];
					this.roles_list = [];
					for(var item of resp.roles){
						listRol.push(item.rol_id);
						this.roles_list.push({
							id : item.rol_id
						})
					}
				});
			}
		});

	}
	ngOnDestroy(){
	}

	ngAfterViewInit(){
		this.ohService.getOH().getLoader().close();
	}

	doProcess(){
		if(this.isEdit){
			this.edit();
		} else {
			this.register();
		}
	}

	register(){
        this.aDMNotificationService.segnotificacionRegistrar({
            titulo : this.objAdd.titulo,
            subtitulo : this.objAdd.subtitulo,
            descripcion : this.objAdd.descripcion,
            icono : this.objAdd.icono,
            nivel : (this.objAdd.nivel)?'2':'1',
            unica_vez : (this.objAdd.unica_vez)?'1':'0',
            unica_alerta : (this.objAdd.unica_alerta)?'1':'0',
            fecha_caducidad : this.ohService.getOH().getUtil().dateTimeToString(this.objAdd.fecha_caducidad),
            estadoNotificacion : (this.objAdd.estado)?'1':'0',
            roles : this.roles_xml,
            usuario_id : this.cse.data.user.data.userid
        }, (resp : pSegnotificacionRegistrar) => {
			if(resp.estado == 1){
				this.sincronizar(() => {
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.router.navigate(['../'], { relativeTo: this.route }); 
				});
			} else {
				if(resp.estado == 0){
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			}
        });
	}

	edit(){
        this.aDMNotificationService.segnotificacionEditar({
            notificacion_id : this.objAdd.notificacion_id,
			titulo : this.objAdd.titulo,
            subtitulo : this.objAdd.subtitulo,
            descripcion : this.objAdd.descripcion,
            icono : this.objAdd.icono,
           	nivel : (this.objAdd.nivel)?'2':'1',
            unica_vez : (this.objAdd.unica_vez)?'1':'0',
            unica_alerta : (this.objAdd.unica_alerta)?'1':'0',
            fecha_caducidad : this.ohService.getOH().getUtil().dateTimeToString(this.objAdd.fecha_caducidad),
           	estadoNotificacion : (this.objAdd.estado)?'1':'0',
            roles : this.roles_xml,
            usuario_id : this.cse.data.user.data.userid
        }, (resp : pSegnotificacionEditar) => {
			if(resp.estado == 1){
				this.sincronizar(() => {
					this.ohService.getOH().getAd().success(resp.mensaje);
					this.router.navigate(['../../'], { relativeTo: this.route }); 
				});
			} else {
				if(resp.estado == 0){
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			}
        });
	}

	sincronizar(call ?: any){
		if(this.objAdd.instanteNotification){
			var listado = this.cse.inland_main.usuarios_conectados.listar().subscribe((usuarios : any) => {
				var users = []
				for(var i in usuarios){
					users.push(usuarios[i].userid);
				}
				
				this.aDMUsuarioService.segusuarioListar({
					usuarios_id : users.join(","),
					roles : this.roles_concat,
					Page : 1,
					Size : 10
				}, (resp : pSegusuarioListar) => {
					for(var item of resp.lista){
						var usuario = usuarios.find(it => it.userid == item.usuario_id);
						if(usuario){
							usuario.conexion_accion = 2;
							this.cse.inland_main.usuarios_conectados.editar(usuario);
						}
					}
					if(call){
						call();
					}
				});
				listado.unsubscribe();
			})
		} else {
			if(call){
				call();
			}
		}
	}

	vistaPrevia(){
		this.modalService.open(this.modalPrueba, {
			ariaLabelledBy: 'modal-basic-title',
			windowClass: 'dark-modal'
		}).result.then((result) => {
		}, (reason) => {
		});
	}

}