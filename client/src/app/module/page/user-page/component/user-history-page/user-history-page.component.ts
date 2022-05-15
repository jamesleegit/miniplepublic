import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-user-history-page',
    templateUrl: './user-history-page.component.html',
    styleUrls: ['./user-history-page.component.scss']
})
export class UserHistoryPageComponent implements OnInit {

    constructor(private _route: ActivatedRoute) {
        this._route.params.subscribe(res => {
            this.userId = res.userId;
        });
    }

    userId: string;
    ngOnInit() {
    }

}
