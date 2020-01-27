import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // [Disabled]
import { CommonModule } from '@angular/common'; // *ngIf
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ListObject, FilterField, FilterCount, Reverse, CurrencyCustom, FilterList, SafeHtml, LocaleCurrency } from './oh.pipes';
import { FocusOnInit, Highlight, InputFormat, MarkText, ScrollMove, ValidateEqual, ValidateEqualNc, ValidateObject, ZxingReader, CopyText } from './directives/oh.core';
import { Ad, Camera, DateRanges, Filter, FilterTab, LinkBox, Loader, Option, Resizer, ResizerSide, SearchModal, searchSensitive, Steps, StepsTrip, ImagePreview, ImageUpload, LinkMenu, FileUpload, DateTime, Pagin, CircleProgressComponent, PreviewCode, Thumbnail } from './components/oh.core';

import { Jpo, ohStorage, Util, ConfirmationModal } from './services/oh.core';
import { MainService } from './services/oh.mainService';
import { WindowRef } from './services/oh.window';
import { AutocompleteComponent } from '../ohCore/components/googlemaps/google-places.component';

@NgModule({
	imports: [FormsModule, CommonModule, RouterModule, HttpClientModule, NgbModule],
	declarations: [
		ListObject, FilterField, FilterCount, Reverse, CurrencyCustom, FilterList, SafeHtml, LocaleCurrency,
		FocusOnInit, Highlight, InputFormat, MarkText, ScrollMove, ValidateEqual, ValidateEqualNc, ValidateObject, ZxingReader, CopyText,
		Ad, Camera, DateRanges, Filter, FilterTab, LinkBox, Loader, Option, Resizer, ResizerSide, searchSensitive, DateTime, Pagin, CircleProgressComponent, PreviewCode, Steps, StepsTrip, ImagePreview, ImageUpload, LinkMenu, FileUpload, Thumbnail,
		ConfirmationModal, SearchModal, AutocompleteComponent
	],
	entryComponents: [ConfirmationModal, SearchModal],
	providers: [MainService, Jpo, ohStorage, Util, WindowRef],
	exports: [
		ListObject, FilterField, FilterCount, Reverse, CurrencyCustom, FilterList, SafeHtml, LocaleCurrency,
		FocusOnInit, Highlight, InputFormat, MarkText, ScrollMove, ValidateEqual, ValidateEqualNc, ValidateObject, ZxingReader, CopyText,
		Ad, Camera, DateRanges, Filter, FilterTab, LinkBox, Loader, Option, Resizer, ResizerSide, searchSensitive, DateTime, Pagin, CircleProgressComponent, PreviewCode, SearchModal, Steps, StepsTrip, ImagePreview, ImageUpload, LinkMenu, AutocompleteComponent, FileUpload, Thumbnail
	]
})

export class OHCore { }