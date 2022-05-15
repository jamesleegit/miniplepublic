import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './component/layout/layout.component';
import { RouterModule } from '@angular/router';
import {  MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from '../header/header.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { UserModule } from '../user/user.module';
import { VideoDetailModule } from '../video-detail/video-detail.module';
import { VideoUploadModule } from '../video-upload/video-upload.module';

const declarations = [LayoutComponent];
const exports = declarations;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HeaderModule,
    MatRippleModule,
    SpinnerModule,
    UserModule,
    // VideoDetailModule
    VideoUploadModule
  ],
  declarations,
  exports
})
export class LayoutModule { }
