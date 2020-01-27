import { pBuiservicioWebObtener, buiservicioWebObtener_procedimientos, buiservicioWebObtener_servicio_web } from "../../BUI/service/bui.bUIGNServicioWebService";
import { BUIBuilderUtil } from "./bui.builder.util";

/* resp.procedimientos[indice].configuraciones
    {  
        "isSlim":true,
        "prefix":"",
        "showLoader":true,
        "setBody":false,
        "disableView":false,
        "datasource":"",
        "oauth2Roles":"",
        "oauth2Enable":true,
        "enableFiles":false,
        "autocommit":true,
        "response":false,
        "linkInternal":false,
        "linkExternal":false
        "oneResult" : false // No se plica
        "return" : false // No se aplica
    }
*/

export class BUIProcedimiento {

    private config : any;
    private util : BUIBuilderUtil;
    private tieneJPOMetodo : boolean;
    private tieneResponseMetodo : boolean;

    private _PREFIJO : String = "PRE";

    constructor(coreData : any){
        this.config = coreData;
        this.util = new BUIBuilderUtil();
    }

    public construirServicio(resp : pBuiservicioWebObtener){
        
        var myClass = {
            package : resp['origen_rest'].url_core + "." + resp['origen_rest'].url_fuente + "." + resp.servicio_web.paquete,
            name : resp.servicio_web.clase+"Service",
            dataSource : resp.servicio_web.origen_datos,
            roles : (resp.roles)?resp.roles.join(","):"",
            enableoauth2: resp.servicio_web.indicador_oauth2
        };

        var jpoClass = this.resJpoAnotacion(myClass);

        this.tieneJPOMetodo = false;
        this.tieneResponseMetodo = false;
        var methods = [];
        for(var i = 0; i < resp.procedimientos.length; i++){
            methods.push(this.restMetodo(resp, i));
        }

        var sb = [];
            sb.push("package "+myClass.package+";\n\n");

            sb.push("import javax.ejb.LocalBean;\n");
            sb.push("import javax.ejb.Stateless;\n");
            if(this.tieneResponseMetodo){sb.push("import javax.servlet.http.HttpServletResponse;\n");}
            sb.push("import javax.servlet.http.HttpServletRequest;\n\n");
            
            sb.push("import ohSolutions.ohJpo.dao.Jpo;\n");
            if(jpoClass || this.tieneJPOMetodo){sb.push("import ohSolutions.ohJpo.dao.JpoClass;\n");}
            sb.push("import ohSolutions.ohJpo.dao.Procedure;\n");
            sb.push("import ohSolutions.ohRest.util.ejb.LocalController;\n");
            sb.push("import ohSolutions.ohRest.util.service.BaseService;\n\n");
    
            sb.push("@Stateless\n");
            sb.push("@LocalBean\n");

            if(jpoClass){sb.push(jpoClass);}
            sb.push("public class "+myClass.name+" extends BaseService implements LocalController {\n\n");

            sb.push(methods.join(""));

            sb.push("}");

        return sb.join("");
        
    }

        private resJpoAnotacion(myClass : any){
            var parts = [];
            if(myClass.dataSource && myClass.dataSource.length>0){
                parts.push("source = \""+myClass.dataSource+"\"");
            }
            if(myClass.roles && myClass.roles.trim().length>0){
                parts.push("oauth2Roles = \""+myClass.roles+"\"");
            }
            if(myClass.enableoauth2 && myClass.enableoauth2 == "1"){
                parts.push("oauth2Enable = true");
            }
            if(parts.length>0){
                return "@JpoClass("+parts.join(", ")+")\n";
            } else {
                return null;
            }
        }

