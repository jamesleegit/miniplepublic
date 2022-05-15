import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardListComponent } from '../../../../common/board/component/board-list/board-list.component';

@Component({
    selector: 'app-board-detail-page',
    templateUrl: './board-detail-page.component.html',
    styleUrls: ['./board-detail-page.component.scss']
})
export class BoardDetailPageComponent implements OnInit {

    @ViewChild('boardList') boardList: BoardListComponent;

    constructor(private _route: ActivatedRoute) {
        this._route.params.subscribe(params => {
            if (this.id && this.id !== params.id) {
                setTimeout(() => {
                    this.boardList.getList();
                }, 1000);
            }
            if (params.category) {
                this.category = params.category;
                this.id = params.id;
            }
        });
    }

    id: string;
    category: string;
    ngOnInit() {
    }

}
