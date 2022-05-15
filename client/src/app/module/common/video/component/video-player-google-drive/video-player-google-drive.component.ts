import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { sleep } from '../../../../../../util';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-video-player-google-drive',
    templateUrl: './video-player-google-drive.component.html',
    styleUrls: ['./video-player-google-drive.component.scss']
})
export class VideoPlayerGoogleDriveComponent implements OnInit {

    constructor(private _domSanitizer: DomSanitizer) { }

    ngOnInit() {
    }

    player: HTMLVideoElement;
    videoVolume: number;

    get currentTime() {
        if (this.player) {
            return this.player.currentTime * 1000;
        }
    }

    get durationTime() {
        if (this.player) {
            return this.player.duration * 1000;
        }
    }

    get isMuted() {
        if (this.player) {
            return this.player.muted;
        }
    }

    get volume() {
        if (this.player) {
            return this.player.volume * 100;
        }
    }

    setVolume(volume: number) {
        if (this.player) {
            this.videoVolume = volume;
            this.player.volume = volume / 100;
            console.log(volume, this.player.volume)
        }
    }

    mute() {
        if (this.player) {
            this.player.muted = true;
        }
    }

    unMute() {
        if (this.player) {
            this.player.muted = false;
        }
    }

    seekTo(time: number) {
        if (this.player) {
            this.player.currentTime = time;
        }
    }

    togglePlay() {
        if (this.player) {
            if (this.playerStatus === 2) {
                this.player.play();
            }
            else if (this.playerStatus === 1) {
                this.player.pause();
            }
        }
    }

    get playerStatus() {
        if (this.player) {
            if (!this.player.paused) {
                return 1;
            } else {
                return 2;
            }
        }
    }

    uploadingVideo = false;
    resourceSrc: any;
    async init() {
        const container = document.querySelector(`#player`);
        if (!container) {
            return;
        }
        container.innerHTML = '';
        const player = this.player = document.createElement("video");
        // const source = document.createElement('source');
        player.src = `https://www.googleapis.com/drive/v3/files/${this.resource.originId}?key=AIzaSyDLUEsLvYYbfd5671EjTYZF9fy-EoPcSnk&alt=media`;
        // source.type = 'video/mp4';
        player.setAttribute('autoplay', "true");
        // player.appendChild(source);
        container.appendChild(player);
        this.onInit.emit();
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
