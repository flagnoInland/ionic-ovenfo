import { Component, AfterViewInit, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { ADMCoreService } from './../../adm.coreService';
import { ADMBase } from './../../adm.base';

@Component({
  templateUrl: './adm.main.html'
})
export class ADMMain extends ADMBase implements OnInit, AfterViewInit {

	constructor(private router :Router, private ohService : OHService, public cse : CoreService, public acs : ADMCoreService){
		super(ohService, cse, acs);
	}

	ngOnInit(){
	}

	ngAfterViewInit(){
		this.ohService.getOH().getLoader().close();
	}


}