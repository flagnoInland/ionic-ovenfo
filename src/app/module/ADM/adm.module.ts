import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { TinyMceModule, tinymceDefaultSettings } from 'angular-tinymce';
import { routing } from './adm.routing';
import { ADMCoreService } from './adm.coreService';
import { OHCore } from 'src/app/ohCore/oh.module';
import { AgmCoreModule } from '@agm/core';
import { I18n, CustomDatepickerI18n } from 'src/app/ohCore/components/dates/oh.dateConfiguration';

import { ADMMain, Catalog, Version, VersionNew, VersionEdit, Rol, RolEdit, User, UserNew, UserEdit, Company, CompanyEdit, Notification, NotificationEdit, Logemailsendgrid, Logemaillocal, Ubiquitous, Exchangerate, ExchangerateEdit, UbiquitousEdit, Money, MoneyEdit, Term, TermEdit, Faq, FaqEdit, Emailtemplate, EmailtemplateEdit, Attached, AttachedNew, Bulk_load, Logweb } from './view/adm.core';

import { CompanySearch, RolSelect } from './view/adm.modules';

import { SHASharedCore } from './../sharedAdmin/sha.module';
import { SHISharedCore } from '../sharedInland/shi.module';

@NgModule({
	imports: [ 
		AgmCoreModule.forRoot({
			apiKey: "AIzaSyBee8urJh-pi-EZ427kwIk0h25g9occSqg",
			libraries: ["places"]
		}),
		routing, NgbModule,
		TinyMceModule.forRoot(tinymceDefaultSettings()),
		CommonModule, HttpClientModule, FormsModule, CustomFormsModule, OHCore,
		SHASharedCore, SHISharedCore
	],
	exports: [],
	declarations: [
		ADMMain,
		CompanySearch, RolSelect,
		Catalog, Version, VersionNew, VersionEdit, Rol, RolEdit, User, UserNew, UserEdit, Company, CompanyEdit, Notification, NotificationEdit, Logemailsendgrid, Logemaillocal, Ubiquitous, Exchangerate, ExchangerateEdit, UbiquitousEdit, Money, MoneyEdit, Term, TermEdit, Faq, FaqEdit, Emailtemplate, EmailtemplateEdit, Attached, AttachedNew, Bulk_load, Logweb
	],
	providers: [ADMCoreService, I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}]
})
export class ADMModule { }
