import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export interface gesempresaDireccionListar_response {total ?: number};
export interface gesempresaDireccionListar_empresa_direccions {empresa_direccion_id ?: number, empresa_id ?: number, ubigeo_id ?: number, direccion ?: string, telefono ?: string, correo ?: string, longitud ?: string, latitud ?: string, nombre ?: string, tipo_direccion_id ?: number};
export class pGesempresaDireccionListar {response : gesempresaDireccionListar_response; empresa_direccions : gesempresaDireccionListar_empresa_direccions[]};
export class pGesempresaEditar {resp_estado : number; resp_mensaje : string};
export class pGesempresaEliminar {resp_estado : number; resp_mensaje : string};
export interface gesempresaListar_response {total ?: number};
export interface gesempresaListar_empresas {empresa_id ?: number, unidad_negocio_id ?: number, unidad_negocio_nombre ?: string, tipo_documento ?: string, documento ?: string, razon_social ?: string, razon_comercial ?: string, direccion ?: string, longitud ?: string, latitud ?: string, estado ?: boolean, fecha_registro ?: Date, fecha_modificacion ?: Date, suspendido ?: boolean, telefono ?: string, correo ?: string, abreviatura ?: string, roles ?: string};
export class pGesempresaListar {response : gesempresaListar_response; empresas : gesempresaListar_empresas[]};
export interface gesempresaListarRol_response {total ?: number};
export interface gesempresaListarRol_empresas {empresa_id ?: number, documento ?: string, razon_social ?: string, razon_comercial ?: string, fecha_registro ?: Date, unidad_negocio_id ?: number, tipo_documento ?: number, abreviatura ?: string, unic_nombre ?: number, catd_descripcion ?: string};
export class pGesempresaListarRol {response : gesempresaListarRol_response; empresas : gesempresaListarRol_empresas[]};
export interface gesempresaObtener_empresa {empresa_id ?: number, unidad_negocio_id ?: number, tipo_documento ?: number, documento ?: string, razon_social ?: string, razon_comercial ?: string, telefono ?: string, correo ?: string, abreviatura ?: string, estado ?: string, suspendido ?: string};
export interface gesempresaObtener_direcciones {empresa_direccion_id ?: number, ubigeo_id ?: number, direccion ?: string, telefono ?: string, correo ?: string, longitud ?: string, latitud ?: string, tipo_direccion_id ?: number, tipo_direccion ?: string, nombre_lugar ?: string, action ?: string, used ?: boolean};
export interface gesempresaObtener_contactos {nombres ?: string, apellido_paterno ?: string, apellido_materno ?: string, telefono ?: string, correo ?: string, tipo_contacto_id ?: number, tipo_contacto ?: string};
export interface gesempresaObtener_roles {empresa_rol ?: number, tipo_rol_id ?: number};
export interface gesempresaObtener_configuracion {tipo_configuracion_id ?: number, valor ?: string};
export class pGesempresaObtener {empresa : gesempresaObtener_empresa; direcciones : gesempresaObtener_direcciones[]; contactos : gesempresaObtener_contactos[]; roles : gesempresaObtener_roles[]; configuracion : gesempresaObtener_configuracion[]};
export class pGesempresaRegistrar {resp_estado : number; resp_mensaje : string};
export class pGesempresaDireccionPrincipalListar {empresa_direccion_id : number; nombre : string};

