import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Injectable()
export class CoreService {
    static user : any;
    get user() {
        return CoreService.user;
    }
    set user(next) {
        CoreService.user = next;
    }
    static isInited = false;
    get isInited() {
        return CoreService.isInited;
    };
    set isInited(next) {
        CoreService.isInited = next;
    };
    constructor(public _api : ApiService, public _router : Router, private _route : ActivatedRoute) {}

    get isLoggedIn() {
        return !!this.user;
    }

    updateStandardDataCallCount = 0;
    async updateStandardData() {
        try {
            const res = await this._api.getStandardData();
            this.user = res.user;
        } catch (e) {}
        this.isInited = true;
    }

    openVideoPopup(videoId : any) {
        this._router.navigate([], {
            queryParams: {
                v: videoId
            },
            relativeTo: this._route,
            queryParamsHandling: 'merge',
            // skipLocationChange: true
        });
    }
    closeVideoPopup() {
        this._router.navigate([], {
            queryParams: {
                v: null
            },
            relativeTo: this._route,
            queryParamsHandling: 'merge',
            // skipLocationChange: true
        });
    }

    signInCallCount = 0;
    signIn() {
        window.open(`${environment.apiDomain}/sign-in/google/`, "google-sign-in", "toolbar=no,scrollbars=no,resizable=no,top=100,left=100,width=600,height=800");

        window.onmessage = res => {
            console.log(res);
            if (res.data === 'success') {
                location.reload();
            }
        };
        return;
        // const iframe = window.document.createElement('iframe');
        // iframe.src = environment.apiDomain + '/sign-in/google/';
        // iframe.style.border = '0';
        // iframe.style.width = '100%';
        // iframe.style.height = '100%';
        // const div = window.document.createElement('div');
        // div.style.display = 'flex';
        // div.style.justifyContent = 'center';
        // div.style.alignItems = 'center';
        // div.style.width = '100vw';
        // div.style.height = '100vh';
        // div.style.background = 'rgba(0,0,0,.32)';
        // div.style.top = '0';
        // div.style.left = '0';
        // div.style.position = 'fixed';
        // div.style.zIndex = '99999999';
        // const div2 = window.document.createElement('div');
        // div2.setAttribute('style', `display: flex; flex-direction: column; background-color: #fff; max-width: 300px; width: 100%; height: 80vh; overflow: auto;`);
        // const div3 = window.document.createElement('button');
        // div3.setAttribute('style', `height: 45px; background-color: #eee; color: #555;`);
        // div3.innerHTML = '닫기';
        // div3.onclick = () => {
        //     div.remove();
        // };
        // const div4 = window.document.createElement('div');
        // div4.setAttribute('style', `flex: 1; width: 100%; height: 1px;`);
        // div4.appendChild(iframe);
        // div2.appendChild(div4);
        // div2.appendChild(div3);
        // div.appendChild(div2);
        // window.document.body.appendChild(div);
    }

    async signOut() {
        try {
            await this._api.signOut();
            location.reload();
        } catch (e) {} finally {
        }
    }
}
