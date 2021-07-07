import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "src/app/helpers/auth.guard";
import { Role } from "./models";

import { ErrorComponent } from './components/error/error.component';
import { IndexComponent } from './components/index/index.component';

const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const ProfileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const ConsoleModule = () => import('./console/console.module').then(x => x.ConsoleModule);

const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full' },
  { path: 'index', component: IndexComponent, pathMatch: 'full' },
  { path: 'account', loadChildren: accountModule },
  { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
  { path: 'profile', loadChildren: ProfileModule, canActivate: [AuthGuard] },
  { path: 'console', loadChildren: ConsoleModule, canActivate: [AuthGuard] },
  { path: '**', component: ErrorComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
