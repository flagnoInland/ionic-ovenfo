import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input, SimpleChanges, ElementRef } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

declare var google: any;

/**
* Implementacion
<AutocompleteComponent (setAddress)="getAddress($event)" adressType="geocode" required="true" sombra="true" [(inputText)]="ubigeo.desc_ini" [form]="form"></AutocompleteComponent>
<AutocompleteComponent (setAddress)="getAddress($event)" adressType="geocode" required="true" [(inputText)]="ubigeo.desc_ini" [form]="form"></AutocompleteComponent>
*/

@Component({
    selector: 'AutocompleteComponent',
	templateUrl: './google-places.component.html',
    styles: ['.sombra {box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02);}'],
})

export class AutocompleteComponent implements OnInit, AfterViewInit {
    
    @Input() public placeholder: any = 'Buscar dirección';
    @Input() public disabled: any = false;
    @Input() public required: any = false;
    @Input() public form: NgForm;
    @Input() public adressType: string;// 'establishment' / 'address' / 'geocode'
    @Input() public inputText: any;
    @Input() public prefijo: any = 'PE';
    @Input() public sombra: any = false;
    @Output() public setAddress: EventEmitter<any> = new EventEmitter();
    @Output() public salidaTXT:  EventEmitter<any> = new EventEmitter();
    @ViewChild('addresstext', { static: true, read: ElementRef}) addresstext: ElementRef;
    @ViewChild('addresstext', { static: false }) addressModel: NgModel;
    public autocompleteInput: string;
    
    constructor() { }
    
    ngOnInit() { }

    ngAfterViewInit() {
        if (this.form) {
            this.addressModel.name = 'ac_name';
			this.form.addControl(this.addressModel);
        }
        setTimeout(() => { this.getPlaceAutocomplete(); }, 1000)
    }

    ngOnChanges(changes: SimpleChanges){
		if(changes.inputText){
            
            this.autocompleteInput = this.inputText;
            this.addresstext.nativeElement.value = this.inputText;
            if(this.addresstext.nativeElement.value != ''){
                this.addresstext.nativeElement.focus();
            }
		}
    }

    onSearchChange(searchValue: string): void {  
        this.salidaTXT.emit(searchValue);
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,{
            componentRestrictions: { country: this.prefijo },
            types: [this.adressType, 'establishment'] // 'establishment' / 'address' / 'geocode'
        });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.invokeEvent(place);
        });        
    }

    invokeEvent(place: any) {
        place.place_text = this.addresstext.nativeElement.value;
        this.setAddress.emit(place);
    }
}