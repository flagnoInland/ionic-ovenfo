import { Jpo } from "../ohCore/services/oh.core";
import { OHService } from "../tis.ohService";

export interface dbowevLisLogin_data {userid ?: string, id ?: string, name ?: string, lastName ?: string, lastMiddle ?: string, company ?: string, companyId ?: string, changePassword ?: string, daysChangekey ?: string, source ?: string, token ?: string};
export interface dbowevLisLogin_profiles {id ?: string, businessName ?: string, default ?: string};
export interface dbowevLisLogin_roles {id ?: string, idUN ?: string};
export interface dbowevLisLogin_systems {id ?: string, description ?: string, icon ?: string};
export interface dbowevLisLogin_systemByProfile {systemId ?: string, profileId ?: string};
export interface dbowevLisLogin_system {version ?: string, nivel ?: number, deploymentDate ?: Date};
export interface dbowevLisLogin_adds {id ?: number, type ?: number, icon ?: string, title ?: string, subtitle ?: string, description ?: string, nivel ?: string, onlyOne ?: string, onlyOneAlert ?: string, dueDate ?: Date, read ?: number, sendDate ?: Date};
export class pDbowevLisLogin {data : dbowevLisLogin_data; profiles : dbowevLisLogin_profiles[]; roles : dbowevLisLogin_roles[]; systems : dbowevLisLogin_systems[]; systemByProfile : dbowevLisLogin_systemByProfile[]; system : dbowevLisLogin_system; adds : dbowevLisLogin_adds[]};
export class pDbowevLisMenu {id : string; parentId : string; description : string; icon : string; url : string; hasId : string};
export class pDbowevUpdCambioclave {estado : number; mensaje : string};

export class LoginServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("Inlandnet","SEC","security","LoginServiceImp");
    }

    dbowevLisLogin(fields : {
        Usuario ?: string,
        Clave ?: string,
        ClaveMD5 ?: string,
        Sistema_id ?: number
    }, body : any, call ?: { (resp: pDbowevLisLogin) }){
        this.jpo.get("dbowevLisLogin",{
            body : body,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDbowevLisLogin();
                        if(rs[0] && rs[0][0]){
                            out.data = {userid : rs[0][0][0], id : rs[0][0][1], name : rs[0][0][2], lastName : rs[0][0][3], lastMiddle : rs[0][0][4], company : rs[0][0][5], companyId : rs[0][0][6], changePassword : rs[0][0][7], daysChangekey : rs[0][0][8], source : rs[0][0][9], token : rs[0][0][10]};
                        }
                        if(rs[1]){
                            out.profiles = [];
                            for(var i = 0; i < rs[1].length; i++){
                                out.profiles.push({id : rs[1][i][0], businessName : rs[1][i][1], default : rs[1][i][2]});
                            }
                        }
                        if(rs[2]){
                            out.roles = [];
                            for(var i = 0; i < rs[2].length; i++){
                                out.roles.push({id : rs[2][i][0], idUN : rs[2][i][1]});
                            }
                        }
                        if(rs[3]){
                            out.systems = [];
                            for(var i = 0; i < rs[3].length; i++){
                                out.systems.push({id : rs[3][i][0], description : rs[3][i][1], icon : rs[3][i][2]});
                            }
                        }
                        if(rs[4]){
                            out.systemByProfile = [];
                            for(var i = 0; i < rs[4].length; i++){
                                out.systemByProfile.push({systemId : rs[4][i][0], profileId : rs[4][i][1]});
                            }
                        }
                        if(rs[5] && rs[5][0]){
                            out.system = {version : rs[5][0][0], nivel : rs[5][0][1], deploymentDate : (rs[5][0][2])?new Date(rs[5][0][2]):null};
                        }
                        if(rs[6]){
                            out.adds = [];
                            for(var i = 0; i < rs[6].length; i++){
                                out.adds.push({id : rs[6][i][0], type : rs[6][i][1], icon : rs[6][i][2], title : rs[6][i][3], subtitle : rs[6][i][4], description : rs[6][i][5], nivel : rs[6][i][6], onlyOne : rs[6][i][7], onlyOneAlert : rs[6][i][8], dueDate : (rs[6][i][9])?new Date(rs[6][i][9]):null, read : rs[6][i][10], sendDate : (rs[6][i][11])?new Date(rs[6][i][11]):null});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    dbowevLisMenu(fields : {
        Origen ?: string,
        Usuario ?: string,
        Empresa ?: string,
        Sistema ?: string
    }, call ?: { (resp: pDbowevLisMenu[]) }){
        this.jpo.get("dbowevLisMenu",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = [];
                        if(rs){
                            for(var i = 0; i < rs.length; i++){
                                out.push({id : rs[i][0], parentId : rs[i][1], description : rs[i][2], icon : rs[i][3], url : rs[i][4], hasId : rs[i][5]});
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

    dbowevUpdCambioclave(fields : {
        Usuario ?: string,
        Clave ?: string,
        ClaveMD5 ?: string,
        Origen ?: string
    }, call ?: { (resp: pDbowevUpdCambioclave) }){
        this.jpo.get("dbowevUpdCambioclave",{
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pDbowevUpdCambioclave();
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

}