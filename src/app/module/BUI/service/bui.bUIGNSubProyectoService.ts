import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pBuisubProyectoRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pBuisubProyectoEliminar {resp_new_id : number; resp_estado : number; resp_mensaje : string};

export class BUIGNSubProyectoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui.gn","BUIGNSubProyectoServiceImp");
    }

    buisubProyectoRegistrar(fields : {
        proyecto_id ?: number,
        nombre ?: string,
        url_fuente ?: string,
        tipo ?: number,
        abreviatura ?: string,
        menu_id ?: number,
        es_submodulo ?: number,
        usuario_id ?: number
    }, files : any, loading : any, call ?: { (resp: pBuisubProyectoRegistrar) }){
        this.jpo.get("buisubProyectoRegistrar",{
            files : files,
            loading : loading,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuisubProyectoRegistrar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                        }
                    call(out);
                }
            }
        });
    }

    buisubProyectoEliminar(fields : {
        sub_proyecto_id ?: number
    }, files : any, loading : any, call ?: { (resp: pBuisubProyectoEliminar) }){
        this.jpo.get("buisubProyectoEliminar",{
            files : files,
            loading : loading,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuisubProyectoEliminar();
                        if(rs){
                            out.resp_new_id = rs[0];
                            out.resp_estado = rs[1];
                            out.resp_mensaje = rs[2];
                        }
                    call(out);
                }
            }
        });
    }

}