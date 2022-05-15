import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoListPageComponent } from './component/video-list-page/video-list-page.component';
import { VideoDetailPageComponent } from './component/video-detail-page/video-detail-page.component';
import { RouterModule } from '@angular/router';
import { VideoModule } from '../../common/video/video.module';
import { LayoutModule } from '../../common/layout/layout.module';
import { VideoUploadPageComponent } from './component/video-upload-page/video-upload-page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: 'upload', component: VideoUploadPageComponent },
            { path: 'list', component: VideoListPageComponent },
            { path: 'id/:id', component: VideoDetailPageComponent }
        ]),
        VideoModule,
        LayoutModule
    ],
    declarations: [VideoListPageComponent, VideoDetailPageComponent, VideoUploadPageComponent]
})
export class VideoPageModule { }
