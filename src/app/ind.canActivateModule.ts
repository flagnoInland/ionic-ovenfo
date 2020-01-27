import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ohStorage } from './ohCore/services/oh.core';
import { CoreService } from 'src/app/ind.coreService';

@Injectable()
export class tisCanActivateModule implements CanActivate {

  myStore : ohStorage;
  
  constructor(private router: Router, private cse : CoreService) {
    this.myStore = new ohStorage();
  }

  canActivate(route: ActivatedRouteSnapshot) {
    if(this.myStore.has("APM_DATA")){
      var data = this.myStore.get("APM_DATA");
      var urlId = route["_routerState"]["url"];

      if(data["routeRol"][urlId]){
        return this.cse.validateBeforeUnload(urlId);
      } else {
        var searches = [];
        for(var i in data["routeRol"]){
          if(data["routeRol"][i].hasId){
            searches.push(i);
          }
        }
        // Validating if has childrens
        if(this.hasIds(data["routeRol"], searches, urlId)){
          return this.cse.validateBeforeUnload(urlId);
        } else {
          return false;
        }
      }
    } else {
      this.cse.logoutHref();
    }
    return false;
  }

  hasIds(routeRol : any, searches : any, url : string){
    if(searches.length>0){
      for(var i in searches){ // only that has id
        if(url.indexOf(searches[i]) >= 0){ // if find related
          var sizeUrl = url.split("/");
          var sizeRoute = searches[i].split("/");
          if(sizeUrl.length == sizeRoute.length + 1){
            return this.cse.validateBeforeUnload(url);
          } else {
            sizeUrl.splice(sizeRoute.length, 1);
            var newUrl = sizeUrl.join("/");
            if(routeRol[newUrl]){
              if(routeRol[newUrl].hasId){
                searches.splice(i, 1);
                return this.hasIds(routeRol, searches, newUrl);
              } else {
                return this.cse.validateBeforeUnload(url);
              }
            } else {
              return false;
            }
          }
        }
      }
    } else {
      return this.cse.validateBeforeUnload(url);
    }
  }

}