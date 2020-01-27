import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { ADMCoreService } from 'src/app/module/ADM/adm.coreService';
import { ADMBase } from 'src/app/module/ADM/adm.base';

@Component({
	templateUrl: './adm.logweb.html'
})
export class Logweb extends ADMBase implements OnInit, AfterViewInit, OnDestroy {

	public pagin: any;
    public filter: any;

	itemObs : any;
	items : any;
	logs : any;

	constructor(private ohService : OHService, public cse : CoreService, public acs : ADMCoreService){
		super(ohService, cse, acs);


		this.itemObs = null;
		this.items = [];
		this.logs = [];
		this.pagin = {
			page: 1,
			total: 0,
			size_rows: 10,
		};

        Promise.all([this.precarga, this.prelistado()]).then(values => {
			this.filtroTab();
		});
		
	}

	ngOnInit(){

	}

	ngAfterViewInit(){
        this.cse.config.disableSeparator = true;
	}

	filtroTab(){
		this.filter = {
			startList : false,
			field : {},
			fields : {
            }
		};
    }

	ngOnDestroy(){
        this.cse.config.disableSeparator = false;
		if(this.itemObs){
			this.itemObs.unsubscribe();
		}
	}

	prelistado(){
		return new Promise((resolve, reject) => {
			this.itemObs = this.cse.inland_main.logs.listar().subscribe((items) => {
				for(var i in items){
					items[i].fecha = new Date(items[i].fecha.seconds*1000);
				}
				this.items = items;
				this.pagin.total = items.length;
				resolve();
			});
        });
	}

	listar(){
		this.logs = this.ohService.getOH().getUtil().paginateArray(this.items, this.pagin.size_rows, this.pagin.page);
		console.log(this.logs);
	}

}
