import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CoreService } from 'src/app/ind.coreService';

@Component({
  selector: 'ind-main',
  templateUrl: './ind.main.html',
  styleUrls: ['./ind.main.css']
})

export class Main implements OnInit {

	daysChange : number;
	daysChangeFV : boolean;
	message;

	constructor(private router :Router, public cse : CoreService){
		this.daysChangeFV = true;
	}

	ngOnInit(){
		this.daysChange = this.cse.data.user.data.daysChangekey;
		if(this.daysChange <= 0){
			this.router.navigate(["/Be/PasswordChange"]);
		} else {
			if(localStorage.getItem("APM_DATA")){ // If has one project load automatically
				var currents = this.cse.data.user.systemByProfile.filter(it => it.profileId == this.cse.data.user.profile);
				if(currents.length == 1 && this.cse.data.roles.length>0){
					this.loadModule(this.cse.data.roles[0]);
				}
			}
		}

	}

	loadModule(rol : any){
		this.cse.toLoadModule(rol);
	}

}