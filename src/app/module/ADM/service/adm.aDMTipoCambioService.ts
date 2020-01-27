import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pGestipoCambioEliminar {resp_estado : number; resp_mensaje : string};
export interface gestipoCambioListar_response {total ?: number};
export interface gestipoCambioListar_tipo_cambios {tipo_cambio_id ?: number, moneda_primera_id ?: number, moneda_segunda_id ?: number, cambio_venta ?: string, fecha ?: Date, fecha_registro ?: Date, usuario_registro_id ?: number, usuario_registro_nombres ?: string, usuario_registro_apellidos ?: string, fecha_modificacion ?: Date, unidad_negocio_id ?: number, unidad_negocio_nombre ?: string, estado ?: number, mona_nombre ?: string, mona_abreviatura ?: string, monb_nombre ?: string, monb_abreviatura ?: string};
export class pGestipoCambioListar {response : gestipoCambioListar_response; tipo_cambios : gestipoCambioListar_tipo_cambios[]};
export class pGestipoCambioObtener {tipo_cambio_id : number; moneda_primera_id : number; moneda_segunda_id : number; cambio_venta : string; fecha : Date; fecha_registro : Date; fecha_modificacion : Date; unidad_negocio_id : number; mona_nombre : string; mona_abreviatura : string; monb_nombre : string; monb_abreviatura : string};
export class pGestipoCambioRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pGestipoCambioEditar {resp_estado : number; resp_mensaje : string};

export class ADMTipoCambioServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMTipoCambioServiceImp");
    }

    gestipoCambioEliminar(fields : {
        tipo_cambio_id ?: number
    }, call ?: { (resp: pGestipoCambioEliminar) }){
        this.jpo.get("gestipoCambioEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGestipoCambioEliminar();
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

    gestipoCambioListar(fields : {
        tipo_cambio_id ?: number,
        moneda_primera_id ?: number,
        moneda_segunda_id ?: number,
        cambio_venta_min ?: number,
        cambio_venta_max ?: number,
        fecha_min ?: string,
        fecha_max ?: string,
        fecha_registro_min ?: string,
        fecha_registro_max ?: string,
        fecha_modificacion_min ?: string,
        fecha_modificacion_max ?: string,
        unidad_negocio_id ?: number,
        mona_nombre ?: string,
        mona_abreviatura ?: string,
        monb_nombre ?: string,
        monb_abreviatura ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pGestipoCambioListar) }){
        this.jpo.get("gestipoCambioListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGestipoCambioListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.tipo_cambios = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.tipo_cambios.push({tipo_cambio_id : rs[1][i][0], moneda_primera_id : rs[1][i][1], moneda_segunda_id : rs[1][i][2], cambio_venta : rs[1][i][3], fecha : (rs[1][i][4])?new Date(rs[1][i][4]):null, fecha_registro : (rs[1][i][5])?new Date(rs[1][i][5]):null, usuario_registro_id : rs[1][i][6], usuario_registro_nombres : rs[1][i][7], usuario_registro_apellidos : rs[1][i][8], fecha_modificacion : (rs[1][i][9])?new Date(rs[1][i][9]):null, unidad_negocio_id : rs[1][i][10], unidad_negocio_nombre : rs[1][i][11], estado : rs[1][i][12], mona_nombre : rs[1][i][13], mona_abreviatura : rs[1][i][14], monb_nombre : rs[1][i][15], monb_abreviatura : rs[1][i][16]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gestipoCambioObtener(fields : {
        tipo_cambio_id ?: number
    }, call ?: { (resp: pGestipoCambioObtener) }){
        this.jpo.get("gestipoCambioObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {tipo_cambio_id : rs[0][0], moneda_primera_id : rs[0][1], moneda_segunda_id : rs[0][2], cambio_venta : rs[0][3], fecha : (rs[0][4])?new Date(rs[0][4]):null, fecha_registro : (rs[0][5])?new Date(rs[0][5]):null, fecha_modificacion : (rs[0][6])?new Date(rs[0][6]):null, unidad_negocio_id : rs[0][7], mona_nombre : rs[0][8], mona_abreviatura : rs[0][9], monb_nombre : rs[0][10], monb_abreviatura : rs[0][11]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gestipoCambioRegistrar(fields : {
        moneda_primera_id ?: number,
        moneda_segunda_id ?: number,
        cambio_venta ?: number,
        fecha ?: string,
        usuario_registro_id ?: number,
        unidad_negocio_id ?: number
    }, call ?: { (resp: pGestipoCambioRegistrar) }){
        this.jpo.get("gestipoCambioRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGestipoCambioRegistrar();
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

    gestipoCambioEditar(fields : {
        tipo_cambio_id ?: number,
        moneda_primera_id ?: number,
        moneda_segunda_id ?: number,
        cambio_venta ?: number,
        fecha ?: string,
        usuario_modificacion_id ?: number,
        unidad_negocio_id ?: number
    }, call ?: { (resp: pGestipoCambioEditar) }){
        this.jpo.get("gestipoCambioEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGestipoCambioEditar();
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

}