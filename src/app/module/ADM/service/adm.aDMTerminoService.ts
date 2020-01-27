import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pGesterminoEditar {estado : number; mensaje : string};
export interface gesterminoListar_terminos {termino_id ?: number, menu_id ?: number, menu_descripcion ?: string, unidad_negocio_id ?: number, unidad_negocio_nombre ?: string, version ?: string, descripcion ?: string, estado ?: string, fecha_registro ?: Date, usuario_registro_id ?: number, usuario_registro_nombres ?: string, usuario_registro_apellidos ?: string};
export interface gesterminoListar_response {total ?: number};
export class pGesterminoListar {terminos : gesterminoListar_terminos[]; response : gesterminoListar_response};
export class pGesterminoObtener {termino_id : number; menu_id : number; menu_descripcion : string; version : string; descripcion : string};
export class pGesterminoRegistrar {estado : number; mensaje : string};

export class ADMTerminoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMTerminoServiceImp");
    }

    gesterminoEditar(fields : {
        Termino_id ?: number,
        Version ?: string,
        Descripcion ?: string,
        EstadoActivo ?: string,
        Usuario_id ?: number
    }, call ?: { (resp: pGesterminoEditar) }){
        this.jpo.get("gesterminoEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesterminoEditar();
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

    gesterminoListar(fields : {
        Page ?: number,
        Size ?: number
    }, call ?: { (resp: pGesterminoListar) }){
        this.jpo.get("gesterminoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesterminoListar();
                        if(rs[0]){
                            out.terminos = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.terminos.push({termino_id : rs[0][i][0], menu_id : rs[0][i][1], menu_descripcion : rs[0][i][2], unidad_negocio_id : rs[0][i][3], unidad_negocio_nombre : rs[0][i][4], version : rs[0][i][5], descripcion : rs[0][i][6], estado : rs[0][i][7], fecha_registro : (rs[0][i][8])?new Date(rs[0][i][8]):null, usuario_registro_id : rs[0][i][9], usuario_registro_nombres : rs[0][i][10], usuario_registro_apellidos : rs[0][i][11]});
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

    gesterminoObtener(fields : {
        Unidad_negocio_id ?: number,
        Proyecto_id ?: number
    }, call ?: { (resp: pGesterminoObtener[]) }){
        this.jpo.get("gesterminoObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({termino_id : rs[i][0], menu_id : rs[i][1], menu_descripcion : rs[i][2], version : rs[i][3], descripcion : rs[i][4]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesterminoRegistrar(fields : {
        Menu_id ?: number,
        Unidad_negocio_id ?: number,
        Version ?: string,
        Descripcion ?: string,
        EstadoActivo ?: string,
        Usuario_id ?: number
    }, call ?: { (resp: pGesterminoRegistrar) }){
        this.jpo.get("gesterminoRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesterminoRegistrar();
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