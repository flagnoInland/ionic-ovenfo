import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { Router, ActivatedRoute } from '@angular/router';
import { ADMVersionServiceJPO, pSegversionEditar } from '../../../service/adm.aDMVersionService';

@Component({
	templateUrl: './adm.versionEdit.html'
})
export class VersionEdit extends ADMBase implements OnInit, AfterViewInit, OnDestroy {
	
	private bUIVersionService : ADMVersionServiceJPO;

	objVersion : any;
	descripConfig : any;

	constructor(private ohService : OHService, public cse : CoreService, public ccs : ADMCoreService, private router : Router, private route: ActivatedRoute){
		super(ohService, cse, ccs);
		this.bUIVersionService = new ADMVersionServiceJPO(ohService);

		this.objVersion = {
			fecha_inicio : ohService.getOH().getUtil().dateToNgb(new Date()),
			fecha_fin : ohService.getOH().getUtil().dateToNgb(new Date()),
			fecha_despliegue : ohService.getOH().getUtil().dateToNgb(new Date()),
			nivel : '2',
			estado : '1',
			instanteNotification : true,
			forceUpdate : true
		};

		this.descripConfig = cse.tinymceConfig;
	}

	sub : any;
	ngOnInit(){

		this.sub = this.route.params.subscribe(params => {
			var item = this.storage.item("APM_ADM_DATA", "selectedEdit");
			if(item){
				this.objVersion = item;
				this.objVersion.fecha_inicio = this.ohService.getOH().getUtil().dateToNgb(this.objVersion.fecha_inicio);
				this.objVersion.fecha_fin = this.ohService.getOH().getUtil().dateToNgb(this.objVersion.fecha_fin);
				this.objVersion.fecha_despliegue = this.ohService.getOH().getUtil().dateToNgb(this.objVersion.fecha_despliegue);
				this.storage.subtract("APM_ADM_DATA", "selectedEdit");
				this.ohService.getOH().getLoader().close();
			}
		});

	}
	ngOnDestroy(){
	}

	ngAfterViewInit(){
		this.ohService.getOH().getLoader().close();
	}

	doProcess(){
		this.bUIVersionService.segversionEditar({
			Version_id : this.objVersion.version_id,
			Version : this.objVersion.version,
            Descripcion : this.objVersion.descripcion,
            Fecha_inicio : this.ohService.getOH().getUtil().dateNgbToString(this.objVersion.fecha_inicio),
            Fecha_fin : this.ohService.getOH().getUtil().dateNgbToString(this.objVersion.fecha_fin),
            Fecha_despliegue : this.ohService.getOH().getUtil().dateNgbToString(this.objVersion.fecha_despliegue),
            EstadoVersion :this.objVersion.estado,
            Nivel : this.objVersion.nivel,
            Usuario_id : this.cse.data.user.data.userid
		}, (resp : pSegversionEditar) => {
			if(resp.estado == 1){
				this.actualizarVersion();
				this.ohService.getOH().getAd().success(resp.mensaje);
				this.router.navigate(['../../'], { relativeTo: this.route }); 
			} else {
				if(resp.estado == 0){
					this.ohService.getOH().getLoader().showError(resp.mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.mensaje);
				}
			}
    	});
	}

	actualizarVersion(){
		if(this.objVersion.instanteNotification){
			this.cse.inland_main.editar({
				habilitar_log : false,
				version : this.objVersion.version,
				version_actualizacion : this.objVersion.forceUpdate?1:2
			});
		} else {
			this.cse.inland_main.editar({
				habilitar_log : false,
				version : this.objVersion.version,
				version_actualizacion : 0
			});
		}
	}
}