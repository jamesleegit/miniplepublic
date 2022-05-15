import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInPageComponent } from './component/sign-in-page/sign-in-page.component';
import { SignUpPageComponent } from './component/sign-up-page/sign-up-page.component';
import { LayoutModule } from '../../common/layout/layout.module';
import { AuthModule } from '../../common/auth/auth.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    AuthModule,
    RouterModule.forChild([
        {path: 'sign-in', component: SignInPageComponent},
        {path: 'sign-up', component: SignUpPageComponent},
    ])
  ],
  declarations: [SignInPageComponent, SignUpPageComponent]
})
export class AuthPageModule { }
