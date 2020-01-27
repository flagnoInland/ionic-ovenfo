import { Routes, RouterModule } from '@angular/router';
import { Main, Tasks, Preferences, PasswordChange, TermsConditions, Faqs, Adds, Inlandnet, Report } from './view/ind.core';
import { tisCanActivate } from './ind.canActivate';
import { tiscanActivatePreferences } from 'src/app/ind.canActivatePreferences';
import { ModuleWithProviders } from '@angular/core';

const MAIRoutes: Routes = [
  { path: '', component: Inlandnet, canActivate: [tisCanActivate], children : [
    { path: '', redirectTo: 'Main', pathMatch: 'full', canActivate: [tisCanActivate] },
    { path: 'Main', component: Main, canActivate: [tisCanActivate] },
    { path: 'Tasks', component: Tasks, canActivate: [tisCanActivate] },
    { path: 'Preferences', component: Preferences, canActivate: [tiscanActivatePreferences] },
    { path: 'PasswordChange', component: PasswordChange, canActivate: [tisCanActivate] },
    { path: 'TermsConditions', component: TermsConditions, canActivate: [tisCanActivate] },
    { path: 'Faqs', component: Faqs, canActivate: [tisCanActivate] },
    { path: 'Adds', component: Adds, canActivate: [tisCanActivate] },
    { path: 'Report', component: Report, canActivate: [tisCanActivate] },
    { path: 'adm', canActivate: [tisCanActivate], loadChildren: () => import('./module/ADM/adm.module').then(m => m.ADMModule) }
  ]}
];

export const MAIRouting: ModuleWithProviders = RouterModule.forChild(MAIRoutes); 
