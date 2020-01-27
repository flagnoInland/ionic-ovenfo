import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMVersionServiceJPO, pSegversionListar } from '../../service/adm.aDMVersionService';

@Component({
	templateUrl: './adm.version.html'
})
export class Version extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

	private bUIVersionService : ADMVersionServiceJPO;

	dateList : any;
	pagin_page : number;
	pagin_size : number;
	pagin_total : number;

	constructor(private ohService : OHService, public cse : CoreService, public acs : ADMCoreService){
		super(ohService, cse, acs);
		this.pagin_page = 1;
		this.pagin_size = 10;
		this.bUIVersionService = new ADMVersionServiceJPO(ohService);
		this.dateList = [];
	}

	ngOnInit(){
		this.cse.config.disableSeparator = true;
		this.list();
	}
	ngOnDestroy(){
		this.cse.config.disableSeparator = false;
	}
	ngAfterViewInit(){
	}

	list(){
		this.bUIVersionService.segversionListar({
			Sistema_id : 1,
            Page : this.pagin_page,
            Size : this.pagin_size
		}, (resp : pSegversionListar) => {
			this.pagin_total = resp.response.total;
			this.dateList = resp.versions;
		})
	}

	onEdit(item : any){
		this.storage.add("APM_ADM_DATA", "selectedEdit", item);
	}

}