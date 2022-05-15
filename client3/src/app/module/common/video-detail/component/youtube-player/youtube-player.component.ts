import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { sleep } from 'src/app/lib/util.lib';

@Component({
  selector: 'app-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss']
})
export class YoutubePlayerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  videoVolume = isNaN(Number(localStorage.getItem('miniple-video-volume'))) ? null : Number(localStorage.getItem('miniple-video-volume'));
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
            this.player.seekTo(time / 1000);
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
            videoId: this.videoId,
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
                    // player.playVideo();
                    this.onInit.emit();
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

    _videoId: string;
    get videoId() { return this._videoId; }
    @Input() set videoId(next) {
        this._videoId = next;
        if (next) {
            this.init();
        }
    }
}
