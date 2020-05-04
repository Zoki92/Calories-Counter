import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignoutComponent } from './signout/signout.component';


const routes: Routes = [
    // { path: 'signup', component: SigninComponent },
    { path: 'signout', component: SignoutComponent },
    { path: '', component: SigninComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
