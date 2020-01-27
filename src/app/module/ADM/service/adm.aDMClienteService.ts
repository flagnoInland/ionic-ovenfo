import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pDbowecLisRolcliente {codigo : string; razon_social : string};

export class ADMClienteServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMClienteServiceImp");
    }

    dbowecLisRolcliente(fields : {
        Empresa ?: string
    }, call ?: { (resp: pDbowecLisRolcliente[]) }){
        this.jpo.get("dbowecLisRolcliente",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({codigo : rs[i][0], razon_social : rs[i][1]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}