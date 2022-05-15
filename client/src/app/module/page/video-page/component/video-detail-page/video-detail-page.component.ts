import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-video-detail-page',
    templateUrl: './video-detail-page.component.html',
    styleUrls: ['./video-detail-page.component.scss']
})
export class VideoDetailPageComponent implements OnInit {

    constructor(private _route: ActivatedRoute) {
        this._route.params.subscribe(res => {
            this.videoId = res.id;
        });
    }

    videoId: string;

    ngOnInit() {
    }

}
