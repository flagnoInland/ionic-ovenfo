import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pSegusuarioClaveCambiar {estado : number; mensaje : string};
export class pSegusuarioEditarEstado {estado : number; mensaje : string};
export class pSegusuarioEditarNuevo {estado : number; mensaje : string};
export class pSegusuarioEliminar {estado : number; mensaje : string};
export interface segusuarioEliminarValidar_roles {nombre ?: string, estado ?: boolean};
export interface segusuarioEliminarValidar_empresas {documento ?: string, documento_tipo ?: string, razon_social ?: string, unidad_negocio ?: string, estado ?: boolean};
export interface segusuarioEliminarValidar_plantillas {nombre ?: string, estado ?: boolean};
export class pSegusuarioEliminarValidar {roles : segusuarioEliminarValidar_roles[]; empresas : segusuarioEliminarValidar_empresas[]; plantillas : segusuarioEliminarValidar_plantillas[]};
export class pSegusuarioEmailPlantillaRegistrar {estado : number; mensaje : string};
export interface segusuarioListar_lista {usuario_id ?: number, id ?: string, correo ?: string, diasCambioClave ?: number, nombres ?: string, apellido_paterno ?: string, apellido_materno ?: string, empresa_id ?: number, documento ?: string, razon_social ?: string, estado ?: string, adjunto_foto_id ?: number, adjunto_uid ?: string, roles ?: string, empresas ?: string};
export interface segusuarioListar_resultado {total ?: number};
export class pSegusuarioListar {lista : segusuarioListar_lista[]; resultado : segusuarioListar_resultado};
export interface segusuarioObtenerEditar_usuario {usuario_id ?: number, id ?: string, correo ?: string, nombres ?: string, apellido_paterno ?: string, apellido_materno ?: string, empresa_id ?: number, adjunto_foto_id ?: number, estado ?: number, caducidad_clave ?: number};
export interface segusuarioObtenerEditar_empresas {empresa_id ?: number, estado ?: string, razon_social ?: string, documento ?: string, documento_tipo ?: string, unidad_negocio_nombre ?: string};
export interface segusuarioObtenerEditar_email_configuracion {email_plantilla_id ?: number, estado ?: boolean, habilitado ?: boolean};
export interface segusuarioObtenerEditar_email_disponibles {email_plantilla_id ?: number, titulo ?: string};
export class pSegusuarioObtenerEditar {usuario : segusuarioObtenerEditar_usuario; empresas : segusuarioObtenerEditar_empresas[]; email_configuracion : segusuarioObtenerEditar_email_configuracion[]; email_disponibles : segusuarioObtenerEditar_email_disponibles[]};
export class pSegusuarioRegistrarNuevo {estado : number; mensaje : string};
export class pSegusuarioRolRegistrar {estado : number; mensaje : string};
export class pSegusuarioValidar {usuario_id : number; id : string; correo : string; dias_cambio_clave : number; nombres : string; apellido_paterno : string; apellido_materno : string; empresa_id : number; estado : string};
export class pSegusuarioSubUnidadRolesListar {usuario_id : number; nombre : string};

