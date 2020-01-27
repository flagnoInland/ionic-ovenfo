import { Component, AfterViewInit, OnInit } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';
import { ADMTerminoServiceJPO, pGesterminoListar } from 'src/app/module/ADM/service/adm.aDMTerminoService';

@Component({
  templateUrl: './adm.term.html'
})
export class Term extends ADMBase implements OnInit, AfterViewInit {

	private aDMTerminoService : ADMTerminoServiceJPO;

	dateList : any = [];

	public filter: any;
	public pagin: any;


	constructor(private ohService : OHService, public coreService : CoreService, public acs : ADMCoreService){
		super(ohService, coreService, acs);
		this.aDMTerminoService = new ADMTerminoServiceJPO(ohService);
		this.filtroTab();
	}

	ngOnInit(){
		this.coreService.config.disableSeparator = true;
	}

	ngAfterViewInit(){
	}

	ngOnDestroy(){
		this.coreService.config.disableSeparator = false;
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
			}
		};
	}

	list(){

        this.aDMTerminoService.gesterminoListar({
			Page : this.pagin.page,
			Size: this.pagin.size_rows
        }, (resp : pGesterminoListar) => {
			this.dateList = resp.terminos;
			this.pagin.total = resp.response.total;
		});
		
	}

	editar(indice : number){
		this.storage.add("APM_ADM_DATA", "selectedTermEdit",this.dateList[indice]);
	}

}