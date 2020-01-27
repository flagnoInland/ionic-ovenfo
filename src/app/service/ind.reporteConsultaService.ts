import { Jpo } from "../ohCore/services/oh.core";
import { OHService } from "../tis.ohService";

export class pGesreporteBusquedaListar {valor : string; descripcion : string};
export class pGesreporteListarFiltrar {reporte_id : number; nombre : string; descripcion : string; nombre_store : string; parametros : string};

export class ReporteConsultaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("Inlandnet","REP","gestion","ReporteConsultaServiceImp");
    }

    gesreporteBusquedaListar(fields : {
        unidad_negocio_id ?: number,
        buscar ?: string,
        tipo_busqueda ?: string
    }, call ?: { (resp: pGesreporteBusquedaListar[]) }){
        this.jpo.get("gesreporteBusquedaListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({valor : rs[i][0], descripcion : rs[i][1]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesreporteListarFiltrar(fields : {
        usuario_id ?: number
    }, call ?: { (resp: pGesreporteListarFiltrar[]) }){
        this.jpo.get("gesreporteListarFiltrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({reporte_id : rs[i][0], nombre : rs[i][1], descripcion : rs[i][2], nombre_store : rs[i][3], parametros : rs[i][4]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}