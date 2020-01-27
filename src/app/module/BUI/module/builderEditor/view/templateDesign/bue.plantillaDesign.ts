import { Component, HostListener, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchModal } from 'src/app/ohCore/components/searchSensitive/oh.searchModal';

declare var JSONEditor: any;

@Component({
	selector: 'bue-plantillaDesign',
	templateUrl: './bue.plantillaDesign.html'
})
export class BUEPlantillaDesign {
	
	@Input() design: any;

	@Output() onDeleteItem : EventEmitter<any>;
	@ViewChild('modBuscar', { static: true }) modalBuscar : ElementRef;
	@ViewChild('modEntitiesNew', { static: true }) modalEntitiesNew : ElementRef;
	
	spacingType : any;
	spacingArea : any;
	spacingSize : any;
	vistaResponsiva : any;
	keyType : any;
	keyButton : any;
	
	constructor(private modalService: NgbModal){

		this.onDeleteItem  = new EventEmitter<any>();

		this.spacingType = [];
		this.spacingType.push({ type : "m", name : "Margen" });
		this.spacingType.push({ type : "p", name : "Relleno" });

		this.spacingArea = [];
		this.spacingArea.push({ type : "t", name : "fas fa-arrow-up" });
		this.spacingArea.push({ type : "b", name : "fas fa-arrow-down" });
		this.spacingArea.push({ type : "l", name : "fas fa-arrow-left" });
		this.spacingArea.push({ type : "r", name : "fas fa-arrow-right" });
		this.spacingArea.push({ type : "y", name : "fas fa-arrows-alt-h" });
		this.spacingArea.push({ type : "x", name : "fas fa-arrows-alt-v" });
		this.spacingArea.push({ type : "",  name : "fas fa-arrows-alt" });

		this.spacingSize = [];
		this.spacingSize.push({ type : "0", name : "0 - 0rem" });
		this.spacingSize.push({ type : "1", name : "1 - 0.25rem" });
		this.spacingSize.push({ type : "2", name : "2 - 0.5rem" });
		this.spacingSize.push({ type : "3", name : "3 - 1rem" });
		this.spacingSize.push({ type : "4", name : "4 - 1.5rem" });
		this.spacingSize.push({ type : "5", name : "5 - 3rem" });
		this.spacingSize.push({ type : "auto", name : "Auto" });

		this.vistaResponsiva = [];
		this.vistaResponsiva.push({ clase : "", nombre : "" });
		this.vistaResponsiva.push({ clase : "vistaA", nombre : "Solo movil" });
		this.vistaResponsiva.push({ clase : "vistaB", nombre : "Solo tablet" });
		this.vistaResponsiva.push({ clase : "vistaC", nombre : "Solo escritorio" });
		this.vistaResponsiva.push({ clase : "vistaAB", nombre : "movil y tablet" });
		this.vistaResponsiva.push({ clase : "vistaBC", nombre : "tablet y escritorio" });

		this.keyType = [];
		this.keyType.push({ tipo : "", nombre : "" });
		this.keyType.push({ tipo : "keydown", nombre : "Tecla abajo" });
		this.keyType.push({ tipo : "keypress", nombre : "Precionadoo movil" });
		this.keyType.push({ tipo : "keyup", nombre : "Tecla arriba" });

		this.keyButton = [];
		this.keyButton.push({ boton : "", nombre : "" });
		this.keyButton.push({ boton : "enter", nombre : "Enter" });
		this.keyButton.push({ boton : "esc", nombre : "Escape" });
		this.keyButton.push({ boton : "control", nombre : "Control" });
		this.keyButton.push({ boton : "alt", nombre : "Alt" });
		this.keyButton.push({ boton : "shift", nombre : "Shift" });
		this.keyButton.push({ boton : "tab", nombre : "Tab" });
		this.keyButton.push({ boton : "backspace", nombre : "Backspace" });

	}

