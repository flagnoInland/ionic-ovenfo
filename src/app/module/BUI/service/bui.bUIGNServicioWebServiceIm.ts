import { BUIGNServicioWebServiceJPO } from "./bui.bUIGNServicioWebService";

export interface listarProcedimientos_entradas {campo ?: string, tipo_dato ?: string, tipo_campo ?: string};
export interface listarProcedimientos_empresas {sp_id ?: string, sp_nombre ?: string, sp_esquema ?: string, entradas ?: listarProcedimientos_entradas[]};
export interface listarProcedimientos_resultado {total ?: number};
export class listarProcedimientosListar {procedimientos : listarProcedimientos_empresas[]; resultado : listarProcedimientos_resultado};


export class BUIGNServicioWebServiceJPOImp extends BUIGNServicioWebServiceJPO {

    listarProcedimientos(fields : {
        base_datos_id ?: number,
        esquema_id ?: number,
        sp_nombre ?: string,
        pagina ?: number,
        cantidad ?: number
    }, call ?: { (resp: listarProcedimientosListar) }){
        this.jpo.get("listarProcedimientos",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new listarProcedimientosListar();
                        if(rs[0]){
                            out.procedimientos = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.procedimientos.push({sp_id : rs[0][i][0], sp_nombre : rs[0][i][1], sp_esquema : rs[0][i][2], entradas : JSON.parse(rs[0][i][3])});
                            }
                        }
                        if(rs[1]){
                            out.resultado = {total : rs[1]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}