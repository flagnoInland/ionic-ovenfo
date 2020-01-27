import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ohStorage } from '../../services/oh.core';

// <oh-filter [(filter)]="filter" [(template)]="componente"></oh-filter>
@Component({
  selector: 'oh-filterTab',
  templateUrl: './oh.filterTab.html',
  styleUrls: ['./oh.filterTab.css']
})

export class FilterTab {

	@Input() filter: any;
	@Output() filterChange: EventEmitter<any>; // evento de filters

	@Input() save : string;
	@Input() template: NgbModalRef;

    @Input() length : any;
    @Input() obj_pagin : any; // {page: 1, total: 0, size_rows: 5};    
	@Output() list: EventEmitter<any> = new EventEmitter();

	@Input() startList : boolean = true;

	private storage : ohStorage;
	
	currentSize: number;
    constructor(private servicioModal: NgbModal){
		this.currentSize = 0;
		this.filterChange = new EventEmitter<any>();
		this.storage = new ohStorage();
	}

	ngOnChanges(changes: SimpleChanges){
		if(changes.filter){
			
			if(changes.filter.currentValue){
				this.getSizing();
				this.copyItem("fields", "field");
				this.restoreFilter();
				this.beforeCheck();
			}
		}
	}

	private isVisible(field : any){
		if(field){
			if(typeof(field.value)!="undefined" && field.value != null && field.value != "null"){
				if(typeof(field.value)=="string" && field.value.length==0){
					return false;
				}
				if(typeof(field.value)=="object" && field.value.length==0){
					return false;
				}
				return true;
			} else if(typeof(field.initValue)!="undefined" && field.initValue != null && typeof(field.endValue)!="undefined" && field.endValue != null){
				return true;
			} else {
				return false;
			}
		}
	}

	getSizing(){
		this.currentSize = 0;
		if(this.filter){
			for(var item in this.filter.fields){
			   if(this.isVisible(this.filter.fields[item]) && this.filter.fields[item].closeFilter){
				this.currentSize++;
			   }
			}
		}
	}

	copyItem(since : string, from : string){
		if(this.filter){
			this.filter[from] = {};
			for(var index in this.filter[since]){
				this.filter[from][index] = Object.assign({}, this.filter[since][index]);
			}
		}
	}

	openFilter(){

		if(this.filter.beforeOpenWindow){
			this.filter.beforeOpenWindow();
		}

		this.copyItem("fields", "field");

		this.filterChange.emit(this.filter);
		
		const modalRef = this.servicioModal.open(this.template, {backdrop : 'static', keyboard  : false, size : "xl"});

	    modalRef.result.then((result) => {
	     	if(result=="doFilter"){
				if (this.obj_pagin) this.obj_pagin.page = 1;
				this.listPagin();
				this.beforeCheck();
	     	}
	    }, (reason) => {
	    });

	}

	refresh(){
		this.copyItem("fields", "field");
		this.filterChange.emit(this.filter);
		this.beforeCheck();
	}

	private getConcatValue(element : any){
		if(element.type == "list" && element.value && element.value.length>=0){
			var concat = [];
			for(var item of element.value){
				var _ref = element.value_id || 'id';
				concat.push(item[_ref]);
			}
			element.concatValue = concat.length> 0 ? concat.join(",") : null;
		}
	}

	private getArrValue(element : any){
		if(element.type == "list" && element.value && element.value.length>=0){
			var concat = [];
			for(var item of element.value){
				var _ref = element.value_id || 'id';
				concat.push(item[_ref]);
			}
			element.arrValue = concat.length > 0 ? JSON.stringify(concat) : null;
		}
	}

	private beforeCheck(){
		if(this.filter){
			for(var i in this.filter.field){
				if(this.filter.field[i].beforeFilter){
					this.filter.field[i].beforeFilter(this.filter.field[i]);
				}
				this.getConcatValue(this.filter.field[i]);
				this.getArrValue(this.filter.field[i]);
			}
			// Nuevo en caso de general
			if(this.filter.beforeFilter){
				this.filter.beforeFilter();
			}
	
			this.copyItem("field", "fields");
			this.getSizing();
			if (this.obj_pagin) {
				if(!this.obj_pagin.page){
					this.obj_pagin.page = 1;
				}
			}
	
			var store = this.storage.item("APM_FILTER", this.save) || {};
			if(store.page){
				if (this.obj_pagin) this.obj_pagin.page = store.page;
			}
			if(store.size_rows){
				if (this.obj_pagin) this.obj_pagin.size_rows = store.size_rows;
			}
	
			this.list.emit();
			this.saveFilter();	
		}
	}

	restoreFilter(){
		if(this.save && this.save.length>0){
			var store = this.storage.item("APM_FILTER", this.save) || null;
			if(store && store.filter){
				for(var item in this.filter.field){
					if(store.filter[item]){
						this.filter.field[item].value = store.filter[item].value;
						this.filter.field[item].descValue = store.filter[item].descValue;
					}
				}
			}
		}
	}

	saveFilter(){
		if(this.save && this.save.length>0){
			var store = this.storage.item("APM_FILTER", this.save) || {};
			if(this.currentSize>0){
				var saved = {};
				for(var item in this.filter.field){
					saved[item] = {
						value : this.filter.field[item].value,
						descValue : this.filter.field[item].descValue
					};
				}
				store.filter = saved;
			} else {
				store.filter = {};
			}
			this.storage.add("APM_FILTER", this.save, store);
		}
	}

	private filterErase(key : string){
		this.filterEraseElement(key);
		this.filter.field = this.filter.fields;
		if (this.obj_pagin) this.obj_pagin.page = 1;
		this.listPagin();
		this.beforeCheck();
	}

	filterEraseItem(item : any, index : number){
		item.value.splice(index, 1);
		if (this.obj_pagin) this.obj_pagin.page = 1;
		this.listPagin();
		this.beforeCheck();
	}

	filterEraseElement(key : string){
		if(this.filter.beforeErase){
			this.filter.beforeErase(key);
		}
		// en tag select el value del option envia null en string
		if(this.filter.fields[key].type == "list"){
			this.filter.fields[key].concatValue = null;
			this.filter.fields[key].arrValue = null;
		}

		if(typeof(this.filter.fields[key].value) != "undefined" && this.filter.fields[key].value != null && this.filter.fields[key].value != "null"){
			this.filter.fields[key].value = null;
			this.filter.fields[key].date = null;
			this.filter.fields[key].time = null;
		} else if(this.filter.fields[key].initValue && this.filter.fields[key].endValue){
			this.filter.fields[key].initValue = null;
			this.filter.fields[key].endValue = null;
		}
		this.filter.fields[key].descValue = null;
		
	}

	filterEraseAll(){
		if (this.obj_pagin) this.obj_pagin.page = 1;
		this.listPagin();
		for(var index in this.filter.fields){
			if (this.filter.fields[index].closeFilter){
				this.filterEraseElement(index);
			}
		}
		this.filter.field = this.filter.fields;
		this.beforeCheck();
	}

	listPagin(){
		if (this.obj_pagin) {
			var store = this.storage.item("APM_FILTER", this.save) || {};
			store.page = this.obj_pagin.page;
			store.size_rows = this.obj_pagin.size_rows;
			this.storage.add("APM_FILTER", this.save, store);
		}
	}

}