        private restMetodo(resp : pBuiservicioWebObtener, indice : number){

            var head : any = resp.procedimientos[indice].configuraciones;
            var nombre = resp.procedimientos[indice].sp_esquema+"."+resp.procedimientos[indice].sp_nombre;
            var mySP = {
                nameMethod : this.util.getMethodName(nombre),
                nameSP : nombre,
                isObject : (!head.isSlim)?"execute":"executeL",
                oneResult : (head.oneResult)?"true":"",
                autocommit : (typeof(head.autocommit)=="undefined" || head.autocommit == null || (typeof(head.autocommit) == "string" && head.autocommit=="true") || head.autocommit)?true:false,
                prefix : (head.prefix)?head.prefix:((resp.servicio_web.prefijo)?resp.servicio_web.prefijo:this._PREFIJO) // 1 head.prefix 2 procedure.prefix 3 this._PREFIJO
            };
            
            var jpoClass = this.resJpoAnotacion({
                dataSource : head.datasource,
                roles : (head.oauth2Roles)?head.oauth2Roles.join(","):"",
                enableoauth2 : head.oauth2Enable
            });

            if(jpoClass){
                this.tieneJPOMetodo = true;
            }

            var headResponse = "";
            if(head.response){
                this.tieneResponseMetodo = true;
                headResponse = ", HttpServletResponse response";
            }

            var sb = [];
                if(jpoClass){sb.push("	"+jpoClass);}
                sb.push("	public Object "+mySP.nameMethod+"(Jpo ppo, HttpServletRequest request"+headResponse+") throws Exception {\n");
                sb.push("		Procedure pResult = ppo.procedure(\""+mySP.nameSP+"\",\""+mySP.prefix+"\");\n");
        
            var param : any = resp.procedimientos[indice].entradas;
                for(var i = 0; i < param.length; i++){

                    var myParam = {
                        typeParam : this.obtenerTipoCampo(param[i].tipo_campo),
                        name : param[i].campo,
                        type : "Jpo."+param[i].tipo_dato,
                        rules : this.obtenerReglas(param[i].tipo_campo, param[i].reglas)
                    }

                    sb.push("		pResult."+myParam.typeParam+"(\""+myParam.name+"\", "+myParam.type+""+myParam.rules+");\n");

                }

                if(head.return){ // store to return specific value
                    sb.push("		pResult.getResult(Jpo."+head.return+");\n");
                }

                sb.push("		Object ohb_response = pResult."+mySP.isObject+"("+mySP.oneResult+");\n");
                if(mySP.autocommit){
                    sb.push("		ppo.commit();\n");
                }
                sb.push("		return ohb_response;\n");
                
                sb.push("	}\n\n");
                
            return sb.join("");

        }

        // "i" => "input"
        private obtenerTipoCampo(typeParam : string){
            if(typeParam){
                var params = { 
                    "i" : "input", 
                    "o" : "output", 
                    "u" : "inoutput"
                }
                return params[typeParam];
            }
        }

        // i, "REQUIRED" => "REQUIRED" | i, null => ""
        private obtenerReglas(typeParam : string, rules : string){ 
            var rRules = "";
            if(typeParam == "i" && rules) {
                rRules += ", \""+rules+"\"";
            }
            return rRules;
        }

    public construirServicioImp(resp : pBuiservicioWebObtener){

        var myClass = {
            package : resp['origen_rest'].url_core + "." + resp['origen_rest'].url_fuente + "." + resp.servicio_web.paquete,
            name : resp.servicio_web.clase+"ServiceImp",
            parentClass : resp.servicio_web.clase+"Service",
            dataSource : resp.servicio_web.origen_datos,
            roles : (resp.roles)?resp.roles.join(","):"",
            enableoauth2: resp.servicio_web.indicador_oauth2
        };

        var jpoClass = this.resJpoAnotacion(myClass);

        this.tieneJPOMetodo = false;
        this.tieneResponseMetodo = false;
        var methods = [];
        for(var i = 0; i < resp.procedimientos.length; i++){
            methods.push(this.restMetodoImp(resp.procedimientos[i]));
        }

        var sb = [];
            sb.push("package "+myClass.package+";\n\n");

            sb.push("import javax.ejb.LocalBean;\n");
            sb.push("import javax.ejb.Stateless;\n");
            if(this.tieneResponseMetodo){sb.push("import javax.servlet.http.HttpServletResponse;\n");}
            sb.push("import javax.servlet.http.HttpServletRequest;\n\n");

            sb.push("import ohSolutions.ohJpo.dao.Jpo;\n");
            if(jpoClass || this.tieneJPOMetodo){sb.push("import ohSolutions.ohJpo.dao.JpoClass;\n");}
            sb.push("import ohSolutions.ohRest.util.ejb.LocalController;\n\n");
    
            sb.push("@Stateless\n");
            sb.push("@LocalBean\n");

            if(jpoClass){sb.push(jpoClass);}
            sb.push("public class "+myClass.name+" extends "+myClass.parentClass+" implements LocalController {\n\n");

            sb.push(methods.join(""));

            sb.push("}");

        return sb.join("");

    }

        private restMetodoImp(resp : buiservicioWebObtener_procedimientos){
            
            var mySP = {
                nameMethod : this.util.getMethodName(resp.sp_esquema+"."+resp.sp_nombre)
            };
            var head : any = resp.configuraciones;

            var jpoClass = this.resJpoAnotacion({
                dataSource : head.datasource,
                roles : (head.oauth2Roles)?head.oauth2Roles.join(","):"",
                enableoauth2 : head.oauth2Enable
            });

            if(jpoClass){
                this.tieneJPOMetodo = true;
            }

            var headResponse = "";
            if(head.response){
                this.tieneResponseMetodo = true;
                headResponse = ", HttpServletResponse response";
            }

            var sb = [];
                if(jpoClass){sb.push("	"+jpoClass);}
                sb.push("	public Object "+mySP.nameMethod+"(Jpo ppo, HttpServletRequest request"+headResponse+") throws Exception {\n");
                sb.push("		return super."+mySP.nameMethod+"(ppo, request);\n");
                sb.push("	}\n\n");
                
            return sb.join("");

        }

