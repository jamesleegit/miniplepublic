import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';
import { MatDialog } from '@angular/material/core';
import { UserHistoryComponent } from '../../../../common/user/component/user-history/user-history.component';

@Component({
    selector: 'app-user-list-page',
    templateUrl: './user-list-page.component.html',
    styleUrls: ['./user-list-page.component.scss']
})
export class UserListPageComponent implements OnInit {

    constructor(private _api: ApiService, private _matDialog: MatDialog) { }

    ngOnInit() {
        this.getList();
    }

    list: any;
    allCount: number;
    start = 0;
    limit = 50;
    getListCallCount = 0;
    async    getList() {
        const pk = ++this.getListCallCount;
        try {
            const res = await this._api.getUsers({ start: this.start, limit: this.limit });
            if (pk === this.getListCallCount) {
                this.list = res.list;
                this.allCount = res.allCount;
            }
        } catch (e) { }
    }

    openPopup(id: number) {
        const dialog = this._matDialog.open(UserHistoryComponent, { maxWidth: '90vw', maxHeight: '80vh', width: '600px', height: '900px' });
        dialog.componentInstance.userId = id;
    }
    trackById(i, item) { return item.id; }
}
