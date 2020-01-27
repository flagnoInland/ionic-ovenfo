import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pGesadjuntoEliminar {ubicacion : string; estado : number; mensaje : string};
export class pGesadjuntoCargar {attached_id : number; estado : number; mensaje : string};
export class pGesadjuntoDescarga {nombre : string; ubicacion : string; estado : number; mensaje : string; data : string};
export interface gesadjuntoListar_response {total ?: number};
export interface gesadjuntoListar_adjuntos {adjunto_id ?: number, nombre ?: string, formato ?: string, peso ?: number, ubicacion ?: string, estado ?: number, fecha_registro ?: Date, es_descargable ?: boolean, usuario_registro_id ?: number, ghost ?: number, usuario_registro_nombres ?: string, usuario_registro_apellidos ?: string};
export class pGesadjuntoListar {response : gesadjuntoListar_response; adjuntos : gesadjuntoListar_adjuntos[]};

export class ADMAdjuntoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMAdjuntoServiceImp");
    }

    gesadjuntoEliminar(fields : {
        adjunto_id ?: number,
        del_file ?: number
    }, call ?: { (resp: pGesadjuntoEliminar) }){
        this.jpo.get("gesadjuntoEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesadjuntoEliminar();
                        if(rs){
                            out.ubicacion = rs[0];
                            out.estado = rs[1];
                            out.mensaje = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesadjuntoCargar(fields : {
        Usuario_id ?: number,
        Archivo_Nombre ?: string,
        Archivo_Formato ?: string,
        Archivo_Peso ?: number,
        Archivo_Ubicacion ?: string
    }, files : any, loading : any, call ?: { (resp: pGesadjuntoCargar) }){
        this.jpo.get("gesadjuntoCargar",{
            files : files,
            loading : loading,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesadjuntoCargar();
                        if(rs){
                            out.attached_id = rs[0];
                            out.estado = rs[1];
                            out.mensaje = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesadjuntoDescarga(fields : {
        adjunto_id ?: number
    }, call ?: { (resp: pGesadjuntoDescarga) }){
        this.jpo.get("gesadjuntoDescarga",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesadjuntoDescarga();
                        if(rs){
                            out.nombre = rs[0];
                            out.ubicacion = rs[1];
                            out.estado = rs[2];
                            out.mensaje = rs[3];
                            out.data = rs[4];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesadjuntoListar(fields : {
        adjunto_id ?: string,
        nombre ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pGesadjuntoListar) }){
        this.jpo.get("gesadjuntoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesadjuntoListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.adjuntos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.adjuntos.push({adjunto_id : rs[1][i][0], nombre : rs[1][i][1], formato : rs[1][i][2], peso : rs[1][i][3], ubicacion : rs[1][i][4], estado : rs[1][i][5], fecha_registro : (rs[1][i][6])?new Date(rs[1][i][6]):null, es_descargable : (rs[1][i][7] == "true" || rs[1][i][7] == "1")?true:false, usuario_registro_id : rs[1][i][8], ghost : rs[1][i][9], usuario_registro_nombres : rs[1][i][10], usuario_registro_apellidos : rs[1][i][11]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}