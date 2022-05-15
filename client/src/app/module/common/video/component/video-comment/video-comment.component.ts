import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserHistoryComponent } from '../../../user/component/user-history/user-history.component';
import { MatDialog } from '@angular/material/core';
import { ApiService } from '../../../../../service/api.service';
import { CoreService } from '../../../../../service/core.service';

@Component({
    selector: 'app-video-comment',
    templateUrl: './video-comment.component.html',
    styleUrls: ['./video-comment.component.scss']
})
export class VideoCommentComponent implements OnInit {

    constructor(private _dialog: MatDialog, private _api: ApiService, public _core: CoreService) { }

    ngOnInit() {
    }

    countDown(time) {
        time = Math.max(0, time);
        return `${Math.floor(time / 60000)}:${String(Math.floor(time / 1000) % 59 + 1).length === 1 ? '0' : ''}${Math.floor(time / 1000) % 59 + 1}`;
    }

    toTimeForDisplay(time) {
        return `${Math.floor(time / 60000)}:${String(Math.floor(time / 1000) % 60).length === 1 ? '0' : ''}${Math.floor(time / 1000) % 60}`;
    };

    floor(v) { return Math.floor(v); }

    openUserDialog(userId: number) {
        const dialog = this._dialog.open(UserHistoryComponent, { maxWidth: '90vw', maxHeight: '70vh', width: '600px', height: '900px' });
        dialog.componentInstance.userId = userId;
    }
    isActiveReaction = false;

    isReacting = false;
    async react(type: string) {
        if (this.isReacting) {
            return;
        }
        this.isReacting = true;
        try {
            const res: any = await this._api.reactComment({ commentId: this.data.id, type });
            if (res.id === this.data.id) {
                this.data.reactions = res.reactions;
                this.isActiveReaction = false;
                this.onChange.emit(res);
            }
        } catch (e) { }
        this.isReacting = false;
    }

    @Input() showCreateTime = false;
    @Input() data: any;
    @Input() currentTime: number;
    @Output() seekTo = new EventEmitter();
    @Output() onChange = new EventEmitter();
}
