import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '../../common/layout/layout.module';
import { UserModule } from '../../common/user/user.module';
import { UserHistoryPageComponent } from './component/user-history-page/user-history-page.component';
import { UserListPageComponent } from './component/user-list-page/user-list-page.component';
import { PageNationModule } from '../../common/page-nation/page-nation.module';
import { MatDialogModule } from '@angular/material/core';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: 'id/:userId', component: UserHistoryPageComponent },
            { path: 'list', component: UserListPageComponent },
        ]),
        LayoutModule,
        UserModule,
        //
        PageNationModule,
        MatDialogModule
    ],
    declarations: [UserHistoryPageComponent, UserListPageComponent]
})
export class UserPageModule { }
