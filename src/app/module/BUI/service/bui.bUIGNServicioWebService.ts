import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pBuiservicioWebSincronizar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pBuiservicioWebEditar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pBuiservicioWebEliminar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export interface buiservicioWebListar_servicios_web {indicador_uid : number, paquete : string, clase : string, servicio_web_id : number, sub_proyecto_rest_id : number, sub_proyecto_web_id : number, base_datos : string, esquema : string, proyecto_rest : string, proyecto_web : string, roles : string, procedimientos : string};
export class pBuiservicioWebListar {servicios_web : buiservicioWebListar_servicios_web[]};
export interface buiservicioWebObtener_servicio_web {servicio_web_id : number, base_datos_id : number, bd_tipo : string, bd_url : string, bd_usuario : string, bd_clave : string, esquema_id : number, base_datos : string, origen_datos : string, rest_sub_proyecto_id : number, rest_url_fuente : string, rest_abreviatura : string, rest_es_submodulo : boolean, web_sub_proyecto_id : number, web_url_fuente : string, web_abreviatura : string, web_es_submodulo : boolean, paquete : string, clase : string, prefijo : string, indicador_oauth2 : string};
export interface buiservicioWebObtener_roles {rol_id : number};
export interface buiservicioWebObtener_procedimientos {sp_id : number, sp_nombre : string, sp_esquema : string, configuraciones : string, salidas : string, parametros : string, entradas : string, sp_real_id : string};
export class pBuiservicioWebObtener {servicio_web : buiservicioWebObtener_servicio_web; roles : buiservicioWebObtener_roles[]; procedimientos : buiservicioWebObtener_procedimientos[]};
export class pBuiservicioWebRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};

export class BUIGNServicioWebServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui.gn","BUIGNServicioWebServiceImp");
    }

    buiservicioWebSincronizar(fields : {
        servicio_web_id ?: number,
        uid ?: string,
        rest ?: string,
        rest_imp ?: string,
        web ?: string,
        comentario ?: string,
        usuario_id ?: number
    }, files : any, loading : any, call ?: { (resp: pBuiservicioWebSincronizar) }){
        this.jpo.get("buiservicioWebSincronizar",{
            files : files,
            loading : loading,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiservicioWebSincronizar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                        }
                    call(out);
                }
            }
        });
    }

    buiservicioWebEditar(fields : {
        servicio_web_id ?: number,
        servicio_web ?: string,
        roles ?: string,
        procedimientos ?: string,
        rest ?: string,
        rest_imp ?: string,
        web ?: string,
        uid ?: string,
        comentario ?: string,
        usuario_id ?: number
    }, files : any, loading : any, call ?: { (resp: pBuiservicioWebEditar) }){
        this.jpo.get("buiservicioWebEditar",{
            files : files,
            loading : loading,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiservicioWebEditar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    buiservicioWebEliminar(fields : {
        servicio_web_id ?: number
    }, files : any, loading : any, call ?: { (resp: pBuiservicioWebEliminar) }){
        this.jpo.get("buiservicioWebEliminar",{
            files : files,
            loading : loading,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiservicioWebEliminar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    buiservicioWebListar(fields : {
        proyecto_id ?: number,
        usuario_id ?: number,
        sub_proyecto_id ?: number
    }, call ?: { (resp: pBuiservicioWebListar) }){
        this.jpo.get("buiservicioWebListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiservicioWebListar();
                        if(rs){
                            if(rs[0]){
                                out.servicios_web = [];
                                for(var i = 0; i < rs[0].length; i++){
                                    out.servicios_web.push({indicador_uid : rs[0][i][0], paquete : rs[0][i][1], clase : rs[0][i][2], servicio_web_id : rs[0][i][3], sub_proyecto_rest_id : rs[0][i][4], sub_proyecto_web_id : rs[0][i][5], base_datos : rs[0][i][6], esquema : rs[0][i][7], proyecto_rest : rs[0][i][8], proyecto_web : rs[0][i][9], roles : rs[0][i][10], procedimientos : rs[0][i][11]});
                                }
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    buiservicioWebObtener(fields : {
        servicio_web_id ?: number
    }, call ?: { (resp: pBuiservicioWebObtener) }){
        this.jpo.get("buiservicioWebObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiservicioWebObtener();
                        if(rs){
                           if(rs[0] && rs[0][0]){
                               out.servicio_web = {servicio_web_id : rs[0][0][0], base_datos_id : rs[0][0][1], bd_tipo : rs[0][0][2], bd_url : rs[0][0][3], bd_usuario : rs[0][0][4], bd_clave : rs[0][0][5], esquema_id : rs[0][0][6], base_datos : rs[0][0][7], origen_datos : rs[0][0][8], rest_sub_proyecto_id : rs[0][0][9], rest_url_fuente : rs[0][0][10], rest_abreviatura : rs[0][0][11], rest_es_submodulo : (rs[0][0][12] == "true" || rs[0][0][12] == "1")?true:false, web_sub_proyecto_id : rs[0][0][13], web_url_fuente : rs[0][0][14], web_abreviatura : rs[0][0][15], web_es_submodulo : (rs[0][0][16] == "true" || rs[0][0][16] == "1")?true:false, paquete : rs[0][0][17], clase : rs[0][0][18], prefijo : rs[0][0][19], indicador_oauth2 : rs[0][0][20]};
                           }
                            if(rs[1]){
                                out.roles = [];
                                for(var i = 0; i < rs[1].length; i++){
                                    out.roles.push({rol_id : rs[1][i][0]});
                                }
                            }
                            if(rs[2]){
                                out.procedimientos = [];
                                for(var i = 0; i < rs[2].length; i++){
                                    out.procedimientos.push({sp_id : rs[2][i][0], sp_nombre : rs[2][i][1], sp_esquema : rs[2][i][2], configuraciones : rs[2][i][3], salidas : rs[2][i][4], parametros : rs[2][i][5], entradas : rs[2][i][6], sp_real_id : rs[2][i][7]});
                                }
                            }
                        }
                    call(out);
                }
            }
        });
    }

    buiservicioWebRegistrar(fields : {
        servicio_web ?: string,
        roles ?: string,
        procedimientos ?: string,
        rest ?: string,
        rest_imp ?: string,
        web ?: string,
        uid ?: string,
        comentario ?: string,
        usuario_id ?: number
    }, files : any, loading : any, call ?: { (resp: pBuiservicioWebRegistrar) }){
        this.jpo.get("buiservicioWebRegistrar",{
            files : files,
            loading : loading,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiservicioWebRegistrar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}