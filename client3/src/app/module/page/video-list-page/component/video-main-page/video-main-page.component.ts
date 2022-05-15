import {Component, OnInit} from '@angular/core';
import {ApiService} from 'src/app/service/api.service';

import {MatDialog} from '@angular/material/dialog';
import {VideoDetailComponent} from 'src/app/module/common/video-detail/component/video-detail/video-detail.component';
import {CoreService} from 'src/app/service/core.service';

@Component({selector: 'app-video-main-page', templateUrl: './video-main-page.component.html', styleUrls: ['./video-main-page.component.scss']})
export class VideoMainPageComponent implements OnInit {

    constructor(private _api : ApiService, public _core : CoreService, private _matDialog : MatDialog) {}

    ngOnInit(): void {
        this.getTags();
        // this.openPopup(2614);
    }

    openPopup(videoId) {
        this._core.openVideoPopup(videoId);
    }

    list : any;
    async getTags() {
        const res = await this._api.getVideoTags();
        const videoTags = res.videoTags;
        videoTags.sort((a, b) => b.viewOrder - a.viewOrder);
        const arr = [];
        let index = 0 ;
        videoTags.forEach((item, i) => {
            if (i > 0 && videoTags[i - 1].viewOrder !== item.viewOrder) {
                index += 1;
            }
            if (! arr[index]) {
                arr[index] = [];
            }
            arr[index].push(item);
        });
        this.list = arr;
    }
    trackById(i, item) {
        return item.id;
    }
}
