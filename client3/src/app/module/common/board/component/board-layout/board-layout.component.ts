import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-board-layout',
    templateUrl: './board-layout.component.html',
    styleUrls: ['./board-layout.component.scss']
})
export class BoardLayoutComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    @Input() category: string;
}
