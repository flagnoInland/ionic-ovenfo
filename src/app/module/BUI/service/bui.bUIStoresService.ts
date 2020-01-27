import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pSegtablaListar {nombre : string};
export class pSegcolumnaListar {esquema : string; tabla : string; columna : string; tipo : string; tamano : number; posicion : number; nulable : string; ref_esquema : string; ref_tabla : string; ref_columna : string};
export class pSegesquemaListar {nombre : string};

export class BUIStoresServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui","BUIStoresServiceImp");
    }

    segtablaListar(fields : {
        schema ?: string
    }, call ?: { (resp: pSegtablaListar[]) }){
        this.jpo.get("segtablaListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({nombre : rs[i][0]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segcolumnaListar(fields : {
        schema ?: string,
        table ?: string
    }, call ?: { (resp: pSegcolumnaListar[]) }){
        this.jpo.get("segcolumnaListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({esquema : rs[i][0], tabla : rs[i][1], columna : rs[i][2], tipo : rs[i][3], tamano : rs[i][4], posicion : rs[i][5], nulable : rs[i][6], ref_esquema : rs[i][7], ref_tabla : rs[i][8], ref_columna : rs[i][9]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    segesquemaListar(call ?: { (resp: pSegesquemaListar[]) }){
        this.jpo.get("segesquemaListar",{
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({nombre : rs[i][0]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}