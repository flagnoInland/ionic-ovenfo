import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // [Disabled]
import { CommonModule } from '@angular/common'; // *ngIf
import { HttpClientModule } from '@angular/common/http';
import { routing } from './bue.routing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { TinyMceModule } from 'angular-tinymce';
import { tinymceDefaultSettings } from 'angular-tinymce';

import { OHCore } from 'src/app/ohCore/oh.module';

import { BUECoreService } from './bue.coreService';

import { EdComAccordionConf, EdComAccordionView, EdComAlertConf, EdComAlertView, EdComBagdeConf, EdComBagdeView, EdComButtonConf, EdComButtonView, EdComCardConf, EdComCardView, EdComContainerConf, EdComContainerView, EdComRadioConf, EdComRadioView, EdComRowConf, EdComRowView, EdComDatepickerConf, EdComDatepickerView, EdComFormConf, EdComFormRowConf, EdComFormRowView, EdComFormView, EdComIconConf, EdComIconView, EdComKeypadConf, EdComKeypadView, EdComLinkBoxConf, EdComLinkBoxView, EdComLinkConf, EdComLinkContainerConf, EdComLinkContainerView, EdComLinkView, EdComListHeaderConf, EdComListHeaderView, EdComModalConf, EdComModalView, EdComOptionConf, EdComOptionView, EdComOutputTextConf, EdComOutputTextView, EdComPaginatioConf, EdComPaginationView, EdComSelectConf, EdComSelectView, EdComTabConf, EdComTabView, EdComTableConf, EdComTableView, EdComTextBoxConf, EdComTextBoxView, EdComSearchRowConf, EdComSearchRowView } from './component/bue.editor.core';
import { BUEEditor } from './view//editor/bue.editor';
import { BUETemplate } from './view/template/bue.template';
import { BUEPlantillaBind } from './view/templateBind/bue.plantillaBind';
import { BUEPlantillaConfig } from "./view/templateConfig/bue.plantillaConfig";
import { BUEPlantillaDesign } from './view/templateDesign/bue.plantillaDesign';

@NgModule({
	imports: [
		CommonModule, HttpClientModule, FormsModule,
		NgbModule,
        TinyMceModule.forRoot(tinymceDefaultSettings()),
		DragulaModule.forRoot(),
		OHCore,
		routing
	],
	declarations: [
		BUEEditor, BUETemplate, BUEPlantillaBind, BUEPlantillaConfig, BUEPlantillaDesign,
		EdComAccordionConf, EdComAccordionView, EdComAlertConf, EdComAlertView, EdComBagdeConf, EdComBagdeView, EdComButtonConf, EdComButtonView, EdComCardConf, EdComCardView, EdComContainerConf, EdComContainerView, EdComRadioConf, EdComRadioView, EdComRowConf, EdComRowView, EdComDatepickerConf, EdComDatepickerView, EdComFormConf, EdComFormRowConf, EdComFormRowView, EdComFormView, EdComIconConf, EdComIconView, EdComKeypadConf, EdComKeypadView, EdComLinkBoxConf, EdComLinkBoxView, EdComLinkConf, EdComLinkContainerConf, EdComLinkContainerView, EdComLinkView, EdComListHeaderConf, EdComListHeaderView, EdComModalConf, EdComModalView, EdComOptionConf, EdComOptionView, EdComOutputTextConf, EdComOutputTextView, EdComPaginatioConf, EdComPaginationView, EdComSelectConf, EdComSelectView, EdComTabConf, EdComTabView, EdComTableConf, EdComTableView, EdComTextBoxConf, EdComTextBoxView, EdComSearchRowConf, EdComSearchRowView
	],
	exports: [],
	providers: [BUECoreService]
})

export class BUEBuilderEditor {}