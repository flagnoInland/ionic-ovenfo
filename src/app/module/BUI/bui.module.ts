import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TinyMceModule } from 'angular-tinymce';
import { tinymceDefaultSettings } from 'angular-tinymce';
import { NgxCurrencyModule } from 'ngx-currency';
import { OHCore } from 'src/app/ohCore/oh.module';
import { routing } from './bui.routing';
import { BUICoreService } from './bui.coreService';
import { BUIMain, Service, ServiceEdit, Menu, MenuEdit, Logerror, Businessunit, BusinessunitNew, BusinessunitEdit, Storescrud, Report, ReportNew, ReportEdit, Catalog, CatalogNew, CatalogEdit } from './view/bui.core';

import { SHASharedCore } from './../sharedAdmin/sha.module';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
    imports: [
        routing,
        NgbModule,
        TinyMceModule.forRoot(tinymceDefaultSettings()),
        DragulaModule.forRoot(),
        CommonModule, HttpClientModule, FormsModule, CustomFormsModule, OHCore,
        NgxCurrencyModule,
        SHASharedCore
      ],
    declarations: [
		BUIMain, Service, ServiceEdit, Menu, MenuEdit, Logerror, Businessunit, BusinessunitNew, BusinessunitEdit, Storescrud, Report, ReportNew, ReportEdit, Catalog, CatalogNew, CatalogEdit
    ],
    providers: [BUICoreService]
})
export class BUIModule {}
