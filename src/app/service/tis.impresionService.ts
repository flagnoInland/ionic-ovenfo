import { Jpo } from "../ohCore/services/oh.core";
import { OHService } from "../tis.ohService";

export class pDbowedLisReimprimir {mensaje : string; impresora : string};

export class ImpresionServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("IMP","comun","ImpresionServiceImp");
    }

    dbowedLisReimprimir(fields : {
        impresion_id ?: number,
        Impresora_id ?: number
    }, call ?: { (resp: pDbowedLisReimprimir) }){
        this.jpo.get("dbowedLisReimprimir",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDbowedLisReimprimir();
                        if(rs){
                            out.mensaje = rs[0];
                            out.impresora = rs[1];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    dbowedUpdImpresionesConfirmar(fields : {
        impresion_id ?: number
    }, call ?: any){
        this.jpo.get("dbowedUpdImpresionesConfirmar",{
            fields : fields,
            response : (rs) => {
                if(call){
                   call(rs);
                }
            },
            showLoader : true
        });
    }

}