import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { sleep } from '../../../../../../util';

@Component({
    selector: 'app-video-player-youtube',
    templateUrl: './video-player-youtube.component.html',
    styleUrls: ['./video-player-youtube.component.scss']
})
export class VideoPlayerYoutubeComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    videoVolume = isNaN(Number(localStorage.getItem('miniple-video-volume'))) ? null : Number(localStorage.getItem('miniple-video-volume'));
    // isMuted = !!localStorage.getItem('miniple-video-mute');
    player: any;
    info: any;
    playerStatus: number | string;

    get currentTime() {
        if (this.player && this.player.getCurrentTime) {
            return this.player.getCurrentTime() * 1000;
        }
    }

    get durationTime() {
        if (this.player) {
            return this.player.getDuration() * 1000;
        }
    }

    get isMuted() {
        if (this.player) {
            return this.player.isMuted();
        }
    }

    get volume() {
        if (this.player) {
            return this.player.getVolume();
        }
    }

    setVolume(volume: number) {
        if (this.player) {
            this.videoVolume = volume;
            this.player.setVolume(volume);
            localStorage.setItem('miniple-video-volume', String(volume));
        }
    }

    mute() {
        if (this.player) {
            this.player.mute();
            localStorage.setItem('miniple-video-mute', '1');
        }
    }

    unMute() {
        if (this.player) {
            this.player.unMute();
            localStorage.removeItem('miniple-video-mute');
        }
    }

    seekTo(time: number) {
        if (this.player) {
            this.player.seekTo(time);
        }
    }

    togglePlay() {
        if (this.playerStatus === 2) {
            this.player.playVideo();
        }
        else if (this.playerStatus === 1) {
            this.player.pauseVideo();
        }
    }

    async init() {
        const resource = this.resource;
        while (1) {
            if ((<any>window).YouTubeIframeAPICompleted) {
                break;
            }
            await sleep(500);
        }
        const container = document.getElementById('ytdplayer-container');
        if (!container) {
            return;
        }
        const playerDom = document.createElement('article');
        const playerDomId = `ydplayer${new Date().getTime()}`;
        playerDom.id = playerDomId;
        playerDom.style.width = '100%';
        playerDom.style.height = '100%';
        container.innerHTML = '';
        container.appendChild(playerDom);
        const YT = (<any>window).YT;
        const player = this.player = new YT.Player(playerDomId, {
            videoId: resource.originId,
            playerVars: {
                controls: '1',
                rel: '0',
                disablekb: '1',
                showinfo: '0',
                modestbranding: '1',
                iv_load_policy: '3',
                fs: '0',
                end: '0',
                loop: '0',
                playsinline: '1',
                start: '0',
                nocookie: 'true',
                enablejsapi: '1',
            },
            events: {
                'onReady': () => {
                    console.log(player)
                    this.info = player.getVideoData();
                    // document.title = this.videoData.title;
                    // if (this.isMuted) {
                    //     this.mute();
                    // }
                    // if (this.videoVolume) {
                    //     this.setVolume(this.videoVolume);
                    // }
                    player.playVideo();
                    this.onInit.emit();
                    // this.renderForTimeline();
                    // setTimeout(() => { this.resize(); }, 500);
                },
                'onError': () => {
                },
                'onStateChange': (e) => {
                    this.playerStatus = e.data;
                }
            }
        });
    }

    @Output() onInit = new EventEmitter();

    _resource: any;
    get resource() { return this._resource; }
    @Input() set resource(next) {
        const prev = this._resource;
        this._resource = next;
        if (next && (!prev || prev.id !== next.id)) {
            this.init();
        }
    }
}
