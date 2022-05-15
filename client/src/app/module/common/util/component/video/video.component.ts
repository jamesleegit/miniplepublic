import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

    constructor(private _domSanitizer: DomSanitizer) { }

    ngOnInit() {
    }
    @Input() routerTarget: '_self' | '_blank' = '_self';
    _video: any;
    get video() { return this._video; }
    @Input() set video(next) {
        if (next) {
            next.ngStyle =
                this._domSanitizer.bypassSecurityTrustStyle(`--bg-pc-image: url('${next.thumbnailSrc3}'); --bg-mobile-image: url('${next.thumbnailSrc2}');`);
        }
        this._video = next;
    }

}
