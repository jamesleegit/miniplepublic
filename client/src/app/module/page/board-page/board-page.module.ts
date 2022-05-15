import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardListPageComponent } from './component/board-list-page/board-list-page.component';
import { BoardDetailPageComponent } from './component/board-detail-page/board-detail-page.component';
import { BoardWritePageComponent } from './component/board-write-page/board-write-page.component';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '../../common/layout/layout.module';
import { BoardModule } from '../../common/board/board.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    BoardModule,
    RouterModule.forChild([
        {path: ':category', redirectTo: ':category/list'},
        {path: ':category/list',component: BoardListPageComponent},
        {path: ':category/detail/:id',component: BoardDetailPageComponent},
        {path: ':category/write',component: BoardWritePageComponent},
    ])
  ],
  declarations: [BoardListPageComponent, BoardDetailPageComponent, BoardWritePageComponent]
})
export class BoardPageModule { }
