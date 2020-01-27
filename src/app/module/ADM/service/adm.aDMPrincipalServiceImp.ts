import { ADMPrincipalServiceJPO } from "./adm.aDMPrincipalService";

export class pGetBaseModuleFiles {contenido : string};
export class pGuardarPlantilla {estado : number; mensaje : string; template_menu_id : number};
export class pGuardarDiseno {estado : number; mensaje : string;};
export class pObtenerDiseno {diseno : string};
export class pRespuesta {estado : number; mensaje : string};

export class ADMPrincipalServiceImpJPO extends ADMPrincipalServiceJPO {

    seglogEmailListarSendGrid(fields : {
        query ?: string
    }, call ?: { (resp: any) }){
        this.jpo.get("seglogEmailListarSendGrid",{
            fields : fields,
            response : (rs) => {
                if(call){
                    call(rs);
                }
            },
            showLoader : true
        });
    }

    seglogEmailDetalle(fields : {
        msg_id ?: string
    }, call ?: { (resp: any) }){
        this.jpo.get("seglogEmailDetalle",{
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