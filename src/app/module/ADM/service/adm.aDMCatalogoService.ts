import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export interface gescatalogoListar_resultado {total ?: number};
export interface gescatalogoListar_respuesta {catalogo_id ?: number, descripcion ?: string, descricion_larga ?: string, estado ?: number};
export class pGescatalogoListar {resultado : gescatalogoListar_resultado; respuesta : gescatalogoListar_respuesta[]};
export class pGescatalogoListarAll {catalogo_id : number; catalogo_padre_id : number; unidad_negocio_id : number; descripcion : string; descricion_larga : string; estado : string; variable_1 : string; variable_2 : string; variable_3 : number};
export interface gescatalogoObtener_catalogo {catalogo_id ?: number, descripcion ?: string, descricion_larga ?: string, estado ?: string, catalogo_padre_id ?: number};
export interface gescatalogoObtener_atributos {catalogo_id ?: number, unidad_negocio_id ?: number, descripcion ?: string, descricion_larga ?: string, variable_1 ?: string, variable_2 ?: string, variable_3 ?: number, estado ?: string};
export class pGescatalogoObtener {catalogo : gescatalogoObtener_catalogo; atributos : gescatalogoObtener_atributos[]};

export class ADMCatalogoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMCatalogoServiceImp");
    }

    gescatalogoListar(fields : {
        catalogo_id ?: number,
        catalogo_hijo_id ?: number,
        descripcion ?: string,
        descricion_larga ?: string,
        estado ?: string,
        Page ?: number,
        Size ?: number
    }, call ?: { (resp: pGescatalogoListar) }){
        this.jpo.get("gescatalogoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGescatalogoListar();
                        if(rs[0] && rs[0][0]){
                            out.resultado = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.respuesta = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.respuesta.push({catalogo_id : rs[1][i][0], descripcion : rs[1][i][1], descricion_larga : rs[1][i][2], estado : rs[1][i][3]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gescatalogoListarAll(fields : {
        catalogo_id ?: number
    }, call ?: { (resp: pGescatalogoListarAll[]) }){
        this.jpo.get("gescatalogoListarAll",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({catalogo_id : rs[i][0], catalogo_padre_id : rs[i][1], unidad_negocio_id : rs[i][2], descripcion : rs[i][3], descricion_larga : rs[i][4], estado : rs[i][5], variable_1 : rs[i][6], variable_2 : rs[i][7], variable_3 : rs[i][8]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gescatalogoObtener(fields : {
        catalogo_id ?: number
    }, call ?: { (resp: pGescatalogoObtener) }){
        this.jpo.get("gescatalogoObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGescatalogoObtener();
                        if(rs[0] && rs[0][0]){
                            out.catalogo = {catalogo_id : rs[0][0][0], descripcion : rs[0][0][1], descricion_larga : rs[0][0][2], estado : rs[0][0][3], catalogo_padre_id : rs[0][0][4]};
                        }
                        if(rs[1]){
                            out.atributos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.atributos.push({catalogo_id : rs[1][i][0], unidad_negocio_id : rs[1][i][1], descripcion : rs[1][i][2], descricion_larga : rs[1][i][3], variable_1 : rs[1][i][4], variable_2 : rs[1][i][5], variable_3 : rs[1][i][6], estado : rs[1][i][7]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}