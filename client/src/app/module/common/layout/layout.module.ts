import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './component/layout/layout.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

const declarations = [LayoutComponent];
const exports = declarations;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatRippleModule
  ],
  declarations,
  exports
})
export class LayoutModule { }
