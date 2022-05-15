import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-user-comments',
    templateUrl: './user-comments.component.html',
    styleUrls: ['./user-comments.component.scss']
})
export class UserCommentsComponent implements OnInit {

    constructor(public _api: ApiService, public _domSanitizer: DomSanitizer) { }

    list: any = [];
    start = 0;
    limit = 30;
    allCount: number;

    getListCallCount = 0;
    async getList() {
        const pk = ++this.getListCallCount;
        try {
            const res = await this._api.getUserComments({
                userId: this.userId,
                start: this.start,
                limit: this.limit
            });
            if (this.getListCallCount === pk) {
                this.list = res.list;
                this.allCount = res.allCount;
                this.list.forEach(item => {
                    if (item.video) {
                        item.video.ngStyle = this._domSanitizer.bypassSecurityTrustStyle(`--bg-pc-image: url('${item.video.thumbnailSrc1}'); --bg-mobile-image: url('${item.video.thumbnailSrc1}');`);
                    }
                });
            }
        } catch (e) { }
    }

    ngOnInit() { }

    _userId: string;
    get userId() {
        return this._userId;
    }
    @Input() set userId(next) {
        this._userId = next;
        if (next) {
            this.getList();
        }
    }

    trackByItem(i, item) { return item.id; }
}
