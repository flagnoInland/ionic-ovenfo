import { BUIGNPrincipalServiceJPO } from "./bui.bUIGNPrincipalService";

export interface obtenerArchivos_archivos {nombre : number, archivo : string};

export class BUIGNPrincipalServiceJPOImp extends BUIGNPrincipalServiceJPO {

    obtenerArchivos(fields : {
        archivos : string,
    }, call ?: { (resp: obtenerArchivos_archivos[]) }){
        this.jpo.get("obtenerArchivos",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        for(var i = 0; i < rs.length; i++){
                            out.push(rs[i]);
                        }
                    call(out);
                }
            }
        });
    }

}