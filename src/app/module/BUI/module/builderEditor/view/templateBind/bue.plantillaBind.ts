import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var JSONEditor: any;

@Component({
	selector: 'bue-plantillaBind',
	templateUrl: './bue.plantillaBind.html',
	styleUrls: ['./bue.plantillaBind.css']
})
export class BUEPlantillaBind {
	
	@Input() design: any;

	@ViewChild('modEntities', { static: true }) modalEntitie : ElementRef;
	@ViewChild('modEntitiesEditor', { static: true }) modalEntitieEditor : ElementRef;
	@ViewChild('modMethods', { static: true }) modalMethod : ElementRef;
	@ViewChild('modServices', { static: true }) modalServiceR : ElementRef;
	@ViewChild('modPredefined', { static: true }) modalPredefined : ElementRef;
	
	ohbOptions : any;
	
	entities : any;
	entitie : any;
	entitieSelected : number;

	method : any;
	methodSelected : number;
	
	services : any;
	service : any;
	serviceSelected : number;
	serviceList : any;

	predefined : any;
	predefinedSelected : number;
	
	constructor(private modalService: NgbModal){
		
		this.ohbOptions = {};
		this.ohbOptions['dataTypes'] = [{id : "number", desc : "Numérico"}, {id : "string", desc : "Texto"}, {id : "boolean", desc : "Booleano"}, {id : "Date", desc : "Fecha"}, {id : "any", desc : "Objeto"}];
		this.ohbOptions['services'] = [{id : "ohService", desc : "OHService"}, {id : "router", desc : "Router"}, {id : "modalService", desc : "NgbModal"}];
		this.ohbOptions['predefineds'] = [{id : "ngOnInit", desc : "ngOnInit"}];
		this.ohbOptions['_option'] = [{id : "1", desc : "Si"}, {id : "0", desc : "No"}];
		
		//this.entities = [];
		this.entitie = {};
		this.entitieSelected = -1;
		
		this.service = {};
		this.predefined = {};

		this.method = {
			params : []
		};
		
	}

	ngOnInit(){
	}

	ngAfterViewInit(){
	}

	getParams(index : number){
		var params = this.design.bind.methods[index].params;
		var outs = "";
		for(var i = 0; i < params.length; i++){
			outs += params[i].name+", ";
		}
		return outs.substring(0, outs.length - 2);
	}


	entitieDelete(index : number){
		this.design.bind.entities.splice(index, 1);
	}
	entitieEdit(index : number){
		this.entitieSelected = index;
		this.entitie = Object.assign({}, {}, this.design.bind.entities[index]);
		this.entitieOpenModa();
	}
	entitieNew(){
		this.entitieSelected = -1;
		this.entitie = {
			isList : false,
			isInput : false,
			isOutput : false
		};
		this.entitieOpenModa();
	}
	entitieOpenModa(){
		this.modalService.open(this.modalEntitie).result.then((result) => {
			if(result == "save"){
				if(this.entitieSelected>=0){
					this.design.bind.entities[this.entitieSelected] = Object.assign({}, this.entitie);
					this.entitieSelected = -1;
				} else {
					this.design.bind.entities.push(Object.assign({}, this.entitie));
				}
				this.design.bind.entities.sort((a, b) => { return (a.name>b.name)?1:((a.name<b.name)?-1:0);});
			} else {
				if(this.entitieSelected>=0){
					this.entitieSelected = -1;
				}
			}
		}, (reason) => {
			this.entitieSelected = -1;
		});
	}

	iterarObjeto(objeto : any){
		//var obj = Array.isArray(objeto)?[]:{};
		var obj = {};
		var objInfo = Array.isArray(objeto)?objeto[0]:objeto;

		for(var i in objInfo){
			if(typeof(objInfo[i])=="string"){
				switch(objInfo[i]){
					case "string" 	: obj[i] = "prueba"; break;
					case "number" 	: obj[i] = 123; break;
					case "boolean" 	: obj[i] = true; break;
					case "Date" 	: obj[i] = "2019-02-26T15:04:56.893Z"; break;
				}
			} else {
				obj[i] = this.iterarObjeto(objInfo[i]);
			}
		}

		return Array.isArray(objeto)?[obj]:obj;
	}

	entitieLimpiar(){
		this.entitie.value = null;
	}

