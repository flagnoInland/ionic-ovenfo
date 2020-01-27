import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PlatformLocation } from '@angular/common';
import { Subscription } from 'rxjs';

/*  HTML
		<div class="input-group">
		  <input type="text" class="form-control" [(ngModel)]="vinId" ohFocusOnInit aria-label="Código VIN" placeholder="Código VIN" (keydown.enter)="searchVin()" maxlength="20">
		  <div class="input-group-append">
		    <span class="input-group-text" (click)="searchVin(); $event.preventDefault();"><i class="fa fa-search" aria-hidden="true"></i> Buscar</span>
			<span class="input-group-text btn btn-info" [ohZxingReader]="'qr'" (ohZxingResponse)="zxingVIN($event)"><i class="fas fa-qrcode"></i></span>
		  </div>
    </div>
    TS
    zxingVIN(event: any){
      event.response.returnValue((value : string) => {
        this.vinId = value;
        this.searchVin();
      });
      event.response.error((id : number, error : string) => {
        this.vinNotFound = true;
        if(id == 1){
          this.vinSearchResponse = "Funcionalidad sólo permitida para dispositivos Android";
        }
        if(id == 2){
          this.vinSearchResponse = "Funcionalidad sólo permitida en Chrome";
        }
        if(id == 3){
          this.vinSearchResponse = "El App Barcode Scanner no se encuentra en tu dispositivo, instálelo primero";
        }
      });
    }
*/
// <input type="text" ... ohZxingReader ...>
@Directive({
  selector: '[ohZxingReader]'
})
export class ZxingReader {

  @Input('ohZxingReader') paramName: string;
	response: any;
  @Output() ohZxingResponse: EventEmitter<any>;
  
  private _routerSub = Subscription.EMPTY;

  myHref: string;

  inUse : boolean;

  constructor(private platformLocation: PlatformLocation, private elemento: ElementRef, private router: Router, private activatedRoute: ActivatedRoute) {

    this.ohZxingResponse = new EventEmitter<string>();
    this.myHref = (platformLocation as any).location.href;

    this.inUse = false;

    this._routerSub = router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {

      var params = Object.assign({}, {}, this.activatedRoute.snapshot.queryParams);
      
      if(params[this.paramName] && this.inUse) {
        this.inUse = false;
        this.responseReturn((call: any) => {
          call(params[this.paramName]);
        });

        delete params[this.paramName];
        setTimeout(()=>{
          this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: params });
        });
        
      } else if(params[this.paramName+"OZE"]){

        this.responseError((call: any) => {
          call(3, "You need to install Barcore Scanner from Google Playstore");
        });

        delete params[this.paramName+"OZE"];
        setTimeout(()=>{
          this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams: params });
        });
        window.open("https://play.google.com/store/apps/details?id=com.google.zxing.client.android", "_blank");

      }

    });

  }

  responseBoforeOpen(fbeforeOpen){
    this.ohZxingResponse.emit({response : {
      beforeOpen : fbeforeOpen,
      returnValue : function(call : any){},
      error : function(call : any){}
    }});
  }

  responseReturn(fReturn : any){
    this.ohZxingResponse.emit({response : {
      beforeOpen : function(call : any){},
      returnValue : fReturn,
      error : function(call : any){}
    }});
  }

  responseError(fError : any){
    this.ohZxingResponse.emit({response : {
      beforeOpen : function(call : any){},
      returnValue : function(call : any){},
      error : fError
    }});
  }

  @HostListener('click', ['$event'])
	onClick(event: Event) {
    
    event.preventDefault();
    this.inUse = true;
    /*return this.testMode();*/
    this.responseBoforeOpen((call: any) => {
      call();
    });
    // For testing
    
   /*this.responseReturn((call: any) => {
      //call('{"comodato_id":4033,"booking":"SLN166627","tipo":"IMPO"}');
      //call('4033');
      call('{"dateId": 20144,"booking":"966687143"}');
    });*/
    
    if(!/Android/i.test(navigator.userAgent)){
      this.responseError((call: any) => {
        call(1, "Your operation system must be Android");
      });
      this.inUse = false;
    } else if(!(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor))) {
      this.responseError((call: any) => {
        call(2, "Your browser must be Chrome");
      });
      this.inUse = false;
    } else {
      var parametrosA = Object.assign({}, {}, this.activatedRoute.snapshot.queryParams);
      parametrosA[this.paramName] = "{CODE}"; // this.myHref+"?"+this.paramName+"={CODE}"
      var urlValue = this.getNew(this.myHref, parametrosA);
      urlValue = encodeURIComponent(urlValue);
          
      var parametrosB = Object.assign({}, {}, this.activatedRoute.snapshot.queryParams);
      parametrosB[this.paramName+"OZE"] = "1";
      var urlError = this.getNew(this.myHref, parametrosB);
      urlError = encodeURIComponent(urlError);
        
      window.location.href = "intent://scan/?ret="+urlValue+"#Intent;scheme=zxing;package=com.google.zxing.client.android;S.browser_fallback_url="+urlError+";end";
    }
    
  }

  private testMode(){
    var parametrosA = Object.assign({}, {}, this.activatedRoute.snapshot.queryParams);
    parametrosA[this.paramName] = "23123"; // this.myHref+"?"+this.paramName+"={CODE}"
    var urlValue = this.getNew(this.myHref, parametrosA);
    window.location.href = urlValue+"?qr=23123";
    return;
  }
  getNew(url : string, params : any){
    var eurl = url.split("?")[0];
    eurl +="?";
    for(var id in params){
      eurl += id+"="+params[id]+"&";
    }
    return eurl.substring(0, eurl.length - 1);
  }
  
  ngOnDestroy(){
      this._routerSub.unsubscribe();
  }

}