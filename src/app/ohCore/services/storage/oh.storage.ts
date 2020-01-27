export class ohStorage {

  public has(name : string){
    if(window.localStorage.getItem(name)){
      return true;
    } else {
      return false;
    }
  }

  // For parents object
  public get(name : string){
    var item = localStorage.getItem(name);
    if(typeof(item) != undefined){
      return JSON.parse(localStorage.getItem(name));
    } else {
      return null;
    }
  }

  public set(name : string, data : any){
    window.localStorage.setItem(name, JSON.stringify(data));
  }

  public remove(name : string){
    window.localStorage.removeItem(name);
  }

  // For childrens
  public item(name : string, field : string){
    var obj = this.get(name);
    if(obj){
      return obj[field];
    } else {
      return null;
    }
  }

  public add(name : string, field : string, data : any){
    var temp = this.get(name);
      if(!temp){
        temp = {};
      }
      temp[field] = data;
		this.set(name, temp);
  }

  public subtract(name : string, field : string){
    var temp = this.get(name);
    if(temp){
      delete temp[field];
      this.set(name, temp);
    }
  }

  public exists(name : string, field : string){
    var temp = this.get(name);
    return (temp && temp[field])?true:false;

  }
  
}