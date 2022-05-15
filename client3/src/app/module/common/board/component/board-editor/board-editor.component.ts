import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';

@Component({
    selector: 'app-board-editor',
    templateUrl: './board-editor.component.html',
    styleUrls: ['./board-editor.component.scss']
})
export class BoardEditorComponent implements OnInit {

    constructor(private _api: ApiService) { }

    ngOnInit() {
    }
    input = {
        title: '',
        content: '',
    };


    isSubmitting = false;
    get outputInput() {
        return {
            ...this.input,
            category: this.category
        };
    }
    @Output() onSubmit = new EventEmitter();
    @Input() category: string;
    @Input() disabled = false;
}
