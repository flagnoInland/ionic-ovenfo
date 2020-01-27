import { Component, OnDestroy, HostListener, ViewChild } from '@angular/core';

import { DragulaService } from 'ng2-dragula';

import { OHService } from 'src/app/tis.ohService';
import { CoreService } from 'src/app/ind.coreService';

import { bComponentButton, bComponentLink, bComponentContainer, bComponentTable, bComponentSearchRow, bComponentKeypad, bComponentKeypadReg, bComponentOutputText, bComponentAlert, bComponentAccordion, bComponentTab, bComponentForm, bComponentRadio, bComponentIcon, bComponentModal, bComponentFormRow, bComponentOption, bComponentCard, bComponentTextBox, bComponentRow, bComponentSelect, bComponentDatepicker, bComponentListHeader, bComponentPagination, bComponentTableTemplate, bComponentBagde, bComponentLinkBox, bComponentLinkBoxChildrens, bComponentLinkContainer, bComponentLinkContainerText } from './../../component/bue.editor.core';
import { Subscription } from 'rxjs';
import { NgbTabChangeEvent, NgbTabset, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { shared } from 'src/environments/environmentShared';
import { BUEBase } from '../../bue.base';
import { BUECoreService } from '../../bue.coreService';
import { SHACoreService } from 'src/app/module/sharedAdmin/sha.coreService';
import { BUICoreService } from 'src/app/module/BUI/bui.coreService';
import { BUIGNPlantillaMenuServiceJPO, pBuiplantillaMenuObtener, pBuiplantillaMenuEditar } from 'src/app/module/BUI/service/bui.bUIGNPlantillaMenuService';
import { BUIBuilderPlantillaBase } from 'src/app/module/BUI/builder/bui.builder.plantillaBase';

@Component({
	templateUrl: './bue.template.html'
})
export class BUETemplate extends BUEBase implements OnDestroy {

	precargaParams : any;
	arbol : any

	@ViewChild('tabOpciones', { static: true }) tabOpciones : NgbTabset;
	@ViewChild("modalPegar", { static: true }) modalPegar: NgbModalRef;    
	private bUIGNPlantillaMenuService : BUIGNPlantillaMenuServiceJPO;

	subs = new Subscription();
	ohBuilder : BUIBuilderPlantillaBase;
	pegarContenido: string;
	design : any;
	plCompo : any;
	nameDrag : string;
	historico : any;
	historicoCont : number;
	preview : any;

	constructor(private route: ActivatedRoute, private router : Router, private modalService: NgbModal, private dragulaService: DragulaService, private ohService : OHService, public cse : CoreService, public bcs : BUICoreService, public acs : BUECoreService, public scs : SHACoreService){
		super(ohService, cse, acs);
  
		this.bUIGNPlantillaMenuService = new BUIGNPlantillaMenuServiceJPO(ohService);
		this.nameDrag = "dgEditor";

		dragulaService.createGroup(this.nameDrag, {
			copy: (el) => {
				return el.className.indexOf('list-group-item') != -1;
			},
			copyItem: (item: any) => {
				var itemCopy = JSON.parse(JSON.stringify(item));
				itemCopy._id = this.ohService.getOH().getUtil().getUID();
				/*if(itemCopy.id == 18 || itemCopy.id == 22){ // 18 = Modal | 22 = bComponentListHeader
					itemCopy._id = ""+new Date().valueOf();
				}*/
				return itemCopy;
			},
			accepts: (el, target, source, sibling) => {
				return target.id == "idDetalles";
			},
			moves: (el, container, handle) => {
				return handle.className.indexOf('oh_editor_handle') != -1;
			}
		});
		
		this.subs.add(this.dragulaService.dropModel(this.nameDrag).subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
			if(target.id == "idDetalles"){
				if(this.historicoCont != this.historico.length - 1){
					for(var i = this.historico.length - 1; i > this.historicoCont; i--){
						this.historico.splice(i, 1);
					}
				}
				setTimeout(() => {
					this.validarEntidades();
					this.historicoGuardar();
				});
			}
		}));
	
		this.plCompo = {
			form : [],
			structure : [],
			component : [],
			complex : []
		};

		this.plCompo.form.push(bComponentForm);
		this.plCompo.form.push(bComponentFormRow);
		this.plCompo.form.push(bComponentTextBox);
		this.plCompo.form.push(bComponentButton);
		this.plCompo.form.push(bComponentSearchRow);
		this.plCompo.form.push(bComponentSelect);
		this.plCompo.form.push(bComponentDatepicker);
		this.plCompo.form.push(bComponentRadio);
		this.plCompo.form.push(bComponentOption);
		this.plCompo.form.sort(this.componenteOrdenar);

		this.plCompo.structure.push(bComponentTable);
		this.plCompo.structure.push(bComponentContainer);
		this.plCompo.structure.push(bComponentRow);
		this.plCompo.structure.push(bComponentTab);
		this.plCompo.structure.push(bComponentAccordion);
		this.plCompo.structure.push(bComponentCard);
		this.plCompo.structure.push(bComponentListHeader);
		this.plCompo.structure.push(bComponentModal);
		this.plCompo.structure.sort(this.componenteOrdenar);
		
		this.plCompo.component.push(bComponentLink);
		this.plCompo.component.push(bComponentOutputText);
		this.plCompo.component.push(bComponentAlert);
		this.plCompo.component.push(bComponentIcon);
		this.plCompo.component.push(bComponentKeypad);
		this.plCompo.component.push(bComponentPagination);
		this.plCompo.component.push(bComponentBagde);
		this.plCompo.component.push(bComponentLinkBox);
		this.plCompo.component.push(bComponentLinkContainer);
		this.plCompo.component.sort(this.componenteOrdenar);
		
		this.plCompo.complex.push(bComponentKeypadReg);
		this.plCompo.complex.push(bComponentTableTemplate);
		
		this.plCompo.complex.push(bComponentLinkContainerText);
		this.plCompo.complex.sort(this.componenteOrdenar);
		
		this.design = {
			config : {},
			content : [],
			bind : {
				entities : [],
				methods : [],
				services : [],
				predefineds : []
			},
			loaded : false,
			observaciones : []
		};

		this.historico = [];
		this.historicoCont = 0;

		this.preview = {};
		this.cse.data.onBeforeUnload = true;

		var precarga = new Promise((resolve, reject) => {
			this.precargaParams = resolve;
		});

		Promise.all([this.precarga, precarga, this.scs.listarArbolMenu(), this.scs.buiplantillaMenuListar()]).then(values => {

			this.arbol = JSON.parse(JSON.stringify(this.scs.menuArbol));
			this.obtenerPlantilla();
			this.ohService.getOH().getLoader().close();

		});

	}

	@HostListener('window:beforeunload', ['$event'])
	eventoAntesCerrar($event) {
		$event.returnValue = this.cse.config.mensajeRecarga;
	}

	template : any;
	item : any;
	menu_id : number;
	ngOnInit(){
		this.route.params.subscribe(params => {
			this.menu_id = Number(params['id']);
			this.precargaParams();
		});
	}

	private buscarMenu(item : any, menu_id : any, relativo : string){
		item.plantillaRelativa = relativo + ((item.plantilla)? ("/"+item.plantilla + ((item.tiene_id)?':id':'')):'');
		if(item.menu_id == menu_id){
			return item;
		} else {
			for(var i in item.hijos){
				var busqueda = null;
				busqueda = this.buscarMenu(item.hijos[i], menu_id, item.plantillaRelativa);
				if(busqueda){
					return busqueda;
				}
			}
			return null;
		}
	}

	mostrarGuardado : boolean;
	plantilla_menu_id : any;
	obtenerPlantilla(){
		if(this.storage.item("APM_ADM_DATA","instantanea_menu_id") == this.menu_id){
			this.mostrarGuardado = true;
		}

		this.template = this.scs.plantillas_menu.find(it => it.menu_id == this.menu_id);

		this.bUIGNPlantillaMenuService.buiplantillaMenuObtener({
			proyecto_id : 2,
			menu_id : this.template.menu_id
		}, (resp : pBuiplantillaMenuObtener) => {
			this.plantilla_menu_id = resp.plantilla_menu.plantilla_menu_id;
			if(resp.plantilla_menu.diseno){
				this.design = JSON.parse(resp.plantilla_menu.diseno);
				if(!this.design.observaciones){
					this.design.observaciones = [];
				}

			}
			var info = this.buscarMenu(this.arbol, this.menu_id, '');
			var info_base = this.buscarMenu(this.arbol, info.menu_base_id, '');
			
			if(info){
				this.design.config.name = info.titulo;
				this.design.config.url = info.plantillaRelativa;
				this.design.config.template = (info.plantillaMenu)?info.plantillaMenu.folder:this.template.folder;
				this.design.config.preFijoPlantilla = info_base.plantilla;
			}
			
			this.historico = [];
			this.historico.push(JSON.parse(JSON.stringify(this.design)));

			this.ohBuilder = new BUIBuilderPlantillaBase(this.cse.data, {
				menuArbol : this.arbol, 
				templateMenu : this.scs.plantillas_menu,
				sources : this.acs.data.sources,
				template : this.template,
				menu_id : this.menu_id
			});

			this.plCompo.complex.push(bComponentLinkBoxChildrens("/"+shared.baseBackEnd+"/"+this.ohBuilder.getPlantilla()));
			this.plCompo.complex.sort(this.componenteOrdenar);

		});
		
	}

	historicoRestaurar(){
		this.design = this.storage.item("APM_ADM_DATA","instantanea_design");
		this.historicoGuardar();
		this.mostrarGuardado = false;
	}

	componenteOrdenar(a : any, b : any){
		return (a.name>b.name)?1:((a.name<b.name)?-1:0);
	}

	ngOnDestroy(){
		this.dragulaService.destroy(this.nameDrag);
		this.subs.unsubscribe();
		this.cse.data.onBeforeUnload = false;
	}

	getSelectedItem(event: any){
		this.design.selectedItem = event.item;
	}

	historicoGuardar(){
		this.historico.push(JSON.parse(JSON.stringify(this.design)));
		this.historicoCont++;
		this.storage.add("APM_ADM_DATA","instantanea_menu_id", this.menu_id);
		this.storage.add("APM_ADM_DATA","instantanea_design", this.design);
	}

	historicoInicio(){
		this.historicoCont = 0;
		this.design = JSON.parse(JSON.stringify(this.historico[this.historicoCont]));
		delete this.design.selectedItem;
	}

	historicoAtras(){
		if(this.historicoCont > 0){
			this.historicoCont--;
			this.design = JSON.parse(JSON.stringify(this.historico[this.historicoCont]));
			delete this.design.selectedItem;
		}
	}

	historicoAdelante(){
		if(this.historicoCont != this.historico.length - 1){
			this.historicoCont++;
			this.design = JSON.parse(JSON.stringify(this.historico[this.historicoCont]));
			delete this.design.selectedItem;
		}
	}

	historicoFinal(){
		this.historicoCont = this.historico.length - 1;
		this.design = JSON.parse(JSON.stringify(this.historico[this.historicoCont]));
	}

	vistaPrevias(){
		this.preview.html = this.ohBuilder.getViewPreview();
		this.preview.ts = this.ohBuilder.getTSPreview();
		this.preview.css = this.ohBuilder.getCSSPreview();
	}

  cambiarTab($event: NgbTabChangeEvent) {
		if($event.nextId === 'tab-Codigo') {
			this.ohBuilder.setViewDesign(this.design);
			this.vistaPrevias();
		}
		if($event.nextId === 'tab-Config') {
			this.validarObservaciones();
		}
	}

	grabar(event : any){

		this.validarObservaciones();

		if(this.design.observaciones.length == 0){

			this.cse.data.onBeforeUnload = false;
			this.ohBuilder.setViewDesign(this.design);
			this.vistaPrevias();

			this.bUIGNPlantillaMenuService.buiplantillaMenuEditar({
				plantilla_menu_id  : this.plantilla_menu_id,
				diseno : JSON.stringify(this.design).replace(new RegExp("'", 'g'), "''"),
				fuente_ts : this.preview.html,
				fuente_html : this.preview.ts.replace(new RegExp("'", 'g'), "''"),
				fuente_css : this.preview.css.replace(new RegExp("'", 'g'), "''"),
				usuario_id : 1
			}, {
				archivos : this.ohService.getOH().getUtil().getJSONtoFile(this.ohBuilder.getTemplate(this.design.config.confCSS))
			}, (progress : number) => {
			}, (resp : pBuiplantillaMenuEditar) => {
				if(resp.resp_estado == 1){
					this.ohService.getOH().getAd().success(resp.resp_mensaje);
					if(event.returning){
						this.router.navigate(['../../'], { relativeTo: this.route }); 
					}
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje);
				}
			});

		}
		
	}

	validarEntidades(event ?: any){
		var obj = this.buscarxElem("id", 22); // Listheader
		if(obj.length>0){
			this.design.config.confOnTop = true;
			if(!this.design.bind.entities.find(it => it.name == "ohpag")){
				this.design.bind.entities.push({
					name : "ohpag",
					type : "any",
					definition : JSON.stringify({
						total : "number",
						pagina : "number",
						itemxPagina : "number",
						nroPaginaciones : "number"
					}),
					isList : false,
					isInput : false,
					isOutput : false,
					value : JSON.stringify({
						total : 30,
						pagina : 1,
						itemxPagina : 10,
						nroPaginaciones : 5
					})
				})
			}
		} else {
			this.design.config.confOnTop = false;
			for(var i in this.design.bind.entities){
				if(this.design.bind.entities[i].name == "ohpag"){
					this.design.bind.entities.splice(i, 1);
					break;
				}
			}
		}

		var obj = this.buscarxElem("id", 18); // Listheader

		if(obj.length>0){

		} else {
			if(event && event.id == 18){
				for(var i in this.design.bind.entities){
					if(this.design.bind.entities[i]._id == event._id){
						this.design.bind.entities.splice(i, 1);
						break;
					}
				}
				for(var e in this.design.bind.methods){
					if(this.design.bind.methods[e]._id == event._id){
						this.design.bind.methods.splice(e, 1);
						break;
					}
				}
			}
		}

	}

	elemBuscados : any;
	buscarxElem(elem : string, buscar : any){
		this.elemBuscados = [];
		this.buscarxElemBind(this.design.content, elem, buscar);
		return this.elemBuscados;
	}
	
	buscarxElemBind(content : any, elem : string, buscar : any){
		for(var i = 0; i < content.length; i++){
			var itemEditor = content[i];
			if(itemEditor[elem] == buscar){
				this.elemBuscados.push(itemEditor);
			}
			if(itemEditor.selected){
				this.buscarxElemBind(itemEditor.selected.content, elem, buscar);
			}
			if(itemEditor.hasChildSelected){
				for(var e = 0; e < itemEditor.config.rows.length; e++){
					if(itemEditor.config.rows[e].selectedHead){
						this.buscarxElemBind(itemEditor.config.rows[e].selectedHead.content, elem, buscar);
					}
					if(itemEditor.config.rows[e].selectedBody){
						this.buscarxElemBind(itemEditor.config.rows[e].selectedBody.content, elem, buscar);
					}
					if(itemEditor.config.rows[e].selectedFooter){
						this.buscarxElemBind(itemEditor.config.rows[e].selectedFooter.content, elem, buscar);
					}
				}
			}
		}
	}

	// Callback al eliminarse un elemento
	deleteItem(event : any){
		this.validarEntidades(event);
		this.historicoGuardar();
	}

	validarObservaciones(){
		this.design.observaciones = [];
		try {
			this.revisarItem(this.design.content);
		} catch(e){
			e.console.log(e);
		}
		/*
		this.tabOpciones.select("tab-Diseno");

		var obj = this.buscarxElem("id", 1); // Listheader
		console.log(obj)
		this.getSelectedItem({
			item : obj[0]
		});*/
	}

	revisarItem(content : any){

		for(var i = 0; i < content.length; i++){

			var item = content[i];
			// input || datepicket || select || opcion || radio
			if(item.id == 1 || item.id == 14 || item.id == 13 || item.id == 20 || item.id == 16){
				if(item.config.value.valor.length>0 && item.config.id.length == 0){
					this.design.observaciones.push({
						componente : item.name,
						item : item,
						icono : item.icon,
						nivel : "0",
						descripcion : "Error angular ngModel no tiene la etiqueta name",
						solucion : "Debes ingresar un id válido",
						opcion : {
							tipo : "autogenerate"
						}
					})
				}
			}
			
			if(content[i].selected){
				this.revisarItem(content[i].selected.content);
			}
			if(content[i].hasChildSelected){
				var tableItem = content[i];
				for(var e = 0; e < tableItem.config.rows.length; e++){
					if(tableItem.config.rows[e].selectedHead){
						this.revisarItem(tableItem.config.rows[e].selectedHead.content);
					}
					if(tableItem.config.rows[e].selectedBody){
						this.revisarItem(tableItem.config.rows[e].selectedBody.content);
					}
					if(tableItem.config.rows[e].selectedFooter){
						this.revisarItem(tableItem.config.rows[e].selectedFooter.content);
					}
				}
			}
		}

	}

	// Nuevo copiar
	copiar(opcion : string){
		if(this.preview){
			var texto_copiar : any = document.getElementById("inp_preview_"+opcion);
			texto_copiar.select();
			document.execCommand("copy");		
			this.ohService.getOH().getAd().success("Copiado correctamente");
		}
	}

	design_copy : any;

	diseno_instantanea(){
		this.historicoGuardar();
		this.ohService.getOH().getAd().success("Instantanea tomada correctamente");
	}

	diseno_copiar(){
		var texto_copiar : any = document.getElementById("inp_instantanea_copiar");
		texto_copiar.select();
		document.execCommand("copy");
		this.ohService.getOH().getAd().success("Copiado correctamente");
	}

	diseno_pegar_abrir(){
		this.modalPegarAbrir((resp) => {
			if(resp=="pegar"){
				this.design = JSON.parse(this.pegarContenido);
				this.historicoGuardar();
			}
		})
	}

	modalPegarAbrir(result ?: any, reason ?: any){
		this.modalService.open(this.modalPegar, {size : 'lg'}).result.then(result, reason);
	}

  @HostListener('window:keydown', ['$event']) onKeyDown(e) {
    if(e.ctrlKey && e.keyCode == 83){
			this.diseno_instantanea();
			e.preventDefault();
    }
  }
	
}
