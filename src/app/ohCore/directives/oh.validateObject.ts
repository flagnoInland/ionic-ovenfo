import { Directive, forwardRef, Attribute, Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[ohValidateObject]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidateObject), multi: true }
    ]
})
export class ValidateObject implements Validator {

    @Input('ohValidateObject') validateObject: any;

    constructor(@Attribute('searchBy') public searchBy: string) {}

    validate(c: AbstractControl): { [key: string]: any } {

        if(c.value && this.validateObject.find(item => item[this.searchBy] == c.value.toUpperCase())){
            return null;
        } else {
            return {
                validateObject : true
            }
        }
        
    }

}