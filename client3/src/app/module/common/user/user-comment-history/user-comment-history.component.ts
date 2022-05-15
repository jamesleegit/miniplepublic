import {Component, OnInit} from '@angular/core';
import {ApiService} from 'src/app/service/api.service';
import {CoreService} from 'src/app/service/core.service';

@Component({selector: 'app-user-comment-history', templateUrl: './user-comment-history.component.html', styleUrls: ['./user-comment-history.component.scss']})
export class UserCommentHistoryComponent implements OnInit {

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
            const res = await this._api.getMyComments({start: this.start, limit: this.limit});
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
    isRemovingComment = false;
    async removeComment(id : number) {
        if (this.isRemovingComment) {
            return;
        }
        if (!confirm('해당 코멘트를 삭제하시겠습니까?')) {
            return;
        }
        this.isRemovingComment = true;
        try {
            await this._api.removeComment({id});
            this.getList();
        } catch (e) {}
        this.isRemovingComment = false;
    }

    ngOnInit() {
        this.getList();
    }
    trackByItem(i, item) {
        return item.id;
    }
}
