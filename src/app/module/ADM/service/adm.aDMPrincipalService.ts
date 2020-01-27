import { Jpo } from "../../../ohCore/services/oh.core";
import { OHService } from "../../../tis.ohService";

export class pGesemailObtenerEnvio {email_plantilla_id : number; destinatario : string; copia : string; copia_oculta : string; titulo : string; mensaje : string};
export class pGesemailReenviar {resp_estado : number; resp_mensaje : string; resp_correo : string};
export interface seglogEmailListar_lista {log_id ?: number, destinatario ?: string, copia ?: string, copia_oculta ?: string, titulo ?: string, cuerpo ?: string, estado ?: number, fecha ?: Date};
export interface seglogEmailListar_resultado {total ?: number};
export class pSeglogEmailListar {lista : seglogEmailListar_lista[]; resultado : seglogEmailListar_resultado};
export class pSeglogEmailReenviar {estado : number; mensaje : string};
export interface gesinicializar_proyectos {menu_id ?: number, titulo ?: string};
export interface gesinicializar_unidad_negocio {unidad_negocio_id ?: number, nombre ?: string, estado ?: boolean};
export interface gesinicializar_proyecto_config {menu_id ?: number, id ?: string, descripcion ?: string, valor ?: string};
export class pGesinicializar {proyectos : gesinicializar_proyectos[]; unidad_negocio : gesinicializar_unidad_negocio[]; proyecto_config : gesinicializar_proyecto_config[]};

export class ADMPrincipalServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ModuleADM","ADM","module.adm","ADMPrincipalServiceImp");
    }

    gesemailObtenerEnvio(fields : {
        msg_id ?: string
    }, call ?: { (resp: pGesemailObtenerEnvio) }){
        this.jpo.get("gesemailObtenerEnvio",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out;
                        if(rs && rs[0]){
                            out = {email_plantilla_id : rs[0][0], destinatario : rs[0][1], copia : rs[0][2], copia_oculta : rs[0][3], titulo : rs[0][4], mensaje : rs[0][5]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    gesemailReenviar(fields : {
        destinatario ?: string,
        email_plantilla_id ?: number,
        titulo ?: string,
        mensaje ?: string
    }, call ?: { (resp: pGesemailReenviar) }){
        this.jpo.get("gesemailReenviar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesemailReenviar();
                        if(rs){
                            out.resp_estado = rs[0];
                            out.resp_mensaje = rs[1];
                            out.resp_correo = rs[2];
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    seglogEmailListar(fields : {
        destinatario ?: string,
        copia ?: string,
        copia_oculta ?: string,
        titulo ?: string,
        Page ?: number,
        Size ?: number
    }, call ?: { (resp: pSeglogEmailListar) }){
        this.jpo.get("seglogEmailListar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSeglogEmailListar();
                        if(rs[0]){
                            out.lista = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.lista.push({log_id : rs[0][i][0], destinatario : rs[0][i][1], copia : rs[0][i][2], copia_oculta : rs[0][i][3], titulo : rs[0][i][4], cuerpo : rs[0][i][5], estado : rs[0][i][6], fecha : (rs[0][i][7])?new Date(rs[0][i][7]):null});
                            }
                        }
                        if(rs[1] && rs[1][0]){
                            out.resultado = {total : rs[1][0][0]};
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    seglogEmailReenviar(fields : {
        usuario_id ?: number,
        log_id ?: number
    }, call ?: { (resp: pSeglogEmailReenviar) }){
        this.jpo.get("seglogEmailReenviar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSeglogEmailReenviar();
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

    gesinicializar(fields : {
        unidad_negocio_id ?: number,
        usuario_id ?: number
    }, call ?: { (resp: pGesinicializar) }){
        this.jpo.get("gesinicializar",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pGesinicializar();
                        if(rs[0]){
                            out.proyectos = [];
                            for(var i = 0; i < rs[0].length; i++){
                                out.proyectos.push({menu_id : rs[0][i][0], titulo : rs[0][i][1]});
                            }
                        }
                        if(rs[1]){
                            out.unidad_negocio = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.unidad_negocio.push({unidad_negocio_id : rs[1][i][0], nombre : rs[1][i][1], estado : (rs[1][i][2] == "true" || rs[1][i][2] == "1")?true:false});
                            }
                        }
                        if(rs[2]){
                            out.proyecto_config = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.proyecto_config.push({menu_id : rs[2][i][0], id : rs[2][i][1], descripcion : rs[2][i][2], valor : rs[2][i][3]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}