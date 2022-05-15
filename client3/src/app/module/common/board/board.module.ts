import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardEditorComponent } from './component/board-editor/board-editor.component';
import { BoardListComponent } from './component/board-list/board-list.component';
import { BoardDetailComponent } from './component/board-detail/board-detail.component';
import { PageNationModule } from '../page-nation/page-nation.module';
import { BoardLayoutComponent } from './component/board-layout/board-layout.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TimeModule } from '../time/time.module';
import { UserModule } from '../user/user.module';
import { BoardCommentComponent } from './component/board-comment/board-comment.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRippleModule } from '@angular/material/core';
import { SpinnerModule } from '../spinner/spinner.module';
const declarations = [BoardEditorComponent, BoardListComponent, BoardDetailComponent, BoardLayoutComponent, BoardCommentComponent]
const exports = declarations;

@NgModule({
    declarations,
    exports,
    imports: [
        CommonModule,
        PageNationModule,
        SpinnerModule,
        RouterModule,
        FormsModule,
        MatRippleModule,
        TimeModule,
        MatDialogModule,
    ],
})
export class BoardModule { }
