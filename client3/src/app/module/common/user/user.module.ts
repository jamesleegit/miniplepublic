import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { HeaderModule } from '../header/header.module';
import { MatDialogModule } from '@angular/material/dialog';
import { UserCommentHistoryComponent } from './user-comment-history/user-comment-history.component';
import { UserBookmarkHistoryComponent } from './user-bookmark-history/user-bookmark-history.component';
import { PageNationModule } from '../page-nation/page-nation.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [UserProfileComponent, MyProfileComponent, UserCommentHistoryComponent, UserBookmarkHistoryComponent],
  exports: [UserProfileComponent, MyProfileComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    HeaderModule,
    MatDialogModule,
    MatRippleModule,
    PageNationModule
  ]
})
export class UserModule { }
