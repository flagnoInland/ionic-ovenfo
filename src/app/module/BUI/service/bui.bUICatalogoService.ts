import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export interface gescatalogoEditar_catalogo_padre {catalogo_id ?: number, descripcion ?: string, descricion_larga ?: string, estado ?: number};
export interface gescatalogoEditar_catalogo {catalogo_id ?: number, catalogo_padre_id ?: number, unidad_negocio_id ?: number, descripcion ?: string, descricion_larga ?: string, estado ?: number, variable_1 ?: string, variable_2 ?: string, variable_3 ?: number};
export interface gescatalogoEditar_resp_mensaje {mensaje ?: string};
export interface gescatalogoEditar_resp_estado {estado ?: number};
export class pGescatalogoEditar {catalogo_padre : gescatalogoEditar_catalogo_padre; catalogo : gescatalogoEditar_catalogo[]; resp_mensaje : gescatalogoEditar_resp_mensaje; resp_estado : gescatalogoEditar_resp_estado};
export class pGescatalogoEliminar {resp_estado : number; resp_mensaje : string};
export interface gescatalogoListar_resultado {total ?: number};
export interface gescatalogoListar_respuesta {catalogo_id ?: number, descripcion ?: string, descricion_larga ?: string, variable_1 ?: string, variable_2 ?: string, variable_3 ?: number, estado ?: number};
export class pGescatalogoListar {resultado : gescatalogoListar_resultado; respuesta : gescatalogoListar_respuesta[]};
export class pGescatalogoListarAll {catalogo_id : number; catalogo_padre_id : number; unidad_negocio_id : number; descripcion : string; descricion_larga : string; estado : string; variable_1 : string; variable_2 : string; variable_3 : number};
export interface gescatalogoObtener_catalogo {catalogo_id ?: number, descripcion ?: string, descricion_larga ?: string, estado ?: string, catalogo_padre_id ?: number};
export interface gescatalogoObtener_atributos {catalogo_id ?: number, unidad_negocio_id ?: number, descripcion ?: string, descricion_larga ?: string, variable_1 ?: string, variable_2 ?: string, variable_3 ?: number, estado ?: string};
export class pGescatalogoObtener {catalogo : gescatalogoObtener_catalogo; atributos : gescatalogoObtener_atributos[]};
export interface gescatalogoRegistrar_catalogo_padre {catalogo_id ?: number, descripcion ?: string, descricion_larga ?: string, estado ?: number};
export interface gescatalogoRegistrar_catalogo {catalogo_id ?: number, catalogo_padre_id ?: number, descripcion ?: string, descricion_larga ?: string, estado ?: number, variable_1 ?: string, variable_2 ?: string, variable_3 ?: number};
export interface gescatalogoRegistrar_resp_mensaje {mensaje ?: string};
export interface gescatalogoRegistrar_resp_estado {estado ?: number};
export class pGescatalogoRegistrar {catalogo_padre : gescatalogoRegistrar_catalogo_padre; catalogo : gescatalogoRegistrar_catalogo[]; resp_mensaje : gescatalogoRegistrar_resp_mensaje; resp_estado : gescatalogoRegistrar_resp_estado};

export class BUICatalogoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui","BUICatalogoServiceImp");
    }

    gescatalogoEditar(fields : {
        catalogo_id ?: number,
        descripcion ?: string,
        descricion_larga ?: string,
        estado ?: string,
        usuario_registro_id ?: number,
        atributos_editar ?: string,
        atributos_nuevo ?: string,
        resp_mensaje ?: string,
        resp_estado ?: number
    }, call ?: { (resp: pGescatalogoEditar) }){
        this.jpo.get("gescatalogoEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGescatalogoEditar();
                        if(rs[0] && rs[0][0]){
                            out.catalogo_padre = {catalogo_id : rs[0][0][0], descripcion : rs[0][0][1], descricion_larga : rs[0][0][2], estado : rs[0][0][3]};
                        }
                        if(rs[1]){
                            out.catalogo = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.catalogo.push({catalogo_id : rs[1][i][0], catalogo_padre_id : rs[1][i][1], unidad_negocio_id : rs[1][i][2], descripcion : rs[1][i][3], descricion_larga : rs[1][i][4], estado : rs[1][i][5], variable_1 : rs[1][i][6], variable_2 : rs[1][i][7], variable_3 : rs[1][i][8]});
                            }
                        }
                        if(rs[2] && rs[2][0]){
                            out.resp_mensaje = {mensaje : rs[2][0][0]};
                        }
                        if(rs[3] && rs[3][0]){
                            out.resp_estado = {estado : rs[3][0][0]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gescatalogoEliminar(fields : {
        catalogo_id ?: number
    }, call ?: { (resp: pGescatalogoEliminar) }){
        this.jpo.get("gescatalogoEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGescatalogoEliminar();
                        if(rs){
                            out.resp_estado = rs[0];
                            out.resp_mensaje = rs[1];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
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
                                out.respuesta.push({catalogo_id : rs[1][i][0], descripcion : rs[1][i][1], descricion_larga : rs[1][i][2], variable_1 : rs[1][i][3], variable_2 : rs[1][i][4], variable_3 : rs[1][i][5], estado : rs[1][i][6]});
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

    gescatalogoRegistrar(fields : {
        catalogo ?: string,
        descricion ?: string,
        estadoCatalogo ?: string,
        atributos ?: string,
        usuario_id ?: number
    }, call ?: { (resp: pGescatalogoRegistrar) }){
        this.jpo.get("gescatalogoRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGescatalogoRegistrar();
                        if(rs[0] && rs[0][0]){
                            out.catalogo_padre = {catalogo_id : rs[0][0][0], descripcion : rs[0][0][1], descricion_larga : rs[0][0][2], estado : rs[0][0][3]};
                        }
                        if(rs[1]){
                            out.catalogo = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.catalogo.push({catalogo_id : rs[1][i][0], catalogo_padre_id : rs[1][i][1], descripcion : rs[1][i][2], descricion_larga : rs[1][i][3], estado : rs[1][i][4], variable_1 : rs[1][i][5], variable_2 : rs[1][i][6], variable_3 : rs[1][i][7]});
                            }
                        }
                        if(rs[2] && rs[2][0]){
                            out.resp_mensaje = {mensaje : rs[2][0][0]};
                        }
                        if(rs[3] && rs[3][0]){
                            out.resp_estado = {estado : rs[3][0][0]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}