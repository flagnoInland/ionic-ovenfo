import { Jpo } from "../ohCore/services/oh.core";
import { OHService } from "../tis.ohService";

export class pSegempresaObtener {Estado : number; Mensaje : string};
export interface segloginAcceder_data {userid ?: string, id ?: string, name ?: string, lastName ?: string, lastMiddle ?: string, company ?: string, companyId ?: string, changePassword ?: string, daysChangekey ?: string, source ?: string, token ?: string};
export interface segloginAcceder_profiles {id ?: string, businessName ?: string, default ?: string, un_hijo_predefinido_id ?: number};
export interface segloginAcceder_roles {id ?: string, idUN ?: string, id_ ?: string};
export interface segloginAcceder_systems {id ?: string, description ?: string, icon ?: string};
export interface segloginAcceder_systemByProfile {systemId ?: string, profileId ?: string};
export interface segloginAcceder_system {version ?: string, nivel ?: number, deploymentDate ?: Date};
export interface segloginAcceder_adds {id ?: number, type ?: number, icon ?: string, title ?: string, subtitle ?: string, description ?: string, nivel ?: string, onlyOne ?: string, onlyOneAlert ?: string, dueDate ?: Date, read ?: number, sendDate ?: Date};
export interface segloginAcceder_rules {regla_id ?: number, parametros ?: string};
export interface segloginAcceder_terms {unidad_negocio_id ?: number};
export interface segloginAcceder_faqs {unidad_negocio_id ?: number};
export class pSegloginAcceder {data : segloginAcceder_data; profiles : segloginAcceder_profiles[]; roles : segloginAcceder_roles[]; systems : segloginAcceder_systems[]; systemByProfile : segloginAcceder_systemByProfile[]; system : segloginAcceder_system; adds : segloginAcceder_adds[]; rules : segloginAcceder_rules[]; terms : segloginAcceder_terms[]; faqs : segloginAcceder_faqs[]};
export interface segloginSincronizar_data {userid ?: string, id ?: string, name ?: string, lastName ?: string, lastMiddle ?: string, company ?: string, companyId ?: string, changePassword ?: string, daysChangekey ?: string, source ?: string, token ?: string};
export interface segloginSincronizar_profiles {id ?: string, businessName ?: string, default ?: string, un_hijo_predefinido_id ?: number};
export interface segloginSincronizar_roles {id ?: string, idUN ?: string, id_ ?: string};
export interface segloginSincronizar_systems {id ?: string, description ?: string, icon ?: string};
export interface segloginSincronizar_systemByProfile {systemId ?: string, profileId ?: string};
export interface segloginSincronizar_system {version ?: string, nivel ?: number, deploymentDate ?: Date};
export interface segloginSincronizar_adds {id ?: number, type ?: number, icon ?: string, title ?: string, subtitle ?: string, description ?: string, nivel ?: string, onlyOne ?: string, onlyOneAlert ?: string, dueDate ?: Date, read ?: number, sendDate ?: Date};
export interface segloginSincronizar_rules {regla_id ?: number, parametros ?: string};
export interface segloginSincronizar_terms {unidad_negocio_id ?: number};
export interface segloginSincronizar_faqs {unidad_negocio_id ?: number};
export class pSegloginSincronizar {data : segloginSincronizar_data; profiles : segloginSincronizar_profiles[]; roles : segloginSincronizar_roles[]; systems : segloginSincronizar_systems[]; systemByProfile : segloginSincronizar_systemByProfile[]; system : segloginSincronizar_system; adds : segloginSincronizar_adds[]; rules : segloginSincronizar_rules[]; terms : segloginSincronizar_terms[]; faqs : segloginSincronizar_faqs[]};
export class pSegusuarioClaveReestablecer {estado : number; mensaje : string};
export class pSegusuarioClaveRestaurar {estado : number; mensaje : string; resp_correo : string};
export class pSegusuarioClaveValidar {estado : number; mensaje : string};
export class pSegusuarioConfiguracionEditar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export interface segusuarioConfiguracionObtener_unidades_negocio_base {unidad_negocio_id ?: number, nombre ?: string, seleccionado ?: boolean};
export interface segusuarioConfiguracionObtener_unidades_negocio_hijos {unidad_negocio_padre_id ?: number, unidad_negocio_id ?: number, nombre ?: string, seleccionado ?: boolean};
export class pSegusuarioConfiguracionObtener {unidades_negocio_base : segusuarioConfiguracionObtener_unidades_negocio_base[]; unidades_negocio_hijos : segusuarioConfiguracionObtener_unidades_negocio_hijos[]};
export class pSegusuarioConfirmar {estado : number; mensaje : string};
export class pSegusuarioEditar {estado : number; mensaje : string};
export class pSegusuarioEditarEmailPlantillas {estado : number; mensaje : string};
export class pSegusuarioFotoAdjuntar {Adjunto_id : number; estado : number; mensaje : string; Archivo_base64 : string};
export class pSegusuarioFotoEliminar {estado : number; mensaje : string};
export interface segusuarioObtener_userInfo {email ?: string, photoId ?: number, RUC ?: string, company ?: string, photoBase64 ?: string};
export interface segusuarioObtener_emailConfig {emailTemplateId ?: number, state ?: string, enable ?: string, description ?: string};
export class pSegusuarioObtener {userInfo : segusuarioObtener_userInfo; emailConfig : segusuarioObtener_emailConfig[]};
export class pSegusuarioPreconfirmar {estado : number; mensaje : string};
export class pSegusuarioRegistrar {estado : number; mensaje : string; resp_correo : string};

