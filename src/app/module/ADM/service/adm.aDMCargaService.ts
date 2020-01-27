import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pSegcargaMasivaMaster {result : any};

export class ADMCargaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMCargaServiceImp");
    }

    segcargaMasivaMaster(fields : {
        stored_valid ?: string,
        stored_bulk ?: string,
        json_data ?: string,
        unidad_negocio ?: number,
        usuario_carga_id ?: number
    }, call ?: { (resp: pSegcargaMasivaMaster) }){
        this.jpo.get("segcargaMasivaMaster",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {result : JSON.parse(rs[0][0])};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}