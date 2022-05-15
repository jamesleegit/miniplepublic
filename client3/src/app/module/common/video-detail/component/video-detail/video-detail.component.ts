import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    AfterContentInit,
    Renderer2,
    OnDestroy
} from '@angular/core';
import {ApiService} from '../../../../../service/api.service';
import {CoreService} from '../../../../../service/core.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialogRef} from '@angular/material/dialog';
import {state, style, trigger} from '@angular/animations';
import {copyToClipboard} from 'src/app/lib/util.lib';
import {VideoPlayerComponent} from '../video-player/video-player.component';

@Component({selector: 'app-video-detail', templateUrl: './video-detail.component.html', styleUrls: ['./video-detail.component.scss']})
export class VideoDetailComponent implements OnInit,
AfterContentInit,
OnDestroy {
    @ViewChild('layoutDom', {static: true})layoutDom : ElementRef;
    @ViewChild('player', {static: true})player : VideoPlayerComponent;
    constructor(private _api : ApiService, public _core : CoreService, public _matDialogRef : MatDialogRef < VideoDetailComponent >, private _renderer2 : Renderer2) {
        this.onFullscreenTemp = this.onFullscreen.bind(this);
        document.addEventListener('fullscreenchange', this.onFullscreenTemp);
        this.resizeInterval = setInterval(() => {
            if (this.player) {
                this.player.resize();
            }
        }, 1000);
        this._renderer2.addClass(document.body, 'disable-pull-to-refresh');
    }
    onFullscreenTemp : any;
    resizeInterval : any;
    ngOnDestroy() {
        document.title = '미니플';
        document.removeEventListener('fullscreenchange', this.onFullscreenTemp);
        clearInterval(this.resizeInterval);
        document.querySelectorAll('.custom-mat-dialog-container').forEach(item => this._renderer2.removeClass(item, 'custom-mat-dialog-container-extend'));
        document
        this._renderer2.removeClass(document.body, 'disable-pull-to-refresh');
    }
    ngOnInit() {}
    ngAfterContentInit() {}
    tabType : 'vote' | 'comment' = 'comment';
    video : any;
    getVideoCallCount = 0;
    async getVideo() {
        const pk = ++ this.getVideoCallCount;
        const videoId = this.videoId;
        try {
            const res: any = await this._api.getVideo({videoId});
            if (pk == this.getVideoCallCount) {
                this.video = res;
                res.comments.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
                document.title = res.title;
            }
        } catch (e) {
            if (pk == this.getVideoCallCount) {}
        }
    }
    onRemove(e : any) {
        if (this.video && this.video.comments) {
            this.video.comments = this.video.comments.filter(item => item.id !== e.id);
        }
    }
    isBookmarking = false;
    async bookmark() {
        this.isBookmarking = true;
        try {
            const videoId = this.videoId;
            await this._api.bookmarkVideo({videoId});
            if (this.video && this.videoId === videoId) {
                this.video.isBookmark = true;
            }
        } catch (e) {}
        this.isBookmarking = false;
    }
    async unBookmark() {
        this.isBookmarking = true;
        try {
            const videoId = this.videoId;
            await this._api.unBookmarkVideo({videoId});
            if (this.video && this.videoId === videoId) {
                this.video.isBookmark = false;
            }
        } catch (e) {}
        this.isBookmarking = false;
    }
    copyIframeSrc() {
        if (this.videoId) {
            copyToClipboard(`<iframe width="350" height="280" src="https://miniple.tv/v/embed/${
                this.videoId
            }" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`);
            alert('클립보드에 iframe코드가 복사되었습니다!');
        }
    }

    _videoId : string;
    get videoId() {
        return this._videoId;
    }
    @Input()set videoId(next) {
        this._videoId = next;
        this.getVideo();
    }

    trackByComment(i, item) {
        return item.id;
    }
    trackByAlert(i, item) {
        return item.id;
    }
    trackByChar(i, item) {
        return item;
    }

    _getLockOrientation() {
        const locOrientation = window.screen['lockOrientation'] || window.screen['mozLockOrientation'] || window.screen['msLockOrientation'] || window.screen['orientation'];
        return locOrientation;
    }
    _setLandscape() {
        const locOrientation = this._getLockOrientation();
        if (locOrientation) {
            locOrientation.lock('landscape-primary');
        }
    }
    _unsetLandscape() {
        const locOrientation = this._getLockOrientation();
        if (locOrientation) {
            locOrientation.unlock();
        }
    }

    _fullscreen(elem : any) {
        const methodToBeInvoked = elem.requestFullscreen || elem.webkitRequestFullScreen || elem['mozRequestFullscreen'] || elem['msRequestFullscreen'];
        if (methodToBeInvoked) {
            methodToBeInvoked.call(elem);
        }
    }
    fullscreen() {
        if (!this.layoutDom || !this.layoutDom.nativeElement) {
            return;
        }
        this._fullscreen(document.body);
    }
    _unFullscreen() {
        const methodToBeInvoked = document.exitFullscreen || (<any>document).webkitExitFullscreen || document['mozCancelFullScreen'] || document['msExitFullscreen'];
        if (methodToBeInvoked) {
            methodToBeInvoked.call(document);
        }
    }
    unFullscreen(){
        this._unFullscreen();
    }
    isFullscreen = false;
    onFullscreen() {
        console.log(document.fullscreenEnabled, document.fullscreenElement);
        if (document.fullscreenElement) {
            this.isFullscreen = true;
            document.querySelectorAll('.custom-mat-dialog-container').forEach(item => this._renderer2.addClass(item, 'custom-mat-dialog-container-extend'));
            this._setLandscape();
        } else {
            this.isFullscreen = false;
            document.querySelectorAll('.custom-mat-dialog-container').forEach(item => this._renderer2.removeClass(item, 'custom-mat-dialog-container-extend'));
            this._unsetLandscape();
        }
    }
}
