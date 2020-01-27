import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pSegrolRegistrar {estado : number; mensaje : string};
export class pSegrolEditar {estado : number; mensaje : string};
export class pSegrolEliminar {estado : number; mensaje : string};
export interface segrolEliminarValidar_menus {nombre ?: string};
export interface segrolEliminarValidar_usuarios {nombre ?: string};
export interface segrolEliminarValidar_notificaciones {nombre ?: string};
export interface segrolEliminarValidar_reportes {nombre ?: string};
export interface segrolEliminarValidar_unidades_negocio {nombre ?: string};
export class pSegrolEliminarValidar {menus : segrolEliminarValidar_menus[]; usuarios : segrolEliminarValidar_usuarios[]; notificaciones : segrolEliminarValidar_notificaciones[]; reportes : segrolEliminarValidar_reportes[]; unidades_negocio : segrolEliminarValidar_unidades_negocio[]};
export interface segrolListar_response {total ?: number};
export interface segrolListar_roles {rol_id ?: number, nombre ?: string, estado ?: string, id ?: string, unidades ?: string};
export class pSegrolListar {response : segrolListar_response; roles : segrolListar_roles[]};
export interface segrolObtener_rol {rol_id ?: number, nombre ?: string, estado ?: string, id ?: string};
export interface segrolObtener_menus {rol_id ?: number, menu_id ?: number};
export interface segrolObtener_unidad_negocios {rol_id ?: number, id ?: number};
export class pSegrolObtener {rol : segrolObtener_rol; menus : segrolObtener_menus[]; unidad_negocios : segrolObtener_unidad_negocios[]};
export interface segrolObtenerUsuario_roles_seleccionados {rol_id ?: number, nombre ?: string, estado ?: string};
export interface segrolObtenerUsuario_roles_menu {rol_id ?: number, menu_id ?: number};
export interface segrolObtenerUsuario_roles_unidades_negocio {rol_id ?: number, id ?: number};
export interface segrolObtenerUsuario_resultado {total ?: number};
export interface segrolObtenerUsuario_roles {rol_id ?: number, nombre ?: string, estado ?: string};
export class pSegrolObtenerUsuario {roles_seleccionados : segrolObtenerUsuario_roles_seleccionados[]; roles_menu : segrolObtenerUsuario_roles_menu[]; roles_unidades_negocio : segrolObtenerUsuario_roles_unidades_negocio[]; resultado : segrolObtenerUsuario_resultado; roles : segrolObtenerUsuario_roles[]};

export class ADMRolServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ROL","module.adm","ADMRolServiceImp");
    }

    segrolRegistrar(fields : {
        nombre ?: string,
        id ?: string,
        estadoRol ?: string,
        menu_ids ?: string,
        unidad_negocio_ids ?: string,
        Usuario_id ?: number
    }, call ?: { (resp: pSegrolRegistrar) }){
        this.jpo.get("segrolRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegrolRegistrar();
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

    segrolEditar(fields : {
        rol_id ?: number,
        id ?: string,
        nombre ?: string,
        estadoRol ?: string,
        menu_ids ?: string,
        unidad_negocio_ids ?: string,
        Usuario_id ?: number
    }, call ?: { (resp: pSegrolEditar) }){
        this.jpo.get("segrolEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegrolEditar();
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

    segrolEliminar(fields : {
        rol_id ?: number,
        Usuario_id ?: number
    }, call ?: { (resp: pSegrolEliminar) }){
        this.jpo.get("segrolEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegrolEliminar();
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

    segrolEliminarValidar(fields : {
        rol_id ?: number
    }, call ?: { (resp: pSegrolEliminarValidar) }){
        this.jpo.get("segrolEliminarValidar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegrolEliminarValidar();
                        if(rs[0]){
                            out.menus = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.menus.push({nombre : rs[0][i][0]});
                            }
                        }
                        if(rs[1]){
                            out.usuarios = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.usuarios.push({nombre : rs[1][i][0]});
                            }
                        }
                        if(rs[2]){
                            out.notificaciones = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.notificaciones.push({nombre : rs[2][i][0]});
                            }
                        }
                        if(rs[3]){
                            out.reportes = [];
                            for(var i = 0; i < rs[3].length; i++){
                                out.reportes.push({nombre : rs[3][i][0]});
                            }
                        }
                        if(rs[4]){
                            out.unidades_negocio = [];
                            for(var i = 0; i < rs[4].length; i++){
                                out.unidades_negocio.push({nombre : rs[4][i][0]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segrolListar(fields : {
        nombre ?: string,
        id ?: string,
        unidades ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pSegrolListar) }){
        this.jpo.get("segrolListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegrolListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.roles = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.roles.push({rol_id : rs[1][i][0], nombre : rs[1][i][1], estado : rs[1][i][2], id : rs[1][i][3], unidades : rs[1][i][4]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

    segrolObtener(fields : {
        rol_id ?: number
    }, call ?: { (resp: pSegrolObtener) }){
        this.jpo.get("segrolObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegrolObtener();
                        if(rs[0] && rs[0][0]){
                            out.rol = {rol_id : rs[0][0][0], nombre : rs[0][0][1], estado : rs[0][0][2], id : rs[0][0][3]};
                        }
                        if(rs[1]){
                            out.menus = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.menus.push({rol_id : rs[1][i][0], menu_id : rs[1][i][1]});
                            }
                        }
                        if(rs[2]){
                            out.unidad_negocios = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.unidad_negocios.push({rol_id : rs[2][i][0], id : rs[2][i][1]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segrolObtenerUsuario(fields : {
        usuario_id ?: number
    }, call ?: { (resp: pSegrolObtenerUsuario) }){
        this.jpo.get("segrolObtenerUsuario",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegrolObtenerUsuario();
                        if(rs[0]){
                            out.roles_seleccionados = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.roles_seleccionados.push({rol_id : rs[0][i][0], nombre : rs[0][i][1], estado : rs[0][i][2]});
                            }
                        }
                        if(rs[1]){
                            out.roles_menu = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.roles_menu.push({rol_id : rs[1][i][0], menu_id : rs[1][i][1]});
                            }
                        }
                        if(rs[2]){
                            out.roles_unidades_negocio = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.roles_unidades_negocio.push({rol_id : rs[2][i][0], id : rs[2][i][1]});
                            }
                        }
                        if(rs[3] && rs[3][0]){
                            out.resultado = {total : rs[3][0][0]};
                        }
                        if(rs[4]){
                            out.roles = [];
                            for(var i = 0; i < rs[4].length; i++){
                                out.roles.push({rol_id : rs[4][i][0], nombre : rs[4][i][1], estado : rs[4][i][2]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}