    public construirServicioTS(resp : pBuiservicioWebObtener){

        var myClass = {
            subProject : resp.servicio_web.rest_url_fuente,
            package : resp.servicio_web.paquete,
            name : resp.servicio_web.clase+"ServiceJPO",
            nameRest : resp.servicio_web.clase+"ServiceImp",
            parentClass : resp.servicio_web.clase+"Service",
            dataSource : resp.servicio_web.origen_datos,
            prefix : (resp.servicio_web.prefijo)?resp.servicio_web.prefijo:this._PREFIJO
        };
        
        var sb = [];
        
        var prefix = this.util.getModulePrefix(myClass.package);
            
            sb.push('import { Jpo } from "'+((prefix)?'../../../':'../')+'ohCore/services/oh.core";\n');
            sb.push('import { OHService } from "'+((prefix)?'../../../':'../')+this.config.proyecto.abreviatura.toLowerCase()+'.ohService";\n\n');

        var sbOutput = [];
        
        for(var i = 0; i < resp.procedimientos.length; i++){

            var head : any = resp.procedimientos[i].configuraciones;

            if(!head.disableView){

                var methodName = this.util.getMethodName(resp.procedimientos[i].sp_esquema+"."+resp.procedimientos[i].sp_nombre);
                var className = 'p'+this.util.firstUpper(methodName);

                var outputs = resp.procedimientos[i].salidas; // {type, data}
                var entradas : any = resp.procedimientos[i].entradas;
                var paraOutputs = [];

                for(var e = 0; e < entradas.length; e++){
                    if(entradas[e].tipo_campo == 'o'){
                        paraOutputs[paraOutputs.length] = {
                            name : entradas[e].campo,
                            type : this.obtenerTSTipo(entradas[e].tipo_dato),
                            value  : 'rs['+paraOutputs.length+']'
                        }
                    }
                }

                if(head.return){
                    resp.procedimientos[i]['htmlFormatOutput'] = "                    call(rs);\n";
                    resp.procedimientos[i]['nameOutput'] = this.obtenerTSTipo(head.return);
                    resp.procedimientos[i]['outputType'] = 'object';
                }
                
                if(paraOutputs.length>0){

                    var formatBase = [];
                        formatBase.push('                    var out = new '+className+'();\n');
                        formatBase.push('                        if(rs){'+'\n');
                        formatBase.push(this.obtenerSalidas(paraOutputs, outputs)+'\n');
                        formatBase.push('                        }'+'\n');
                        formatBase.push('                    call(out);\n');

                    resp.procedimientos[i]['htmlFormatOutput'] = formatBase.join("");
                    resp.procedimientos[i]['nameOutput'] = className;
                    resp.procedimientos[i]['outputType'] = 'object';
                    
                    sbOutput.push(this.obtenerSalidasInterfaces(paraOutputs, outputs, methodName));
                    sbOutput.push('export class '+className+' {'+this.obtenerParametros(paraOutputs, outputs, methodName)+'};'+'\n');

                } else if(outputs && outputs.length>0){

                    if(outputs.length>1){

                        var childs = [];

                        var formatBase = [];

                        formatBase.push('                    var out = new '+className+'();\n');

                        for(var e = 0; e < outputs.length ; e++){
                            
                            var objOutPut = outputs[e]; // {type, data}
        
                            //var pars = objOutPut.data.split("{");
        
                            var paramName = objOutPut['name'];
                            var interName = methodName+'_'+paramName;
                            
                            // interface and class
                            childs.push(paramName+' : '+interName+((objOutPut['type']=="list" && head.oneResult!=true)?'[]':''));

                            var formato = [];
                            for(var u in objOutPut['items']){
                                formato.push(objOutPut['items'][u].name+" ?: "+objOutPut['items'][u].type);
                            }
                            sbOutput.push('export interface '+interName+' {'+formato.join(", ")+'};\n');

                            // formating
                            if(head.oneResult==true){
                                formatBase.push('                        if(rs && rs['+e+']){'+'\n');
                                formatBase.push('                            out.'+paramName+' = '+this.obtenerSalidasParametrosDos(''+e, objOutPut['items'])+';'+'\n');
                                formatBase.push('                        }'+'\n');
                            } else if(head.isObject) {
                                if(objOutPut['type']=="list"){
                                    formatBase.push('                        if(rs['+e+']){'+'\n');
                                    formatBase.push('                            out.'+paramName+' = rs['+e+'];'+'\n');
                                    formatBase.push('                        }'+'\n');
                                } else {
                                    formatBase.push('                        if(rs['+e+'] && rs['+e+'][0]){'+'\n');
                                    formatBase.push('                            out.'+paramName+' = rs['+e+'][0];'+'\n');
                                    formatBase.push('                        }'+'\n');
                                }
                            } else {
                                if(objOutPut['type']=="list"){
                                    formatBase.push('                        if(rs['+e+']){'+'\n');
                                    formatBase.push('                            out.'+paramName+' = [];'+'\n');
                                    formatBase.push('                            for(var i = 0; i < rs['+e+'].length; i++){'+'\n');
                                    formatBase.push('                                out.'+paramName+'.push('+this.obtenerSalidasParametros(e, 'i', objOutPut['items'])+');'+'\n');
                                    formatBase.push('                            }'+'\n');
                                    formatBase.push('                        }'+'\n');
                                } else {
                                    formatBase.push('                        if(rs['+e+'] && rs['+e+'][0]){'+'\n');
                                    formatBase.push('                            out.'+paramName+' = '+this.obtenerSalidasParametros(e, '0', objOutPut['items'])+';'+'\n');
                                    formatBase.push('                        }'+'\n');
                                }
                            }


                        }

                        formatBase.push('                    call(out);\n');

                        resp.procedimientos[i]['htmlFormatOutput'] = formatBase.join("");
                        resp.procedimientos[i]['nameOutput'] = className;
                        resp.procedimientos[i]['outputType'] = 'object';
                        
                        sbOutput.push('export class '+className+' {'+childs.join("; ")+'};'+'\n');

                    } else {
                        
                        var objOutPut = outputs[0];

                        var formatBase = [];

                            if(head.isObject) {
                                if(objOutPut['type']=="list"){
                                    formatBase.push('                    var out = [];\n');
                                } else {
                                    formatBase.push('                    var out = new '+className+'();\n');
                                }
                                formatBase.push('                        if(rs){'+'\n');
                                formatBase.push('                            out = rs;'+'\n');
                                formatBase.push('                        }'+'\n');
                            } else if(objOutPut['type']=="list"){
                                formatBase.push('                    var out = [];\n');
                                formatBase.push('                        if(rs){'+'\n');
                                formatBase.push('                            for(var i = 0; i < rs.length; i++){'+'\n');
                                formatBase.push('                                out.push('+this.obtenerSalidasParametrosDos('i', objOutPut['items'])+');'+'\n');
                                formatBase.push('                            }'+'\n');
                                formatBase.push('                        }'+'\n');
                            } else { // comes fro [[one]]
                                formatBase.push('                    var out;\n');
                                if(head.oneResult==true){
                                    formatBase.push('                        if(rs && rs.length>0){'+'\n');
                                    formatBase.push('                            out = new '+className+'();'+'\n');
                                    formatBase.push('                            out = '+this.obtenerSalidasParametrosCero(objOutPut['items'])+';'+'\n');
                                    formatBase.push('                        }'+'\n');
                                } else {
                                    formatBase.push('                        if(rs && rs[0]){'+'\n');
                                    formatBase.push('                            out = '+this.obtenerSalidasParametrosDos('0', objOutPut['items'])+';'+'\n');
                                    formatBase.push('                        }'+'\n');
                                }
                            }
                        formatBase.push('                    call(out);\n');

                        resp.procedimientos[i]['htmlFormatOutput'] = formatBase.join("");
                        resp.procedimientos[i]['nameOutput'] = className;
                        resp.procedimientos[i]['outputType'] = objOutPut['type'];

                        var formato = [];
                        for(var u in objOutPut['items']){
                            formato.push(objOutPut['items'][u].name+" : "+objOutPut['items'][u].type);
                        }
                        
                        sbOutput.push('export class '+className+' {'+formato.join("; ")+'};'+'\n');

                    }

                }

            }

        }

        sb.push(sbOutput.join("")+'\n');
        sb.push('export class '+myClass.name+' {\n\n');
        
        sb.push('    jpo : Jpo;\n\n');

        sb.push('    constructor(private ohService : OHService){\n');
        sb.push('        this.jpo = ohService.getOH().getJPO('+((myClass.subProject)?('"'+myClass.subProject+'",'):"")+'"'+myClass.prefix+'","'+myClass.package+'","'+myClass.nameRest+'");\n');
        sb.push('    }\n\n');
        
        for(var i = 0; i < resp.procedimientos.length; i++){
            if(!resp.procedimientos[i].configuraciones['disableView']){
                sb.push(this.tsMetodo(resp, i));
            }
        }

        sb.push('}');
        
        return sb.join("");
        
    }

