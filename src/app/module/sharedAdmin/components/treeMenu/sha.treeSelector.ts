import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'sha-treeSelector',
	templateUrl: './sha.treeSelector.html'
})
export class TreeSelector {

	@Input() item : any;
	@Input() proyecto_id : number;
	@Input() disabled : boolean;

	@Output() eventosItem: EventEmitter<any>;

	constructor(){
		this.eventosItem = new EventEmitter<any>();
	}
	
	ngOnInit(){

	}

	eventosItemCall($event){
		this.eventosItem.emit($event);
	}

	seleccionar(menu_id : number){
		this.eventosItem.emit({respuesta : {
			seleccionar : (call : any) => {
				call(menu_id);
			}
		}});
	}

	obtenerProyectoHijo(hijo : any){
		if((this.proyecto_id != null && this.proyecto_id == hijo.menu_id && hijo.menu_padre_id == null)){
			return null;
		} else {
			return this.proyecto_id;
		}
	}

}