	entitieInicializar(){
		var jsonToEdit = JSON.parse(this.entitie.definition || "{}");
		this.entitie.value = JSON.stringify(this.iterarObjeto(jsonToEdit));
		this.entitieAbrirEditor("value");
	}

	entitieAbrirEditor(type : string){

		var jsonEdit : any;
		var jsonToEdit = JSON.parse(this.entitie[type] || "{}");

		this.modalService.open(this.modalEntitieEditor, {size : 'lg'}).result.then((result) => {
			if(result == "save"){
				this.entitie[type] = JSON.stringify(jsonEdit.get());
			}
		}, (reason) => {
		});

		setTimeout(() => {
			var jsoneditorDiv = document.getElementById("jsoneditor");
			jsonEdit = new JSONEditor(jsoneditorDiv, {modes : ["tree","view","code","text"]});
			jsonEdit.set(jsonToEdit);
		});
		
	}

	methodOpen(){
		this.method = {
			params : []
		};
		this.methodOpenModa();
	}
	methodDelete(index : number){
		this.design.bind.methods.splice(index, 1);
	}
	methodEdit(index : number){
		this.methodSelected = index;
		this.method = Object.assign({}, {}, this.design.bind.methods[index]);
		this.methodOpenModa();
	}
	methodOpenModa(){
		this.modalService.open(this.modalMethod, {size : 'lg'}).result.then((result) => {
			if(result == "save"){
				if(this.methodSelected>=0){
					this.design.bind.methods[this.methodSelected] = Object.assign({}, this.method);
					this.methodSelected = -1;
				} else {
					this.design.bind.methods.push(Object.assign({}, this.method));
				}
				this.design.bind.methods.sort((a, b) => { return (a.name>b.name)?1:((a.name<b.name)?-1:0);});
			} else {
				if(this.methodSelected>=0){
					this.methodSelected = -1;
				}
			}
		}, (reason) => {
			this.methodSelected = -1;
		});
	}
	methodAddAtribute(){
		this.method.params.push({
			//name : "",
			//type : ""
		});
	}


	getService(service : string){
		var objSerice = this.ohbOptions['services'].filter(item => item.id == service);
		return objSerice[0].desc;
	}
	serviceOpen(){
		this.service = {};
		this.serviceOpenModa();
	}
	serviceDelete(index : number){
		this.design.bind.services.splice(index, 1);
	}
	serviceEdit(index : number){
		this.serviceSelected = index;
		this.service = Object.assign({}, {}, this.design.bind.services[index]);
		this.serviceOpenModa();
	}
	serviceOpenModa(){
		this.modalService.open(this.modalServiceR).result.then((result) => {
			if(result == "save"){
				if(this.serviceSelected>=0){
					this.design.bind.services[this.serviceSelected] = Object.assign({}, this.service);
					this.serviceSelected = -1;
				} else {
					this.design.bind.services.push(Object.assign({}, this.service));
				}
				this.design.bind.services.sort((a, b) => { return (a.name>b.name)?1:((a.name<b.name)?-1:0);});
			} else {
				if(this.serviceSelected>=0){
					this.serviceSelected = -1;
				}
			}
		}, (reason) => {
			this.serviceSelected = -1;
		});
	}

	
	predefinedOpen(){
		this.predefined = {};
		this.predefinedOpenModa();
	}
	predefinedDelete(index : number){
		this.design.bind.predefineds.splice(index, 1);
	}
	predefinedEdit(index : number){
		this.predefinedSelected = index;
		this.predefined = Object.assign({}, {}, this.design.bind.predefineds[index]);
		this.predefinedOpenModa();
	}
	predefinedOpenModa(){
		this.modalService.open(this.modalPredefined).result.then((result) => {
			if(result == "save"){
				if(this.predefinedSelected>=0){
					this.design.bind.predefineds[this.predefinedSelected] = Object.assign({}, this.predefined);
					this.predefinedSelected = -1;
				} else {
					this.design.bind.predefineds.push(Object.assign({}, this.predefined));
				}
				this.design.bind.predefineds.sort((a, b) => { return (a.name>b.name)?1:((a.name<b.name)?-1:0);});
			} else {
				if(this.predefinedSelected>=0){
					this.predefinedSelected = -1;
				}
			}
		}, (reason) => {
			this.predefinedSelected = -1;
		});
	}

}