import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ADMMain, Catalog, Version, VersionNew, VersionEdit, Rol, RolEdit, User, UserNew, UserEdit, Company, CompanyEdit, Notification, NotificationEdit, Logemailsendgrid, Logemaillocal, Ubiquitous, Exchangerate, ExchangerateEdit, UbiquitousEdit, Money, MoneyEdit, Term, TermEdit, Faq, FaqEdit, Emailtemplate, EmailtemplateEdit, Attached, AttachedNew, Bulk_load, Logweb } from './view/adm.core';
import { tisCanActivateModule } from 'src/app/ind.canActivateModule';
import { tisCanActivate } from 'src/app/ind.canActivate';

const routes: Routes = [
	{ path: '', component: ADMMain, canActivate: [tisCanActivate] },
	{ path: 'catalog', component: Catalog, canActivate: [tisCanActivateModule] },
	{ path: 'version', component: Version, canActivate: [tisCanActivateModule] },
	{ path: 'version/new', component: VersionNew, canActivate: [tisCanActivateModule] },
	{ path: 'version/edit/:id', component: VersionEdit, canActivate: [tisCanActivateModule] },
	{ path: 'rol', component: Rol, canActivate: [tisCanActivateModule] },
	{ path: 'rol/new', component: RolEdit, canActivate: [tisCanActivateModule] },
	{ path: 'rol/edit/:id', component: RolEdit, canActivate: [tisCanActivateModule] },
	{ path: 'user', component: User, canActivate: [tisCanActivateModule] },
	{ path: 'user/new', component: UserNew, canActivate: [tisCanActivateModule] },
	{ path: 'user/edit/:id', component: UserEdit, canActivate: [tisCanActivateModule] },
	{ path: 'company', component: Company, canActivate: [tisCanActivateModule] },
	{ path: 'company/new', component: CompanyEdit, canActivate: [tisCanActivateModule] },
	{ path: 'company/edit/:id', component: CompanyEdit, canActivate: [tisCanActivateModule] },
	{ path: 'notification', component: Notification, canActivate: [tisCanActivateModule] },
	{ path: 'notification/new', component: NotificationEdit, canActivate: [tisCanActivateModule] },
	{ path: 'notification/edit/:id', component: NotificationEdit, canActivate: [tisCanActivateModule] },
	{ path: 'logemailsendgrid', component: Logemailsendgrid, canActivate: [tisCanActivateModule] },
	{ path: 'logemaillocal', component: Logemaillocal, canActivate: [tisCanActivateModule] },
	{ path: 'ubiquitous', component: Ubiquitous, canActivate: [tisCanActivateModule] },
	{ path: 'exchangerate', component: Exchangerate, canActivate: [tisCanActivateModule] },
	{ path: 'exchangerate/new', component: ExchangerateEdit, canActivate: [tisCanActivateModule] },
	{ path: 'exchangerate/edit/:id', component: ExchangerateEdit, canActivate: [tisCanActivateModule] },
	{ path: 'ubiquitous/new', component: UbiquitousEdit, canActivate: [tisCanActivateModule] },
	{ path: 'ubiquitous/edit/:id', component: UbiquitousEdit, canActivate: [tisCanActivateModule] },
	{ path: 'money', component: Money, canActivate: [tisCanActivateModule] },
	{ path: 'money/new', component: MoneyEdit, canActivate: [tisCanActivateModule] },
	{ path: 'money/edit/:id', component: MoneyEdit, canActivate: [tisCanActivateModule] },
	{ path: 'term', component: Term, canActivate: [tisCanActivateModule] },
	{ path: 'term/new', component: TermEdit, canActivate: [tisCanActivateModule] },
	{ path: 'term/edit/:id', component: TermEdit, canActivate: [tisCanActivateModule] },
	{ path: 'faq', component: Faq, canActivate: [tisCanActivateModule] },
	{ path: 'faq/new', component: FaqEdit, canActivate: [tisCanActivateModule] },
	{ path: 'faq/edit/:id', component: FaqEdit, canActivate: [tisCanActivateModule] },
	{ path: 'emailtemplate', component: Emailtemplate, canActivate: [tisCanActivateModule] },
	{ path: 'emailtemplate/new', component: EmailtemplateEdit, canActivate: [tisCanActivateModule] },
	{ path: 'emailtemplate/edit/:id', component: EmailtemplateEdit, canActivate: [tisCanActivateModule] },
	{ path: 'attached', component: Attached, canActivate: [tisCanActivateModule] },
	{ path: 'attached/new', component: AttachedNew, canActivate: [tisCanActivateModule] },
	{ path: 'bulk_load', component: Bulk_load, canActivate: [tisCanActivateModule] },
	{ path: 'logweb', component: Logweb, canActivate: [tisCanActivateModule] }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes); 
