import { Injectable } from '@angular/core';

import { Loader, Ad, Camera } from './ohCore/components/oh.core';
import { MainService } from './ohCore/services/oh.mainService';
import { INLANDLog } from './firebase/log';

@Injectable()
export class OHService {

  constructor(private ohMainService : MainService){}

  public getOH(){
    return this.ohMainService;
  }

  public initialize(loader : Loader, aviso : Ad, camera : Camera, loaderAttributes : any, data : any, logs ?: INLANDLog){
    loader.setAttributes(loaderAttributes);
    this.ohMainService.setLoader(loader);
    this.ohMainService.setAd(aviso);
    this.ohMainService.setCamera(camera);
    this.ohMainService.setData(data);
    this.ohMainService.setLogs(logs);
  }

}