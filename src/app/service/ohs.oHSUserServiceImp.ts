import { OHSUserServiceJPO } from "./ohs.oHSUserService";

export class OHSUserServiceJPOImp extends OHSUserServiceJPO {

    segloginDesconectar(){
        this.jpo.get("segloginDesconectar", {
            noShowError : true
        });
    }

}