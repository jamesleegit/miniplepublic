import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '../../common/layout/layout.module';
import { VideoListModule } from '../../common/video-list/video-list.module';
import { TimeModule } from '../../common/time/time.module';
import { VideoDetailModule } from '../../common/video-detail/video-detail.module';
import { MatDialogModule } from '@angular/material/dialog';
import { VideoSearchPageComponent } from './component/video-search-page/video-search-page.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { VideoMainPageComponent } from './component/video-main-page/video-main-page.component';
import { SpinnerModule } from '../../common/spinner/spinner.module';
import { MatRippleModule } from '@angular/material/core';
@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        VideoListModule,
        MatDialogModule,
        MatRippleModule,
        ScrollingModule,
        SpinnerModule,
        RouterModule.forChild([
            { path: '', redirectTo: 'main', pathMatch: 'prefix'},
            { path: 'main', component: VideoMainPageComponent },
            { path: 'search', component: VideoSearchPageComponent },
            { path: 'search/:keyword', component: VideoSearchPageComponent },
        ])
    ],
    declarations: [ VideoSearchPageComponent, VideoMainPageComponent]
})
export class VideoListPageModule { }
