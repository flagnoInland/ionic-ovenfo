import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'sha-treeMenu',
	templateUrl: './sha.treeMenu.html'
})
export class TreeMenu {

	@Input() hijos : any;
	@Input() proyecto_id : number;
	@Output() eventosItem: EventEmitter<any>;
	eventos : any;

	constructor(){
		this.eventosItem = new EventEmitter<any>();
		this.eventos = {
			editar : (call : any) => {},
			subir : (call : any) => {},
			bajar : (call : any) => {},
			eliminar : (call : any) => {},
			plantilla : (call : any) => {},
			getInserts : (call : any) => {}
		}
	}

	eventosItemCall($event){
		this.eventosItem.emit($event);
	}

	editar(menu_id : number){
		this.eventosItem.emit({respuesta : Object.assign({}, this.eventos, {
			editar : (call : any) => {
				call(menu_id);
			}
		})});
	}

	subir(menu_id : number){
		this.eventosItem.emit({respuesta : Object.assign({}, this.eventos, {
			subir : (call : any) => {
				call(menu_id);
			}
		})});
	}

	bajar(menu_id : number){
		this.eventosItem.emit({respuesta : Object.assign({}, this.eventos, {
			bajar : (call : any) => {
				call(menu_id);
			}
		})});
	}

	eliminar(menu_id : number){
		this.eventosItem.emit({respuesta : Object.assign({}, this.eventos, {
			eliminar : (call : any) => {
				call(menu_id);
			}
		})});
	}

	plantilla(menu_id : number){
		this.eventosItem.emit({respuesta : Object.assign({}, this.eventos, {
			plantilla : (call : any) => {
				call(menu_id);
			}
		})});
	}

	getInserts(item : any){
		this.eventosItem.emit({respuesta : Object.assign({}, this.eventos, {
			getInserts : (call : any) => {
				call(item);
			}
		})});
	}

	obtenerProyectoHijo(item : any){
		if((this.proyecto_id != null && this.proyecto_id == item.menu_id && item.menu_padre_id == null)){
			return null;
		} else {
			return this.proyecto_id;
		}
	}

}