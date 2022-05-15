import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/core';
import { UserHistoryComponent } from '../user-history/user-history.component';

@Component({
    selector: 'app-user-box',
    templateUrl: './user-box.component.html',
    styleUrls: ['./user-box.component.scss']
})
export class UserBoxComponent implements OnInit {

    constructor(private _matDialog: MatDialog) { }

    ngOnInit() {
    }

    openPopup(userId) {
        const dialog = this._matDialog.open(UserHistoryComponent, { maxWidth: '90vw', maxHeight: '70vh', width: '600px', height: '900px' });
        dialog.componentInstance.userId = userId;
    }

    @Input() user: any;
}
