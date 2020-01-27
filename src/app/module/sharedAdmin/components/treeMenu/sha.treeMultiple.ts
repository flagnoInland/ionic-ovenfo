import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'sha-treeMultiple',
	templateUrl: './sha.treeMultiple.html'
})
export class TreeMultiple {

	@Input() hijos : any;
	@Input() disabled : boolean;
	@Input() selected : number;
	@Output() eventosItem: EventEmitter<any>;

	constructor(){
		this.eventosItem = new EventEmitter<any>();

	}

	ngOnInit(){
		for(var i in this.hijos){
			if(this.hijos[i].menu_id == this.selected){
				this.hijos[i].seleccionado = true;
			}
		}
	}

	eventosItemCall($event){
		if($event.respuesta){
			for(var i in this.hijos){
				if(this.hijos[i].menu_id == $event.respuesta){
					this.hijos[i].seleccionado = true;
					this.eventosItem.emit({respuesta : this.hijos[i].menu_padre_id});
					break;
				}
			}
		} else {
			this.eventosItem.emit({respuesta : null});
		}
	}

	seleccionar(item : any){
		if(item.seleccionado){
			this.eventosItem.emit({respuesta : item.menu_padre_id});
		} else {
			this.deseleccionar(item);
			this.eventosItem.emit({respuesta : null});
		}
	}

	deseleccionar(item : any){
		item.seleccionado = false;
		for(var i in item.hijos){
			this.deseleccionar(item.hijos[i]);
		}
	}

}