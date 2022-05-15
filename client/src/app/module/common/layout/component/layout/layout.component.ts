import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from '../../../../../service/core.service';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { ApiService } from '../../../../../service/api.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

    @ViewChild('mainContainer') mainContainer: ElementRef;

    constructor(public _core: CoreService, public _router: Router, private _api: ApiService) {
        this.routerSubscribe = this._router.events.subscribe((e) => {
            if (e instanceof NavigationStart) {
                this.showNav = false;
                if (this.mainContainer.nativeElement) {
                    this.mainContainer.nativeElement.scrollTop = 0;
                }
            }
        });
    }

    routerSubscribe: any;

    ngOnInit() {
    }

    ngOnDestroy() {
        this.routerSubscribe.unsubscribe();
    }

    showNav = false;

    signIn() {
        this._core.signIn();
    }
    signOut() {
        if (!confirm('로그아웃 하시겠습니까?')) {
            return;
        }
        this._core.signOut();
    }

    back() {
        history.back();
    }

    moveDataInput = { id: '', password: '' };
    async  moveData() {
        if (!this.moveDataInput.id || !this.moveDataInput.password) {
            alert('값을 입력해주세요.');
        }
        try {
            await this._api.moveData(this.moveDataInput);
            alert('데이터 이동 완료되었습니다.');
        } catch (e) { }
    }

    @Input() fullPageMobile = false;
    @Input() hideSide = false;
}