export class ADMUsuarioServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMUsuarioServiceImp");
    }

    segusuarioClaveCambiar(fields : {
        Usuario_id ?: number,
        Clave ?: string,
        Origen ?: string
    }, call ?: { (resp: pSegusuarioClaveCambiar) }){
        this.jpo.get("segusuarioClaveCambiar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioClaveCambiar();
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

    segusuarioEditarEstado(fields : {
        Usuario_id ?: number,
        EstadoUsuario ?: string,
        UsuarioEditor_id ?: number
    }, call ?: { (resp: pSegusuarioEditarEstado) }){
        this.jpo.get("segusuarioEditarEstado",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioEditarEstado();
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

    segusuarioEditarNuevo(fields : {
        usuario_id ?: number,
        id ?: string,
        editar_id ?: string,
        correo ?: string,
        nombres ?: string,
        apellido_paterno ?: string,
        apellido_materno ?: string,
        empresa_id ?: number,
        estado_usuario ?: string,
        usuario_edicion_id ?: number,
        empresas ?: string
    }, call ?: { (resp: pSegusuarioEditarNuevo) }){
        this.jpo.get("segusuarioEditarNuevo",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioEditarNuevo();
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

    segusuarioEliminar(fields : {
        usuario_id ?: number,
        usuario_admin_id ?: number
    }, call ?: { (resp: pSegusuarioEliminar) }){
        this.jpo.get("segusuarioEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioEliminar();
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

    segusuarioEliminarValidar(fields : {
        usuario_id ?: number
    }, call ?: { (resp: pSegusuarioEliminarValidar) }){
        this.jpo.get("segusuarioEliminarValidar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioEliminarValidar();
                        if(rs[0]){
                            out.roles = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.roles.push({nombre : rs[0][i][0], estado : (rs[0][i][1] == "true" || rs[0][i][1] == "1")?true:false});
                            }
                        }
                        if(rs[1]){
                            out.empresas = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.empresas.push({documento : rs[1][i][0], documento_tipo : rs[1][i][1], razon_social : rs[1][i][2], unidad_negocio : rs[1][i][3], estado : (rs[1][i][4] == "true" || rs[1][i][4] == "1")?true:false});
                            }
                        }
                        if(rs[2]){
                            out.plantillas = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.plantillas.push({nombre : rs[2][i][0], estado : (rs[2][i][1] == "true" || rs[2][i][1] == "1")?true:false});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segusuarioEmailPlantillaRegistrar(fields : {
        usuario_id ?: number,
        emailconfig ?: string
    }, call ?: { (resp: pSegusuarioEmailPlantillaRegistrar) }){
        this.jpo.get("segusuarioEmailPlantillaRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioEmailPlantillaRegistrar();
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

    segusuarioListar(fields : {
        usuarios_id ?: string,
        usuario_id ?: number,
        id ?: string,
        correo ?: string,
        nombres ?: string,
        estado ?: string,
        roles ?: string,
        empresas ?: string,
        Page ?: number,
        Size ?: number
    }, call ?: { (resp: pSegusuarioListar) }){
        this.jpo.get("segusuarioListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioListar();
                        if(rs[0]){
                            out.lista = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.lista.push({usuario_id : rs[0][i][0], id : rs[0][i][1], correo : rs[0][i][2], diasCambioClave : rs[0][i][3], nombres : rs[0][i][4], apellido_paterno : rs[0][i][5], apellido_materno : rs[0][i][6], empresa_id : rs[0][i][7], documento : rs[0][i][8], razon_social : rs[0][i][9], estado : rs[0][i][10], adjunto_foto_id : rs[0][i][11], adjunto_uid : rs[0][i][12], roles : rs[0][i][13], empresas : rs[0][i][14]});
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

    segusuarioObtenerEditar(fields : {
        Usuario_id ?: number
    }, call ?: { (resp: pSegusuarioObtenerEditar) }){
        this.jpo.get("segusuarioObtenerEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioObtenerEditar();
                        if(rs[0] && rs[0][0]){
                            out.usuario = {usuario_id : rs[0][0][0], id : rs[0][0][1], correo : rs[0][0][2], nombres : rs[0][0][3], apellido_paterno : rs[0][0][4], apellido_materno : rs[0][0][5], empresa_id : rs[0][0][6], adjunto_foto_id : rs[0][0][7], estado : rs[0][0][8], caducidad_clave : rs[0][0][9]};
                        }
                        if(rs[1]){
                            out.empresas = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.empresas.push({empresa_id : rs[1][i][0], estado : rs[1][i][1], razon_social : rs[1][i][2], documento : rs[1][i][3], documento_tipo : rs[1][i][4], unidad_negocio_nombre : rs[1][i][5]});
                            }
                        }
                        if(rs[2]){
                            out.email_configuracion = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.email_configuracion.push({email_plantilla_id : rs[2][i][0], estado : (rs[2][i][1] == "true" || rs[2][i][1] == "1")?true:false, habilitado : (rs[2][i][2] == "true" || rs[2][i][2] == "1")?true:false});
                            }
                        }
                        if(rs[3]){
                            out.email_disponibles = [];
                            for(var i = 0; i < rs[3].length; i++){
                                out.email_disponibles.push({email_plantilla_id : rs[3][i][0], titulo : rs[3][i][1]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segusuarioRegistrarNuevo(fields : {
        id ?: string,
        correo ?: string,
        clave ?: string,
        nombres ?: string,
        apellido_paterno ?: string,
        apellido_materno ?: string,
        empresa_id ?: number,
        estado_usuario ?: string,
        usuario_id ?: number,
        empresas ?: string,
        roles ?: string
    }, call ?: { (resp: pSegusuarioRegistrarNuevo) }){
        this.jpo.get("segusuarioRegistrarNuevo",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioRegistrarNuevo();
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

    segusuarioRolRegistrar(fields : {
        usuario_id ?: number,
        roles ?: string
    }, call ?: { (resp: pSegusuarioRolRegistrar) }){
        this.jpo.get("segusuarioRolRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioRolRegistrar();
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

    segusuarioValidar(fields : {
        correo ?: string,
        id ?: string
    }, call ?: { (resp: pSegusuarioValidar[]) }){
        this.jpo.get("segusuarioValidar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({usuario_id : rs[i][0], id : rs[i][1], correo : rs[i][2], dias_cambio_clave : rs[i][3], nombres : rs[i][4], apellido_paterno : rs[i][5], apellido_materno : rs[i][6], empresa_id : rs[i][7], estado : rs[i][8]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

    segusuarioSubUnidadRolesListar(fields : {
        sub_unidad_negocio_id ?: number,
        roles_id ?: string
    }, call ?: { (resp: pSegusuarioSubUnidadRolesListar[]) }){
        this.jpo.get("segusuarioSubUnidadRolesListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({usuario_id : rs[i][0], nombre : rs[i][1]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}