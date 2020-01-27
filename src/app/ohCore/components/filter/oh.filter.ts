import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// <oh-filter [(filter)]="filter" [(template)]="componente"></oh-filter>
@Component({
  selector: 'oh-filter',
  templateUrl: './oh.filter.html',
  styleUrls: ['./oh.filter.css']
})
export class Filter {

	@Input() filter: any;
	@Input() showLight: boolean;

	@Input() template: NgbModalRef;
	
	@Output() filterChange: EventEmitter<any>; // evento de filters
	
	private currentSize: number;
    constructor(private servicioModal: NgbModal){
		this.currentSize = 0;
		this.filterChange = new EventEmitter<any>();
	}
	
	ngOnChanges(changes: SimpleChanges){
		if(changes.filter){
			this.getSizing();
		}
	}

	private isVisible(field : any){
		// en tag select el value del option envia null en string
		if(typeof(field.value)!="undefined" && field.value != null && field.value != "null"){
			if(typeof(field.value)=="string" && field.value.length==0){
				return false;
			}
			return true;
		} else if(typeof(field.initValue)!="undefined" && field.initValue != null && typeof(field.endValue)!="undefined" && field.endValue != null){
			return true;
		} else {
			return false;
		}
	}

	getSizing(){
		this.currentSize = 0;
		for(var item in this.filter.fields){
		   if(this.isVisible(this.filter.fields[item])){
			this.currentSize++;
		   }
		}
	}

	openFilter(){

		if(this.filter.beforeOpenWindow){
			this.filter.beforeOpenWindow();
		}

		this.filter.field = JSON.parse(JSON.stringify(this.filter.fields));
		this.filterChange.emit(this.filter);

		const modalRef = this.servicioModal.open(this.template, { centered: true, size: 'lg', scrollable: true, backdrop: 'static' });

	    modalRef.result.then((result) => {
	     	if(result=="doFilter" && this.filter.beforeFilter){
				this.filter.beforeFilter();
				this.getSizing();
	     	}
	    }, (reason) => {
	    });

	}

	refresh(){
		this.filter.field = JSON.parse(JSON.stringify(this.filter.fields));
		this.filterChange.emit(this.filter);
		this.filter.beforeFilter();
	}

	private filterErase(key : string, e){
		if(this.filter.fields[key].disabledFilter){
			e.preventDefault();
			return;
		}
		if(this.filter.beforeErase){
			this.filter.beforeErase(key);
		}
		// en tag select el value del option envia null en string
		if(typeof(this.filter.fields[key].value) != "undefined" && this.filter.fields[key].value != null && this.filter.fields[key].value != "null"){
			this.filter.fields[key].value = null;
			this.filter.fields[key].date = null;
			this.filter.fields[key].time = null;
			this.filter.fields[key].obj = null;
		} else if(this.filter.fields[key].initValue && this.filter.fields[key].endValue){
			this.filter.fields[key].initValue = null;
			this.filter.fields[key].endValue = null;
		}
		this.filter.fields[key].descValue = null;
		this.filter.field = this.filter.fields;
		this.filter.beforeFilter();
		this.getSizing();
	}

	test(e : any){
		console.log(e);
	}

}

/*
		this.filter = {};
		this.filter.field = {}; // Mapea datos en el ng-template 
		this.filter.fields = {}; // en los filters
		this.filter.fields.{field} = {
			etiqueta : "Nombre",
			tipo : "",
			value : "Oscar",
			filter_cerrar : false,
			filter_desabilitado : true
		}; 
		this.filter.fields.fechaRegistro = {
			etiqueta : "Fecha registro",
			tipo : "fechaRango",
			initValue : null,
			endValue : null,
			filter_cerrar : true
		};
		this.filter.beforeOpenWindow = () => { // no obligatorio
			// realiza validaciones antes de abrir
		};
		this.filter.beforeFilter = () => {
     		// Realiza validaciones antes de retornar
     		this.filter.fields = this.filter.field;
     		this.filter.doFilter();
		};
		this.filter.doFilter = () => {
			// llama a un metodo interno para doFilter por ajax this.doFilter();
		};
		this.filter.beforeErase = => {
			// llama a un m�todo internet antes que se borre un filtro
		}
*/