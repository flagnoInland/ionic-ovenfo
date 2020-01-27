import { BUIBuilderUtil } from "./bui.builder.util";
import { BUIBuilderServicio } from "./bui.builder.servicio";

import { pBuiservicioWebObtener, buiservicioWebObtener_servicio_web } from "../../BUI/service/bui.bUIGNServicioWebService";

export class BUIBuilderServicioBase {
    
    private config : any;
    private procedimiento : BUIBuilderServicio;
    private util : BUIBuilderUtil;

    constructor(coreData : any){
        this.config = coreData;
        this.procedimiento = new BUIBuilderServicio(coreData);
        this.util = new BUIBuilderUtil();
    }

    public obtenerUtil(){
        return this.util;
    }

    public obtenerProcedimientos(resp : pBuiservicioWebObtener){
        
        resp['origen_rest'] = this.config.origenes.find(it => it.origen_id == this.config.origen_id_rest);
        resp['origen_web']  = this.config.origenes.find(it => it.origen_id == this.config.origen_id_web);

        var url = this.obtenerURLRest(resp);

        var archivos = [];
            archivos.push({
                url             : url,
                name            : resp.servicio_web.clase+"Service.java",
                isRewritable    : true,
                source          : this.procedimiento.construirServicio(resp)
            });
            archivos.push({
                url             : url,
                name            : resp.servicio_web.clase+"ServiceImp.java",
                isRewritable    : false,
                source          : this.procedimiento.construirServicioImp(resp)
            });
            archivos.push({
                url             : this.obtenerURLWeb(resp),
                name            : resp.servicio_web.rest_abreviatura.toLowerCase()+"."+this.util.firstLower(resp.servicio_web.clase)+"Service.ts",
                isRewritable    : true,
                source          : this.procedimiento.construirServicioTS(resp)
            });
            
        return archivos;

    }

    public eliminarProcedimientos(resp : pBuiservicioWebObtener){

        resp['origen_rest'] = this.config.origenes.find(it => it.origen_id == this.config.origen_id_rest);
        resp['origen_web']  = this.config.origenes.find(it => it.origen_id == this.config.origen_id_web);

        var url = this.obtenerURLRest(resp);

        var archivos = [];
            archivos.push({
                url             : url,
                name          : resp.servicio_web.clase+"Service.java"
            });
            archivos.push({
                url             : url,
                name          : resp.servicio_web.clase+"ServiceImp.java"
            });
            archivos.push({
                url             : this.obtenerURLWeb(resp),
                name          : resp.servicio_web.rest_abreviatura.toLowerCase()+"."+this.util.firstLower(resp.servicio_web.clase)+"Service.ts"
            });
            
        return archivos;

    }
        
        private obtenerURLRest(resp : pBuiservicioWebObtener){
            
            var url = [];

            if(resp['origen_rest'].sub_tipo == 1){ // JAVA EJB
                url.push(resp['origen_rest'].url_proyecto);
                url.push(resp.servicio_web.rest_url_fuente);
                url.push(resp['origen_rest'].url_principal);
                url.push(resp['origen_rest'].url_core.replace(/\./g, "\\"));
                url.push(resp['origen_rest'].url_fuente.replace(/\./g, "\\"));
                url.push(resp.servicio_web.paquete.replace(/\./g, "\\"));
            }

            return url.join("\\");
        }

        private obtenerURLWeb(resp : pBuiservicioWebObtener){
            
            var url = [];
            
                url.push(resp['origen_web'].url_proyecto);
                url.push(resp.servicio_web.web_url_fuente);
                url.push(resp['origen_web'].url_principal);
                url.push(resp['origen_web'].url_core);
                if(resp.servicio_web.rest_es_submodulo){
                    url.push("module");
                    url.push(resp.servicio_web.rest_abreviatura);
                }
                url.push("service");

            return url.join("\\");
        }
    
    public obtenerImplementacion(resp : pBuiservicioWebObtener){
        return this.procedimiento.construirImplementacion(resp);
    }

    public obtenerVistaPreviaRest(resp : buiservicioWebObtener_servicio_web){
        return this.procedimiento.obtenerVistaPreviaRest(resp);
    }

}