export class UserServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("Inlandnet","SEG","security","UserServiceImp");
    }

    segempresaObtener(fields : {
        Documento ?: string,
        Unidad_negocio_id ?: number,
        Tipo_documento ?: number
    }, call ?: { (resp: pSegempresaObtener) }){
        this.jpo.get("segempresaObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegempresaObtener();
                        if(rs){
                            out.Estado = rs[0];
                            out.Mensaje = rs[1];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segloginAcceder(fields : {
        Usuario ?: string,
        ClaveMD5 ?: string,
        Sistema_id ?: number
    }, body : any, call ?: { (resp: pSegloginAcceder) }){
        this.jpo.get("segloginAcceder",{
            body : body,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegloginAcceder();
                        if(rs[0] && rs[0][0]){
                            out.data = {userid : rs[0][0][0], id : rs[0][0][1], name : rs[0][0][2], lastName : rs[0][0][3], lastMiddle : rs[0][0][4], company : rs[0][0][5], companyId : rs[0][0][6], changePassword : rs[0][0][7], daysChangekey : rs[0][0][8], source : rs[0][0][9], token : rs[0][0][10]};
                        }
                        if(rs[1]){
                            out.profiles = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.profiles.push({id : rs[1][i][0], businessName : rs[1][i][1], default : rs[1][i][2], un_hijo_predefinido_id : rs[1][i][3]});
                            }
                        }
                        if(rs[2]){
                            out.roles = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.roles.push({id : rs[2][i][0], idUN : rs[2][i][1], id_ : rs[2][i][2]});
                            }
                        }
                        if(rs[3]){
                            out.systems = [];
                            for(var i = 0; i < rs[3].length; i++){
                                out.systems.push({id : rs[3][i][0], description : rs[3][i][1], icon : rs[3][i][2]});
                            }
                        }
                        if(rs[4]){
                            out.systemByProfile = [];
                            for(var i = 0; i < rs[4].length; i++){
                                out.systemByProfile.push({systemId : rs[4][i][0], profileId : rs[4][i][1]});
                            }
                        }
                        if(rs[5] && rs[5][0]){
                            out.system = {version : rs[5][0][0], nivel : rs[5][0][1], deploymentDate : (rs[5][0][2])?new Date(rs[5][0][2]):null};
                        }
                        if(rs[6]){
                            out.adds = [];
                            for(var i = 0; i < rs[6].length; i++){
                                out.adds.push({id : rs[6][i][0], type : rs[6][i][1], icon : rs[6][i][2], title : rs[6][i][3], subtitle : rs[6][i][4], description : rs[6][i][5], nivel : rs[6][i][6], onlyOne : rs[6][i][7], onlyOneAlert : rs[6][i][8], dueDate : (rs[6][i][9])?new Date(rs[6][i][9]):null, read : rs[6][i][10], sendDate : (rs[6][i][11])?new Date(rs[6][i][11]):null});
                            }
                        }
                        if(rs[7]){
                            out.rules = [];
                            for(var i = 0; i < rs[7].length; i++){
                                out.rules.push({regla_id : rs[7][i][0], parametros : rs[7][i][1]});
                            }
                        }
                        if(rs[8]){
                            out.terms = [];
                            for(var i = 0; i < rs[8].length; i++){
                                out.terms.push({unidad_negocio_id : rs[8][i][0]});
                            }
                        }
                        if(rs[9]){
                            out.faqs = [];
                            for(var i = 0; i < rs[9].length; i++){
                                out.faqs.push({unidad_negocio_id : rs[9][i][0]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segloginSincronizar(fields : {
        usuario_id ?: number,
        sistema_id ?: number
    }, call ?: { (resp: pSegloginSincronizar) }){
        this.jpo.get("segloginSincronizar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegloginSincronizar();
                        if(rs[0] && rs[0][0]){
                            out.data = {userid : rs[0][0][0], id : rs[0][0][1], name : rs[0][0][2], lastName : rs[0][0][3], lastMiddle : rs[0][0][4], company : rs[0][0][5], companyId : rs[0][0][6], changePassword : rs[0][0][7], daysChangekey : rs[0][0][8], source : rs[0][0][9], token : rs[0][0][10]};
                        }
                        if(rs[1]){
                            out.profiles = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.profiles.push({id : rs[1][i][0], businessName : rs[1][i][1], default : rs[1][i][2], un_hijo_predefinido_id : rs[1][i][3]});
                            }
                        }
                        if(rs[2]){
                            out.roles = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.roles.push({id : rs[2][i][0], idUN : rs[2][i][1], id_ : rs[2][i][2]});
                            }
                        }
                        if(rs[3]){
                            out.systems = [];
                            for(var i = 0; i < rs[3].length; i++){
                                out.systems.push({id : rs[3][i][0], description : rs[3][i][1], icon : rs[3][i][2]});
                            }
                        }
                        if(rs[4]){
                            out.systemByProfile = [];
                            for(var i = 0; i < rs[4].length; i++){
                                out.systemByProfile.push({systemId : rs[4][i][0], profileId : rs[4][i][1]});
                            }
                        }
                        if(rs[5] && rs[5][0]){
                            out.system = {version : rs[5][0][0], nivel : rs[5][0][1], deploymentDate : (rs[5][0][2])?new Date(rs[5][0][2]):null};
                        }
                        if(rs[6]){
                            out.adds = [];
                            for(var i = 0; i < rs[6].length; i++){
                                out.adds.push({id : rs[6][i][0], type : rs[6][i][1], icon : rs[6][i][2], title : rs[6][i][3], subtitle : rs[6][i][4], description : rs[6][i][5], nivel : rs[6][i][6], onlyOne : rs[6][i][7], onlyOneAlert : rs[6][i][8], dueDate : (rs[6][i][9])?new Date(rs[6][i][9]):null, read : rs[6][i][10], sendDate : (rs[6][i][11])?new Date(rs[6][i][11]):null});
                            }
                        }
                        if(rs[7]){
                            out.rules = [];
                            for(var i = 0; i < rs[7].length; i++){
                                out.rules.push({regla_id : rs[7][i][0], parametros : rs[7][i][1]});
                            }
                        }
                        if(rs[8]){
                            out.terms = [];
                            for(var i = 0; i < rs[8].length; i++){
                                out.terms.push({unidad_negocio_id : rs[8][i][0]});
                            }
                        }
                        if(rs[9]){
                            out.faqs = [];
                            for(var i = 0; i < rs[9].length; i++){
                                out.faqs.push({unidad_negocio_id : rs[9][i][0]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segusuarioClaveReestablecer(fields : {
        Correo ?: string,
        Clave ?: string
    }, call ?: { (resp: pSegusuarioClaveReestablecer) }){
        this.jpo.get("segusuarioClaveReestablecer",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioClaveReestablecer();
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

    segusuarioClaveRestaurar(fields : {
        Correo ?: string,
        Enlace ?: string
    }, call ?: { (resp: pSegusuarioClaveRestaurar) }){
        this.jpo.get("segusuarioClaveRestaurar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioClaveRestaurar();
                        if(rs){
                            out.estado = rs[0];
                            out.mensaje = rs[1];
                            out.resp_correo = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segusuarioClaveValidar(fields : {
        Correo ?: string
    }, call ?: { (resp: pSegusuarioClaveValidar) }){
        this.jpo.get("segusuarioClaveValidar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioClaveValidar();
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

    segusuarioConfiguracionEditar(fields : {
        usuario_id ?: number,
        unidad_negocio_padre_id ?: number,
        unidades_hijas ?: string
    }, call ?: { (resp: pSegusuarioConfiguracionEditar) }){
        this.jpo.get("segusuarioConfiguracionEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioConfiguracionEditar();
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

    segusuarioConfiguracionObtener(fields : {
        unidad_negocio_id ?: number,
        usuario_id ?: number
    }, call ?: { (resp: pSegusuarioConfiguracionObtener) }){
        this.jpo.get("segusuarioConfiguracionObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioConfiguracionObtener();
                        if(rs[0]){
                            out.unidades_negocio_base = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.unidades_negocio_base.push({unidad_negocio_id : rs[0][i][0], nombre : rs[0][i][1], seleccionado : (rs[0][i][2] == "true" || rs[0][i][2] == "1")?true:false});
                            }
                        }
                        if(rs[1]){
                            out.unidades_negocio_hijos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.unidades_negocio_hijos.push({unidad_negocio_padre_id : rs[1][i][0], unidad_negocio_id : rs[1][i][1], nombre : rs[1][i][2], seleccionado : (rs[1][i][3] == "true" || rs[1][i][3] == "1")?true:false});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segusuarioConfirmar(fields : {
        Correo ?: string,
        Clave ?: string
    }, call ?: { (resp: pSegusuarioConfirmar) }){
        this.jpo.get("segusuarioConfirmar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioConfirmar();
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

    segusuarioEditar(fields : {
        Usuario_id ?: number,
        Correo ?: string,
        Nombre ?: string,
        Apellido_paterno ?: string,
        Apellido_materno ?: string,
        Ruc ?: string,
        Empresa ?: string
    }, call ?: { (resp: pSegusuarioEditar) }){
        this.jpo.get("segusuarioEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioEditar();
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

    segusuarioEditarEmailPlantillas(fields : {
        Usuario_id ?: number,
        Plantillas_json ?: string
    }, call ?: { (resp: pSegusuarioEditarEmailPlantillas) }){
        this.jpo.get("segusuarioEditarEmailPlantillas",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioEditarEmailPlantillas();
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

    segusuarioFotoAdjuntar(fields : {
        Usuario_id ?: number,
        Archivo_Nombre ?: string,
        Archivo_Formato ?: string,
        Archivo_Peso ?: number,
        Archivo_Ubicacion ?: string
    }, files : any, loading : any, call ?: { (resp: pSegusuarioFotoAdjuntar) }){
        this.jpo.get("segusuarioFotoAdjuntar",{
            files : files,
            loading : loading,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioFotoAdjuntar();
                        if(rs){
                            out.Adjunto_id = rs[0];
                            out.estado = rs[1];
                            out.mensaje = rs[2];
                            out.Archivo_base64 = rs[3];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segusuarioFotoEliminar(fields : {
        Usuario_id ?: number,
        Adjunto_id ?: number
    }, call ?: { (resp: pSegusuarioFotoEliminar) }){
        this.jpo.get("segusuarioFotoEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioFotoEliminar();
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

    segusuarioObtener(fields : {
        Usuario_id ?: number
    }, call ?: { (resp: pSegusuarioObtener) }){
        this.jpo.get("segusuarioObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioObtener();
                        if(rs[0] && rs[0][0]){
                            out.userInfo = {email : rs[0][0][0], photoId : rs[0][0][1], RUC : rs[0][0][2], company : rs[0][0][3], photoBase64 : rs[0][0][4]};
                        }
                        if(rs[1]){
                            out.emailConfig = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.emailConfig.push({emailTemplateId : rs[1][i][0], state : rs[1][i][1], enable : rs[1][i][2], description : rs[1][i][3]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segusuarioPreconfirmar(fields : {
        Correo ?: string,
        Clave ?: string
    }, call ?: { (resp: pSegusuarioPreconfirmar) }){
        this.jpo.get("segusuarioPreconfirmar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioPreconfirmar();
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

    segusuarioRegistrar(fields : {
        Nombre ?: string,
        Apellido_paterno ?: string,
        Apellido_materno ?: string,
        Correo ?: string,
        Clave ?: string,
        Ruc ?: string,
        Empresa ?: string,
        Enlace ?: string,
        Pais_id ?: number,
        Origen ?: string
    }, call ?: { (resp: pSegusuarioRegistrar) }){
        this.jpo.get("segusuarioRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegusuarioRegistrar();
                        if(rs){
                            out.estado = rs[0];
                            out.mensaje = rs[1];
                            out.resp_correo = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}