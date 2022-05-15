import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-page-nation',
    templateUrl: './page-nation.component.html',
    styleUrls: ['./page-nation.component.scss']
})
export class PageNationComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    get pageNationNow() {
        return Math.floor(this.start / this.limit);
    }

    get pageNationLast() {
        return Math.floor((this.allCount - 1) / this.limit);
    }

    min = Math.min;
    max = Math.max;

    get pageNationArray() {
        const arr = new Array();
        const now = this.pageNationNow;
        const last = this.pageNationLast;

        let start = Math.max(0, now - this.pagePadding);
        const end = Math.min(last + 1, start + (1 + 2 * this.pagePadding));
        if (end === last + 1) {
            start = Math.max(0, end - (1 + 2 * this.pagePadding));
        }
        for (let i = start; i < end; i++) {
            arr.push(i);
        }
        return arr;
    }

    @Input() start: number;
    @Input() limit: number;
    @Input() allCount: number;
    @Input() pagePadding = 4;

    @Output() change = new EventEmitter<number>();
}
