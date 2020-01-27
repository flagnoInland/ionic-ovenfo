import { Component, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ohLeftMenu } from './../../ohCore/animations/oh.core';

import { ohStorage } from '../../ohCore/services/oh.core';
import { CoreService } from 'src/app/ind.coreService';
import { OHService } from 'src/app/tis.ohService';
import { shared } from 'src/environments/environmentShared';
import { UserServiceJPO, pSegloginSincronizar } from 'src/app/service/tis.userService';

@Component({
  selector: 'ind-menu',
  animations: [ohLeftMenu],
  templateUrl: './ind.menu.html',
  styleUrls: ['./ind.menu.css']
})

export class Menu {

	private userService : UserServiceJPO;

	baseBe : string;
	storage : ohStorage;

	@Input() openMenu : boolean;

	treeChild : any;

	constructor(private router: Router, private cse : CoreService, private ohService : OHService) {
		this.userService = new UserServiceJPO(ohService);
		this.baseBe = shared.baseBackEnd;
		this.treeChild = [];
		this.storage = new ohStorage();
		router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
			this.treeChild = [];
			if(cse.data && cse.data.routeRol){
				if(e["url"]=="/" || e["url"]=="/"+shared.baseBackEnd+"/Main"){
					this.changeMenu();
				} else {
					this.treeChild = cse.getTreeChild(e["url"]);
				}
			}
		});

	}

	changeMenu(){
		this.treeChild = [];
		if(this.cse.data && this.cse.data.routeRol){
			for(var subPart in this.cse.data.routeRol){
				var subParts = subPart.split("/");
				if(subParts.length==3 && !this.cse.data.routeRol[subPart].hasId){
					this.treeChild.push(this.cse.data.routeRol[subPart].list[0]);
				}
			}
		}
	}

	changeProfile(profile_id : any){
		this.cse.data.user.profile = profile_id;
		this.cse.setUserOptions(this.cse.getUO());
		this.storage.add("APM_DATA", "profile", this.cse.data.user.profile);
		this.cse.buildMenu();
		if(this.router.url!="/"+shared.baseBackEnd+"/Main"){
			this.router.navigate([shared.baseBackEnd+"/Main"]);
		} else {
			var currents = this.cse.data.user.systemByProfile.filter(it => it.profileId == this.cse.data.user.profile)
			if(currents.length == 1 && this.cse.data.roles.length>0){
				this.cse.toLoadModule(this.cse.data.roles[0]);
			}
		}
		this.changeMenu();
	}

	sincronizar(){
        this.userService.segloginSincronizar({
            usuario_id : this.cse.data.user.data.userid,
            sistema_id : 1
        }, (resp : pSegloginSincronizar) => {

			for(var i = 0; i < this.cse.data.user.systems.length; i++){
				this.storage.remove("APM_"+this.cse.data.user.systems[i].id.trim().toUpperCase()+"_DATA");
			}

			resp.data.token = this.cse.data.user.data.token;
			resp['origin'] = this.cse.data.user.origin;
			resp['password'] = this.cse.data.user.password;
			resp['profile'] = this.cse.obtenerPerfil(resp.profiles);

			this.storage.remove("APM_FILTER");
			this.storage.set("APM_DATA", resp);
			this.cse.data.user = resp;

			this.cse.setUserOptions(this.cse.getUO());
			this.cse.buildMenu();
			this.cse.mapRol();
			this.router.navigate([shared.baseBackEnd+"/Main"]);

        });
	}

	obtenerNombre(){
		var item = this.cse.data.user.profiles.find(it => it.id == this.cse.data.user.profile);
		if(item){
			return item.businessName;
		}
	}

}