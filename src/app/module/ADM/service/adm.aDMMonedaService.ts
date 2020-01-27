import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pGesmonedaEditar {resp_estado : number; resp_mensaje : string};
export class pGesmonedaEliminar {resp_estado : number; resp_mensaje : string};
export interface gesmonedaListar_response {total ?: number};
export interface gesmonedaListar_monedas {moneda_id ?: number, nombre ?: string, abreviatura ?: string, simbolo ?: string, estado ?: number, fecha_registro ?: Date, fecha_modificacion ?: Date, separador_miles ?: string, separador_decimales ?: string, precision ?: string, ICU ?: string, usuario_registro_id ?: number, usuario_registro_nombres ?: string, usuario_registro_apellidos ?: string};
export class pGesmonedaListar {response : gesmonedaListar_response; monedas : gesmonedaListar_monedas[]};
export class pGesmonedaObtener {moneda_id : number; nombre : string; abreviatura : string; simbolo : string; estado : number; fecha_registro : Date; fecha_modificacion : Date; separador_miles : string; separador_decimales : string; precision : string; ICU : string};
export class pGesmonedaRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};

export class ADMMonedaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMMonedaServiceImp");
    }

    gesmonedaEditar(fields : {
        moneda_id ?: number,
        nombre ?: string,
        abreviatura ?: string,
        simbolo ?: string,
        estado ?: number,
        usuario_modificacion_id ?: number,
        separador_miles ?: string,
        separador_decimales ?: string,
        precision ?: string,
        ICU ?: string
    }, call ?: { (resp: pGesmonedaEditar) }){
        this.jpo.get("gesmonedaEditar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesmonedaEditar();
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

    gesmonedaEliminar(fields : {
        moneda_id ?: number
    }, call ?: { (resp: pGesmonedaEliminar) }){
        this.jpo.get("gesmonedaEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesmonedaEliminar();
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

    gesmonedaListar(fields : {
        moneda_id ?: number,
        nombre ?: string,
        abreviatura ?: string,
        simbolo ?: string,
        estado ?: number,
        fecha_registro_min ?: string,
        fecha_registro_max ?: string,
        fecha_modificacion_min ?: string,
        fecha_modificacion_max ?: string,
        separador_miles ?: string,
        separador_decimales ?: string,
        precision ?: string,
        ICU ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pGesmonedaListar) }){
        this.jpo.get("gesmonedaListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesmonedaListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.monedas = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.monedas.push({moneda_id : rs[1][i][0], nombre : rs[1][i][1], abreviatura : rs[1][i][2], simbolo : rs[1][i][3], estado : rs[1][i][4], fecha_registro : (rs[1][i][5])?new Date(rs[1][i][5]):null, fecha_modificacion : (rs[1][i][6])?new Date(rs[1][i][6]):null, separador_miles : rs[1][i][7], separador_decimales : rs[1][i][8], precision : rs[1][i][9], ICU : rs[1][i][10], usuario_registro_id : rs[1][i][11], usuario_registro_nombres : rs[1][i][12], usuario_registro_apellidos : rs[1][i][13]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesmonedaObtener(fields : {
        moneda_id ?: number
    }, call ?: { (resp: pGesmonedaObtener) }){
        this.jpo.get("gesmonedaObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {moneda_id : rs[0][0], nombre : rs[0][1], abreviatura : rs[0][2], simbolo : rs[0][3], estado : rs[0][4], fecha_registro : (rs[0][5])?new Date(rs[0][5]):null, fecha_modificacion : (rs[0][6])?new Date(rs[0][6]):null, separador_miles : rs[0][7], separador_decimales : rs[0][8], precision : rs[0][9], ICU : rs[0][10]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesmonedaRegistrar(fields : {
        nombre ?: string,
        abreviatura ?: string,
        simbolo ?: string,
        estado ?: number,
        usuario_registro_id ?: number,
        separador_miles ?: string,
        separador_decimales ?: string,
        precision ?: string,
        ICU ?: string
    }, call ?: { (resp: pGesmonedaRegistrar) }){
        this.jpo.get("gesmonedaRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesmonedaRegistrar();
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