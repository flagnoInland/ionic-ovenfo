import { Jpo } from "../ohCore/services/oh.core";
import { OHService } from "../tis.ohService";

export interface segloginAcceder_data {userid : string, id : string, name : string, lastName : string, lastMiddle : string, company : string, companyId : string, changePassword : string, daysChangekey : string, source : string, token : string};
export interface segloginAcceder_profiles {id : string, businessName : string, default : string, un_hijo_predefinido_id : number};
export interface segloginAcceder_roles {id : string, idUN : string, id_ : string};
export interface segloginAcceder_systems {id : string, description : string, icon : string};
export interface segloginAcceder_systemByProfile {systemId : string, profileId : string};
export interface segloginAcceder_system {version : string, nivel : number, deploymentDate : Date};
export interface segloginAcceder_adds {id : number, type : number, icon : string, title : string, subtitle : string, description : string, nivel : string, onlyOne : string, onlyOneAlert : string, dueDate : Date, read : number, sendDate : Date};
export interface segloginAcceder_rules {regla_id : number, parametros : string};
export interface segloginAcceder_terms {unidad_negocio_id : number};
export interface segloginAcceder_faqs {unidad_negocio_id : number};
export class pSegloginAcceder {data : segloginAcceder_data; profiles : segloginAcceder_profiles[]; roles : segloginAcceder_roles[]; systems : segloginAcceder_systems[]; systembyprofile : segloginAcceder_systemByProfile[]; system : segloginAcceder_system; adds : segloginAcceder_adds[]; rules : segloginAcceder_rules[]; terms : segloginAcceder_terms[]; faqs : segloginAcceder_faqs[]};

export class OHSUserServiceJPO {

    jpo : Jpo;

    constructor(private ohService : OHService){
        this.jpo = ohService.getOH().getJPO("ovnmain","OHS","security","OHSUserServiceImp");
    }

    segloginAcceder(fields : {
        id ?: string,
        clave_md5 ?: string,
        sistema_id ?: number
    }, body : any, call ?: { (resp: pSegloginAcceder) }){
        this.jpo.get("segloginAcceder",{
            body : body,
            fields : fields,
            response : (rs) => {
                if(call){
                    var out = new pSegloginAcceder();
                        if(rs){
                           if(rs[0] && rs[0][0]){
                               out.data = {userid : rs[0][0][0], id : rs[0][0][1], name : rs[0][0][2], lastName : rs[0][0][3], lastMiddle : rs[0][0][4], company : rs[0][0][5], companyId : rs[0][0][6], changePassword : rs[0][0][7], daysChangekey : rs[0][0][8], source : rs[0][0][9], token : rs[0][0][10]};
                           }
                            if(rs[1]){
                                out.profiles = [];
                                for(var i = 0; i < rs[1].length; i++){
                                    out.profiles.push({id : rs[1][i][0], businessName : rs[1][i][1], default : rs[1][i][2], un_hijo_predefinido_id : rs[1][i][3]});
                                }
                            }
                            if(rs[2]){
                                out.roles = [];
                                for(var i = 0; i < rs[2].length; i++){
                                    out.roles.push({id : rs[2][i][0], idUN : rs[2][i][1], id_ : rs[2][i][2]});
                                }
                            }
                            if(rs[3]){
                                out.systems = [];
                                for(var i = 0; i < rs[3].length; i++){
                                    out.systems.push({id : rs[3][i][0], description : rs[3][i][1], icon : rs[3][i][2]});
                                }
                            }
                            if(rs[4]){
                                out.systembyprofile = [];
                                for(var i = 0; i < rs[4].length; i++){
                                    out.systembyprofile.push({systemId : rs[4][i][0], profileId : rs[4][i][1]});
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
                            if(rs[7]){
                                out.rules = [];
                                for(var i = 0; i < rs[7].length; i++){
                                    out.rules.push({regla_id : rs[7][i][0], parametros : rs[7][i][1]});
                                }
                            }
                            if(rs[8]){
                                out.terms = [];
                                for(var i = 0; i < rs[8].length; i++){
                                    out.terms.push({unidad_negocio_id : rs[8][i][0]});
                                }
                            }
                            if(rs[9]){
                                out.faqs = [];
                                for(var i = 0; i < rs[9].length; i++){
                                    out.faqs.push({unidad_negocio_id : rs[9][i][0]});
                                }
                            }
                        }
                    call(out);
                }
            },
            showLoader : true
        });
    }

}