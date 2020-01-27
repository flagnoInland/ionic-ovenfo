import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export interface buiinicializar_usuariobui {usuario_id : number, nombre : string};
export interface buiinicializar_proyecto {proyecto_id : number, nombre : string, descripcion : string, abreviatura : string};
export interface buiinicializar_origenes {origen_id : number, tipo : number, sub_tipo : number, url_proyecto : string, url_principal : string, url_core : string, url_fuente : string, host : string, usuario : string};
export interface buiinicializar_basedatos {base_datos_id : number, nombre : string, tipo : string, url : string, puerto : string, usuario : string, clave : string};
export interface buiinicializar_esquemas {esquema_id : number, base_datos_id : number, nombre : string, origen_datos : string};
export interface buiinicializar_sub_proyectos {sub_proyecto_id : number, nombre : string, url_fuente : string, tipo : number, abreviatura : string, menu_id : number, es_submodulo : boolean};
export class pBuiinicializar {usuariobui : buiinicializar_usuariobui; proyecto : buiinicializar_proyecto; origenes : buiinicializar_origenes[]; basedatos : buiinicializar_basedatos[]; esquemas : buiinicializar_esquemas[]; sub_proyectos : buiinicializar_sub_proyectos[]};

export class BUIGNPrincipalServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui.gn","BUIGNPrincipalServiceImp");
    }

    buiinicializar(fields : {
        proyecto_id ?: number,
        usuario ?: string
    }, call ?: { (resp: pBuiinicializar) }){
        this.jpo.get("buiinicializar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiinicializar();
                        if(rs){
                           if(rs[0] && rs[0][0]){
                               out.usuariobui = {usuario_id : rs[0][0][0], nombre : rs[0][0][1]};
                           }
                           if(rs[1] && rs[1][0]){
                               out.proyecto = {proyecto_id : rs[1][0][0], nombre : rs[1][0][1], descripcion : rs[1][0][2], abreviatura : rs[1][0][3]};
                           }
                            if(rs[2]){
                                out.origenes = [];
                                for(var i = 0; i < rs[2].length; i++){
                                    out.origenes.push({origen_id : rs[2][i][0], tipo : rs[2][i][1], sub_tipo : rs[2][i][2], url_proyecto : rs[2][i][3], url_principal : rs[2][i][4], url_core : rs[2][i][5], url_fuente : rs[2][i][6], host : rs[2][i][7], usuario : rs[2][i][8]});
                                }
                            }
                            if(rs[3]){
                                out.basedatos = [];
                                for(var i = 0; i < rs[3].length; i++){
                                    out.basedatos.push({base_datos_id : rs[3][i][0], nombre : rs[3][i][1], tipo : rs[3][i][2], url : rs[3][i][3], puerto : rs[3][i][4], usuario : rs[3][i][5], clave : rs[3][i][6]});
                                }
                            }
                            if(rs[4]){
                                out.esquemas = [];
                                for(var i = 0; i < rs[4].length; i++){
                                    out.esquemas.push({esquema_id : rs[4][i][0], base_datos_id : rs[4][i][1], nombre : rs[4][i][2], origen_datos : rs[4][i][3]});
                                }
                            }
                            if(rs[5]){
                                out.sub_proyectos = [];
                                for(var i = 0; i < rs[5].length; i++){
                                    out.sub_proyectos.push({sub_proyecto_id : rs[5][i][0], nombre : rs[5][i][1], url_fuente : rs[5][i][2], tipo : rs[5][i][3], abreviatura : rs[5][i][4], menu_id : rs[5][i][5], es_submodulo : (rs[5][i][6] == "true" || rs[5][i][6] == "1")?true:false});
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