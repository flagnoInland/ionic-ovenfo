import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export interface gesreporteObtener_reporte {reporte_id ?: number, menu_id ?: number, nombre ?: string, descripcion ?: string, nombre_store ?: string, parametros ?: string, estado ?: string};
export interface gesreporteObtener_roles {rol_id ?: number};
export class pGesreporteObtener {reporte : gesreporteObtener_reporte; roles : gesreporteObtener_roles[]};
export class pGesreporteRegistrar {estado : number; mensaje : string};
export class pGesreporteEditar {estado : number; mensaje : string};
export class pGesreporteEliminar {estado : number; mensaje : string};
export interface gesreporteListar_reportes {reporte_id ?: number, proyecto ?: string, plantilla ?: string, nombre ?: string, descripcion ?: string, nombre_store ?: string, estado ?: boolean, parametros ?: string, roles ?: string};
export interface gesreporteListar_resultado {total ?: number};
export class pGesreporteListar {reportes : gesreporteListar_reportes[]; resultado : gesreporteListar_resultado};

export class BUIReporteServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui","BUIReporteServiceImp");
    }

    gesreporteObtener(fields : {
        reporte_id ?: number
    }, call ?: { (resp: pGesreporteObtener) }){
        this.jpo.get("gesreporteObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesreporteObtener();
                        if(rs[0] && rs[0][0]){
                            out.reporte = {reporte_id : rs[0][0][0], menu_id : rs[0][0][1], nombre : rs[0][0][2], descripcion : rs[0][0][3], nombre_store : rs[0][0][4], parametros : rs[0][0][5], estado : rs[0][0][6]};
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

    gesreporteRegistrar(fields : {
        Menu_id ?: number,
        Nombre ?: string,
        Descripcion ?: string,
        nombre_store ?: string,
        Parametros ?: string,
        EstadoReporte ?: string,
        Usuario_id ?: number,
        Roles_id ?: string
    }, call ?: { (resp: pGesreporteRegistrar) }){
        this.jpo.get("gesreporteRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesreporteRegistrar();
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

    gesreporteEditar(fields : {
        reporte_id ?: number,
        Menu_id ?: number,
        Nombre ?: string,
        Descripcion ?: string,
        nombre_store ?: string,
        Parametros ?: string,
        EstadoReporte ?: string,
        Usuario_id ?: number,
        Roles_id ?: string
    }, call ?: { (resp: pGesreporteEditar) }){
        this.jpo.get("gesreporteEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesreporteEditar();
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

    gesreporteEliminar(fields : {
        reporte_id ?: number
    }, call ?: { (resp: pGesreporteEliminar) }){
        this.jpo.get("gesreporteEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesreporteEliminar();
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

    gesreporteListar(fields : {
        estado ?: string,
        nombre ?: string,
        nombre_store ?: string,
        Page ?: number,
        Size ?: number
    }, call ?: { (resp: pGesreporteListar) }){
        this.jpo.get("gesreporteListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesreporteListar();
                        if(rs[0]){
                            out.reportes = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.reportes.push({reporte_id : rs[0][i][0], proyecto : rs[0][i][1], plantilla : rs[0][i][2], nombre : rs[0][i][3], descripcion : rs[0][i][4], nombre_store : rs[0][i][5], estado : (rs[0][i][6] == "true" || rs[0][i][6] == "1")?true:false, parametros : rs[0][i][7], roles : rs[0][i][8]});
                            }
                        }
                        if(rs[1] && rs[1][0]){
                            out.resultado = {total : rs[1][0][0]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}