import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pSegversionEditar {estado : number; mensaje : string};
export interface segversionListar_response {total ?: number};
export interface segversionListar_versions {version_id ?: number, version ?: string, descripcion ?: string, nivel ?: string, fecha_inicio ?: Date, fecha_fin ?: Date, fecha_despliegue ?: Date, estado ?: string};
export class pSegversionListar {response : segversionListar_response; versions : segversionListar_versions[]};
export class pSegversionRegistrar {estado : number; mensaje : string};

export class ADMVersionServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMVersionServiceImp");
    }

    segversionEditar(fields : {
        Version_id ?: number,
        Version ?: string,
        Descripcion ?: string,
        Fecha_inicio ?: string,
        Fecha_fin ?: string,
        Fecha_despliegue ?: string,
        EstadoVersion ?: string,
        Nivel ?: string,
        Usuario_id ?: number
    }, call ?: { (resp: pSegversionEditar) }){
        this.jpo.get("segversionEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegversionEditar();
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

    segversionListar(fields : {
        Sistema_id ?: number,
        Page ?: number,
        Size ?: number
    }, call ?: { (resp: pSegversionListar) }){
        this.jpo.get("segversionListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegversionListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.versions = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.versions.push({version_id : rs[1][i][0], version : rs[1][i][1], descripcion : rs[1][i][2], nivel : rs[1][i][3], fecha_inicio : (rs[1][i][4])?new Date(rs[1][i][4]):null, fecha_fin : (rs[1][i][5])?new Date(rs[1][i][5]):null, fecha_despliegue : (rs[1][i][6])?new Date(rs[1][i][6]):null, estado : rs[1][i][7]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segversionRegistrar(fields : {
        Sistema_id ?: number,
        Version_id ?: string,
        Descripcion ?: string,
        Fecha_inicio ?: string,
        Fecha_fin ?: string,
        Fecha_despliegue ?: string,
        EstadoVersion ?: string,
        Nivel ?: string,
        Usuario_id ?: number
    }, call ?: { (resp: pSegversionRegistrar) }){
        this.jpo.get("segversionRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegversionRegistrar();
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