import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pSegmenuConfiguraciones {catalogo_id : number; descricion_larga : string};
export class pSegmenuEditar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pSegmenuEditarBajar {resp_estado : number; resp_mensaje : string};
export class pSegmenuEditarSubir {resp_estado : number; resp_mensaje : string};
export class pSegmenuEliminar {resp_estado : number; resp_mensaje : string};
export interface segmenuEliminarValidar_roles {nombre ?: string};
export interface segmenuEliminarValidar_reportes {nombre ?: string};
export interface segmenuEliminarValidar_terminos {nombre ?: string};
export interface segmenuEliminarValidar_faqs {nombre ?: string};
export interface segmenuEliminarValidar_procesos {nombre ?: string};
export interface segmenuEliminarValidar_tareas {nombre ?: string};
export class pSegmenuEliminarValidar {roles : segmenuEliminarValidar_roles[]; reportes : segmenuEliminarValidar_reportes[]; terminos : segmenuEliminarValidar_terminos[]; faqs : segmenuEliminarValidar_faqs[]; procesos : segmenuEliminarValidar_procesos[]; tareas : segmenuEliminarValidar_tareas[]};
export class pSegmenuListar {menu_id : number; menu_padre_id : number; titulo : string; descripcion : string; plantilla : string; icono : string; orden : number; estado : boolean; tiene_id : boolean; menu_base_id : number};
export class pSegmenuListarProyectos {menu_id : number; titulo : string};
export interface segmenuObtener_menu {menu_id ?: number, menu_base_id ?: number, menu_padre_id ?: number, titulo ?: string, descripcion ?: string, plantilla ?: string, icono ?: string, orden ?: number, tiene_id ?: string, estado ?: string};
export interface segmenuObtener_menu_config {tipo_configuracion ?: number, valor ?: string, estado ?: string};
export interface segmenuObtener_roles {rol_id ?: number};
export class pSegmenuObtener {menu : segmenuObtener_menu; menu_config : segmenuObtener_menu_config[]; roles : segmenuObtener_roles[]};
export class pSegmenuRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};

export class BUIMenuServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui","BUIMenuServiceImp");
    }

    segmenuConfiguraciones(call ?: { (resp: pSegmenuConfiguraciones[]) }){
        this.jpo.get("segmenuConfiguraciones",{
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({catalogo_id : rs[i][0], descricion_larga : rs[i][1]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segmenuEditar(fields : {
        menu_id ?: number,
        titulo ?: string,
        descripcion ?: string,
        plantilla ?: string,
        icono ?: string,
        tiene_id ?: string,
        estado ?: string,
        usuario_id ?: number,
        configuracion ?: string,
        roles_id ?: string
    }, call ?: { (resp: pSegmenuEditar) }){
        this.jpo.get("segmenuEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegmenuEditar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segmenuEditarBajar(fields : {
        Menu_id ?: number
    }, call ?: { (resp: pSegmenuEditarBajar) }){
        this.jpo.get("segmenuEditarBajar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegmenuEditarBajar();
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

    segmenuEditarSubir(fields : {
        Menu_id ?: number
    }, call ?: { (resp: pSegmenuEditarSubir) }){
        this.jpo.get("segmenuEditarSubir",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegmenuEditarSubir();
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

    segmenuEliminar(fields : {
        Menu_id ?: number
    }, call ?: { (resp: pSegmenuEliminar) }){
        this.jpo.get("segmenuEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegmenuEliminar();
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

    segmenuEliminarValidar(fields : {
        Menu_id ?: number
    }, call ?: { (resp: pSegmenuEliminarValidar) }){
        this.jpo.get("segmenuEliminarValidar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegmenuEliminarValidar();
                        if(rs[0]){
                            out.roles = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.roles.push({nombre : rs[0][i][0]});
                            }
                        }
                        if(rs[1]){
                            out.reportes = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.reportes.push({nombre : rs[1][i][0]});
                            }
                        }
                        if(rs[2]){
                            out.terminos = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.terminos.push({nombre : rs[2][i][0]});
                            }
                        }
                        if(rs[3]){
                            out.faqs = [];
                            for(var i = 0; i < rs[3].length; i++){
                                out.faqs.push({nombre : rs[3][i][0]});
                            }
                        }
                        if(rs[4]){
                            out.procesos = [];
                            for(var i = 0; i < rs[4].length; i++){
                                out.procesos.push({nombre : rs[4][i][0]});
                            }
                        }
                        if(rs[5]){
                            out.tareas = [];
                            for(var i = 0; i < rs[5].length; i++){
                                out.tareas.push({nombre : rs[5][i][0]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segmenuListar(call ?: { (resp: pSegmenuListar[]) }){
        this.jpo.get("segmenuListar",{
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({menu_id : rs[i][0], menu_padre_id : rs[i][1], titulo : rs[i][2], descripcion : rs[i][3], plantilla : rs[i][4], icono : rs[i][5], orden : rs[i][6], estado : (rs[i][7] == "true" || rs[i][7] == "1")?true:false, tiene_id : (rs[i][8] == "true" || rs[i][8] == "1")?true:false, menu_base_id : rs[i][9]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segmenuListarProyectos(call ?: { (resp: pSegmenuListarProyectos[]) }){
        this.jpo.get("segmenuListarProyectos",{
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({menu_id : rs[i][0], titulo : rs[i][1]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segmenuObtener(fields : {
        menu_id ?: number
    }, call ?: { (resp: pSegmenuObtener) }){
        this.jpo.get("segmenuObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegmenuObtener();
                        if(rs[0] && rs[0][0]){
                            out.menu = {menu_id : rs[0][0][0], menu_base_id : rs[0][0][1], menu_padre_id : rs[0][0][2], titulo : rs[0][0][3], descripcion : rs[0][0][4], plantilla : rs[0][0][5], icono : rs[0][0][6], orden : rs[0][0][7], tiene_id : rs[0][0][8], estado : rs[0][0][9]};
                        }
                        if(rs[1]){
                            out.menu_config = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.menu_config.push({tipo_configuracion : rs[1][i][0], valor : rs[1][i][1], estado : rs[1][i][2]});
                            }
                        }
                        if(rs[2]){
                            out.roles = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.roles.push({rol_id : rs[2][i][0]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segmenuRegistrar(fields : {
        menu_base_id ?: number,
        menu_padre_id ?: number,
        titulo ?: string,
        descripcion ?: string,
        plantilla ?: string,
        icono ?: string,
        orden ?: number,
        tiene_id ?: string,
        estado ?: string,
        usuario_id ?: number,
        configuracion ?: string,
        roles_id ?: string
    }, call ?: { (resp: pSegmenuRegistrar) }){
        this.jpo.get("segmenuRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegmenuRegistrar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}