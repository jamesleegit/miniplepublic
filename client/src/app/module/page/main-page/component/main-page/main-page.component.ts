import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoListComponent } from '../../../../common/video/component/video-list/video-list.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, AfterContentInit {

    @ViewChild('list1') list1: VideoListComponent;
    @ViewChild('list2') list2: VideoListComponent;
    @ViewChild('list3') list3: VideoListComponent;
    @ViewChild('list4') list4: VideoListComponent;
    @ViewChild('list5') list5: VideoListComponent;
    @ViewChild('list6') list6: VideoListComponent;

    constructor(private _router: Router) { }

    ngOnInit() {
    }

    url: string;
    goto() {
        let t1, t2, t3;
        const url = this.url.split(' ').join('');
        try {
            t1 = url.split('watch?v=')[1].split('&')[0];
        } catch (e) { }
        try {
            t2 = url.split('/v/')[1].split('&')[0];
        } catch (e) { }

        try {
            t3 = url;
        } catch (e) { }

        if (t1) {
            this._router.navigate(['/video/id/' + t1]);
        } else if (t2) {
            this._router.navigate(['/video/id/' + t2]);
        } else if (t3) {
            this._router.navigate(['/video/id/' + t3]);
        } else {
            alert('주소를 읽을 수 없습니다.');
        }
    }

    ngAfterContentInit() {
        this.list1.routerTarget = '_blank';
        this.list1.limit = 6;
        this.list1.sort = 'recentComment';

        this.list2.routerTarget = '_blank';
        this.list2.limit = 6;
        this.list2.sort = 'recentComment';

        this.list3.routerTarget = '_blank';
        this.list3.limit = 6;
        this.list3.sort = 'recentComment';

        this.list4.routerTarget = '_blank';
        this.list4.limit = 6;
        this.list4.sort = 'recentComment';

        this.list5.routerTarget = '_blank';
        this.list5.limit = 6;
        this.list5.sort = 'recentComment';

        this.list6.routerTarget = '_blank';
        this.list6.limit = 6;
        this.list6.sort = 'recentComment';

        // 태그
        this.list1.tag = '병맛';
        this.list1.getList();

        this.list2.tag = '애니리뷰';
        this.list2.getList();

        this.list3.tag = '게임';
        this.list3.getList();

        this.list4.tag = '더빙';
        this.list4.getList();

        this.list5.tag = '심영';
        this.list5.getList();
        
        this.list6.tag = '롤';
        this.list6.getList();

        this.list1.onChange.subscribe(res => {
            this.list1.getList();
        });
        
        this.list2.onChange.subscribe(res => {
            this.list2.getList();
        });
        
        this.list3.onChange.subscribe(res => {
            this.list3.getList();
        });
        
        this.list4.onChange.subscribe(res => {
            this.list4.getList();
        });
        
        this.list5.onChange.subscribe(res => {
            this.list5.getList();
        });
        
        this.list6.onChange.subscribe(res => {
            this.list6.getList();
        });
    }

}
