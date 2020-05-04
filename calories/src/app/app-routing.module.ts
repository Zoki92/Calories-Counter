import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';


const routes: Routes = [
  { path: 'home', canActivate: [AuthGuard], loadChildren: () => import('./meals/meals.module').then(mod => mod.MealsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
