import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoListComponent } from './component/video-list/video-list.component';
import { VideoDetailComponent } from './component/video-detail/video-detail.component';
import { PageNationModule } from '../page-nation/page-nation.module';
import { MatTooltipModule, MatProgressSpinnerModule, MatButtonModule, MatRippleModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TimeModule } from '../time/time.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { VideoUploadComponent } from './component/video-upload/video-upload.component';
import { VideoPlayerYoutubeComponent } from './component/video-player-youtube/video-player-youtube.component';
import { VideoPlayerGoogleDriveComponent } from './component/video-player-google-drive/video-player-google-drive.component';
import { VideoCommentComponent } from './component/video-comment/video-comment.component';
import { UtilModule } from '../util/util.module';

const declarations = [VideoListComponent, VideoCommentComponent,VideoDetailComponent, VideoUploadComponent, VideoPlayerGoogleDriveComponent, VideoPlayerYoutubeComponent];
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        PageNationModule,
        MatButtonModule,
        FormsModule,
        MatRippleModule,
        MatDialogModule,
        UtilModule,
        AuthModule,
        UserModule,
        TimeModule
    ],
    declarations,
    exports: declarations,
})
export class VideoModule { }
