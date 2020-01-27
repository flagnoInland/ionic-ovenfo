import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BUIMain, Service, ServiceEdit, Menu, MenuEdit, Logerror, Businessunit, BusinessunitNew, BusinessunitEdit, Storescrud, Report, ReportNew, ReportEdit, Catalog, CatalogNew, CatalogEdit } from './view/bui.core';
import { tisCanActivateModule } from 'src/app/ind.canActivateModule';

const routes: Routes = [
	{ path: '', component: BUIMain },
	{ path: 'service', component: Service, canActivate: [tisCanActivateModule] },
	{ path: 'service/edit', component: ServiceEdit, canActivate: [tisCanActivateModule] },
	{ path: 'service/edit/:id', component: ServiceEdit, canActivate: [tisCanActivateModule] },
	{ path: 'menu', component: Menu, canActivate: [tisCanActivateModule] },
	{ path: 'menu/new', component: MenuEdit, canActivate: [tisCanActivateModule] },
	{ path: 'menu/edit/:id', component: MenuEdit, canActivate: [tisCanActivateModule] },
	{ path: 'menu/template/:id', loadChildren: () => import('./module/builderEditor/bue.module').then(m => m.BUEBuilderEditor), canActivate: [tisCanActivateModule] },
	{ path: 'logerror', component: Logerror, canActivate: [tisCanActivateModule] },
	{ path: 'businessunit', component: Businessunit, canActivate: [tisCanActivateModule] },
	{ path: 'businessunit/new', component: BusinessunitNew, canActivate: [tisCanActivateModule] },
	{ path: 'businessunit/edit/:id', component: BusinessunitEdit, canActivate: [tisCanActivateModule] },
	{ path: 'storescrud', component: Storescrud, canActivate: [tisCanActivateModule] },
	{ path: 'report', component: Report, canActivate: [tisCanActivateModule] },
	{ path: 'report/new', component: ReportNew, canActivate: [tisCanActivateModule] },
	{ path: 'report/edit/:id', component: ReportEdit, canActivate: [tisCanActivateModule] },
	{ path: 'catalog', component: Catalog, canActivate: [tisCanActivateModule] },
	{ path: 'catalog/new', component: CatalogNew, canActivate: [tisCanActivateModule] },
	{ path: 'catalog/edit/:id', component: CatalogEdit, canActivate: [tisCanActivateModule] }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
