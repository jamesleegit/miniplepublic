import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';
import { CoreService } from '../../../../../service/core.service';

@Component({
    selector: 'app-board-comment',
    templateUrl: './board-comment.component.html',
    styleUrls: ['./board-comment.component.scss']
})
export class BoardCommentComponent implements OnInit {

    constructor(private _api: ApiService, public _core: CoreService) { }

    ngOnInit() {
    }

    input = {
        text: ''
    };
    list: any;
    start = 0;
    limit = 20;
    allCount: number;
    getListCallCount = 0;
    async getList() {
        const pk = ++this.getListCallCount;
        try {
            const res: any = await this._api.getBoardComments({
                taskId: this.taskId,
                start: this.start,
                limit: this.limit,
            });
            if (pk === this.getListCallCount) {
                this.list = res.list;
                this.list.sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime());
                this.allCount = res.allCount;
            }
        } catch (e) { }
    }
    isSubmitting = false;
    async submit() {
        if (!this.input.text) {
            alert('댓글을 입력해주세요.');
            return;
        }
        this.isSubmitting = true;
        try {
            await this._api.insertBoardComment({
                taskId: this.taskId,
                text: this.input.text
            });
            this.input.text = '';
            this.getList();
        } catch (e) { }
        this.isSubmitting = false;
    }
    trackById(i, item) { return item.id; }
    _taskId: number;
    get taskId() { return this._taskId; }
    @Input() set taskId(next) {
        this._taskId = next;
        if (next) {
            this.start = 0;
            this.allCount = null;
            this.list = null;
            this.input.text = '';
            this.getList();
        }
    }
}
