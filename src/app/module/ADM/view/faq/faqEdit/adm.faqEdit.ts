import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMFaqServiceJPO, pGesfaqEditar, pGesfaqRegistrar } from 'src/app/module/ADM/service/adm.aDMFaqService';

@Component({
  templateUrl: './adm.faqEdit.html'
})
export class FaqEdit extends ADMBase {

	private aDMFaqService : ADMFaqServiceJPO;

	id : any;
	item : any = {};
	descripConfig : any;

	constructor(private route: ActivatedRoute, private router :Router, private ohService : OHService, public coreService : CoreService, public acs : ADMCoreService){
		super(ohService, coreService, acs);

		this.aDMFaqService = new ADMFaqServiceJPO(ohService);
		this.descripConfig = coreService.tinymceConfig;

		this.item = {
			estado : "1"
		}

	}

	sub : any;
	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			if(params['id']){
				var item_ = this.storage.item("APM_ADM_DATA", "selectedFaqsEdit");
				this.item = {
					faq_id : item_.faq_id,
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
		(this.item.faq_id) ? this.edit() : this.register()
	}

	edit(){
		this.aDMFaqService.gesfaqEditar({
			Faq_id : this.item.faq_id,
			Version : this.item.version,
			Descripcion : this.item.descripcion,
			EstadoActivo : this.item.estado,
			Usuario_id : this.coreService.data.user.data.userid
		}, (resp : pGesfaqEditar) => {
			if (resp.estado == 1) {
				this.ohService.getOH().getAd().success(resp.mensaje);
				this.router.navigate(['../../'], { relativeTo: this.route });
			} else {
				this.ohService.getOH().getAd().warning(resp.mensaje);
			}
		});
	}

	register(){
		this.aDMFaqService.gesfaqRegistrar({
			Menu_id : this.item.menu_id,
			Unidad_negocio_id : this.coreService.data.user.profile,
			Version : this.item.version,
			Descripcion : this.item.descripcion,
			EstadoActivo : this.item.estado,
			Usuario_id : this.coreService.data.user.data.userid
		}, (resp : pGesfaqRegistrar) => {
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