	checkTableItem(tableItem : any, selectedItem : any){
		for(var i = 0; i < tableItem.config.rows.length; i++){
			if(tableItem.config.rows[i].selectedHead){
				this.checkItem(tableItem.config.rows[i].selectedHead.content, selectedItem);
			}
			if(tableItem.config.rows[i].selectedBody){
				this.checkItem(tableItem.config.rows[i].selectedBody.content, selectedItem);
			}
			if(tableItem.config.rows[i].selectedFooter){
				this.checkItem(tableItem.config.rows[i].selectedFooter.content, selectedItem);
			}
		}
	}

	checkItem(content : any, selectedItem : any){
		for(var i = 0; i < content.length; i++){
			if(content[i] == selectedItem){
				content.splice(i, 1);
				delete this.design.selectedItem;
				break;
			}
			if(content[i].selected){
				this.checkItem(content[i].selected.content, selectedItem);
			}
			if(content[i].hasChildSelected){
				this.checkTableItem(content[i], selectedItem);
			}
		}
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		if(event.key=="Delete"){
			var oldItem = Object.assign({}, {}, this.design.selectedItem);
			this.checkItem(this.design.content, this.design.selectedItem);
			this.onDeleteItem.emit(oldItem);
		}
	}

	deleteElement(){
		var oldItem = Object.assign({}, {}, this.design.selectedItem);
		this.checkItem(this.design.content, this.design.selectedItem);
		this.onDeleteItem.emit(oldItem);
	}

	addSpace(){
		if(!this.design.selectedItem.spacing){
			this.design.selectedItem.spacing = [];
		}
		this.design.selectedItem.spacing.push({
			type : "",
			area : "",
			size : null
		});
	}

	deleteSpace(index : number){
		this.design.selectedItem.spacing.splice(index, 1);
	}

	private hasClass(el: any, name: string) {
		return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
	}

	private removeClass(el: any, name: string) {
		if (this.hasClass(el, name)) {
		  el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
		}
	}

	closeConfig(){
		var elems = document.getElementsByClassName("oh_editor_compSelected");
		for (var i = 0; i < elems.length; ++i) {
			this.removeClass(elems[i], "oh_editor_compSelected");
		}
		delete this.design.selectedItem;
	}
	
	entiBuscar : any;
	
	forParentConfig : any;

	buscarBind(event : any){

		this.forParentConfig = null;
		this.checkParentBind(this.design.content, this.design.selectedItem, null);
		this.mapearEntidades();

		if(event.tipo=='array' || event.tipo=="item"){

			if(event.subTipo){
				this.entiBuscar = this.entiBuscar.filter(it => it.typeEnt == event.tipo && it.typeVariable == event.subTipo);
			} else {
				this.entiBuscar = this.entiBuscar.filter(it => it.typeEnt == event.tipo);
			}

		}

		const modalRef = this.modalService.open(SearchModal);
			  modalRef.componentInstance.title = "titulo";
			  modalRef.componentInstance.search = this.entiBuscar;
			  modalRef.componentInstance.searchBy = "valor";
		if(this.forParentConfig){
			modalRef.componentInstance.prefilter = this.forParentConfig.value;
		}
		modalRef.result.then((result) => {

			if(result){

				var jerarq = event.campo.split(".");

				if(jerarq.length == 1){

					if(event.bindTipo && event.bindTipo=="tabla"){
						this.design.selectedItem.config[event.campo]['item'] = "item";
						this.design.selectedItem.config[event.campo]['value'] = result.id;
						this.design.selectedItem.config[event.campo]['index'] = "i";
					} else {
						this.design.selectedItem.config[event.campo] = result.id;
					}
					this.design.selectedItem.config[event.campo+"Binded"] = result.id;

				} else {
					var finalBind = this.design.selectedItem.config;
					var value = jerarq[jerarq.length-1];
					for(var i = 0 ; i < jerarq.length-1 ; i++){
						finalBind = finalBind[jerarq[i]];
					}

					if(event.bindTipo && event.bindTipo=="tabla"){
						finalBind[event.campo]['item'] = "item";
						finalBind[event.campo]['value'] = result.id;
						finalBind[event.campo]['index'] = "i";
					} else {
						finalBind[value] = result.id;
					}
					
					finalBind[value+"Binded"] = result.id;
				}

			}
		}, (reason) => {
			console.log(reason);
		});

	}

