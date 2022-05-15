import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';

@Component({
    selector: 'app-user-upload-videos',
    templateUrl: './user-upload-videos.component.html',
    styleUrls: ['./user-upload-videos.component.scss']
})
export class UserUploadVideosComponent implements OnInit {

    constructor(private _api: ApiService) { }

    list: any = [];
    start = 0;
    limit = 9;
    allCount: number;

    getListCallCount = 0;
    async getList() {
        const pk = ++this.getListCallCount;
        try {
            const res = await this._api.getUserUploadVideos({
                userId: this.userId,
                start: this.start,
                limit: this.limit
            });
            if (this.getListCallCount === pk) {
                this.list = res.list;
                this.allCount = res.allCount;
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
