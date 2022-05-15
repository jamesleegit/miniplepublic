import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';

@Component({
    selector: 'app-board-list',
    templateUrl: './board-list.component.html',
    styleUrls: ['./board-list.component.scss']
})
export class BoardListComponent implements OnInit {

    constructor(private _api: ApiService) { }

    ngOnInit() {
    }

    list: any;
    notices: any;
    allCount: number;
    start = 0;
    limit = 30;
    getListCallCount = 0;
    async getList() {
        const pk = ++this.getListCallCount;
        try {
            const res: any = await this._api.getBoardTasks({ category: this.category, start: this.start, limit: this.limit });
            if (pk === this.getListCallCount) {
                this.list = res.list;
                this.notices = res.notices;
                this.allCount = res.allCount;

                this.list.forEach(item => {
                    if (item.imageSrcs) {
                        item.$imageSrcs = item.imageSrcs.split('\n');
                    }
                });
            }
        } catch (e) { }
    }

    _category: string;
    get category() { return this._category; }
    @Input() set category(next) {
        this._category = next;
        if (next) {
            this.getList();
        }
    }

    trackById(i, item) { return item.id; }
}