        private obtenerTSTipo(typeParam : string){ 
            if(typeParam){
                var params = { 
                    "DATE"      : "string", 
                    "DATETIME"  : "string", 
                    "STRING"    : "string", 
                    "TEXT"      : "string", 
                    "CHARACTER" : "string", 
                    "DECIMAL"   : "number", 
                    "INTEGER"   : "number", 
                    "BIGINTEGER": "number", 
                    "XML"       : "string", 
                    "RESULT"    : "any"
                };
                return params[typeParam];
            }
        }

        private tsMetodo(resp : pBuiservicioWebObtener, indice : number){

            var head = resp.procedimientos[indice].configuraciones;
            
            var mySP = {
                nameMethod : this.util.getMethodName(resp.procedimientos[indice].sp_esquema+"."+resp.procedimientos[indice].sp_nombre)
            };

            var sbInput = [];
            var sbInputPar = [];
            
            for(var i = 0; i < resp.procedimientos[indice].entradas.length; i++){
                
                var entrada = resp.procedimientos[indice].entradas[i];

                var myParam = {
                    typeParam : this.obtenerTipoCampo(entrada['tipo_campo']),
                    name : entrada['campo'],
                    type : this.obtenerTSTipo(entrada['tipo_dato']),
                    rules : this.obtenerReglas(entrada['tipo_campo'], null)
                }

                var optional = "?";
                if(myParam.rules.indexOf("REQUIRED")>=0){
                    optional = "";
                }

                if(myParam.typeParam=='input'){
                    sbInputPar.push('        '+myParam.name+' '+optional+': '+myParam.type+',\n');
                }

            }
            var inputs = sbInputPar.join("");
            if(inputs.length>0){
                sbInput.push('fields : {\n');
                sbInput.push(inputs.substring(0, inputs.length - 2)+'\n');
                sbInput.push('    }, ');
            }

            if(head['setBody']){
                sbInput.push('body : any, ');
            }

            if(head['enableFiles']){
                sbInput.push('files : any, loading : any, ');
            }

            // new to considera showLoader
            var showLoaderStr = "";
            if(head['showLoader'] == null || head['showLoader'] == true){
                showLoaderStr = ',\n            showLoader : true'
            }

            var formatOutput = resp.procedimientos[indice]['htmlFormatOutput'];

            var sb = [];
                sb.push('    '+mySP.nameMethod+'('+sbInput.join("")+((formatOutput)?('call ?: { (resp: '+resp.procedimientos[indice]['nameOutput']+(resp.procedimientos[indice]['outputType']=='list'?'[]':'')+') }'):'call ?: any')+'){\n');
                sb.push('        this.jpo.get("'+mySP.nameMethod+'",{\n');
                if(head['setBody']){
                    sb.push('            body : body,\n');
                }
                if(head['enableFiles']){
                    sb.push('            files : files,\n');
                    sb.push('            loading : loading,\n');
                }
                if(inputs.length>0){
                    sb.push('            fields : fields,\n');
                }
                if(head['linkInternal']){
                    sb.push('            locationHref : true,\n');
                }
                if(head['linkExternal']){
                    sb.push('            windowopen : true,\n');
                }
                sb.push('            response : (rs) => {\n');
                if(formatOutput){
                    sb.push('                if(call){\n');
                    sb.push(formatOutput);
                    sb.push('                }\n');
                } else {
                    sb.push('                if(call){\n');
                    sb.push('                   call(rs);\n');
                    sb.push('                }\n');
                }
                sb.push('            }'+showLoaderStr+'\n');
                sb.push('        });\n');
                sb.push('    }\n\n');
            
            return sb.join("");

        }

