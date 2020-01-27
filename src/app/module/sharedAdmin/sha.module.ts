import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // [Disabled]
import { CommonModule } from '@angular/common'; // *ngIf
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SHACoreService } from './sha.coreService';
import { RolSearch, TreeMenu, TreeMultiple, TreeSelector } from './components/sha.core';

@NgModule({
	imports: [FormsModule, CommonModule, HttpClientModule, NgbModule],
	declarations: [
		RolSearch, TreeMenu, TreeMultiple, TreeSelector
	],
	exports: [
		RolSearch, TreeMenu, TreeMultiple, TreeSelector
	],
	providers: [SHACoreService]
})

export class SHASharedCore { }