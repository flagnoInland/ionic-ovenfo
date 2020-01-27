import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMTerminoServiceJPO, pGesterminoEditar, pGesterminoRegistrar } from 'src/app/module/ADM/service/adm.aDMTerminoService';

@Component({
  templateUrl: './adm.termEdit.html'
})
export class TermEdit extends ADMBase {

	private aDMTerminoService : ADMTerminoServiceJPO;

	id : any;
	item : any = {};
	descripConfig : any;

	constructor(private route: ActivatedRoute, private router :Router, private ohService : OHService, public coreService : CoreService, public acs : ADMCoreService){
		super(ohService, coreService, acs);

		this.aDMTerminoService = new ADMTerminoServiceJPO(ohService);
		this.descripConfig = coreService.tinymceConfig;

		this.item = {
			estado : "1"
		}

	}

	sub : any;
	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			if(params['id']){
				var item_ = this.storage.item("APM_ADM_DATA", "selectedTermEdit");
				this.item = {
					termino_id : item_.termino_id,
					menu_id : item_.menu_id,
					version : item_.version,
					descripcion : item_.descripcion,
					estado : item_.estado
				}
			}
		});
		this.ohService.getOH().getLoader().close();
	}

	registrar(){
		(this.item.termino_id) ? this.edit() : this.register()
	}

	edit(){
		this.aDMTerminoService.gesterminoEditar({
			Termino_id : this.item.termino_id,
			Version : this.item.version,
			Descripcion : this.item.descripcion,
			EstadoActivo : this.item.estado,
			Usuario_id : this.coreService.data.user.data.userid
		}, (resp : pGesterminoEditar) => {
			if (resp.estado == 1) {
				this.ohService.getOH().getAd().success(resp.mensaje);
				this.router.navigate(['../../'], { relativeTo: this.route });
			} else {
				this.ohService.getOH().getAd().warning(resp.mensaje);
			}
		});
	}

	register(){
		this.aDMTerminoService.gesterminoRegistrar({
			Menu_id : this.item.menu_id,
			Unidad_negocio_id : this.coreService.data.user.profile,
			Version : this.item.version,
			Descripcion : this.item.descripcion,
			EstadoActivo : this.item.estado,
			Usuario_id : this.coreService.data.user.data.userid
		}, (resp : pGesterminoRegistrar) => {
			if (resp.estado == 1) {
				this.ohService.getOH().getAd().success(resp.mensaje);
				this.router.navigate(['../'], { relativeTo: this.route });
			} else {
				this.ohService.getOH().getAd().warning(resp.mensaje);
			}
		});
	}

	clean(){
		
	}

}