import { Directive, forwardRef, Attribute, Input } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

declare var AesUtil: any;
//import '../../js/CryptoJS/aes.js';
//import '../../js/CryptoJS/pbkdf2.js';
//import '../../js/CryptoJS/aesUtil.js';

@Directive({
    selector: '[ohValidateEqual]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidateEqual), multi: true }
    ]
})
export class ValidateEqual implements Validator {
    constructor( @Attribute('ohValidateEqual') public validateEqual: string, @Attribute('reverse') public reverse: string) {}

    private get isReverse() {
        if (!this.reverse) return false;
        return this.reverse === 'true' ? true: false;
    }

    validate(c: AbstractControl): { [key: string]: any } {
        
        let v = c.value;

        let e = c.root.get(this.validateEqual);


        // value not equal
        if (e && v !== e.value && !this.isReverse) {
          return {
            validateEqual: false
          }
        }

        // value equal and reverse
        if (e && v === e.value && this.isReverse) {
            delete e.errors['validateEqual'];
            if (!Object.keys(e.errors).length) e.setErrors(null);
        }

        // value not equal and reverse
        if (e && v !== e.value && this.isReverse) {
            e.setErrors({
                validateEqual: false
            })
        }

        return null;
    }
}

@Directive({
    selector: '[ohValidateEqualNc]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidateEqualNc), multi: true }
    ]
})
export class ValidateEqualNc implements Validator {

    @Input('ohValidateEqualNc') validateEqualNc: string;

    constructor(@Attribute('reverseNc') public reverseNc: string) {}

    private get isReverseNc() {
        if (!this.reverseNc) return false;
        return this.reverseNc === 'true' ? true: false;
    }

    validate(c: AbstractControl): { [key: string]: any } {
        let v = new AesUtil().encrypt(c.value);
        if (!this.isReverseNc && this.validateEqualNc && v !== this.validateEqualNc) return {
            validateEqualNc: false
        }
        if (this.isReverseNc && this.validateEqualNc && v === this.validateEqualNc) return {
            validateEqualNc: false
        }
        return null;
    }
    
}