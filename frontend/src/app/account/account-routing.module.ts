import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { RecoverComponent } from "./recover/recover.component";
import { EmailVerifyComponent } from "./email-verify/email-verify.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { LayoutComponent } from "./layout.component";

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [            
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'recover', component: RecoverComponent },
            { path: 'verify-email', component: EmailVerifyComponent },
            { path: 'reset-password', component: ResetPasswordComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AccountRoutingModule { }