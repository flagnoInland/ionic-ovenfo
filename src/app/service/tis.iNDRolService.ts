import { Jpo } from "../ohCore/services/oh.core";
import { OHService } from "../tis.ohService";

export class pSegrolListarMenuBase {rol_id : number; nombre : string};

export class INDRolServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("IND","comun","INDRolServiceImp");
    }

    segrolListarMenuBase(fields : {
        menu_base_id ?: number,
        menu_base_plantilla ?: string
    }, call ?: { (resp: pSegrolListarMenuBase[]) }){
        this.jpo.get("segrolListarMenuBase",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({rol_id : rs[i][0], nombre : rs[i][1]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}