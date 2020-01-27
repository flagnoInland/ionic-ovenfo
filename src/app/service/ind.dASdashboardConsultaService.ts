import { Jpo } from "../ohCore/services/oh.core";
import { OHService } from "../tis.ohService";

export interface gesdashboardListarFiltrar_dashboards {dashboard_id ?: number, nombre ?: string, descripcion ?: string, nombre_store ?: string, parametros ?: string};
export interface gesdashboardListarFiltrar_seleccion {dashboard_list ?: string, config_columnas ?: number};
export class pGesdashboardListarFiltrar {dashboards : gesdashboardListarFiltrar_dashboards[]; seleccion : gesdashboardListarFiltrar_seleccion};
export class pGesdashboardUsuarioRegistrar {estado : number; mensaje : string};

export class DASdashboardConsultaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("Inlandnet","DAS","gestion","DASdashboardConsultaServiceImp");
    }

    gesdashboardListarFiltrar(fields : {
        usuario_id ?: number
    }, call ?: { (resp: pGesdashboardListarFiltrar) }){
        this.jpo.get("gesdashboardListarFiltrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesdashboardListarFiltrar();
                        if(rs[0]){
                            out.dashboards = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.dashboards.push({dashboard_id : rs[0][i][0], nombre : rs[0][i][1], descripcion : rs[0][i][2], nombre_store : rs[0][i][3], parametros : rs[0][i][4]});
                            }
                        }
                        if(rs[1] && rs[1][0]){
                            out.seleccion = {dashboard_list : rs[1][0][0], config_columnas : rs[1][0][1]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesdashboardUsuarioRegistrar(fields : {
        Dashboard_list ?: string,
        Usuario_id ?: number,
        Config_columnas ?: number
    }, call ?: { (resp: pGesdashboardUsuarioRegistrar) }){
        this.jpo.get("gesdashboardUsuarioRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesdashboardUsuarioRegistrar();
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