import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ohStorage } from './ohCore/services/oh.core';
import { CoreService } from 'src/app/ind.coreService';

@Injectable()
export class tisCanActivate implements CanActivate {

  myStore : ohStorage;
  
  constructor(private router: Router, private cse : CoreService) {
    this.myStore = new ohStorage();
  }

  canActivate(route: ActivatedRouteSnapshot) {
    if(this.myStore.has("APM_DATA")){
      var urlId = route["_routerState"]["url"];
      if(route.routeConfig.loadChildren){
        var finded = this.myStore.get("APM_DATA").systems.filter(sys => sys.id.trim() == route.routeConfig.path);
        if(finded.length > 0){
          return this.cse.validateBeforeUnload(urlId);
        } else {
          return false;
        }
      } else {
        return this.cse.validateBeforeUnload(urlId);
      }
    } else {
      this.cse.logoutHref();
    }
    return false;
  }

}