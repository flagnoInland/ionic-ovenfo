import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { environment } from '../../../environments/environment';

import { Ad, Loader, Camera } from './../../ohCore/components/oh.core';

import { shared } from 'src/environments/environmentShared';
import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';
import { ohStorage } from 'src/app/ohCore/services/oh.core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ind-body',
  templateUrl: './ovn.body.html'
})

export class OVNBody implements OnInit, AfterViewInit {

	@ViewChild("loaderId", { static: true }) objLoader : Loader;
	@ViewChild("adId", { static: true }) objAd : Ad;
	@ViewChild("cameraId", { static: true }) objCamera : Camera;
	
	myStorage : ohStorage;
    
	constructor(private ohService : OHService, private cse : CoreService, private router: Router, private route: ActivatedRoute){

		this.myStorage = new ohStorage();

		cse.config.jpo = {
			restSuffix : (environment.env=='local' || environment.env=='production')?'':environment.env,
			hosts : {
				main : {
					url : environment.protocol+"://"+environment.host, 
					rest : environment.rest, 
					service : environment.service
				}
			}
		};
		cse.config.formatDate = "dd/MM/yyyy";
		cse.config.formatDateTime = "dd/MM/yyyy HH:mm:ss";

		if(this.myStorage.has("APM_DATA")){
			this.cse.data.user = this.myStorage.get("APM_DATA");
			this.router.navigate(["/be"], { relativeTo: this.route });
			/*if(this.cse.data.user.origin){
				this.myStorage.set("ORG", {origin : this.cse.data.user.origin});
			}*/
		}
	}
    
	ngOnInit() {

		this.ohService.initialize(this.objLoader, this.objAd, this.objCamera, {
			emailAdm : shared.support.email,
			number : shared.support.number,
			annexed : shared.support.anex,
			title : shared.support.title
		}, this.cse.config, this.cse.inland_main.logs);
	}

	ngAfterViewInit() {
		var child = document.getElementById("tisContent");
		child.parentNode.removeChild(child);
	}

}