		private checkParentBind(content : any, selectedItem : any, baseContent : any){
			for(var i = 0; i < content.length; i++){
				var itemEditor = content[i];
				if(itemEditor == selectedItem && baseContent != null){
					if(baseContent.config.for && baseContent.config.for.value.length>0 && baseContent.config.for.item.length>0){
						this.forParentConfig = baseContent.config.for;
					}
					break;
				}
				if(itemEditor.selected){
					this.checkParentBind(itemEditor.selected.content, selectedItem, itemEditor);
				}
				if(itemEditor.hasChildSelected){
					for(var e = 0; e < itemEditor.config.rows.length; e++){
						if(itemEditor.config.rows[e].selectedHead){
							this.checkParentBind(itemEditor.config.rows[e].selectedHead.content, selectedItem, itemEditor);
						}
						if(itemEditor.config.rows[e].selectedBody){
							this.checkParentBind(itemEditor.config.rows[e].selectedBody.content, selectedItem, itemEditor);
						}
						if(itemEditor.config.rows[e].selectedFooter){
							this.checkParentBind(itemEditor.config.rows[e].selectedFooter.content, selectedItem, itemEditor);
						}
					}
				}
			}
		}

		private mapearEntidades(){
			this.entiBuscar = [];
			
			for(var i in this.design.bind.entities){
				var ent = this.design.bind.entities[i];
				if(ent.type!='any'){
					this.entiBuscar.push({
						id : ent.name,
						valor : "this."+ent.name+" <"+ent.type+">",
						typeEnt : "item",
						typeVariable : ent.type
					});
				} else {

					var hijo = JSON.parse(ent.definition || "{}");
					var opcTag = null;
					var opcIndex = "i";
					var myBase = "";
					if(this.forParentConfig && ent.name == this.forParentConfig.value){
						myBase = this.forParentConfig.item;
						opcTag = this.forParentConfig.item;
						opcIndex = this.forParentConfig.index;
					} else {
						//myBase = ent.name+(Array.isArray(hijo)?"["+opcIndex+"]":"");
						myBase = ent.name;
					}

					var valor = "this."+ent.name;
					this.entiBuscar.push({
						id : myBase,
						valor : valor+(Array.isArray(hijo)?"[]":"{}"),
						tag : opcTag,
						typeEnt : Array.isArray(hijo)?"array":"item",
						typeVariable : ent.type
					});
					this.mapearObjeto(myBase, valor, hijo, opcTag);
				}
			}
		}

		private mapearObjeto(idBase : string, valorBase : string, hijo : any, tag : string){
			if(Array.isArray(hijo) && hijo.length>0){
				hijo = hijo[0];
			}
			for(var elem in hijo){
				var tipo = hijo[elem];
				if(Array.isArray(tipo)){
	
					var opcTag = null;
					var opcIndex = "i";
					var myBase = "";
					if(this.forParentConfig && idBase+"."+elem == this.forParentConfig.value){
						myBase = this.forParentConfig.item;
						opcTag = this.forParentConfig.item;
						opcIndex = this.forParentConfig.index;
					} else {
						myBase = idBase+"."+elem+"[i]";
					}
	
					this.entiBuscar.push({
						id : idBase+"."+elem,
						valor : valorBase+"."+elem+"[]",
						typeEnt : "array",
						tag : tag || null
					});
					this.mapearObjeto(myBase, valorBase+"."+elem+"[i]", tipo, opcTag);
				} else if(typeof(tipo)=="object"){
					var myBase = idBase+"."+elem;
					var valor = valorBase+"."+elem;
					this.entiBuscar.push({
						id : myBase,
						valor : valor+"{}",
						typeEnt : "item"
					});
					this.mapearObjeto(myBase, valor, tipo, null);
				} else {
					this.entiBuscar.push({
						id : idBase+"."+elem,
						valor : valorBase+"."+elem+" <"+tipo+">",
						typeEnt : "item",
						tag : tag || null
					});
				}
			}
		}
	
	nuevoBind(event : any){

		if(event.tipo=="opcion" || event.tipo=="tabla"){
			this.nuevoBindModal(event);
		} else if(event.tipo=="porId"){
			this.nuevoBindPorId(event);
		}
		
	}

