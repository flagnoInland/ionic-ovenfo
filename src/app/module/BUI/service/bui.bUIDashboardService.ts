import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pGesdashboardEliminar {estado : number; mensaje : string};
export class pGesdashboardEditar {estado : number; mensaje : string};
export interface gesdashboardListar_dashboards {dashboard_id ?: number, proyecto ?: string, plantilla ?: string, nombre ?: string, descripcion ?: string, nombre_store ?: string, estado ?: boolean, parametros ?: string, roles ?: string};
export interface gesdashboardListar_resultado {total ?: number};
export class pGesdashboardListar {dashboards : gesdashboardListar_dashboards[]; resultado : gesdashboardListar_resultado};
export interface gesdashboardObtener_dashboard {dashboard_id ?: number, menu_id ?: number, nombre ?: string, descripcion ?: string, nombre_store ?: string, parametros ?: string, estado ?: string, tipo_dashboard_id ?: string};
export interface gesdashboardObtener_roles {rol_id ?: number};
export class pGesdashboardObtener {dashboard : gesdashboardObtener_dashboard; roles : gesdashboardObtener_roles[]};
export class pGesdashboardRegistrar {estado : number; mensaje : string};

export class BUIDashboardServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui","BUIDashboardServiceImp");
    }

    gesdashboardEliminar(fields : {
        dashboard_id ?: number
    }, call ?: { (resp: pGesdashboardEliminar) }){
        this.jpo.get("gesdashboardEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesdashboardEliminar();
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

    gesdashboardEditar(fields : {
        dashboard_id ?: number,
        Menu_id ?: number,
        Nombre ?: string,
        Descripcion ?: string,
        nombre_store ?: string,
        Parametros ?: string,
        EstadoDashboard ?: string,
        Usuario_id ?: number,
        Roles_id ?: string,
        TipoDashboard_id ?: number
    }, call ?: { (resp: pGesdashboardEditar) }){
        this.jpo.get("gesdashboardEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesdashboardEditar();
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

    gesdashboardListar(fields : {
        estado ?: string,
        nombre ?: string,
        nombre_store ?: string,
        Page ?: number,
        Size ?: number
    }, call ?: { (resp: pGesdashboardListar) }){
        this.jpo.get("gesdashboardListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesdashboardListar();
                        if(rs[0]){
                            out.dashboards = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.dashboards.push({dashboard_id : rs[0][i][0], proyecto : rs[0][i][1], plantilla : rs[0][i][2], nombre : rs[0][i][3], descripcion : rs[0][i][4], nombre_store : rs[0][i][5], estado : (rs[0][i][6] == "true" || rs[0][i][6] == "1")?true:false, parametros : rs[0][i][7], roles : rs[0][i][8]});
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

    gesdashboardObtener(fields : {
        dashboard_id ?: number
    }, call ?: { (resp: pGesdashboardObtener) }){
        this.jpo.get("gesdashboardObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesdashboardObtener();
                        if(rs[0] && rs[0][0]){
                            out.dashboard = {dashboard_id : rs[0][0][0], menu_id : rs[0][0][1], nombre : rs[0][0][2], descripcion : rs[0][0][3], nombre_store : rs[0][0][4], parametros : rs[0][0][5], estado : rs[0][0][6], tipo_dashboard_id : rs[0][0][7]};
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

    gesdashboardRegistrar(fields : {
        Menu_id ?: number,
        Nombre ?: string,
        Descripcion ?: string,
        nombre_store ?: string,
        Parametros ?: string,
        EstadoDashboard ?: string,
        Usuario_id ?: number,
        Roles_id ?: string,
        TipoDashboard_id ?: number
    }, call ?: { (resp: pGesdashboardRegistrar) }){
        this.jpo.get("gesdashboardRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesdashboardRegistrar();
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