        private obtenerSalidas(salidasParametros : any, salidas : any){

            var childs = [];

            for(var i = 0; i < salidasParametros.length; i++){
                var name = salidasParametros[i].name;
                
                if(salidas[i]){ // Macheando con la posicion
                    if(salidas[i].type=="list"){
                        childs.push('                            if(rs['+i+']){'+'\n');
                        childs.push('                                out.'+name+' = [];'+'\n');
                        childs.push('                                for(var i = 0; i < rs['+i+'].length; i++){'+'\n');
                        childs.push('                                    out.'+name+'.push('+this.obtenerSalidasParametros(i, 'i', salidas[i].items)+');'+'\n');
                        childs.push('                                }'+'\n');
                        childs.push('                            }'+'\n');
                    } else {
                        childs.push('                           if(rs['+i+'] && rs['+i+'][0]){'+'\n');
                        childs.push('                               out.'+name+' = '+this.obtenerSalidasParametros(i, '0', salidas[i].items)+';'+'\n');
                        childs.push('                           }'+'\n');
                    }
                } else {
                    childs.push('                            out.'+name+' = rs['+i+'];'+'\n');
                }
            }

            var listChilds = childs.join("");
            return listChilds.substring(0, listChilds.length-1);

        }

        private obtenerSalidasParametros(index : number, row : string, atributos : any){
            
            if(atributos.length>0){
                var sbConvertion = [];
                for(var i = 0; i < atributos.length; i++){
                    var value = 'rs['+index+']['+row+']['+i+']';
                    if(atributos[i].type=="Date"){
                        value = '(rs['+index+']['+row+']['+i+'])?new Date(rs['+index+']['+row+']['+i+']):null'
                    }
                    if(atributos[i].type=="boolean"){
                        value = '(rs['+index+']['+row+']['+i+'] == "true" || rs['+index+']['+row+']['+i+'] == "1")?true:false'
                    }
                    if(atributos[i].type=="any"){
                        value = 'JSON.parse(rs['+index+']['+row+']['+i+'])'
                    }
                    sbConvertion.push(atributos[i].name+' : '+value);
                }
                return '{'+sbConvertion.join(", ")+"}";
            } else {
                return "{}";
            }

        }