		private nuevoBindPorId(event : any){
		
			if(event.tipo=="porId"){

				if(event.entidad){
					var encontro = false;
					for(var i in this.design.bind.entities){
						var entitie = this.design.bind.entities[i];
						if(entitie._id && entitie._id == event.entidad._id){
							entitie.name = event.entidad.name;
							entitie.decorador_id = event.entidad.decorador_id;
							entitie.definition = event.entidad.definition;
							encontro = true;
							break;
						}
					}

					if(!encontro){
						this.design.bind.entities.push(event.entidad);
					}
				}

				if(event.metodo){
					var encontro = false;
					for(var i in this.design.bind.methods){
						var method = this.design.bind.methods[i];
						if(method._id && method._id == event.metodo._id){
							method.name = event.metodo.name;
							method.value = event.metodo.value;
							encontro = true;
							break;
						}
					}

					if(!encontro){
						this.design.bind.methods.push(event.metodo);
					}
				}
				
			}

		}

		nuevoEnlace : any;
		tipoEnlace : string;
		private nuevoBindModal(event : any){

			this.nuevoEnlace = "";

			var nuevoValor = [];

			if(event.tipo=="opcion"){
				this.tipoEnlace = "opcion";
				nuevoValor = [
					{
						id : 1,
						value : "Valor 1"
					},
					{
						id : 2,
						value : "Valor 2"
					}
				];
			} else if(event.tipo=="tabla"){
				this.tipoEnlace = "tabla";
				nuevoValor = [
					{
						id : 1,
						campo : "Campo 1"
					},
					{
						id : 2,
						campo : "Campo 2"
					}
				];
			}

			var jsonEdit : any;

			this.modalService.open(this.modalEntitiesNew, {size : 'lg'}).result.then((result) => {
				if(result == "save"){

					if(!event.tipo || event.tipo=="opcion"){

						var ohbData = this.design.bind.entities.find(item => item.name == "ohbData");
						if(!ohbData){
							this.design.bind.entities.push({
								name : "ohbData",
								type : "any",
								value : "{}",
								isList : false,
								isInput : false,
								isOutput : false,
								definition : '{}'
							});
							ohbData = this.design.bind.entities.find(item => item.name == "ohbData");
						}
		
						var ohbDataValue = JSON.parse(ohbData.value);
						ohbDataValue[this.nuevoEnlace] = jsonEdit.get();
		
						var ohbDataDefinition = JSON.parse(ohbData.definition);
							ohbDataDefinition[this.nuevoEnlace] = [
								{
									"id": "number",
									"nombre": "string"
								}
							];
		
						ohbData.value = JSON.stringify(ohbDataValue);
						ohbData.definition = JSON.stringify(ohbDataDefinition);
		
						this.design.selectedItem.config[event.campo] = "ohbData."+this.nuevoEnlace;
						this.design.selectedItem.config[event.campo+"Binded"] = "ohbData."+this.nuevoEnlace;

					} else if(event.tipo=="tabla"){

						var valorJson = jsonEdit.get();
						var definitJson = [];

						if(valorJson.length>0){
							var defJson = {};
							for(var variable in valorJson[0]){

								var tipoVar = ""+typeof(valorJson[0][variable]);
								if(tipoVar != "number" && tipoVar != "string"){
									tipoVar = "any";
								}

								defJson[variable] = tipoVar;
							}

							definitJson.push(defJson);
						}
						
						this.design.bind.entities.push({
							name : this.nuevoEnlace,
							type : "any",
							value : JSON.stringify(valorJson),
							isList : false,
							isInput : false,
							isOutput : false,
							definition : JSON.stringify(definitJson)
						});

						this.design.selectedItem.config[event.campo]['item'] = "item";
						this.design.selectedItem.config[event.campo]['value'] = this.nuevoEnlace;
						this.design.selectedItem.config[event.campo]['index'] = "i";

					}

				}
			}, (reason) => {
			});

			setTimeout(() => {
				var jsoneditorDiv = document.getElementById("jsoneditorNew");
				jsonEdit = new JSONEditor(jsoneditorDiv, {modes : ["tree","view","code","text"]});
				jsonEdit.set(nuevoValor);
			});

		}

}