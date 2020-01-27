import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pBuiplantillaMenuEliminar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export interface buiplantillaMenuListar_plantillas {plantilla_menu_id : number, proyecto_id : number, menu_id : number, folder : string, diseno : string, fuente_ts : string, fuente_html : string, fuente_css : string};
export class pBuiplantillaMenuListar {plantillas : buiplantillaMenuListar_plantillas[]};
export class pBuiplantillaMenuRegistrar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export class pBuiplantillaMenuEditar {resp_new_id : number; resp_estado : number; resp_mensaje : string};
export interface buiplantillaMenuObtener_plantilla_menu {plantilla_menu_id : number, proyecto_id : number, menu_id : number, folder : string, diseno : string, fuente_ts : string, fuente_html : string, fuente_css : string};
export class pBuiplantillaMenuObtener {plantilla_menu : buiplantillaMenuObtener_plantilla_menu};

export class BUIGNPlantillaMenuServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleBUI","BUI","module.bui.gn","BUIGNPlantillaMenuServiceImp");
    }

    buiplantillaMenuEliminar(fields : {
        plantilla_menu_id ?: number
    }, files : any, loading : any, call ?: { (resp: pBuiplantillaMenuEliminar) }){
        this.jpo.get("buiplantillaMenuEliminar",{
            files : files,
            loading : loading,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiplantillaMenuEliminar();
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

    buiplantillaMenuListar(fields : {
        proyecto_id ?: number
    }, call ?: { (resp: pBuiplantillaMenuListar) }){
        this.jpo.get("buiplantillaMenuListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiplantillaMenuListar();
                        if(rs){
                            if(rs[0]){
                                out.plantillas = [];
                                for(var i = 0; i < rs[0].length; i++){
                                    out.plantillas.push({plantilla_menu_id : rs[0][i][0], proyecto_id : rs[0][i][1], menu_id : rs[0][i][2], folder : rs[0][i][3], diseno : rs[0][i][4], fuente_ts : rs[0][i][5], fuente_html : rs[0][i][6], fuente_css : rs[0][i][7]});
                                }
                            }
                        }
                    call(out);
                }
            }
        });
    }

    buiplantillaMenuRegistrar(fields : {
        proyecto_id ?: number,
        menu_id ?: number,
        folder ?: string,
        diseno ?: string,
        fuente_ts ?: string,
        fuente_html ?: string,
        fuente_css ?: string,
        usuario_id ?: number
    }, files : any, loading : any, call ?: { (resp: pBuiplantillaMenuRegistrar) }){
        this.jpo.get("buiplantillaMenuRegistrar",{
            files : files,
            loading : loading,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiplantillaMenuRegistrar();
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

    buiplantillaMenuEditar(fields : {
        plantilla_menu_id ?: number,
        diseno ?: string,
        fuente_ts ?: string,
        fuente_html ?: string,
        fuente_css ?: string,
        usuario_id ?: number
    }, files : any, loading : any, call ?: { (resp: pBuiplantillaMenuEditar) }){
        this.jpo.get("buiplantillaMenuEditar",{
            files : files,
            loading : loading,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiplantillaMenuEditar();
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

    buiplantillaMenuObtener(fields : {
        proyecto_id ?: number,
        menu_id ?: number
    }, call ?: { (resp: pBuiplantillaMenuObtener) }){
        this.jpo.get("buiplantillaMenuObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pBuiplantillaMenuObtener();
                        if(rs){
                           if(rs[0] && rs[0][0]){
                               out.plantilla_menu = {plantilla_menu_id : rs[0][0][0], proyecto_id : rs[0][0][1], menu_id : rs[0][0][2], folder : rs[0][0][3], diseno : rs[0][0][4], fuente_ts : rs[0][0][5], fuente_html : rs[0][0][6], fuente_css : rs[0][0][7]};
                           }
                        }
                    call(out);
                }
            }
        });
    }

}