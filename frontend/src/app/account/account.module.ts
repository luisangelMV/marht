import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account-routing.module';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EmailVerifyComponent } from './email-verify/email-verify.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RecoverComponent } from './recover/recover.component';
import { LayoutComponent } from './layout.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    NgxCaptchaModule,
    SharedModule
  ],
  declarations: [
    LayoutComponent,
    LoginComponent,
    RecoverComponent,
    RegisterComponent,
    EmailVerifyComponent,
    ResetPasswordComponent
    
  ],
  exports: [
    LayoutComponent
  ]
  
})
export class AccountModule { }
