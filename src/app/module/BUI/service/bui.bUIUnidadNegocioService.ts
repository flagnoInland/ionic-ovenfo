import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pSegunidadNegocioEditar {estado : number; mensaje : string};
export class pSegunidadNegocioEliminar {estado : number; mensaje : string};
export interface segunidadNegocioEliminarValidar_roles {nombre ?: string};
export interface segunidadNegocioEliminarValidar_catalogos {nombre ?: string};
export interface segunidadNegocioEliminarValidar_usuarios {nombre ?: string};
export interface segunidadNegocioEliminarValidar_empresas {nombre ?: string};
export interface segunidadNegocioEliminarValidar_terminos {nombre ?: string};
export interface segunidadNegocioEliminarValidar_faqs {nombre ?: string};
export class pSegunidadNegocioEliminarValidar {roles : segunidadNegocioEliminarValidar_roles[]; catalogos : segunidadNegocioEliminarValidar_catalogos[]; usuarios : segunidadNegocioEliminarValidar_usuarios[]; empresas : segunidadNegocioEliminarValidar_empresas[]; terminos : segunidadNegocioEliminarValidar_terminos[]; faqs : segunidadNegocioEliminarValidar_faqs[]};
export interface segunidadNegocioListar_respuesta {total ?: number};
export interface segunidadNegocioListar_resultado {unidad_negocio_id ?: number, nombre ?: string, estado ?: string, unidad_negocio_padre_id ?: number, unidad_negocio_padre_nombre ?: string};
export class pSegunidadNegocioListar {respuesta : segunidadNegocioListar_respuesta; resultado : segunidadNegocioListar_resultado[]};
export interface segunidadNegocioObtener_un {unidad_negocio_id ?: number, nombre ?: string, estado ?: string, unidad_negocio_padre_id ?: number};
export interface segunidadNegocioObtener_un_config {tipo_configuracion ?: number, valor ?: string, estado ?: string};
export interface segunidadNegocioObtener_un_monedas {moneda_id ?: number};
export interface segunidadNegocioObtener_configuraciones {catalogo_id ?: number, descricion_larga ?: string};
export interface segunidadNegocioObtener_monedas {moneda_id ?: number, nombre ?: string, abreviatura ?: string};
export class pSegunidadNegocioObtener {un : segunidadNegocioObtener_un; un_config : segunidadNegocioObtener_un_config[]; un_monedas : segunidadNegocioObtener_un_monedas[]; configuraciones : segunidadNegocioObtener_configuraciones[]; monedas : segunidadNegocioObtener_monedas[]};
export interface segunidadNegocioOpciones_configuraciones {catalogo_id ?: number, descricion_larga ?: string};
export interface segunidadNegocioOpciones_monedas {moneda_id ?: number, nombre ?: string, abreviatura ?: string};
export class pSegunidadNegocioOpciones {configuraciones : segunidadNegocioOpciones_configuraciones[]; monedas : segunidadNegocioOpciones_monedas[]};
export class pSegunidadNegocioRegistrar {estado : number; mensaje : string};

export class BUIUnidadNegocioServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui","BUIUnidadNegocioServiceImp");
    }

    segunidadNegocioEditar(fields : {
        unidad_negocio_id ?: number,
        nombre ?: string,
        estadoUN ?: string,
        configuracion ?: string,
        moneda ?: string,
        usuario_id ?: number,
        unidad_negocio_padre_id ?: number
    }, call ?: { (resp: pSegunidadNegocioEditar) }){
        this.jpo.get("segunidadNegocioEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegunidadNegocioEditar();
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

    segunidadNegocioEliminar(fields : {
        unidad_negocio_id ?: number,
        Usuario_id ?: number
    }, call ?: { (resp: pSegunidadNegocioEliminar) }){
        this.jpo.get("segunidadNegocioEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegunidadNegocioEliminar();
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

    segunidadNegocioEliminarValidar(fields : {
        unidad_negocio_id ?: number
    }, call ?: { (resp: pSegunidadNegocioEliminarValidar) }){
        this.jpo.get("segunidadNegocioEliminarValidar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegunidadNegocioEliminarValidar();
                        if(rs[0]){
                            out.roles = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.roles.push({nombre : rs[0][i][0]});
                            }
                        }
                        if(rs[1]){
                            out.catalogos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.catalogos.push({nombre : rs[1][i][0]});
                            }
                        }
                        if(rs[2]){
                            out.usuarios = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.usuarios.push({nombre : rs[2][i][0]});
                            }
                        }
                        if(rs[3]){
                            out.empresas = [];
                            for(var i = 0; i < rs[3].length; i++){
                                out.empresas.push({nombre : rs[3][i][0]});
                            }
                        }
                        if(rs[4]){
                            out.terminos = [];
                            for(var i = 0; i < rs[4].length; i++){
                                out.terminos.push({nombre : rs[4][i][0]});
                            }
                        }
                        if(rs[5]){
                            out.faqs = [];
                            for(var i = 0; i < rs[5].length; i++){
                                out.faqs.push({nombre : rs[5][i][0]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
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

    segunidadNegocioObtener(fields : {
        unidad_negocio_id ?: number
    }, call ?: { (resp: pSegunidadNegocioObtener) }){
        this.jpo.get("segunidadNegocioObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegunidadNegocioObtener();
                        if(rs[0] && rs[0][0]){
                            out.un = {unidad_negocio_id : rs[0][0][0], nombre : rs[0][0][1], estado : rs[0][0][2], unidad_negocio_padre_id : rs[0][0][3]};
                        }
                        if(rs[1]){
                            out.un_config = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.un_config.push({tipo_configuracion : rs[1][i][0], valor : rs[1][i][1], estado : rs[1][i][2]});
                            }
                        }
                        if(rs[2]){
                            out.un_monedas = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.un_monedas.push({moneda_id : rs[2][i][0]});
                            }
                        }
                        if(rs[3]){
                            out.configuraciones = [];
                            for(var i = 0; i < rs[3].length; i++){
                                out.configuraciones.push({catalogo_id : rs[3][i][0], descricion_larga : rs[3][i][1]});
                            }
                        }
                        if(rs[4]){
                            out.monedas = [];
                            for(var i = 0; i < rs[4].length; i++){
                                out.monedas.push({moneda_id : rs[4][i][0], nombre : rs[4][i][1], abreviatura : rs[4][i][2]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segunidadNegocioOpciones(call ?: { (resp: pSegunidadNegocioOpciones) }){
        this.jpo.get("segunidadNegocioOpciones",{
            response : (rs) => {
                if(call){
                    var out = new pSegunidadNegocioOpciones();
                        if(rs[0]){
                            out.configuraciones = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.configuraciones.push({catalogo_id : rs[0][i][0], descricion_larga : rs[0][i][1]});
                            }
                        }
                        if(rs[1]){
                            out.monedas = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.monedas.push({moneda_id : rs[1][i][0], nombre : rs[1][i][1], abreviatura : rs[1][i][2]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segunidadNegocioRegistrar(fields : {
        nombre ?: string,
        estadoUN ?: string,
        configuracion ?: string,
        moneda ?: string,
        usuario_id ?: number,
        unidad_negocio_padre_id ?: number
    }, call ?: { (resp: pSegunidadNegocioRegistrar) }){
        this.jpo.get("segunidadNegocioRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegunidadNegocioRegistrar();
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