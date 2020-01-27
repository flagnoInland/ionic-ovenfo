import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Loader, Ad, Camera } from './../components/oh.core';
import { Jpo, Util } from './oh.core';
import { INLANDLog } from 'src/app/firebase/log';

@Injectable()
export class MainService {

  private loader: Loader;
  private ad: Ad;
  private camera: Camera;
  private util: Util;
  data : any;
  log : INLANDLog;

  //private token : string;
  private shareJpoConfig : any;
  
  constructor(private _http: HttpClient, private serviceModal: NgbModal){
    this.util = new Util(serviceModal);
    this.shareJpoConfig = {};
  } 

  public setLoader(loader : Loader){
    this.loader = loader;
  }
  public setAd(ad : Ad){
    this.ad = ad;
  }
  public setCamera(camera : Camera){
    this.camera = camera;
  }
  public setData(data : any){
    this.data = data;
  }
  
  public getJPO(newService : string, _id: string, _package: string, _class ?: string, _baseURL ?: string){
    var jpo = new Jpo(this._http, this.loader, this.ad, this.util);
    if(_class){
      jpo.config(this.data.jpo, this.shareJpoConfig, _id, _package, _class, newService, _baseURL);
    } else {
      jpo.config(this.data.jpo, this.shareJpoConfig, newService, _id, _package, null, null);
    }
    if(this.log){
      jpo.setLogs(this.log);
    }
    return jpo;
  }
/*
  public setToken(token : string){
    this.token = token;
  }
*/
  public setShareConfig(config : any){
    this.shareJpoConfig = config;
  }

  public getLoader(){
    return this.loader;
  }

  public getAd(){
    return this.ad;
  }
  public getCamera(){
    return this.camera;
  }

  public getUtil(){
    return this.util;
  }
  
  public setLogs(log : any){
    this.log = log;
  }

}