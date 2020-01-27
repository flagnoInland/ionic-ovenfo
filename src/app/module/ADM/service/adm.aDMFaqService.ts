import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pGesfaqEditar {estado : number; mensaje : string};
export interface gesfaqListar_faqs {faq_id ?: number, menu_id ?: number, menu_descripcion ?: string, unidad_negocio_id ?: number, unidad_negocio_nombre ?: string, version ?: string, descripcion ?: string, estado ?: string, fecha_registro ?: Date, usuario_registro_id ?: number, usuario_registro_nombres ?: string, usuario_registro_apellidos ?: string};
export interface gesfaqListar_response {total ?: number};
export class pGesfaqListar {faqs : gesfaqListar_faqs[]; response : gesfaqListar_response};
export class pGesfaqObtener {faq_id : number; menu_id : number; menu_descripcion : string; version : string; descripcion : string};
export class pGesfaqRegistrar {estado : number; mensaje : string};

export class ADMFaqServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMFaqServiceImp");
    }

    gesfaqEditar(fields : {
        Faq_id ?: number,
        Version ?: string,
        Descripcion ?: string,
        EstadoActivo ?: string,
        Usuario_id ?: number
    }, call ?: { (resp: pGesfaqEditar) }){
        this.jpo.get("gesfaqEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesfaqEditar();
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

    gesfaqListar(fields : {
        Page ?: number,
        Size ?: number
    }, call ?: { (resp: pGesfaqListar) }){
        this.jpo.get("gesfaqListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesfaqListar();
                        if(rs[0]){
                            out.faqs = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.faqs.push({faq_id : rs[0][i][0], menu_id : rs[0][i][1], menu_descripcion : rs[0][i][2], unidad_negocio_id : rs[0][i][3], unidad_negocio_nombre : rs[0][i][4], version : rs[0][i][5], descripcion : rs[0][i][6], estado : rs[0][i][7], fecha_registro : (rs[0][i][8])?new Date(rs[0][i][8]):null, usuario_registro_id : rs[0][i][9], usuario_registro_nombres : rs[0][i][10], usuario_registro_apellidos : rs[0][i][11]});
                            }
                        }
                        if(rs[1] && rs[1][0]){
                            out.response = {total : rs[1][0][0]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesfaqObtener(fields : {
        Unidad_negocio_id ?: number,
        Proyecto_id ?: number
    }, call ?: { (resp: pGesfaqObtener[]) }){
        this.jpo.get("gesfaqObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({faq_id : rs[i][0], menu_id : rs[i][1], menu_descripcion : rs[i][2], version : rs[i][3], descripcion : rs[i][4]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesfaqRegistrar(fields : {
        Menu_id ?: number,
        Unidad_negocio_id ?: number,
        Version ?: string,
        Descripcion ?: string,
        EstadoActivo ?: string,
        Usuario_id ?: number
    }, call ?: { (resp: pGesfaqRegistrar) }){
        this.jpo.get("gesfaqRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesfaqRegistrar();
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