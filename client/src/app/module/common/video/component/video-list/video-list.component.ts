import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-video-list',
    templateUrl: './video-list.component.html',
    styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {

    constructor(public _api: ApiService, private _domSanitizer: DomSanitizer) { }

    ngOnInit() {
    }

    @Input() start = 0;
    @Input() limit = 21;
    @Input() sort: string;
    @Input() tag = '';
    @Input() title: string;
    @Input() routerTarget : '_self' | '_blank' = '_self';
    list: any;
    allCount: number;

    isGettingList = false;
    getListCallCount = 0;
    async getList() {
        this.isGettingList = true;
        const pk = ++this.getListCallCount;
        try {
            const res = await this._api.getVideos({
                start: this.start,
                limit: this.limit,
                sort: this.sort,
                tag: this.tag
            });
            if (pk === this.getListCallCount) {
                this.isGettingList = false;
                this.list = res.list;
                this.allCount = res.allCount;
            }
        } catch (e) {
            if (pk === this.getListCallCount) {
                this.isGettingList = false;
            }
        }

    }

    trackByVideo(i, item) { return item.id; }
    @Output() onChange = new EventEmitter();
}
