import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './component/sign-in/sign-in.component';
import { SignUpComponent } from './component/sign-up/sign-up.component';
import { MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const declarations = [SignInComponent, SignUpComponent];
const entryComponents = declarations;
const exports = declarations;
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    entryComponents,
    declarations,
    exports
})
export class AuthModule { }
