import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ohStorage } from './ohCore/services/oh.core';
import { CoreService } from 'src/app/ind.coreService';

@Injectable()
export class tiscanActivatePreferences implements CanActivate {

  myStore : ohStorage;
  
  constructor(private router: Router, private cse : CoreService) {
    this.myStore = new ohStorage();
  }

  canActivate(route: ActivatedRouteSnapshot) {
    if(this.myStore.has("APM_DATA")){
      var data = this.myStore.item("APM_DATA", "data");
      var urlId = route["_routerState"]["url"];
      if(data.source == "IND"){
        return this.cse.validateBeforeUnload(urlId);
      } else {
        return false;
      }
    } else {
      this.cse.logoutHref();
    }
    return false;
  }

}