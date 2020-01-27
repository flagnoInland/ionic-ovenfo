import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export interface buiinicializar_origenes {origen_id : number, tipo : number, url_proyecto : string, url_principal : string, url_core : string, url_fuente : string, host : string, usuario : string};
export interface buiinicializar_basedatos {base_datos_id : number, nombre : string, tipo : string, url : string, puerto : string, usuario : string, clave : string};
export interface buiinicializar_esquemas {esquema_id : number, base_datos_id : number, nombre : string, origen_datos : string};
export interface buiinicializar_sub_proyectos {sub_proyecto_id : number, nombre : string, url_fuente : string, tipo : number, abreviatura : string, menu_id : number};
export class pBuiinicializar {origenes : buiinicializar_origenes[]; basedatos : buiinicializar_basedatos[]; esquemas : buiinicializar_esquemas[]; sub_proyectos : buiinicializar_sub_proyectos[]};

export class BUIPGInicializarServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui","BUIPGInicializarServiceImp");
    }

    buiinicializar(fields : {
        usuario_id ?: number
    }, call ?: { (resp: pBuiinicializar) }){
        this.jpo.get("buiinicializar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiinicializar();
                        if(rs){
                            if(rs[0]){
                                out.origenes = [];
                                for(var i = 0; i < rs[0].length; i++){
                                    out.origenes.push({origen_id : rs[0][i][0], tipo : rs[0][i][1], url_proyecto : rs[0][i][2], url_principal : rs[0][i][3], url_core : rs[0][i][4], url_fuente : rs[0][i][5], host : rs[0][i][6], usuario : rs[0][i][7]});
                                }
                            }
                            if(rs[1]){
                                out.basedatos = [];
                                for(var i = 0; i < rs[1].length; i++){
                                    out.basedatos.push({base_datos_id : rs[1][i][0], nombre : rs[1][i][1], tipo : rs[1][i][2], url : rs[1][i][3], puerto : rs[1][i][4], usuario : rs[1][i][5], clave : rs[1][i][6]});
                                }
                            }
                            if(rs[2]){
                                out.esquemas = [];
                                for(var i = 0; i < rs[2].length; i++){
                                    out.esquemas.push({esquema_id : rs[2][i][0], base_datos_id : rs[2][i][1], nombre : rs[2][i][2], origen_datos : rs[2][i][3]});
                                }
                            }
                            if(rs[3]){
                                out.sub_proyectos = [];
                                for(var i = 0; i < rs[3].length; i++){
                                    out.sub_proyectos.push({sub_proyecto_id : rs[3][i][0], nombre : rs[3][i][1], url_fuente : rs[3][i][2], tipo : rs[3][i][3], abreviatura : rs[3][i][4], menu_id : rs[3][i][5]});
                                }
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}