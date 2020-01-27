import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pGesreferenciaListar {esquema : string; tabla : string; columna : string; value_id : number};

export class BUIReferenciaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui","BUIReferenciaServiceImp");
    }

    gesreferenciaListar(fields : {
        owner_in ?: string,
        tabla_in ?: string,
        value_in ?: string
    }, call ?: { (resp: pGesreferenciaListar[]) }){
        this.jpo.get("gesreferenciaListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({esquema : rs[i][0], tabla : rs[i][1], columna : rs[i][2], value_id : rs[i][3]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}