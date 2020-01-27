import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OVNLogin, OVNPasswordConfirm, OVNPasswordRestore, OVNRegister } from './access/view/ovn.core';

const OVNRoutes: Routes = [
  { path: '', redirectTo: 'Login', pathMatch: 'full' },
  { path: 'Login', component: OVNLogin },
  { path: 'Register', component: OVNRegister },
  { path: 'PasswordConfirm', component: OVNPasswordConfirm },
  { path: 'PasswordRestore', component: OVNPasswordRestore },
  { path: 'be', loadChildren: () => import('./mai.module').then(m => m.MAIModule) }
];

export const OVNRouting: ModuleWithProviders = RouterModule.forRoot(OVNRoutes, { useHash: true });