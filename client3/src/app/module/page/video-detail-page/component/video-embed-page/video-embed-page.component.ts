import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {VideoPlayerComponent} from 'src/app/module/common/video-detail/component/video-player/video-player.component';
import {ApiService} from 'src/app/service/api.service';

@Component({selector: 'app-video-embed-page', templateUrl: './video-embed-page.component.html', styleUrls: ['./video-embed-page.component.scss']})
export class VideoEmbedPageComponent implements OnInit,
AfterContentInit {
    @ViewChild('player', {static: true})player : VideoPlayerComponent;

    constructor(private _route : ActivatedRoute, private _api : ApiService) {
        this._route.params.subscribe(res => {
            if (res.videoId) {
                this.videoId = res.videoId;
                this.getVideo();
            }
        });
    }

    ngOnInit(): void {}
    ngAfterContentInit() {
        setInterval(() => {
            if (this.player && !this.player.isDestroyed) {
                this.player.resize();
            }
        }, 5000);
    }
    video : any;
    videoId : string;
    getVideoCallCount = 0;
    async getVideo() {
        const pk = ++ this.getVideoCallCount;
        const videoId = this.videoId;
        try {
            const res: any = await this._api.getVideo({videoId});
            if (pk == this.getVideoCallCount) {
                this.video = res;
            }
        } catch (e) {
            if (pk == this.getVideoCallCount) {}
        }
    }
}
