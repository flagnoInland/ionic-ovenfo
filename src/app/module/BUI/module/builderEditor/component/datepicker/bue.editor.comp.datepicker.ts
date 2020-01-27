import { Component, Input } from '@angular/core';
import { CoreService } from 'src/app/ind.coreService';

export const bComponentDatepicker = {
	id : 14,
	name : "Fecha",
	icon : "far fa-calendar-alt",
	isMaxWidh : true,
	viewContent : "div",
	config : {
		id : "",
		value : {
			esEnlace : true,
			valor : "",
			esEnlaceHasta : true,
			valorHasta : ""
		},
		type : "simple",
		months : 1,
		navigation : "select",
		showWeekNumbers : true,
		enableRules : false,
		required : false
	}
};

@Component({
  selector: 'bue-ec-datepickerview',
  templateUrl: './bue.editor.comp.datepickerView.html'
})
export class EdComDatepickerView {
	
	constructor(public cse : CoreService){

	}
	
	@Input() item: any;

	validDate(dateItem : any){
		return new Date(dateItem).toString()!="Invalid Date"?true:false;
	}

}

@Component({
	selector: 'bue-ec-datepickerconf',
	templateUrl: './bue.editor.comp.datepickerConf.html'
})
export class EdComDatepickerConf {
	
	@Input() item: any;

	constructor(){}

}