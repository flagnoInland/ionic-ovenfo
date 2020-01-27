import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pGesubigeoEditar {resp_estado : number; resp_mensaje : string};
export class pGesubigeoEliminar {resp_estado : number; resp_mensaje : string};
export interface gesubigeoListarAll_resultado {total_registros ?: number};
export interface gesubigeoListarAll_ubigeos {ubigeo_id ?: number, ubigeo_padre_id ?: number, ubigeo_padre_nombre ?: string, unidad_negocio_id ?: number, unidad_negocio_nombre ?: string, codigo ?: string, nombre ?: string, estado ?: string, fecha_registro ?: Date, fecha_modificacion ?: Date, latitud ?: string, longitud ?: string, usuario_registro_id ?: number, usuario_registro_nombres ?: string, usuario_registro_apellidos ?: string};
export class pGesubigeoListarAll {resultado : gesubigeoListarAll_resultado; ubigeos : gesubigeoListarAll_ubigeos[]};
export class pGesubigeoObtener {ubigeo_id : number; ubigeo_padre_id : number; unidad_negocio_id : number; codigo : string; nombre : string; estado : string; fecha_registro : Date; fecha_modificacion : Date; latitud : string; longitud : string};
export class pGesubigeoRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pGesubigeoListar {ubigeo_id : number; nombre : string};
export class pGesubigeoObtenerEstructura {padre1_id : number; padre2_id : number; nivel : number};
export class pGesubigeoDistritoListar {ubigeo_id : number; nombre : string};

export class ADMUbigeoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMUbigeoServiceImp");
    }

    gesubigeoEditar(fields : {
        ubigeo_id ?: number,
        ubigeo_padre_id ?: number,
        unidad_negocio_id ?: number,
        codigo ?: string,
        nombre ?: string,
        estado ?: string,
        latitud ?: string,
        longitud ?: string,
        usuario_modificacion_id ?: number
    }, call ?: { (resp: pGesubigeoEditar) }){
        this.jpo.get("gesubigeoEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesubigeoEditar();
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

    gesubigeoEliminar(fields : {
        ubigeo_id ?: number
    }, call ?: { (resp: pGesubigeoEliminar) }){
        this.jpo.get("gesubigeoEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesubigeoEliminar();
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

    gesubigeoListarAll(fields : {
        ubigeo_id ?: number,
        ubigeo_padre_id ?: number,
        unidad_negocio_id ?: number,
        codigo ?: string,
        nombre ?: string,
        estado ?: string,
        fecha_registro_min ?: string,
        fecha_registro_max ?: string,
        fecha_modificacion_min ?: string,
        fecha_modificacion_max ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pGesubigeoListarAll) }){
        this.jpo.get("gesubigeoListarAll",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesubigeoListarAll();
                        if(rs[0] && rs[0][0]){
                            out.resultado = {total_registros : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.ubigeos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.ubigeos.push({ubigeo_id : rs[1][i][0], ubigeo_padre_id : rs[1][i][1], ubigeo_padre_nombre : rs[1][i][2], unidad_negocio_id : rs[1][i][3], unidad_negocio_nombre : rs[1][i][4], codigo : rs[1][i][5], nombre : rs[1][i][6], estado : rs[1][i][7], fecha_registro : (rs[1][i][8])?new Date(rs[1][i][8]):null, fecha_modificacion : (rs[1][i][9])?new Date(rs[1][i][9]):null, latitud : rs[1][i][10], longitud : rs[1][i][11], usuario_registro_id : rs[1][i][12], usuario_registro_nombres : rs[1][i][13], usuario_registro_apellidos : rs[1][i][14]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesubigeoObtener(fields : {
        ubigeo_id ?: number
    }, call ?: { (resp: pGesubigeoObtener) }){
        this.jpo.get("gesubigeoObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {ubigeo_id : rs[0][0], ubigeo_padre_id : rs[0][1], unidad_negocio_id : rs[0][2], codigo : rs[0][3], nombre : rs[0][4], estado : rs[0][5], fecha_registro : (rs[0][6])?new Date(rs[0][6]):null, fecha_modificacion : (rs[0][7])?new Date(rs[0][7]):null, latitud : rs[0][8], longitud : rs[0][9]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesubigeoRegistrar(fields : {
        ubigeo_padre_id ?: number,
        unidad_negocio_id ?: number,
        codigo ?: string,
        nombre ?: string,
        estado ?: string,
        latitud ?: string,
        longitud ?: string,
        usuario_registro_id ?: number
    }, call ?: { (resp: pGesubigeoRegistrar) }){
        this.jpo.get("gesubigeoRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesubigeoRegistrar();
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

    gesubigeoListar(fields : {
        unidad_negocio_id ?: number,
        ubigeo_padre_id ?: number
    }, call ?: { (resp: pGesubigeoListar[]) }){
        this.jpo.get("gesubigeoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({ubigeo_id : rs[i][0], nombre : rs[i][1]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

    gesubigeoObtenerEstructura(fields : {
        ubigeo_id ?: number
    }, call ?: { (resp: pGesubigeoObtenerEstructura) }){
        this.jpo.get("gesubigeoObtenerEstructura",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesubigeoObtenerEstructura();
                        if(rs){
                            out.padre1_id = rs[0];
                            out.padre2_id = rs[1];
                            out.nivel = rs[2];
                        }
                    call(out);
                }
            }
        });
    }

    gesubigeoDistritoListar(fields : {
        unidad_negocio_id ?: number
    }, call ?: { (resp: pGesubigeoDistritoListar[]) }){
        this.jpo.get("gesubigeoDistritoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({ubigeo_id : rs[i][0], nombre : rs[i][1]});
                            }
                        }
                    call(out);
                }
            }
        });
    }

}