export class BUIBuilderUtil {

    // WEV_LIS_AVISO -> wevLisAviso
    public getMethodName(name : string){
        name = name.replace(/\./g, "");
        var parts = name.split("_");
        var finalName = "";
        for(var e = 0 ; e < parts.length; e++) {
            if(e == 0) {
                finalName += parts[e].toLowerCase();
            } else {
                finalName += parts[e].charAt(0).toUpperCase() + parts[e].substring(1).toLowerCase();
            }
        }
        return finalName;
    }

    public firstLower(name : string){
        return name.charAt(0).toLowerCase()+name.substring(1);
    }

    public firstUpper(name : string){
        return name.charAt(0).toUpperCase()+name.substring(1);
    }

    public getModulePrefix(strPackage : string){
        if(strPackage){
            var packTS = strPackage.split("."); // when get module.flw FLW is prefix of view
            if(packTS.length>=2 && packTS[0]=="module"){
                return packTS[1].toUpperCase();
            }
        }
        return null;
    }

    // 5 -> \t\t\t\t\t
    public getT(sep : number){
        var sb = [];
        for(var i = 0; i < sep; i++){
            sb[i] = "    ";
        }
        return sb.join("");
    }

    public getId(id : string){
        if(id.length>0){
            return id.substr(2);
        } else {
            return "";
        }
    }

    public getIdNew(){
        var getChar = {
            '0' : 'a',
            '1' : 'b',
            '2' : 'c',
            '3' : 'd',
            '4' : 'e',
            '5' : 'f',
            '6' : 'g',
            '7' : 'h',
            '8' : 'i',
            '9' : 'j'
        }
        var numbers = ""+Math.round(Math.random()*1000000);
        var id = "p_";
        for(var i = 0; i < numbers.length; i++){
            id += getChar[numbers[i]];
        }

        return id;
    }

    public getNameMethod(event : string){
        return event.substring(0, event.indexOf("(")).trim();
    }
    
    public getParamMethod(event : string){
        var param = [];
        var params = event.substring(event.indexOf("(")+1, event.length - 1);
        if(params.length>0){
            var lParams = params.split(",");
            for(var i = 0 ; i < lParams.length; i++){
                param.push({
                    name : lParams[i].trim(),
                    type : "any"
                });
            }
        }
        return param;
    }

    getFolderTS(procedure : any){
        var preUrl = [];
        if(procedure.prefixModule){
            preUrl.push("module");
            preUrl.push(procedure.prefixModule);
        }
        preUrl.push("service");
        return preUrl.join("/");
    }

    escapeHtml(unsafe : string) {
		return unsafe
			 .replace(/&/g, "&amp;")
			 .replace(/</g, "&lt;")
			 .replace(/>/g, "&gt;")
			 .replace(/"/g, "&quot;")
			 .replace(/'/g, "&#039;");
	 }

}