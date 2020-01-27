import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pSegnotificacionEditar {estado : number; mensaje : string};
export interface segnotificacionListar_response {total ?: number};
export interface segnotificacionListar_adds {notificacion_id ?: number, titulo ?: string, subtitulo ?: string, icono ?: string, nivel ?: string, unica_vez ?: string, unica_alerta ?: string, fecha_caducidad ?: Date, estado ?: string, roles ?: string};
export class pSegnotificacionListar {response : segnotificacionListar_response; adds : segnotificacionListar_adds[]};
export interface segnotificacionObtener_add {notificacion_id ?: number, titulo ?: string, subtitulo ?: string, descripcion ?: string, icono ?: string, nivel ?: string, unica_vez ?: string, unica_alerta ?: string, fecha_caducidad ?: Date, estado ?: string};
export interface segnotificacionObtener_roles {rol_id ?: number};
export class pSegnotificacionObtener {add : segnotificacionObtener_add; roles : segnotificacionObtener_roles[]};
export class pSegnotificacionRegistrar {estado : number; mensaje : string};

export class ADMNotificationServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","NOT","module.adm","ADMNotificationServiceImp");
    }

    segnotificacionEditar(fields : {
        notificacion_id ?: number,
        titulo ?: string,
        subtitulo ?: string,
        descripcion ?: string,
        icono ?: string,
        nivel ?: string,
        unica_vez ?: string,
        unica_alerta ?: string,
        fecha_caducidad ?: string,
        estadoNotificacion ?: string,
        roles ?: string,
        usuario_id ?: number
    }, call ?: { (resp: pSegnotificacionEditar) }){
        this.jpo.get("segnotificacionEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegnotificacionEditar();
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

    segnotificacionListar(fields : {
        roles ?: string,
        Page ?: number,
        Size ?: number
    }, call ?: { (resp: pSegnotificacionListar) }){
        this.jpo.get("segnotificacionListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegnotificacionListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.adds = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.adds.push({notificacion_id : rs[1][i][0], titulo : rs[1][i][1], subtitulo : rs[1][i][2], icono : rs[1][i][3], nivel : rs[1][i][4], unica_vez : rs[1][i][5], unica_alerta : rs[1][i][6], fecha_caducidad : (rs[1][i][7])?new Date(rs[1][i][7]):null, estado : rs[1][i][8], roles : rs[1][i][9]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segnotificacionObtener(fields : {
        Notificacion_id ?: number
    }, call ?: { (resp: pSegnotificacionObtener) }){
        this.jpo.get("segnotificacionObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegnotificacionObtener();
                        if(rs[0] && rs[0][0]){
                            out.add = {notificacion_id : rs[0][0][0], titulo : rs[0][0][1], subtitulo : rs[0][0][2], descripcion : rs[0][0][3], icono : rs[0][0][4], nivel : rs[0][0][5], unica_vez : rs[0][0][6], unica_alerta : rs[0][0][7], fecha_caducidad : (rs[0][0][8])?new Date(rs[0][0][8]):null, estado : rs[0][0][9]};
                        }
                        if(rs[1]){
                            out.roles = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.roles.push({rol_id : rs[1][i][0]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segnotificacionRegistrar(fields : {
        titulo ?: string,
        subtitulo ?: string,
        descripcion ?: string,
        icono ?: string,
        nivel ?: string,
        unica_vez ?: string,
        unica_alerta ?: string,
        fecha_caducidad ?: string,
        estadoNotificacion ?: string,
        roles ?: string,
        usuario_id ?: number
    }, call ?: { (resp: pSegnotificacionRegistrar) }){
        this.jpo.get("segnotificacionRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegnotificacionRegistrar();
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

}