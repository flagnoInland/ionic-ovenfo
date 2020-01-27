import { Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpRequest, HttpEventType } from '@angular/common/http';

import { Util } from './../util/oh.util';
import { Loader } from '../../components/loader/oh.loader';
import { Ad } from '../../components/ad/oh.ad';
import { INLANDLog } from 'src/app/firebase/log';

export class Jpo {

  private data: any;
  private id: string;
  private package: string;
  private class: string;
  private method: string;
  private sharedConfig: any;
  private newService: string;
  private baseURL: string;
  private retry : number = 1;
  log : INLANDLog;
  private tiempoInicio : any;

  constructor(@Inject(HttpClient) private _http: HttpClient, @Inject(Loader) private loader: Loader, @Inject(Ad) private ad: Ad,  @Inject(Util) private util: Util){}

  config(_data : any, _sharedConfig: any, _id: string, _package: string, _class: string, _newService ?: string, _baseURL ?: string){
    this.data = _data;
    this.id = _id;
    this.package = _package;
    this.class = _class;
    this.sharedConfig = _sharedConfig;
    this.newService = _newService;
    this.baseURL = _baseURL;
  }

  private respError(_config: any,_error: any,_mensaje: any, _codigoEnvio : any){
      if(_config.error){
        _config.error(_error);
      }
      if(_config.showAd){
        this.ad.close();
      }

      if(this.log){
        let actual : any = new Date();
        this.log.registrar({
          uid : this.util.getUID(),
          fecha : new Date(),
          rnd : _codigoEnvio,
          tiempo : (actual - this.tiempoInicio),
          paquete : this.package,
          clase : this.class,
          metodo : this.method,
          log : _mensaje
        })
      }

      if(!_config.noShowError){
        this.loader.showError({
          error : _mensaje,
          errorCodigo : _codigoEnvio
        });
      }
  }

  private getHost(){
    if(this.baseURL == null){
      return this.data.hosts.main.url+((this.newService)?("/"+this.newService+this.data.restSuffix):this.data.hosts.main.rest)+'/'+this.data.hosts.main.service;
    } else {
      return this.baseURL;
    }
  }
  public get(_class: string, _method: any, _config?: any){
    if(!_config){
      _config = _method;
      _method = _class;
    }
    return this._get(this.class, _method, _config);
  }

  private _get(_class: string, _method: any, _config: any){
    
    var headers_ = new HttpHeaders();
        
    var _p = new HttpParams();
    var codigoEnvio = Math.random();
    _p = _p.set("rnd", "" + codigoEnvio);
    _p = _p.set("package", this.package);
    _p = _p.set("class", this.class);
    _p = _p.set("method", _method);

    this.method = _method;

    let eid = (this.id.length>0)?this.id:"";

    let myBody : any = {};

    myBody[eid] = {};

    if(_config.locationHref || _config.windowopen){
      if(_config.fields){
        for (let field in _config.fields) {
          _p = _p.set(eid+"_"+field, (_config.fields[field])?encodeURIComponent(_config.fields[field]):"");
        }
      }

      if(_config.locationHref){
        location.href = this.getHost()+"?"+_p.toString();
      }
      if(_config.windowopen){
        window.open(this.getHost()+"Download?"+_p.toString(),'_blank');
      }
      return;
    }
    
    if(_config.fields){
      myBody[eid]["F"] = {};
      for (let field in _config.fields) {
        if(typeof(_config.fields[field])=="object" && !this.util.isDate(_config.fields[field])){
          myBody[field] = _config.fields[field];
        } else {

          if(typeof(_config.fields[field]) == "string"){
            myBody[eid]["F"][field] = (_config.fields[field])?_config.fields[field]:"";
          } else {
            myBody[eid]["F"][field] = _config.fields[field];
          }
          
        }
      }
    }
    
    if(_config.where){
      myBody[eid]["W"] = {};
      for (let field in _config.where) {
        myBody[eid]["W"][field] = (_config.where[field])?_config.where[field]:"";
      }
    }

    if(_config.showLoader){
      this.loader.show();
    }

    if(_config.showAd){
      this.ad.loading();
    }

    let _body : any;
        _body = myBody;
    if(_config.body){
        _body = Object.assign({}, _body, _config.body)
    }

    if(this.sharedConfig.token){
      headers_ = headers_.append('Authorization', 'Bearer '+this.sharedConfig.token);
    }
    
    if(_config.files || _config.noMappingBody){ // For files too
      headers_ = headers_.append('jpoNoMappingBody', 'true');
    }

    var options = {
      params: _p,
      headers : headers_,
    }

    if(_config.files){
      options['reportProgress'] = true;

      var newBody = new FormData();
      for(var param in _config.files){
        newBody.append(param, _config.files[param]);
      }

      if(_body){
        newBody.append("jpoData", JSON.stringify(_body));
      }
      
      _body = newBody;

    }
    this.count = 1;
    return this.sendRequest(_config, _body, options, codigoEnvio);

  };

  count : number;
  sendRequest = (_config: any, _body : any, options : any, codigoEnvio : any) => {

    let url_test_func = this.getHost();
    // if(options.params.updates[2].value == "ADMAdjuntoServiceImp"){
    //   url_test_func = 'http://localhost:7071/api/ADMAdjuntoService';
    // }

    this.tiempoInicio = new Date();
    let consulta = this._http.request(new HttpRequest('POST', url_test_func, _body, options));
    
    consulta.subscribe(event => {
      if(_config.files && event.type == HttpEventType.UploadProgress) {
        _config.loading(Math.round(100 * event.loaded / event.total));
      }
      if (event.type == HttpEventType.Response){
        this.responseData(_config, event.body, codigoEnvio);
      }
    }, error => {
      if(error.status == 401){ // No tiene acceso
        if(this.sharedConfig.onUnAuthrorized){
          this.loader.close();
          this.sharedConfig.onUnAuthrorized(error);
        }
      } else if(error.status == 403){ // No esta permitido
        if(this.sharedConfig.onForbidden){
          this.loader.close();
          this.sharedConfig.onForbidden(error);
        }
      } else if(error.status == 503 || error.status == 404){ // Fuera de servicio o en mantenimiento
        this.loader.showUnService();
      } else if(error.status == 0 || error.status == 502){ // 502 El servidor no obtuvo una respuesta correcta
        if(!_config.disabledLoop && this.count < this.retry){
          setTimeout(() => {
            this.count++;
            this.sendRequest(_config, _body, options, codigoEnvio);
          }, 1500);
        } else {
          this.respError(_config, error, error.message, codigoEnvio);
        }
      } else {
        this.respError(_config, error, error.message, codigoEnvio);
      }
    });

    return consulta;

  }

  responseData = (_config : any, data : any, codigoEnvio : string) => {
    if(_config.showLoader){
      this.loader.close();
    }
    if(data["isCorrect"]){
      if(_config.showAd){
        this.ad.success();
      }
      if(_config.response){

        let result = data["result"];
        if(_config.conversion){
           result = this.util.getObjet(result, _config.conversion);
        }
        _config.response(result);

      }
    } else {
      this.respError(_config, null, data["message"], codigoEnvio);
    }
  }
  
  public setLogs(log : any){
    this.log = log;
  }

}