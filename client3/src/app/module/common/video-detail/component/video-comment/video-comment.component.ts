import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../../../service/api.service';
import {CoreService} from '../../../../../service/core.service';

@Component({selector: 'app-video-comment', templateUrl: './video-comment.component.html', styleUrls: ['./video-comment.component.scss']})
export class VideoCommentComponent implements OnInit {

    constructor(private _dialog : MatDialog, private _api : ApiService, public _core : CoreService) {}

    ngOnInit() {}

    floor(v) {
        return Math.floor(v);
    }

    openUserDialog(userId : number) {
        // const dialog = this._dialog.open(UserHistoryComponent, { maxWidth: '90vw', maxHeight: '70vh', width: '600px', height: '900px' });
        // dialog.componentInstance.userId = userId;
    }
    // isActiveReaction = false;

    isRemovingComment = false;
    async removeComment() {
        if (this.isRemovingComment || !this.data) {
            return;
        }
        if (!confirm('해당 코멘트를 삭제하시겠습니까?')) {
            return;
        }
        this.isRemovingComment = true;
        try {
            const data = this.data;
            await this._api.removeComment({id: data.id});
            this.onRemove.emit(data);
        } catch (e) {}
        this.isRemovingComment = false;
    }

    // @Input() showCreateTime = false;
    @Input()data : any;
    // @Input() currentTime: number;
    // @Output() seekTo = new EventEmitter();
    // @Output() onChange = new EventEmitter();
    @Output()onPlayTime = new EventEmitter();
    @Output()onRemove = new EventEmitter();
}
