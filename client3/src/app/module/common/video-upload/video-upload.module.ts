import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoUploadComponent } from './component/video-upload/video-upload.component';
import { HeaderModule } from '../header/header.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [VideoUploadComponent],
  exports: [VideoUploadComponent],
  imports: [
    CommonModule,
    HeaderModule,
    MatDialogModule,
    MatRippleModule
  ]
})
export class VideoUploadModule { }
