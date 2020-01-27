export class Rules {

  // Inlandnet - Preferencias - Desabilitar roles para la modificación de empresa y RUC
  disableEditCompany(roles : any, rolesId : any){
    var indexRol = {};
    for(var i in rolesId){
      indexRol[rolesId[i]] = true;
    }
    for(var i in roles){
      if(indexRol[roles[i].id]){
        return true;
      }
    }
    return false;
  }

}