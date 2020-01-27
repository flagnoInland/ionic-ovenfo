import { Component, Input, SimpleChanges, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchModal } from './oh.searchModal';
import { NgModel, NgForm } from '@angular/forms';

@Component({
  selector: 'oh-searchSensitive',
  templateUrl: './oh.searchSensitive.html'
})

export class searchSensitive {

	@Input() format: string = 'standard';
	@Input() title: string;
	@Input() disabled: boolean;
	@Input() search: any;
	@Input() searchId: string = 'id';
	@Input() searchBy: string = 'value';
	@Input() type: number = 1; // 1 = opl, 2 = tms list paradas multicolor
	
	@Input() required: boolean;
	@Input() form : NgForm;
	@Input() name: string = '';
	@Input() value: any;
	@Input() placeholder: any = '';
	@Output() valueChange: EventEmitter<any>; // hace binding al padre.
	@Output() onChange = new EventEmitter();


	/*  */
	
	public valueSearch : string;

	@ViewChild('inp_search', { static: false }) inp_search: NgModel;
	
	constructor(private servicioModal: NgbModal){
		this.valueChange = new EventEmitter<boolean>();
		this.inp_search ;
	};

	ngAfterViewInit() {
		if(this.form){
			if(this.inp_search){
				this.inp_search.name = this.name;
				this.form.addControl(this.inp_search);
			}
		}
	}

	selectValue(result){
		if(result){
			this.value = result[this.searchId];
			this.valueChange.emit(this.value);
			this.onChange.emit();
			this.valueSearch = result[this.searchBy];

		}
	}

	currentTop : number;
	openModal(){
		this.currentTop = document.documentElement.scrollTop;
		const 	modalRef = this.servicioModal.open(SearchModal);
				modalRef.componentInstance.title = this.title;
				modalRef.componentInstance.search = this.search;
				modalRef.componentInstance.searchBy = this.searchBy;
				modalRef.componentInstance.searchId = this.searchId;
				modalRef.componentInstance.type = this.type;
				modalRef.result.then((result) => {
					if(result){
						this.value = result[this.searchId];
						this.valueChange.emit(this.value);
					}
					document.documentElement.scrollTop = this.currentTop;
				}, (reason) => {
					document.documentElement.scrollTop = this.currentTop;
				});
	}

    ngOnChanges(changes: SimpleChanges){
		var result;

		//if(changes.search && this.search && this.value){ // Cuando el campo ya ha sido llenado y el evento dispara desde el search
		if(this.search && this.value && (
			(changes.search && (changes.search.currentValue != changes.search.previousValue)) ||
			(changes.value && (changes.value.currentValue != changes.value.previousValue))
		) // Cuando el campo ya ha sido llenado y el evento dispara desde el search
		){
		//if(this.search && this.value){ // Cuando el campo ya ha sido llenado y el evento dispara desde el search
			result = this.search.filter(item => item[this.searchId] == this.value)[0];
			this.valueChange.emit(this.value);
			this.onChange.emit();
			if(result){
				this.valueSearch = result[this.searchBy];
			}
			
		}
	}
	
	ngOnDestroy(){
		if(this.form){
			this.form.removeControl(this.inp_search);
		}
	}

}