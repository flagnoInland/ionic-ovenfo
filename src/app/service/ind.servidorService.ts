import { Jpo } from "../ohCore/services/oh.core";
import { OHService } from "../tis.ohService";

export class pDbolisFechaservidor {currentDate : Date};

export class ServidorServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("Inlandnet","COM","comun","ServidorServiceImp");
    }

    dbolisFechaservidor(call ?: { (resp: pDbolisFechaservidor) }){
        this.jpo.get("dbolisFechaservidor",{
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {currentDate : (rs[0][0])?new Date(rs[0][0]):null};
                        }
                    call(out);
                }
            }
        });
    }

}