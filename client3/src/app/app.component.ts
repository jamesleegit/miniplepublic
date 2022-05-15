import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {
    Router,
    NavigationStart,
    NavigationEnd,
    NavigationError,
    ActivatedRoute
} from '@angular/router';
import {VideoDetailComponent} from './module/common/video-detail/component/video-detail/video-detail.component';
import {CoreService} from './service/core.service';

@Component({selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.scss']})
export class AppComponent {
    constructor(private _core : CoreService, private _router : Router, public _matDialog : MatDialog, public _route : ActivatedRoute) {
        this._router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this._core.updateStandardData();
                if (this.videoPopup) {
                    this.videoPopup.close();
                    this.videoPopup = null;
                }
            }
            if (event instanceof NavigationEnd) {
                window.document.body.scrollTop = 0;
                window.document.body.scrollLeft = 0;
            }
            if (event instanceof NavigationError) {}
        });
        this._route.queryParams.subscribe(res => {
            if (res.v) {
                if (this.videoPopup) {
                    this.videoPopup.close();
                }
                this.openVideoPopup(res.v);
            }
        });
    }


    videoPopup : any;
    openVideoPopup(videoId : any) {
        const dialog = this.videoPopup = this._matDialog.open(VideoDetailComponent, {hasBackdrop: false});
        dialog.componentInstance.videoId = videoId;
    }
}