        private obtenerSalidasInterfaces(salidasParametros : any, salidas : any, methodName : string){
            var childs = [];
            for(var i = 0; i < salidasParametros.length; i++){
                var name = salidasParametros[i].name;
                if(salidas[i]){
                    var formato = [];
                    for(var e in salidas[i].items){
                        formato.push(salidas[i].items[e].name+" : "+salidas[i].items[e].type);
                    }
                    childs.push('export interface '+methodName+'_'+salidas[i].name+' {'+formato.join(", ")+'};\n');
                }
            }
            return childs.join("");
        }

        private obtenerParametros(salidasParametros : any, salidas : any, methodName : string){

            var childs = [];
            for(var i = 0; i < salidasParametros.length; i++){
                var name = salidasParametros[i].name;
                var interName = methodName+'_'+name;
                if(salidas[i]){
                    childs.push(name+' : '+interName+((salidas[i].type=="list")?'[]':''));
                } else {
                    childs.push(name+' : '+salidasParametros[i].type);
                }
            }   

            return childs.join("; ");

        }

        private obtenerSalidasParametrosDos(row : string, atributos : string){
            if(atributos.length>0){
                var sbConvertion = []
                for(var i = 0; i < atributos.length; i++){
                    var name = atributos[i]['name'];
                    var type = atributos[i]['type'];
                    var value = 'rs['+row+']['+i+']';
                    if(type=="Date"){
                        value = '(rs['+row+']['+i+'])?new Date(rs['+row+']['+i+']):null'
                    }
                    if(type=="boolean"){
                        value = '(rs['+row+']['+i+'] == "true" || rs['+row+']['+i+'] == "1")?true:false'
                    }
                    if(type=="any"){
                        value = 'JSON.parse(rs['+row+']['+i+'])'
                    }
                    sbConvertion.push(name+' : '+value);
                }
                return '{'+sbConvertion.join(", ")+"}";
            } else {
                return '{}';
            }
        }

        private obtenerSalidasParametrosCero(atributos : string){
            if(atributos.length>0){
                var sbConvertion = []
                for(var i = 0; i < atributos.length; i++){
                    var name = atributos[i]['name'];
                    sbConvertion.push(name+' : rs['+i+']');
                }
                return '{'+sbConvertion.join(", ")+"}";
            } else {
                return '{}';
            }
        }

