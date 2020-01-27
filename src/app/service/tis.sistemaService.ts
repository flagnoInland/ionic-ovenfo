import { Jpo } from "../ohCore/services/oh.core";
import { OHService } from "../tis.ohService";

export class pGesactualizarUbicacionAdjunto {estado : number; mensaje : string};
export class pGescatalogoListarAtributos {catalogo_id : number; descripcion : string; catalogo_pagre_id : number};
export class pSegnotificacionLeer {estado : number; mensaje : string};
export class pSegsistemaFecha {fecha : Date};
export interface segsistemaValidar_system {version ?: string, nivel ?: number, deploymentDate ?: Date};
export interface segsistemaValidar_adds {id ?: number, type ?: number, icon ?: string, title ?: string, subtitle ?: string, description ?: string, nivel ?: string, onlyOne ?: string, onlyOneAlert ?: string, dueDate ?: Date, read ?: number, sendDate ?: Date};
export class pSegsistemaValidar {system : segsistemaValidar_system; adds : segsistemaValidar_adds[]};

export class SistemaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("SEG","security","SistemaServiceImp");
    }

    gesactualizarUbicacionAdjunto(fields : {
        Usuario_id ?: number,
        Id_adjunto ?: number,
        Archivo_Ubicacion_Upd ?: string
    }, call ?: { (resp: pGesactualizarUbicacionAdjunto) }){
        this.jpo.get("gesactualizarUbicacionAdjunto",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesactualizarUbicacionAdjunto();
                        if(rs){
                            out.estado = rs[0];
                            out.mensaje = rs[1];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gescatalogoListar(fields : {
        Page ?: number,
        Size ?: number
    }, call ?: any){
        this.jpo.get("gescatalogoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                   call(rs);
                }
            },
            showLoader : true
        });
    }

    gescatalogoListarAtributos(fields : {
        Unidad_negocio_id ?: number,
        padres_id ?: string
    }, call ?: { (resp: pGescatalogoListarAtributos[]) }){
        this.jpo.get("gescatalogoListarAtributos",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({catalogo_id : rs[i][0], descripcion : rs[i][1], catalogo_pagre_id : rs[i][2]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segnotificacionLeer(fields : {
        Usuario_id ?: number,
        Notificacion_id ?: number
    }, call ?: { (resp: pSegnotificacionLeer) }){
        this.jpo.get("segnotificacionLeer",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegnotificacionLeer();
                        if(rs){
                            out.estado = rs[0];
                            out.mensaje = rs[1];
                        }
                    call(out);
                }
            }
        });
    }

    segsistemaFecha(call ?: { (resp: pSegsistemaFecha) }){
        this.jpo.get("segsistemaFecha",{
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {fecha : (rs[0][0])?new Date(rs[0][0]):null};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segsistemaValidar(fields : {
        Usuario_id ?: number,
        Sistema_id ?: number
    }, call ?: { (resp: pSegsistemaValidar) }){
        this.jpo.get("segsistemaValidar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegsistemaValidar();
                        if(rs[0] && rs[0][0]){
                            out.system = {version : rs[0][0][0], nivel : rs[0][0][1], deploymentDate : (rs[0][0][2])?new Date(rs[0][0][2]):null};
                        }
                        if(rs[1]){
                            out.adds = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.adds.push({id : rs[1][i][0], type : rs[1][i][1], icon : rs[1][i][2], title : rs[1][i][3], subtitle : rs[1][i][4], description : rs[1][i][5], nivel : rs[1][i][6], onlyOne : rs[1][i][7], onlyOneAlert : rs[1][i][8], dueDate : (rs[1][i][9])?new Date(rs[1][i][9]):null, read : rs[1][i][10], sendDate : (rs[1][i][11])?new Date(rs[1][i][11]):null});
                            }
                        }
                    call(out);
                }
            }
        });
    }

}