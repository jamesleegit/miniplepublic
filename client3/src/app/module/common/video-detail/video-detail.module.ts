import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VideoDetailComponent} from './component/video-detail/video-detail.component';
import {HeaderModule} from '../header/header.module';
import {VideoCommentComponent} from './component/video-comment/video-comment.component';
import {TimeModule} from '../time/time.module';
import {VideoPlayerComponent} from './component/video-player/video-player.component';
import {YoutubePlayerComponent} from './component/youtube-player/youtube-player.component';
import {ScrollingModule} from '@angular/cdk/scrolling'
import {DragDropModule} from '@angular/cdk/drag-drop'
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        MatDialogModule,
        HeaderModule,
        MatRippleModule,
        TimeModule,
        ScrollingModule,
        FormsModule,
        MatMenuModule,
        // DragDropModule
    ],
    declarations: [
        VideoDetailComponent, VideoCommentComponent, VideoPlayerComponent, YoutubePlayerComponent
    ],
    exports: [
        VideoDetailComponent, VideoPlayerComponent
    ],
    entryComponents: [VideoDetailComponent]
})
export class VideoDetailModule {}