    public construirImplementacion(resp : pBuiservicioWebObtener){

        var myClass = {
            package : resp.servicio_web.paquete,
            name : resp.servicio_web.clase+"ServiceJPO",
            nameRest : resp.servicio_web.clase+"ServiceImp",
            nameVariable : this.util.firstLower(resp.servicio_web.clase)+"Service",
            dataSource : resp.servicio_web.origen_datos,
            prefix : (resp.servicio_web.prefijo)?resp.servicio_web.prefijo:this._PREFIJO
        };
        
        for(var i = 0; i < resp.procedimientos.length; i++){

            var head : any = resp.procedimientos[i].configuraciones;

            if(!head.disableView){

                var methodName = this.util.getMethodName(resp.procedimientos[i].sp_esquema+"."+resp.procedimientos[i].sp_nombre);
                var className = 'p'+this.util.firstUpper(methodName);

                var outputs = resp.procedimientos[i].salidas; // {type, data}
                var entradas : any = resp.procedimientos[i].entradas;
                var paraOutputs = [];
                
                for(var e = 0; e < entradas.length; e++){
                    if(entradas[e].tipo_campo == 'o'){
                        paraOutputs[paraOutputs.length] = {
                            name : entradas[e].campo,
                            type : this.obtenerTSTipo(entradas[e].tipo_dato),
                            value  : 'rs['+paraOutputs.length+']'
                        }
                    }
                }

                if(head.return){
                    resp.procedimientos[i]['htmlFormatOutput'] = "                    call(rs);\n";
                    resp.procedimientos[i]['nameOutput'] = this.obtenerTSTipo(head.return);
                    resp.procedimientos[i]['outputType'] = 'object';
                }

                if(paraOutputs.length>0){
                    
                    var formatBase = [];
                            formatBase.push('                    var out = new '+className+'();\n');
                            formatBase.push('                        if(rs){'+'\n');
                            formatBase.push(this.obtenerSalidas(paraOutputs, outputs)+'\n');
                            formatBase.push('                        }'+'\n');
                            formatBase.push('                    call(out);\n');

                    resp.procedimientos[i]['htmlFormatOutput'] = formatBase.join("");
                    resp.procedimientos[i]['nameOutput'] = className;
                    resp.procedimientos[i]['outputType'] = 'object';

                } else if(outputs && outputs.length>0){

                    if(outputs.length>1){

                        var childs = [];

                        var formatBase = [];

                        formatBase.push('                    var out = new '+className+'();\n');

                        for(var e = 0; e < outputs.length ; e++){
                            
                            var objOutPut = outputs[e]; // {type, data}
        
                            var paramName = objOutPut['name'];
                            var interName = methodName+'_'+paramName;
                            
                            // interface and class
                            childs.push(paramName+' : '+interName+((objOutPut['type']=="list" && head.oneResult!=true)?'[]':'')+'; ');
                                
                            // formating
                            if(head.oneResult==true){
                                formatBase.push('                        if(rs && rs['+e+']){'+'\n');
                                formatBase.push('                            out.'+paramName+' = '+this.obtenerSalidasParametrosDos(''+e, objOutPut['items'])+';'+'\n');
                                formatBase.push('                        }'+'\n');
                            } else if(head.isObject) {
                                if(objOutPut['type']=="list"){
                                    formatBase.push('                        if(rs['+e+']){'+'\n');
                                    formatBase.push('                            out.'+paramName+' = rs['+e+'];'+'\n');
                                    formatBase.push('                        }'+'\n');
                                } else {
                                    formatBase.push('                        if(rs['+e+'] && rs['+e+'][0]){'+'\n');
                                    formatBase.push('                            out.'+paramName+' = rs['+e+'][0];'+'\n');
                                    formatBase.push('                        }'+'\n');
                                }
                            } else {
                                if(objOutPut['type']=="list"){
                                    formatBase.push('                        if(rs['+e+']){'+'\n');
                                    formatBase.push('                            out.'+paramName+' = [];'+'\n');
                                    formatBase.push('                            for(var i = 0; i < rs['+e+'].length; i++){'+'\n');
                                    formatBase.push('                                out.'+paramName+'.push('+this.obtenerSalidasParametros(e, 'i', objOutPut['items'])+');'+'\n');
                                    formatBase.push('                            }'+'\n');
                                    formatBase.push('                        }'+'\n');
                                } else {
                                    formatBase.push('                        if(rs['+e+'] && rs['+e+'][0]){'+'\n');
                                    formatBase.push('                            out.'+paramName+' = '+this.obtenerSalidasParametros(e, '0', objOutPut['items'])+';'+'\n');
                                    formatBase.push('                        }'+'\n');
                                }
                            }

                        }

                        formatBase.push('                    call(out);\n');

                        resp.procedimientos[i]['htmlFormatOutput'] = formatBase.join("");
                        resp.procedimientos[i]['nameOutput'] = className;
                        resp.procedimientos[i]['outputType'] = 'object';
                        
                    } else {

                        var objOutPut = outputs[0];
                        var formatBase = [];

                            if(head.isObject) {
                                if(objOutPut['type']=="list"){
                                    formatBase.push('                    var out = [];\n');
                                } else {
                                    formatBase.push('                    var out = new '+className+'();\n');
                                }
                                formatBase.push('                        if(rs){'+'\n');
                                formatBase.push('                            out = rs;'+'\n');
                                formatBase.push('                        }'+'\n');
                            } else if(objOutPut['type']=="list"){
                                formatBase.push('                    var out = [];\n');
                                formatBase.push('                        if(rs){'+'\n');
                                formatBase.push('                            for(var i = 0; i < rs.length; i++){'+'\n');
                                formatBase.push('                                out.push('+this.obtenerSalidasParametrosDos('i', objOutPut['items'])+');'+'\n');
                                formatBase.push('                            }'+'\n');
                                formatBase.push('                        }'+'\n');
                            } else { // comes fro [[one]]
                                formatBase.push('                    var out;\n');
                                if(head.oneResult==true){
                                    formatBase.push('                        if(rs && rs.length>0){'+'\n');
                                    formatBase.push('                            out = new '+className+'();'+'\n');
                                    formatBase.push('                            out = '+this.obtenerSalidasParametrosCero(objOutPut['items'])+';'+'\n');
                                    formatBase.push('                        }'+'\n');
                                } else {
                                    formatBase.push('                        if(rs && rs[0]){'+'\n');
                                    formatBase.push('                            out = '+this.obtenerSalidasParametrosDos('0', objOutPut['items'])+';'+'\n');
                                    formatBase.push('                        }'+'\n');
                                }
                            }
                        formatBase.push('                    call(out);\n');

                        resp.procedimientos[i]['htmlFormatOutput'] = formatBase.join("");
                        resp.procedimientos[i]['nameOutput'] = className;
                        resp.procedimientos[i]['outputType'] = objOutPut['type'];

                    }

                }

            }

        }

        var imp = {
            instanciar : '    private '+myClass.nameVariable+' : '+myClass.name+';',
            construir : '        this.'+myClass.nameVariable+' = new '+myClass.name+'(ohService);',
            metodos : []
        }

        for(var i = 0; i < resp.procedimientos.length; i++){
            var head : any = resp.procedimientos[i].configuraciones;
            if(!head.disableView){
                imp.metodos.push({
                    nombre : resp.procedimientos[i].sp_nombre,
                    codigo : this.obtenerMetodoImp(myClass.nameVariable, resp.procedimientos[i])
                })
            }
        }

        return imp;

    }

