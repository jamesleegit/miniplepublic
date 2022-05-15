import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';
import { MatDialog } from '@angular/material/core';
import { UserHistoryComponent } from '../../../user/component/user-history/user-history.component';
import { CoreService } from '../../../../../service/core.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-board-detail',
    templateUrl: './board-detail.component.html',
    styleUrls: ['./board-detail.component.scss']
})
export class BoardDetailComponent implements OnInit, OnDestroy {

    constructor(private _api: ApiService, private _matDialog: MatDialog, public _core: CoreService, private _router: Router, private _title: Title) { }

    ngOnInit() {
    }
    ngOnDestroy(){
        this._title.setTitle(`${this.detail.title} - 유머/미니플/꿀잼/드립/심심/커뮤니티`);
    }

    async delete() {
        if (!confirm('정말 이 게시물을 삭제하시겠습니까?')) {
            return;
        }
        try {
            await this._api.deleteBoardTask({ id: this.detail.id });
            this._router.navigate(['/board/' + this.category + '/']);
        } catch (e) { }
    }

    detail: any;
    getDetailCallCount = 0;
    isGettingDetail = false;
    async getDetail() {
        const pk = ++this.getDetailCallCount;
        this.detail = null;
        this.isGettingDetail = true;
        try {
            const res = await this._api.getBoardTask({ id: this.id });
            if (pk === this.getDetailCallCount) {
                this.detail = res;
                this.isGettingDetail = false;
                if (this.detail.imageSrcs) {
                    this.detail.$imageSrcs = this.detail.imageSrcs.split('\n');
                }
                this._title.setTitle(`${this.detail.title} /유머/정보/커뮤니티 - 미니플`);
            }
        } catch (e) {
            if (pk === this.getDetailCallCount) {
                this.isGettingDetail = false;
            }
        }
    }

    openUserPopup(id: number) {
        const dialog = this._matDialog.open(UserHistoryComponent, { maxWidth: '90vw', maxHeight: '70vh', width: '600px', height: '900px' });
        dialog.componentInstance.userId = id;
    }

    @Input() category: any;
    _id: any;
    get id() { return this._id; }
    @Input() set id(next) {
        this._id = next;
        if (next) {
            this.getDetail();
        }
    }
}
