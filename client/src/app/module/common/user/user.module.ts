import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLayoutComponent } from './component/user-layout/user-layout.component';
import { UserHistoryComponent } from './component/user-history/user-history.component';
import { UserLikeVideosComponent } from './component/user-like-videos/user-like-videos.component';
import { UserCommentsComponent } from './component/user-comments/user-comments.component';
import { MatRadioModule, MatTooltipModule, MatButtonModule, MatDialogModule, MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageNationModule } from '../page-nation/page-nation.module';
import { TimeModule } from '../time/time.module';
import { UserUploadVideosComponent } from './component/user-upload-videos/user-upload-videos.component';
import { UtilModule } from '../util/util.module';
import { UserBoxComponent } from './component/user-box/user-box.component';

const declarations = [UserHistoryComponent,UserBoxComponent, UserLayoutComponent, UserLikeVideosComponent,UserUploadVideosComponent, UserCommentsComponent];
const entryComponents = declarations;

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatRadioModule,
        MatTooltipModule,
        MatButtonModule,
        MatDialogModule,
        MatRippleModule,
        PageNationModule,
        TimeModule,
        UtilModule
    ],
    declarations,
    exports: declarations,
    entryComponents,
})
export class UserModule { }
