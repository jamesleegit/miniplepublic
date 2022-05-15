import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoEmbedPageComponent } from './component/video-embed-page/video-embed-page.component';
import { RouterModule } from '@angular/router';
import { VideoDetailModule } from '../../common/video-detail/video-detail.module';

@NgModule({
  imports: [
    CommonModule,
    VideoDetailModule,
    RouterModule.forChild([
        { path: 'embed/:videoId', component: VideoEmbedPageComponent},
    ])
  ],
  declarations: [VideoEmbedPageComponent]
})
export class VideoDetailPageModule { }
