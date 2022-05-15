import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';

@Component({
    selector: 'app-user-history',
    templateUrl: './user-history.component.html',
    styleUrls: ['./user-history.component.scss']
})
export class UserHistoryComponent implements OnInit {

    constructor(private _api: ApiService) { }

    ngOnInit() {
    }

    tabType = '1';

    @Input() userId: number;
}
