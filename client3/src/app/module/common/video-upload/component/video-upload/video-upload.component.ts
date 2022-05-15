import {ReturnStatement} from '@angular/compiler';
import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {ApiService} from 'src/app/service/api.service';
import {CoreService} from 'src/app/service/core.service';

@Component({selector: 'app-video-upload', templateUrl: './video-upload.component.html', styleUrls: ['./video-upload.component.scss']})
export class VideoUploadComponent implements OnInit {

    constructor(public _api : ApiService, public _matDialogRef : MatDialogRef < VideoUploadComponent >, public _core : CoreService, private _domSanitizer : DomSanitizer) {}

    ngOnInit(): void {}
    id : string;
    src : any;
    step1(url : string) {
        if (!url) {
            return;
        }
        const id = this.parseYoutube(url);
        if (! id) {
            alert('잘못된 주소입니다.');
            return;
        }
        this.id = id;
        this.src = this._domSanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}`);
    }
    async submit(title? : string) {
        try {
            const res = await this._api.uploadVideoForYoutube({videoId: this.id, title});
            if (res.isError) {
                alert('이미 등록된 영상입니다.');
            }
            this._core.openVideoPopup(res.videoId);
        } catch (e) {
            alert(e.error);
        }
    }
    parseYoutube(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return(match && match[7].length == 11) ? match[7] : false;
    }
}
