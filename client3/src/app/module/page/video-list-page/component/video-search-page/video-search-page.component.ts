import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {encode} from 'punycode';
import {VideoDetailComponent} from 'src/app/module/common/video-detail/component/video-detail/video-detail.component';
import {ApiService} from 'src/app/service/api.service';
import {CoreService} from 'src/app/service/core.service';

@Component({selector: 'app-video-search-page', templateUrl: './video-search-page.component.html', styleUrls: ['./video-search-page.component.scss']})
export class VideoSearchPageComponent implements OnInit {

    constructor(public _core : CoreService, private _route : ActivatedRoute, private _matDialog : MatDialog, private _router : Router, private _api : ApiService) {
        this._route.params.subscribe(params => {
            this.keyword = params.keyword ? decodeURIComponent(params.keyword) : null;
            this.list = [];
            this.isEnd = false;
            this.sort = 'createTime_desc';
            this.getList();
        });
    }

    openPopup(videoId) {
        this._core.openVideoPopup(videoId);
    }

    list : any = [];
    keyword : string;
    getListCallCount = 0;
    isEnd = false;
    isGettingList = false;
    sort = 'createTime_desc';
    search(next) {
        this._router.navigate(['/list/search/' + encodeURIComponent(next)]);
    }
    setSort(next) {
        this.sort = next;
        this.list = [];
        this.isEnd = false;
        this.getList();
    }
    async getList() {
        const pk = ++ this.getListCallCount;
        this.isGettingList = true;
        try {
            const res = await this._api.getVideos({start: this.list.length, sort: this.sort, keyword: this.keyword});
            if (pk === this.getListCallCount) {
                if (res.list.length === 0) {
                    this.isEnd = true;
                }
                this.list = [
                    ...this.list,
                    ... res.list
                ];
                this.isGettingList = false;
            }

        } catch (e) {
            if (pk === this.getListCallCount) {
                this.isGettingList = false;
            }
        }
    }
    ngOnInit(): void {}

    trackById(i, item) {
        return item.id;
    }
}
