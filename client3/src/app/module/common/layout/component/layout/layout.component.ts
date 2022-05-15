import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    ViewChild,
    ElementRef
} from '@angular/core';
import {CoreService} from '../../../../../service/core.service';
import {ActivatedRoute, Router, NavigationStart} from '@angular/router';
import {environment} from '../../../../../../environments/environment';
import {ApiService} from '../../../../../service/api.service';
import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {UserProfileComponent} from '../../../user/user-profile/user-profile.component';
import {MyProfileComponent} from '../../../user/my-profile/my-profile.component';
import {VideoDetailComponent} from '../../../video-detail/component/video-detail/video-detail.component';
import {VideoUploadComponent} from '../../../video-upload/component/video-upload/video-upload.component';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    animations: [trigger('loading-panel', [
            state('open', style({left: 0})),
            state('close', style({left: '-100%', opacity: 0})),
            transition('open=>close', [animate('500ms')]),
            transition('close=>open', [animate('0ms')]),
        ])]
})
export class LayoutComponent implements OnInit,
OnDestroy {

    @ViewChild('mainContainer')mainContainer : ElementRef;

    constructor(private _matDialog : MatDialog, public _core : CoreService, public _router : Router, private _api : ApiService, private _route : ActivatedRoute) {}
    showSide = false;

    ngOnInit() {
    }

    ngOnDestroy() {}
    openVideoUpload() {
        if (!this._core.isLoggedIn) {
            this._core.signIn();
            return;
        }
        const dialog = this._matDialog.open(VideoUploadComponent, {panelClass: 'custom-mat-dialog-container2'});
        // dialog.
    }
    openMyProfile() {
        const dialog = this._matDialog.open(MyProfileComponent, {panelClass: 'custom-mat-dialog-container2'});
        // dialog.
    }

    showNav = false;
    search(keyword : string) {
        this._router.navigate(['/list/search/' + encodeURIComponent(keyword)]);
    }

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

    moveDataInput = {
        id: '',
        password: ''
    };
    async moveData() {
        if (!this.moveDataInput.id || !this.moveDataInput.password) {
            alert('값을 입력해주세요.');
        }
        try {
            await this._api.moveData(this.moveDataInput);
            alert('데이터 이동 완료되었습니다.');
        } catch (e) {}
    }

    @Input()fullPageMobile = false;
    @Input()hideSide = false;
}