        private obtenerMetodoImp(nameVariable : string, procedimiento : buiservicioWebObtener_procedimientos){

            var head : any = procedimiento.configuraciones;
            var mySP = {
                nameMethod : this.util.getMethodName(procedimiento.sp_esquema+"."+procedimiento.sp_nombre)
            };

            var sbInput = [];
            var sbInputPar = [];

            for(var i = 0; i < procedimiento.entradas.length; i++){

                var entrada : any = procedimiento.entradas[i];

                var myParam = {
                    typeParam : this.obtenerTipoCampo(entrada.tipo_campo),
                    name : entrada.campo,
                    typeEx : this.obtenerEntradaImp(entrada.tipo_dato),
                    rules : this.obtenerReglas(entrada.tipo_campo, entrada.reglas)
                }

                var optional = "// Optional";
                if(myParam.rules.indexOf("REQUIRED")>=0){
                    optional = "";
                }

                if(myParam.typeParam=='input'){
                    sbInputPar.push('            '+myParam.name+' : '+myParam.typeEx+', '+optional);
                }

            }
        
            if(sbInputPar.length>0){
                var last =  sbInputPar[sbInputPar.length-1];

                sbInputPar[sbInputPar.length-1] = last.replace(", ", " ");
        
                var inputs = sbInputPar.join("\n");
                if(inputs.length>0){
                    sbInput.push('{\n');
                    sbInput.push(inputs+'\n');
                    //sbInput.push(inputs.substring(0, inputs.length - 2)+'\n');
                    sbInput.push('        }');
                }
            }
            if(head.setBody){
                if(sbInput.length!=0){ // If exist suplly add ', '
                    sbInput.push(", ");
                }
                sbInput.push('body : {\n');
                sbInput.push('        }');
            }

            if(head.enableFiles){
                if(sbInput.length!=0){ // If exist suplly add ', '
                    sbInput.push(", ");
                }
                sbInput.push('{\n');
                sbInput.push('        }, (progress : number) => {\n');
                sbInput.push('        }');
            }

            var callback = "";
            var callbackOpc = "";
            if(procedimiento['htmlFormatOutput']){
                callback += "(resp : "+procedimiento['nameOutput']+(procedimiento['outputType']=='list'?'[]':'')+") => {\n";
                callback += "        }";
                if(sbInput.length!=0){ // If exist suplly add ', '
                    sbInput.push(", ");
                }
            } else {
                callbackOpc = " // Optional callback (resp : any) => {}";
            }

            var sb = [];
                sb.push('    '+mySP.nameMethod+'(){\n');
                sb.push('        this.'+nameVariable+'.'+mySP.nameMethod+'('+sbInput.join("")+callback+');'+callbackOpc+'\n');
                sb.push('    }');
            
            return sb.join("");

        }

        private obtenerEntradaImp(typeParam : string){ 
            if(typeParam){
                var params = { 
                    "DATE"      : "\"\"", 
                    "DATETIME"  : "\"\"", 
                    "STRING"    : "\"\"", 
                    "TEXT"      : "\"\"", 
                    "CHARACTER" : "\"\"", 
                    "DECIMAL"   : "0", 
                    "INTEGER"   : "0", 
                    "BIGINTEGER": "0", 
                    "XML"       : "\"\"", 
                    "RESULT"    : "any"
                };
                return params[typeParam];
            }
        }

    public obtenerVistaPreviaRest(resp : buiservicioWebObtener_servicio_web){

		var vista = [];
		
			vista.push("package com.oh.business.service."+resp.paquete+";"+"\n");

			vista.push("import javax.ejb.LocalBean;..."+"\n");
			
			vista.push("@Stateless");
			vista.push("@LocalBean");
			vista.push("@JpoClass(source = \""+resp.origen_datos+"\", oauth2Enable = "+(resp.indicador_oauth2=='1'?'true':'false')+")");
			vista.push("public class "+resp.clase+"Service extends BaseService implements LocalController {"+"\n");
			
			vista.push("	@JpoClass(oauth2Enable = true)");
			vista.push("	public Object procedimientoPrueba(Jpo ppo, HttpServletRequest request) throws Exception {");
			vista.push("		Procedure pResult = ppo.procedure(\"store_dummy\",\""+resp.prefijo+"\");");
			vista.push("		Object ohb_response = pResult.executeL();");
			vista.push("		ppo.commit();");
			vista.push("		return ohb_response;");
			vista.push("	}"+"\n");
				
			vista.push("}");

        return vista.join("\n");
        
    }

}