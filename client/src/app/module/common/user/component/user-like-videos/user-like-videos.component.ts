import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-user-like-videos',
    templateUrl: './user-like-videos.component.html',
    styleUrls: ['./user-like-videos.component.scss']
})
export class UserLikeVideosComponent implements OnInit {

    constructor(private _api: ApiService, private _domSanitizer: DomSanitizer) { }

    ngOnInit() {
    }

    list: any = [];
    start = 0;
    limit = 7;
    allCount: number;

    getListCallCount = 0;
    async getList() {
        const pk = ++this.getListCallCount;
        try {
            const res = await this._api.getUserLikeVideos({
                userId: this.userId,
                start: this.start,
                limit: this.limit
            });
            if (this.getListCallCount === pk) {
                this.list = res.list;
                this.allCount = res.allCount;
                this.list.forEach(item => {
                    if (item.video) {
                        item.video.ngStyle = this._domSanitizer.bypassSecurityTrustStyle(`--bg-pc-image: url('${item.video.thumbnailSrc3}'); --bg-mobile-image: url('${item.video.thumbnailSrc2}');`);
                    }
                });
            }
        } catch (e) { }
    }

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
