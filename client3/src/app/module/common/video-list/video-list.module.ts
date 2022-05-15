import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoListItemComponent } from './component/video-list-item/video-list-item.component';
import { RouterModule } from '@angular/router';
import { TimeModule } from '../time/time.module';
import { MatRippleModule } from '@angular/material/core';
import { VideoListItemSmComponent } from './component/video-list-item-sm/video-list-item-sm.component';
import { VideoListByTagComponent } from './component/video-list-by-tag/video-list-by-tag.component';

@NgModule({
  imports: [
    CommonModule,
    TimeModule,
    RouterModule,
    MatRippleModule,
  ],
  declarations: [VideoListItemComponent,  VideoListItemSmComponent, VideoListByTagComponent],
  exports: [VideoListItemComponent,  VideoListItemSmComponent, VideoListByTagComponent]
})
export class VideoListModule { }
