import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CoreService } from '../../../../../service/core.service';

@Component({
    selector: 'app-user-layout',
    templateUrl: './user-layout.component.html',
    styleUrls: ['./user-layout.component.scss']
})
export class UserLayoutComponent implements OnInit {

    constructor(private _api: ApiService, public _core: CoreService, private _domSanitizer: DomSanitizer) { }

    ngOnInit() {
    }

    async blockUser(userId: number) {
        if (!confirm('이 유저를 블럭하겠습니까?')) {
            return;
        }
        await this._api.blockUser({ userId });
        location.reload();
    }
    async toggleUserThumbnail() {
        await this._api.toggleUserThumbnail();
        location.reload();
    }

    async changeUserNickname() {
        const str = prompt('변경할 이름을 입력해주세요.');
        if (!str) {
            return;
        }
        if (confirm(`"${str}"로 이름을 변경하시겠습니까?`)) {
            await this._api.changeUserNickname({ nickname: str });
            location.reload();
        }
    }

    user: any;
    async getUser() {
        try {
            this.user = await this._api.getUser({ userId: this.userId });
            this.user._thumbnailSrc = this._domSanitizer.bypassSecurityTrustStyle(`url("${this.user.thumbnailSrc}")`);
        } catch (e) { }
    }

    _userId: string;
    get userId() { return this._userId; }
    @Input() set userId(next) {
        this._userId = next;
        if (next) {
            this.getUser();
        }
    }
}
