import { Component, Input, Output, EventEmitter } from '@angular/core';
// <oh-option [text]="inspeccion.nombre" [(option)]="inspeccion.valor" (onChange)="validarInspeccion()"></oh-option>
// <oh-option [type]="'box'" [(option)]="inspeccion.valor"></oh-option>
@Component({
  selector: 'oh-option',
  templateUrl: './oh.option.html',
  styleUrls: ['./oh.option.css']
})
export class Option {

	@Input() text: string;
	@Input() description: string;
	@Input() option: boolean;
	@Input() type: string; // "" | 'box' 'small'
	
	@Output() optionChange: EventEmitter<boolean>; // hace binding al padre.
	@Output() onChange = new EventEmitter(); // llama a un evento

    constructor(){
    	this.type = "";
    	this.option = false;
        this.optionChange = new EventEmitter<boolean>();
    }

	changeValue(){
		if(this.option==true){
			this.option = false;
		} else {
			this.option = true;
		}
		this.optionChange.emit(this.option);
		this.onChange.emit();
	}

}