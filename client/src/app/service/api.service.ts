import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class ApiService {
    constructor(private _http: HttpClient) {
    }

    blockUser(data: { userId: number }) {
        return this._http.post(`${environment.adminApiDomain}/admin/block-user`, data).toPromise();
    }

    deleteBoardTask(data: { id: number; }) {
        return this._http.post(`${environment.apiDomain}/delete-board-task`, data).toPromise();
    }

    insertBoardComment(data: { taskId: number; text: string; }) {
        return this._http.post(`${environment.apiDomain}/board-comment`, data).toPromise();
    }
    getBoardComments(data: { taskId: number; start: number; limit: number; }) {
        return this._http.get(`${environment.apiDomain}/board-comments`, {
            params: new HttpParams()
                .append('start', data.start.toString())
                .append('limit', data.limit.toString())
                .append('taskId', data.taskId.toString())
        }).toPromise();
    }
    getBoardTask(data: { id: number; }) {
        return this._http.get(`${environment.apiDomain}/board-task`, {
            params: new HttpParams()
                .append('id', data.id.toString())
        }).toPromise();
    }
    getBoardTasks(data: { category: string; start: number; limit: number; }) {
        return this._http.get(`${environment.apiDomain}/board-tasks`, {
            params: new HttpParams()
                .append('start', data.start.toString())
                .append('limit', data.limit.toString())
                .append('category', data.category)
        }).toPromise();
    }
    insertBoardTask(data: { category: string; title: string; content: string; files: any; }) {
        const formData: FormData = new FormData();
        formData.append('category', data.category);
        formData.append('title', data.title);
        formData.append('content', data.content);
        if (data.files) {
            console.log(data.files);
            for (let i in data.files) {
                formData.append(i, data.files[i]);
            }
        }
        return this._http.post(`${environment.apiDomain}/board-task`, formData).toPromise();
    }
    reactComment(data: { commentId: number; type: string; }) {
        return this._http.post(`${environment.apiDomain}/react-comment`, data).toPromise();
    }
    toggleUserThumbnail() {
        return this._http.post(`${environment.apiDomain}/toggle-user-thumbnail`, {}).toPromise();
    }
    changeUserNickname(data: { nickname: string; }) {
        return this._http.post(`${environment.apiDomain}/change-user-nickname`, data).toPromise();
    }
    getUsers(data: { start: number; limit: number; }) {
        return this._http.get<any>(`${environment.apiDomain}/users`, {
            params: new HttpParams()
                .append('start', String(data.start))
                .append('limit', String(data.limit))
        }).toPromise();
    }

    uploadVideo(data: { title: string; file: File; description: string; }) {
        const formData: FormData = new FormData();
        formData.append('file', data.file, 'file');
        formData.append('title', data.title);
        formData.append('description', data.description);
        return this._http.post<any>(`${environment.apiDomain}/upload-video`, formData, {}).toPromise();
    }

    uploadVideoForYoutube(data: { videoId: string; title: string; }) {
        return this._http.post<any>(`${environment.apiDomain}/upload-video-for-youtube`, data).toPromise();
    }

    moveData(data: { id: string; password: string; }) {
        return this._http.post<any>(`${environment.apiDomain}/move-data`, data).toPromise();
    }

    signOut() {
        return this._http.get<any>(`${environment.apiDomain}/sign-out/google`, {}).toPromise();
    }

    getStandardData() {
        return this._http.get<any>(`${environment.apiDomain}/standard`).toPromise();
    }

    getVideos(data: { start: number; limit: number; sort: string; tag: string; }) {
        return this._http.get<any>(`${environment.apiDomain}/videos`, {
            params: new HttpParams()
                .append('start', String(data.start))
                .append('limit', String(data.limit))
                .append('sort', String(data.sort))
                .append('tag', String(data.tag))
        }).toPromise();
    }

    getVideo(data: { videoId: string; }) {
        return this._http.get<any>(`${environment.apiDomain}/video`, {
            params: new HttpParams()
                .append('videoId', String(data.videoId))
        }).toPromise();
    }

    writeArtComment(data: {
        info: { text: string; x: number; y: number }[];
        videoId: string;
        time: number;
    }) {
        return this._http.post(`${environment.apiDomain}/art-comment`, data).toPromise();
    }

    writeComment(data: {
        time: number;
        x: number;
        y: number;
        videoId: string;
        text: string;
    }) {
        return this._http.post(`${environment.apiDomain}/comment`, data).toPromise();
    }

    likeVideo(data: {
        videoId: string;
    }) {
        return this._http.post<any>(`${environment.apiDomain}/like-video`, data).toPromise();
    }

    getUserUploadVideos(data: { userId: string; start: number; limit: number; }) {
        return this._http.get<any>(`${environment.apiDomain}/user/upload-videos`, {
            params: new HttpParams()
                .append('start', String(data.start))
                .append('limit', String(data.limit))
                .append('userId', String(data.userId))
        }).toPromise();
    }
    getUserLikeVideos(data: { userId: string; start: number; limit: number; }) {
        return this._http.get<any>(`${environment.apiDomain}/user/like-videos`, {
            params: new HttpParams()
                .append('start', String(data.start))
                .append('limit', String(data.limit))
                .append('userId', String(data.userId))
        }).toPromise();
    }
    getUserComments(data: { userId: string; start: number; limit: number; }) {
        return this._http.get<any>(`${environment.apiDomain}/user/comments`, {
            params: new HttpParams()
                .append('start', String(data.start))
                .append('limit', String(data.limit))
                .append('userId', String(data.userId))
        }).toPromise();
    }

    getUser(data: { userId: string; }) {
        return this._http.get<any>(`${environment.apiDomain}/user`, {
            params: new HttpParams()
                .append('userId', String(data.userId))
        }).toPromise();
    }
}