import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../service/api.service';
import { CoreService } from '../../../../../service/core.service';

@Component({
    selector: 'app-board-write-page',
    templateUrl: './board-write-page.component.html',
    styleUrls: ['./board-write-page.component.scss']
})
export class BoardWritePageComponent implements OnInit {
    constructor(private _route: ActivatedRoute, private _api: ApiService, public _core: CoreService, private _router: Router) {
        this._route.params.subscribe(params => {
            if (params.category) {
                this.category = params.category;
            }
        });
    }

    category: string;

    ngOnInit() {
    }

    isSubmitting = false;
    async submit(input) {
        if (this.isSubmitting) {
            return;
        }
        if (!input.title) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!input.content) {
            alert('내용을 입력해주세요.');
            return;
        }
        this.isSubmitting = true;
        try {
            const res: any = await this._api.insertBoardTask({ title: input.title, content: input.content, category: input.category, files: input.files });
            this._router.navigate(['/board/' + input.category + '/detail/' + res.taskId]);
        } catch (e) { 
            console.log(e);
        }
        this.isSubmitting = false;
    }
}
