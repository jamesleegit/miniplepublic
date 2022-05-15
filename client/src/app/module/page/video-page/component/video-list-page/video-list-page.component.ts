import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoListComponent } from '../../../../common/video/component/video-list/video-list.component';

@Component({
    selector: 'app-video-list-page',
    templateUrl: './video-list-page.component.html',
    styleUrls: ['./video-list-page.component.scss']
})
export class VideoListPageComponent implements OnInit, AfterContentInit, OnDestroy {

    @ViewChild('videoList') videoList: VideoListComponent;
    subscribes: any = [];

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this._route.queryParams.subscribe(res => {
            if (res.s === 'recent') {
                this.sort = 'recent';
            }
            else if (res.s === 'recmt') {
                this.sort = 'recentComment';
            } else if (res.s === 'popularweek') {
                this.sort = 'popularweek';
            } else if (res.s === 'popularmonth') {
                this.sort = 'popularmonth';
            } else if (res.s === 'popular') {
                this.sort = 'popular';
            } else {
                this._router.navigate(['/video/list'], { queryParams: { s: 'popular' } });
                return;
            }
            if (!isNaN(Number(res.i))) {
                this.start = Number(res.i);
            } else {
                this.start = 0;
            }
            this.updateList();
        });
    }

    updateList() {
        if (this.videoList) {
            this.videoList.sort = this.sort;
            if (this.sort === 'popular') {
                this.videoList.title = '종합 인기영상';
            }
            if (this.sort === 'popularmonth') {
                this.videoList.title = '월간 인기영상';
            }
            if (this.sort === 'popularweek') {
                this.videoList.title = '주간 인기영상';
            }
            if (this.sort === 'recentComment') {
                this.videoList.title = '최신구름';
            }
            if (this.sort === 'recent') {
                this.videoList.title = '최신영상';
            }
            this.videoList.start = this.start;
            this.videoList.getList();
        }
    }

    ngAfterContentInit() {
        this.updateList();
        this.subscribes.push(
            this.videoList.onChange.subscribe(start => {
                if (start === this.start) {
                    this.videoList.getList();
                } else {
                    this._router.navigate([], {
                        queryParams: {
                            i: start
                        },
                        queryParamsHandling: 'merge'
                    });
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscribes.forEach(item => item.unsubscribe());
    }

    start = 0;
    sort: string;

    ngOnInit() {
    }

}
