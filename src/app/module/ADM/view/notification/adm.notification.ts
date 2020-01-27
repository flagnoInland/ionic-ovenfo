import { Component, AfterViewInit, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { ADMBase } from '../../adm.base';
import { ADMNotificationServiceJPO, pSegnotificacionListar } from '../../service/adm.aDMNotificationService';
import { ADMCoreService } from '../../adm.coreService';

@Component({
  templateUrl: './adm.notification.html'
})
export class Notification extends ADMBase implements OnInit, AfterViewInit {

	private aDMNotificationService : ADMNotificationServiceJPO;

	adds : any;

	pagin: any;
	filter : any;

	constructor(private router :Router, private ohService : OHService, public coreService : CoreService, public acs : ADMCoreService){
		super(ohService, coreService, acs);

		this.aDMNotificationService = new ADMNotificationServiceJPO(ohService);
		this.adds = [];
		this.filtroTab();

	}

	filtroTab(){
		this.pagin = {
			page: 1,
			total: 0,
			size_rows: 10,
		};
		this.filter = {
			startList : false,
			field : {},
			fields : {
				roles : {
					label : "Roles",
					type : "list",
					closeFilter : true
				}
			}
		};
	}

	ngOnInit(){
		this.coreService.config.disableSeparator = true;
		this.list();
	}
	ngOnDestroy(){
		this.coreService.config.disableSeparator = false;
	}
	ngAfterViewInit(){
		this.filter.startList = true;
	}

	list(){
        this.aDMNotificationService.segnotificacionListar({
			roles : this.filter.fields.roles.concatValue,
			Page : this.pagin.page,
			Size : this.pagin.size_rows
        }, (resp : pSegnotificacionListar) => {
			for(var item of resp.adds){
				item['roles_lista'] = this.ohService.getOH().getUtil().StringXMLtoJSONList(item.roles);
			}
			this.adds = resp.adds;
			this.pagin.total = resp.response.total;
        });
	}

}