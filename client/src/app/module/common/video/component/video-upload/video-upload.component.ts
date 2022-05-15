import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-video-upload',
    templateUrl: './video-upload.component.html',
    styleUrls: ['./video-upload.component.scss']
})
export class VideoUploadComponent implements OnInit {

    constructor(private _api: ApiService, private _router: Router) { }
    tabType: 'create' | 'youtube' = 'create';

    ngOnInit() {
    }


    titleForYoutube = '';
    videoId: string;
    title: string;
    description: string;
    fileToUpload: File;
    isUploading = false;
    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
        console.log(this.fileToUpload)
    }

    async uploadYoutube() {
        if (!this.videoId) {
            alert('유튜브 비디오아이디를 입력바랍니다.');
            return;
        }
        this.isUploading = true;
        try {
            const res = await this._api.uploadVideoForYoutube({
                videoId: this.videoId,
                title: this.titleForYoutube
            });
            this.isUploading = false;
            this._router.navigate(['/video/id/' + res.videoId]);
        } catch (e) {
            this.isUploading = false;
         }
    }

    async upload() {
        if (!this.fileToUpload) {
            alert('파일을 업로드해주세요.');
            return;
        }
        if (!this.title) {
            alert('영상제목을 입력해주세요.');
            return;
        }
        if (!this.description) {
            alert('영상설명을 입력해주세요.');
            return;
        }
        this.isUploading = true;
        try {
            const res = await this._api.uploadVideo({
                title: this.title,
                description: this.description,
                file: this.fileToUpload
            });
            this.isUploading = false;
            this._router.navigate(['/video/id/' + res.videoId]);
        } catch (e) {
            this.isUploading = false;
        }
    }
}
