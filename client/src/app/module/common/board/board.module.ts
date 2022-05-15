import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardEditorComponent } from './component/board-editor/board-editor.component';
import { BoardListComponent } from './component/board-list/board-list.component';
import { BoardDetailComponent } from './component/board-detail/board-detail.component';
import { PageNationModule } from '../page-nation/page-nation.module';
import { BoardLayoutComponent } from './component/board-layout/board-layout.component';
import { MatButtonModule, MatRippleModule, MatDialogModule, MatProgressSpinnerModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TimeModule } from '../time/time.module';
import { UserModule } from '../user/user.module';
import { BoardCommentComponent } from './component/board-comment/board-comment.component';
const declarations = [BoardEditorComponent, BoardListComponent, BoardDetailComponent, BoardLayoutComponent, BoardCommentComponent]
const exports = declarations;

@NgModule({
    declarations,
    exports,
    imports: [
        CommonModule,
        PageNationModule,
        RouterModule,
        MatButtonModule,
        FormsModule,
        MatRippleModule,
        TimeModule,
        UserModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
})
export class BoardModule { }
