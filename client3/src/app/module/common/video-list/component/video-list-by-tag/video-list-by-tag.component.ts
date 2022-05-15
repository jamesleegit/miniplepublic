import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {ApiService} from 'src/app/service/api.service';

@Component({selector: 'app-video-list-by-tag', templateUrl: './video-list-by-tag.component.html', styleUrls: ['./video-list-by-tag.component.scss']})
export class VideoListByTagComponent implements OnInit {

    constructor(private _api : ApiService) {}

    ngOnInit(): void {}

    get activeTag() {
        return this.tags.find(item => item.id === this.activeTagId);
    }
    get activeTagLimit() {
        return this.activeTag.limit || 4;
    }
    activeTagId : number;
    isGettingList = false;
    getListCallCount = 0;
    list : any;
    blankArray : any = [];
    more() {
        const next = this.blankArray.length + this.activeTagLimit;
        if (next > this.list.length) {
            this.blankArray = new Array(this.list.length);
        } else {
            this.blankArray = new Array(next);
        }
    }
    setTagId(next) {
        this.activeTagId = next;
        this.getList();
    }
    async getList() {
        this.isGettingList = true;
        const pk = ++ this.getListCallCount;
        this.list = [];
        this.blankArray = new Array(this.activeTagLimit);
        try {
            const res = await this._api.getVideosByTag({tagId: this.activeTagId});
            if (pk === this.getListCallCount) {
                this.list = res.list;
                this.isGettingList = false;
            }
        } catch (e) {
            if (pk === this.getListCallCount) {
                this.isGettingList = false;
            }
        }
    }
    trackById(i, item) {
        if (this.list && this.list[i]) {
            return this.list[i].id;
        }
    }
    _tags : any;
    get tags() {
        return this._tags;
    }
    @Input()set tags(next) {
        this._tags = next;
        if (next && next[0]) {
            next.sort((a, b) => b.viewOredr2 - a.viewOredr2);
            this.activeTagId = next[0].id;
            this.getList();
        }
    };
    @Output()onClick = new EventEmitter();
}
