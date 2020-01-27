
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OHCore } from 'src/app/ohCore/oh.module';
import { tisCanActivate } from './ind.canActivate';
import { tiscanActivatePreferences } from './ind.canActivatePreferences';
import { tisCanActivateModule } from './ind.canActivateModule';
import { Inlandnet, Main, Adds, Menu, Nav, PasswordChange, Preferences, TermsConditions, Faqs, Tasks, Report } from 'src/app/view/ind.core';

import { RouterModule } from '@angular/router';
import { MAIRouting } from './mai.route';

@NgModule({
  declarations: [
    Inlandnet, Adds, Main, Menu, Nav, PasswordChange, Preferences, TermsConditions, Faqs, Tasks, Report
  ],
  imports: [
    FormsModule,
    NgbModule,
    MAIRouting,
    CustomFormsModule,
    CommonModule,
    OHCore
  ],
  exports: [RouterModule],
  providers: [tisCanActivate, tiscanActivatePreferences, tisCanActivateModule]
})

export class MAIModule { }