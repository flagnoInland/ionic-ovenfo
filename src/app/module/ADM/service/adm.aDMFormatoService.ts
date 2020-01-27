import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pGesformatoActualizar {estado : number; mensaje : string};
export class pGesformatoEliminar {estado : number; mensaje : string};
export interface gesformatoListar_response {total ?: number};
export interface gesformatoListar_formatos {email_plantilla_id ?: number, contenido ?: string, cotenido_padre ?: string, titulo ?: string, descripcion ?: string, estado ?: number, fecha_registro ?: Date, usuario_registro_id ?: number, usuario_registro_nombres ?: string, usuario_registro_apellidos ?: string};
export class pGesformatoListar {response : gesformatoListar_response; formatos : gesformatoListar_formatos[]};
export interface gesformatoObtener_formato {email_plantilla_id ?: number, email_plantilla_padre_id ?: number, contenido ?: string, destinatario ?: string, copia ?: string, copia_oculta ?: string, titulo ?: string, estado ?: number, descripcion ?: string, usuario_registro ?: string};
export interface gesformatoObtener_atributos {campo ?: string};
export class pGesformatoObtener {formato : gesformatoObtener_formato; atributos : gesformatoObtener_atributos[]};
export class pGesformatoPadreListar {email_plantilla_id : number; titulo : string; contenido : string};
export class pGesformatoRegistrar {format_id : number; estado : number; mensaje : string};

export class ADMFormatoServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMFormatoServiceImp");
    }

    gesformatoActualizar(fields : {
        formato_id ?: number,
        email_plantilla_padre_id ?: number,
        contenido ?: string,
        destinatario ?: string,
        copia ?: string,
        copia_oculta ?: string,
        titulo ?: string,
        estado_plantilla ?: number,
        usuario_modificacion_id ?: number,
        descripcion ?: string,
        atributos ?: string
    }, call ?: { (resp: pGesformatoActualizar) }){
        this.jpo.get("gesformatoActualizar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesformatoActualizar();
                        if(rs){
                            out.estado = rs[0];
                            out.mensaje = rs[1];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesformatoEliminar(fields : {
        formato_id ?: number
    }, call ?: { (resp: pGesformatoEliminar) }){
        this.jpo.get("gesformatoEliminar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesformatoEliminar();
                        if(rs){
                            out.estado = rs[0];
                            out.mensaje = rs[1];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesformatoListar(fields : {
        titulo ?: string,
        descripción ?: string,
        page ?: number,
        size ?: number
    }, call ?: { (resp: pGesformatoListar) }){
        this.jpo.get("gesformatoListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesformatoListar();
                        if(rs[0] && rs[0][0]){
                            out.response = {total : rs[0][0][0]};
                        }
                        if(rs[1]){
                            out.formatos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.formatos.push({email_plantilla_id : rs[1][i][0], contenido : rs[1][i][1], cotenido_padre : rs[1][i][2], titulo : rs[1][i][3], descripcion : rs[1][i][4], estado : rs[1][i][5], fecha_registro : (rs[1][i][6])?new Date(rs[1][i][6]):null, usuario_registro_id : rs[1][i][7], usuario_registro_nombres : rs[1][i][8], usuario_registro_apellidos : rs[1][i][9]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesformatoObtener(fields : {
        formato_id ?: number
    }, call ?: { (resp: pGesformatoObtener) }){
        this.jpo.get("gesformatoObtener",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesformatoObtener();
                        if(rs[0] && rs[0][0]){
                            out.formato = {email_plantilla_id : rs[0][0][0], email_plantilla_padre_id : rs[0][0][1], contenido : rs[0][0][2], destinatario : rs[0][0][3], copia : rs[0][0][4], copia_oculta : rs[0][0][5], titulo : rs[0][0][6], estado : rs[0][0][7], descripcion : rs[0][0][8], usuario_registro : rs[0][0][9]};
                        }
                        if(rs[1]){
                            out.atributos = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.atributos.push({campo : rs[1][i][0]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesformatoPadreListar(call ?: { (resp: pGesformatoPadreListar[]) }){
        this.jpo.get("gesformatoPadreListar",{
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({email_plantilla_id : rs[i][0], titulo : rs[i][1], contenido : rs[i][2]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesformatoRegistrar(fields : {
        email_plantilla_padre_id ?: number,
        contenido ?: string,
        destinatario ?: string,
        copia ?: string,
        copia_oculta ?: string,
        titulo ?: string,
        estado_plantilla ?: number,
        usuario_registro_id ?: number,
        descripcion ?: string,
        atributos ?: string
    }, call ?: { (resp: pGesformatoRegistrar) }){
        this.jpo.get("gesformatoRegistrar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesformatoRegistrar();
                        if(rs){
                            out.format_id = rs[0];
                            out.estado = rs[1];
                            out.mensaje = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}