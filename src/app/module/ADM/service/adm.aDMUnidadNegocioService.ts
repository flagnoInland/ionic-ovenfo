import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export interface segunidadNegocioListar_respuesta {total ?: number};
export interface segunidadNegocioListar_resultado {unidad_negocio_id ?: number, nombre ?: string, estado ?: string, unidad_negocio_padre_id ?: number, unidad_negocio_padre_nombre ?: string};
export class pSegunidadNegocioListar {respuesta : segunidadNegocioListar_respuesta; resultado : segunidadNegocioListar_resultado[]};

export class ADMUnidadNegocioServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMUnidadNegocioServiceImp");
    }

    segunidadNegocioListar(fields : {
        unidad_padre ?: number,
        tipo_un ?: number,
        indicador_padres ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pSegunidadNegocioListar) }){
        this.jpo.get("segunidadNegocioListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegunidadNegocioListar();
                        if(rs[0] && rs[0][0]){
                            out.respuesta = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.resultado = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.resultado.push({unidad_negocio_id : rs[1][i][0], nombre : rs[1][i][1], estado : rs[1][i][2], unidad_negocio_padre_id : rs[1][i][3], unidad_negocio_padre_nombre : rs[1][i][4]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}