export class ADMEmpresaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMEmpresaServiceImp");
    }

    gesempresaDireccionListar(fields : {
        empresa_direccion_id ?: number,
        empresa_id ?: number,
        ubigeo_id ?: number,
        direccion ?: string,
        telefono ?: string,
        correo ?: string,
        longitud ?: string,
        latitud ?: string,
        nombre ?: string,
        tipo_direccion_id ?: number,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pGesempresaDireccionListar) }){
        this.jpo.get("gesempresaDireccionListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesempresaDireccionListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.empresa_direccions = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.empresa_direccions.push({empresa_direccion_id : rs[1][i][0], empresa_id : rs[1][i][1], ubigeo_id : rs[1][i][2], direccion : rs[1][i][3], telefono : rs[1][i][4], correo : rs[1][i][5], longitud : rs[1][i][6], latitud : rs[1][i][7], nombre : rs[1][i][8], tipo_direccion_id : rs[1][i][9]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesempresaEditar(fields : {
        empresa_id ?: number,
        documento ?: string,
        razon_social ?: string,
        razon_comercial ?: string,
        direccion ?: string,
        longitud ?: string,
        latitud ?: string,
        usuario_modificacion_id ?: number,
        unidad_negocio_id ?: number,
        tipo_documento ?: number,
        telefono ?: string,
        correo ?: string,
        abreviatura ?: string,
        estado ?: number,
        suspendido ?: number,
        direcciones ?: string,
        contactos ?: string,
        roles ?: string,
        configuraciones ?: string
    }, call ?: { (resp: pGesempresaEditar) }){
        this.jpo.get("gesempresaEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesempresaEditar();
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

    gesempresaEliminar(fields : {
        empresa_id ?: number
    }, call ?: { (resp: pGesempresaEliminar) }){
        this.jpo.get("gesempresaEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesempresaEliminar();
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

    gesempresaListar(fields : {
        empresa_id ?: number,
        documento ?: string,
        razon_social ?: string,
        razon_comercial ?: string,
        direccion ?: string,
        longitud ?: string,
        latitud ?: string,
        estado ?: string,
        fecha_registro_min ?: string,
        fecha_registro_max ?: string,
        fecha_modificacion_min ?: string,
        fecha_modificacion_max ?: string,
        unidad_negocio_id ?: number,
        tipo_documento ?: number,
        suspendido ?: string,
        telefono ?: string,
        correo ?: string,
        abreviatura ?: string,
        roles ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pGesempresaListar) }){
        this.jpo.get("gesempresaListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesempresaListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.empresas = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.empresas.push({empresa_id : rs[1][i][0], unidad_negocio_id : rs[1][i][1], unidad_negocio_nombre : rs[1][i][2], tipo_documento : rs[1][i][3], documento : rs[1][i][4], razon_social : rs[1][i][5], razon_comercial : rs[1][i][6], direccion : rs[1][i][7], longitud : rs[1][i][8], latitud : rs[1][i][9], estado : (rs[1][i][10] == "true" || rs[1][i][10] == "1")?true:false, fecha_registro : (rs[1][i][11])?new Date(rs[1][i][11]):null, fecha_modificacion : (rs[1][i][12])?new Date(rs[1][i][12]):null, suspendido : (rs[1][i][13] == "true" || rs[1][i][13] == "1")?true:false, telefono : rs[1][i][14], correo : rs[1][i][15], abreviatura : rs[1][i][16], roles : rs[1][i][17]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesempresaListarRol(fields : {
        empresa_id ?: number,
        documento ?: string,
        razon_social ?: string,
        razon_comercial ?: string,
        fecha_registro_min ?: string,
        fecha_registro_max ?: string,
        unidad_negocio_id ?: number,
        tipo_documento ?: number,
        abreviatura ?: string,
        unic_nombre ?: string,
        catd_descripcion ?: string,
        tipo_rol_id ?: number,
        tipo_rol_ids ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pGesempresaListarRol) }){
        this.jpo.get("gesempresaListarRol",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesempresaListarRol();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.empresas = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.empresas.push({empresa_id : rs[1][i][0], documento : rs[1][i][1], razon_social : rs[1][i][2], razon_comercial : rs[1][i][3], fecha_registro : (rs[1][i][4])?new Date(rs[1][i][4]):null, unidad_negocio_id : rs[1][i][5], tipo_documento : rs[1][i][6], abreviatura : rs[1][i][7], unic_nombre : rs[1][i][8], catd_descripcion : rs[1][i][9]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesempresaObtener(fields : {
        empresa_id ?: number
    }, call ?: { (resp: pGesempresaObtener) }){
        this.jpo.get("gesempresaObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesempresaObtener();
                        if(rs[0] && rs[0][0]){
                            out.empresa = {empresa_id : rs[0][0][0], unidad_negocio_id : rs[0][0][1], tipo_documento : rs[0][0][2], documento : rs[0][0][3], razon_social : rs[0][0][4], razon_comercial : rs[0][0][5], telefono : rs[0][0][6], correo : rs[0][0][7], abreviatura : rs[0][0][8], estado : rs[0][0][9], suspendido : rs[0][0][10]};
                        }
                        if(rs[1]){
                            out.direcciones = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.direcciones.push({empresa_direccion_id : rs[1][i][0], ubigeo_id : rs[1][i][1], direccion : rs[1][i][2], telefono : rs[1][i][3], correo : rs[1][i][4], longitud : rs[1][i][5], latitud : rs[1][i][6], tipo_direccion_id : rs[1][i][7], tipo_direccion : rs[1][i][8], nombre_lugar : rs[1][i][9], action : rs[1][i][10], used : (rs[1][i][11] == "true" || rs[1][i][11] == "1")?true:false});
                            }
                        }
                        if(rs[2]){
                            out.contactos = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.contactos.push({nombres : rs[2][i][0], apellido_paterno : rs[2][i][1], apellido_materno : rs[2][i][2], telefono : rs[2][i][3], correo : rs[2][i][4], tipo_contacto_id : rs[2][i][5], tipo_contacto : rs[2][i][6]});
                            }
                        }
                        if(rs[3]){
                            out.roles = [];
                            for(var i = 0; i < rs[3].length; i++){
                                out.roles.push({empresa_rol : rs[3][i][0], tipo_rol_id : rs[3][i][1]});
                            }
                        }
                        if(rs[4]){
                            out.configuracion = [];
                            for(var i = 0; i < rs[4].length; i++){
                                out.configuracion.push({tipo_configuracion_id : rs[4][i][0], valor : rs[4][i][1]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesempresaRegistrar(fields : {
        documento ?: string,
        razon_social ?: string,
        razon_comercial ?: string,
        direccion ?: string,
        longitud ?: string,
        latitud ?: string,
        usuario_registro_id ?: number,
        usuario_modificacion_id ?: number,
        unidad_negocio_id ?: number,
        tipo_documento ?: number,
        telefono ?: string,
        correo ?: string,
        abreviatura ?: string,
        contactos ?: string,
        direcciones ?: string,
        roles ?: string,
        configuraciones ?: string
    }, call ?: { (resp: pGesempresaRegistrar) }){
        this.jpo.get("gesempresaRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesempresaRegistrar();
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

    gesempresaDireccionPrincipalListar(fields : {
        unidad_negocio_id ?: number
    }, call ?: { (resp: pGesempresaDireccionPrincipalListar[]) }){
        this.jpo.get("gesempresaDireccionPrincipalListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({empresa_direccion_id : rs[i][0], nombre : rs[i][1]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

}