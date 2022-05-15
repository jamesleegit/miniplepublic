import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-board-list-page',
    templateUrl: './board-list-page.component.html',
    styleUrls: ['./board-list-page.component.scss']
})
export class BoardListPageComponent implements OnInit {

    constructor(private _route: ActivatedRoute) {
        this._route.params.subscribe(params => {
            if (params.category) {
                this.category = params.category;
            }
        });
    }

    category: string;

    ngOnInit() {
    }

}
