import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";


export class BUIEsquemaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui.gn","BUIEsquemaServiceImp");
    }

}