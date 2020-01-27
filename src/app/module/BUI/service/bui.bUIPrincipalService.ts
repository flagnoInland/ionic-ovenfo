import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export interface seglogListar_lista {log_id ?: number, usuario_nombre ?: string, origen ?: string, linea ?: number, numero_error ?: number, mensaje ?: string, fecha_registro ?: Date};
export interface seglogListar_resultado {total ?: number};
export class pSeglogListar {lista : seglogListar_lista[]; resultado : seglogListar_resultado};

export class BUIPrincipalServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui","BUIPrincipalServiceImp");
    }

    seglogListar(fields : {
        usuario_nombre ?: string,
        origen ?: string,
        mensaje ?: string,
        Page ?: number,
        Size ?: number
    }, call ?: { (resp: pSeglogListar) }){
        this.jpo.get("seglogListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSeglogListar();
                        if(rs[0]){
                            out.lista = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.lista.push({log_id : rs[0][i][0], usuario_nombre : rs[0][i][1], origen : rs[0][i][2], linea : rs[0][i][3], numero_error : rs[0][i][4], mensaje : rs[0][i][5], fecha_registro : (rs[0][i][6])?new Date(rs[0][i][6]):null});
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

}