import { SistemaServiceJPO } from "src/app/service/tis.sistemaService";

export class SistemaServiceImpJPO extends SistemaServiceJPO {

    connectedUsersList(call ?: { (resp: any) }){
        this.jpo.get("connectedUsersList",{
            response : (rs) => {
                call(rs);
            }
        });
    }

    connectedUsersMassValidation(call ?: { (resp: any) }){
        this.jpo.get("connectedUsersMassValidation",{
            response : (rs) => {
                call(rs);
            }
        });
    }

}