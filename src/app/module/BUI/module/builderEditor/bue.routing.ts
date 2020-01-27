import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BUETemplate } from './view/template/bue.template';

const routes: Routes = [
	{ path: '', component: BUETemplate }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
