import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // [Disabled]
import { CommonModule } from '@angular/common'; // *ngIf
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CompanyDirectionSelect } from './component/company/companyDirectionSelect/shi.companyDirectionSelect';
import { OHCore } from 'src/app/ohCore/oh.module';
import { AgmCoreModule } from '@agm/core';
import { BusinessunitSelect, UbiquitousRegister } from './component/shi.core';

@NgModule({
	imports: [FormsModule, CommonModule, HttpClientModule, NgbModule, OHCore,
		AgmCoreModule.forRoot({
		  apiKey: "AIzaSyBee8urJh-pi-EZ427kwIk0h25g9occSqg",
		  libraries: ["places"]
		}),	
	],
	declarations: [ 
		CompanyDirectionSelect,
		UbiquitousRegister,
		BusinessunitSelect
	],
	exports: [
		CompanyDirectionSelect,
		UbiquitousRegister,
		BusinessunitSelect
	]
})

export class SHISharedCore { }