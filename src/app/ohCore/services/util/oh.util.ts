import { Component, OnInit, Injectable, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

/*
  this.ohService.getOH().getUtil().confirm("Desea ver el ejemplo?",() => {
    alert("se cerro");
  });

  this.ohService.getOH().getUtil().confirm("Desea ver el ejemplo?",() => {
    alert("se cerro");
  },(tipomessage) => {
    alert(tipomessage); // ESC | BACK
  });

  this.ohService.getOH().getUtil().confirm("Desea ver el ejemplo?",() => {
    //alert("se cerro");
  },(tipomessage) => {
    //alert(tipomessage);  ESC | BACK | CLOSE | CANCEL
  }, {
    title : "CLOSE sessión",
    btnAccept : "CLOSE",
    btnAcceptIcon : "fa fa-sign-out",
    btnAcceptBack : "btn btn-outline-danger",
    btnCancel : "Return",
    btnCancelIcon : "fa fa-mail-reply",
    btnCancelBack : "btn btn-outline-dark",
  });
*/
@Component({
  selector: 'oh-confirmationModal',
  templateUrl: './oh.confirmationModal.html'
})
export class ConfirmationModal implements OnInit {

  @Input() options: any;
  _options: any;
  @Input() message: string;

  constructor(public activeModal: NgbActiveModal) {
    this._options = {
      title: "Confirmación",
      btnAccept: "Aceptar",
      btnAcceptIcon: "far fa-hand-point-up",
      btnAcceptBack: "btn btn-success",
      btnCancel: "Retornar",
      btnCancelIcon: "fas fa-reply",
      btnCancelBack: 'btn btn-outline-info'
    }
  }

  ngOnInit() {
    if (!this.options) {
      this.options = {};
    }
    Object.assign(this._options, this.options);
  }

  ngAfterViewInit() {
    document.getElementById("btn_confirm").focus();
  }

}

@Injectable()
export class Util {

  CONFIRM_ESC: string = "ESC";
  CONFIRM_BACK: string = "BACK";
  CONFIRM_CLOSE: string = "CLOSE";
  CONFIRM_CANCEL: string = "CANCEL";

  constructor(private servicioModal: NgbModal) { };

  confirm(message: string, callOk: Function, callReturn?: Function, options?: any) {

    const modalRef = this.servicioModal.open(ConfirmationModal);
    modalRef.componentInstance.options = options;
    modalRef.componentInstance.message = message;
    modalRef.result.then((result) => {
      if (result == "ACCEPT") {
        callOk(true);
      } else {
        if (callReturn) {
          callReturn(result);
        }
      }
    }, (reason) => {
      if (callReturn) {
        callReturn(this.getDismissReason(reason));
      }
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'BACK';
    } else {
      return reason;
    }
  }

  // ["A","B","C"] => {0 : "A",1 : "B",1 : "C"}
  private listToObject(fields: any) {
    let fieldsInd = {};
    if (fields) {
      for (var ind in fields) {
        fieldsInd[ind] = fields[ind];
      }
    }
    return fieldsInd;
  }

  // 1er. [[123,"ABC"],[456,"DEF"]] , ["codigo","nombre"] => [{codigo : 123,nombre : "ABC"},{codigo : 456,nombre : "DEF"}]
  // 2do. [[123,"abc",true],[[4,"a"],[5,"b"],[6,"c"]]] , [["codigo","nombre","estado"],["codigo","valor"]] => 
  // [{codigo : 123,nombre : "ABC",estado : true},[{codigo : 4,valor : "a"},{codigo : 5,valor : "b"},{codigo : 6,valor : "c"}]]
  // 3ro. ["YG4409", "201", "S.A."], ["plate", "companyId", "name"] => {plate : YG4409, companyId : "201", name : "S.A."}
  public getObjet(list: any, fields: any) {
    let entity: any, result: any;
    if (list) {
      if (typeof (list.length) == "number" && list.length == 0) {
        return null;
      }
      if (!this._hasChildList(fields)) {
        if (this._hasChildList(list)) { // Fixed for arrays
          result = this._getlistsToObjets(list, fields);
        } else {
          result = this._getlistToObjet(list, fields);
        }
      } else {
        result = [];
        for (var i in fields) {
          if (list[i]) {
            if (this._hasChildList(list[i])) {
              result[i] = this._getlistsToObjets(list[i], fields[i]);
            } else {
              result[i] = this._getlistToObjet(list[i], fields[i]);
            }
          } else {
            result[i] = {};
          }
        }
      }
    }
    return result;
  }

  // [1,"inlandnet","Portal"] // false
  // [[1,"b"],[2,"c"]] // true
  private _hasChildList(list: any) { // Si algun atributo es lista retorna true
    return (typeof (list[0]) == "object") ? true : false;
  }

  // [123,"ABC"] , ["codigo","nombre"] => {codigo : 123,nombre : "ABC"}
  private _getlistToObjet(list: any, fields: any) {
    let entity: any = {};
    for (var e = 0; e < list.length; e++) {
      entity[fields[e]] = list[e];
    }
    return entity;
  }

  // [[123,"ABC"],[456,"DEF"]] , ["codigo","nombre"] => [{codigo : 123,nombre : "ABC"},{codigo : 456,nombre : "DEF"}]
  private _getlistsToObjets(list: any, fields: any) {
    let result: any = [];
    for (var i = 0; i < list.length; i++) {
      result.push(this._getlistToObjet(list[i], fields));
    }
    return result;
  }

  // [{codigo : 123,nombre : "ABC"},{codigo : 456,nombre : "DEF"}] => [[123,"ABC"],[456,"DEF"]] , ["codigo","nombre"]
  public getlist(objetos: any) {
    let items: any, result: any;
    if (objetos) {
      result = [];
      for (let objeto of objetos) {
        items = [];
        for (let item in objeto) {
          items.push(objeto[item]);
        }
        result.push(items);
      }
    }
    return result;
  }

  // (firstDate, AnotherDate) => Return difference in text description like 2 minutes, 10 Hours
  public getDateDesc(serverDate: Date, itemDate: Date) {

    if (serverDate != null && itemDate != null) {

      if (typeof (serverDate) == "number") {
        serverDate = new Date(serverDate);
      }
      if (typeof (itemDate) == "number") {
        itemDate = new Date(itemDate);
      }

      let diff = (serverDate.getTime() - itemDate.getTime()) / 1000;

      if (diff < 3600) {
        return Math.floor((diff / 60) * 100) / 100 + " Minutos";
      } else if (diff < 86400) {
        return Math.floor((diff / (60 * 60)) * 100) / 100 + " Horas";
      } else if (diff < 86400 * 30) {
        return Math.floor((diff / (60 * 60 * 24)) * 100) / 100 + " Días";
      } else if (diff < 86400 * 30 * 12) {
        return Math.floor((diff / (60 * 60 * 24 * 30)) * 100) / 100 + " Meses";
      } else {
        return Math.floor((diff / (60 * 60 * 24 * 30 * 12)) * 100) / 100 + " Años";
      }
    }
  }

  // (firstDate, AnotherDate, limitLightInfo, limitLightWarning) 
  // => Return icon css style if difference of dates is between the limits values
  // like Fri Feb 16 2018 09:27:46, Fri Feb 16 2018 09:30:46 difference 3 minutos 
  // limitInfo 10 minutes, limitWarning 15 minutes, 3 is between 0 an 10 so is Info
  public getLight(serverDate: Date, itemDate: Date, milW: number, milD: number) {
    if (serverDate != null && itemDate != null) {

      if (typeof (serverDate) == "number") {
        serverDate = new Date(serverDate);
      }
      if (typeof (itemDate) == "number") {
        itemDate = new Date(itemDate);
      }

      let diff = (serverDate.getTime() - itemDate.getTime()) / 1000;

      if (diff < milW) {
        return "badge badge-info"; // badge-success
      } else if (diff > milW && diff < milD) {
        return "badge badge-warning";
      } else {
        return "badge badge-danger";
      }
    }
  }

  public containExact(text: string, searches: any) {
    if (typeof (searches) == "string") {
      return (text.indexOf(text) !== -1) ? true : false;
    } else if (typeof (searches) == "object") {
      let indic = 0;
      for (var i in searches) {
        if (text.indexOf(searches[i]) !== -1) {
          indic++;
        }
      }
      return (indic > 0) ? true : false;
    } else {
      return false;
    }
  }

  public contain(text: string, searches: any) {
    if (typeof (searches) == "string") {
      searches = searches.toLowerCase();
    } else if (typeof (searches) == "object") {
      for (var i in searches) {
        searches[i] = searches[i].toLowerCase();
      }
    }
    return this.containExact(text.toLowerCase(), searches);
  }

  public isDate(date: any) {
    return Object.prototype.toString.call(date) === '[object Date]' ? true : false;
  }

  base64strToBlog(b64Data, contentType?, sliceSize?) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  public pad(s) { return (s < 10) ? '0' + s : s; }

  public dateToString(inputFormat) {
    if (inputFormat) {
      var d = (typeof (inputFormat) == "string") ? new Date(inputFormat) : inputFormat;
      return [this.pad(d.getDate()), this.pad(d.getMonth() + 1), d.getFullYear()].join('/');
    } else {
      return null;
    }
  }

  public dateToStringTwo(inputFormat) {
    if (inputFormat) {
      var d = (typeof (inputFormat) == "string") ? new Date(inputFormat) : inputFormat;
      return [d.getFullYear(), this.pad(d.getMonth() + 1), this.pad(d.getDate())].join('-');
    } else {
      return null;
    }
  }

  public dateTimeToString(inputFormat) {
    if (inputFormat) {
      var d = (typeof (inputFormat) == "string") ? new Date(inputFormat) : inputFormat;
      return [this.pad(d.getDate()), this.pad(d.getMonth() + 1), d.getFullYear()].join('/') + " " + [this.pad(d.getHours()), this.pad(d.getMinutes()), this.pad(d.getSeconds())].join(':');
    } else {
      return null;
    }
  }


  public dateNgbToString(d: any) {
    if (d) {
      return [this.pad(d.day), this.pad(d.month), d.year].join('/');
    } else {
      return null;
    }
  }

  public dateToNgb(d: any) {
    if (d) {
      d = (typeof (d) == "string") ? new Date(d) : d;
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate()
      };
    } else {
      return null;
    }
  }

  // ("dd/mm/yyyy" or "dd-mm-yyyy") to {year:,month:,day:}
  public dateToNgbTwo(d: any) {
    if (d && typeof (d) == "string") {
      if (d.indexOf('-') != -1) {
        d = new Date(d);
      } else {
        let dateParts: any = d.split("/");
        d = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      }
      return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate()
      };
    } else {
      return null;
    }
  }

  public round(value: number, precition?: number) {
    if (value) {
      if (!precition) {
        precition = 2;
      }
      return Math.round(value * Math.pow(10, precition)) / Math.pow(10, precition);
    } else {
      return 0;
    }
  }

  public objectIdToStringJoin(cabeceras: any): string {
    var padres = [];
    for (var key in cabeceras) {
      padres.push(key);
    }
    return padres.join();
  }

  public getCatalog(catalogos: any, cabeceras: any): any {
    var catalogoFormat = {};
    for (var keyA in cabeceras) {
      var temp1 = [];
      for (var keyB in catalogos) {
        if (keyA == catalogos[keyB].catalogo_padre_id) {
          temp1.push({
            id: catalogos[keyB].catalogo_id,
            value: catalogos[keyB].descripcion
          });
        }
        catalogoFormat[cabeceras[keyA]] = temp1;
      }
    }
    return catalogoFormat;
  }

  // [{id: 1, idUN: 1}, {id: 2, idUN: 2}, {id: 3, idUN: 2}] ->
  public getJoinFielByFind(items: any, joinField: string, searchField: string, search: any): string {
    var filtered = items.filter(item => item[searchField] == search);
    var keys = [];
    for (var key in filtered) {
      keys.push(filtered[key][joinField]);
    }
    return keys.join();
  }

  // name : string (title) , obj =  {}

  public getXMLString(elements: any, name: string) {
    var xmls = [];
    elements.forEach(element => {
      xmls.push(this.titleXML(name, element));
    });
    return xmls.join("");
  }

  public titleXML(name: any, obj: any) {
    var xml = '';
    xml += "<" + name + ">";
    xml += this.objectToXml(obj);
    xml += "</" + name + ">";
    return xml;
  }

  public objectToXml(obj: any) {
    var xml = '';

    for (var prop in obj) {
      if (!obj.hasOwnProperty(prop)) {
        continue;
      }

      if (obj[prop] == undefined)
        continue;

      xml += "<" + prop + ">";
      if (typeof obj[prop] == "object")
        xml += this.objectToXml(new Object(obj[prop]));
      else
        xml += obj[prop];

      xml += "</" + prop + ">";
    }
    return xml;
  }

  public dateToFormatParticular(d: any) {
    var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

    return d.day + " " + months[d.month - 1] + " " + d.year

  }

  public listToIndex(list: any, by: string, field: string) {
    var newObject = {};
    for (var i in list) {
      newObject[list[i][by]] = list[i][field];
    }
    return newObject;
  }

  public paginateArray(array, page_size, page_number) {
    --page_number;
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
  }

  public StringXMLtoJSON(xml: string) {
    var getxml = new DOMParser();
    var xmlDoc = getxml.parseFromString(xml, "text/xml");
    var json_str = this.jsontoStr(this.setJsonObj(xmlDoc));
    return JSON.parse(json_str);
  }

  public StringXMLtoJSONList(xml: string) {
    var lista = [];
    if(xml){
      let base = "data";
      var objeto = this.StringXMLtoJSON("<"+base+">"+xml+"</"+base+">");
      if(!(objeto[base].row.length>=0)){
        objeto[base].row = [objeto[base].row];
      }
      for(var item of objeto[base].row){
        var lista_elemento = {};
        for(var element in item){
          lista_elemento[element] = item[element]["#text"];
        }
        lista.push(lista_elemento);
      }
    }
    return lista;
  }

  

  // converts JSON object to string (human readablle).
  // Removes '\t\r\n', rows with multiples '""', multiple empty rows, '  "",', and "  ",; replace empty [] with ""
  private jsontoStr(js_obj) {
    var rejsn = JSON.stringify(js_obj, undefined, 2).replace(/(\\t|\\r|\\n)/g, '').replace(/"",[\n\t\r\s]+""[,]*/g, '').replace(/(\n[\t\s\r]*\n)/g, '').replace(/[\s\t]{2,}""[,]{0,1}/g, '').replace(/"[\s\t]{1,}"[,]{0,1}/g, '').replace(/\[[\t\s]*\]/g, '""');
    return (rejsn.indexOf('"parsererror": {') == -1) ? rejsn : 'Invalid XML format';
  }

  // receives XML DOM object, returns converted JSON object
  private setJsonObj(xml) {
    var js_obj = {};
    if (xml.nodeType == 1) {
      if (xml.attributes.length > 0) {
        js_obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          js_obj["@attributes"][attribute.nodeName] = attribute.value;
        }
      }
    } else if (xml.nodeType == 3) {
      js_obj = xml.nodeValue;
    }
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof (js_obj[nodeName]) == "undefined") {
          js_obj[nodeName] = this.setJsonObj(item);
        } else {
          if (typeof (js_obj[nodeName].push) == "undefined") {
            var old = js_obj[nodeName];
            js_obj[nodeName] = [];
            js_obj[nodeName].push(old);
          }
          js_obj[nodeName].push(this.setJsonObj(item));
        }
      }
    }
    return js_obj;
  }

  public getUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public getJSONtoFile(json_texto: any, nombre_archivo?: string) {
    var f_blob = new Blob([JSON.stringify(json_texto)], { type: "application/json" });
    return new File([f_blob], ((nombre_archivo) ? nombre_archivo : "archivo"));
  }

}