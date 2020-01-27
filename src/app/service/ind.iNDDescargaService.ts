import { Jpo } from "../ohCore/services/oh.core";
import { OHService } from "../tis.ohService";

export class pGesdescargaEditar {resp_nombre : string; resp_ubicacion : string; resp_estado : number; resp_mensaje : string};
export class pGesdescargaRegistrar {resp_estado : number; resp_mensaje : string};

export class INDDescargaServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("Inlandnet","TIS","comun","INDDescargaServiceImp");
    }

    gesdescargaEditar(fields : {
        token_id ?: string,
        usuario_id ?: number
    }, call ?: { (resp: pGesdescargaEditar) }){
        this.jpo.get("gesdescargaEditar",{
            fields : fields,
            windowopen : true,
            response : (rs) => {
                if(call){
                    var out = new pGesdescargaEditar();
                        if(rs){
                            out.resp_nombre = rs[0];
                            out.resp_ubicacion = rs[1];
                            out.resp_estado = rs[2];
                            out.resp_mensaje = rs[3];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesdescargaRegistrar(fields : {
        adjunto_id ?: number,
        token_id ?: string,
        tipo ?: string,
        usuario_id ?: number
    }, call ?: { (resp: pGesdescargaRegistrar) }){
        this.jpo.get("gesdescargaRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesdescargaRegistrar();
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

}