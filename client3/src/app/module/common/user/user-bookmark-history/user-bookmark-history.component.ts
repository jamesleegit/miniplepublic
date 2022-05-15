import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { CoreService } from 'src/app/service/core.service';

@Component({
  selector: 'app-user-bookmark-history',
  templateUrl: './user-bookmark-history.component.html',
  styleUrls: ['./user-bookmark-history.component.scss']
})
export class UserBookmarkHistoryComponent implements OnInit {

    constructor(public _api : ApiService, public _core : CoreService) {}

    list : any = [];
    start = 0;
    limit = 7;
    allCount : number;

    getListCallCount = 0;
    isGettingList = false;
    async getList() {
        const pk = ++ this.getListCallCount;
        this.isGettingList = true;
        this.list = [];
        try {
            const res = await this._api.getMyBookmarks({start: this.start, limit: this.limit});
            if (this.getListCallCount === pk) {
                this.list = res.list;
                this.allCount = res.allCount;
                this.isGettingList = false;
            }
        } catch (e) {
            if (this.getListCallCount === pk) {
                this.isGettingList = false;
            }
        }
    }
    isBookmarking = false;
    async unBookmark(id : string) {
        if (this.isBookmarking) {
            return;
        }
        if (!confirm('해당 북마크를 삭제하시겠습니까?')) {
            return;
        }
        this.isBookmarking = true;
        try {
            await this._api.unBookmarkVideo({videoId: id});
            this.getList();
        } catch (e) {}
        this.isBookmarking = false;
    }

    ngOnInit() {
        this.getList();
    }
    trackByItem(i, item) {
        return item.id;
    }

}
