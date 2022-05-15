import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Injectable()
export class CoreService {
    constructor(public _api: ApiService, public _router: Router) {
    }

    get isLoggedIn() {
        return !!this.user;
    }

    user: any;
    async updateStandardData() {
        try {
            const res = await this._api.getStandardData();
            this.user = res.user;
        } catch (e) { }
    }
    
    signInCallCount = 0;
    signIn() {
        const childWindow = window.open(`${environment.apiDomain}/sign-in/google/`, "google-sign-in", "toolbar=no,scrollbars=no,resizable=no,top=100,left=100,width=600,height=800");

        if (++this.signInCallCount === 1) {
            const interval = window.setInterval(() => {
                try {
                    console.log('a');
                    if (!childWindow || childWindow.closed) {
                        window.clearInterval(interval);
                        location.reload();
                    }
                } catch (e) {
                }
            }, 500);
        }
    }

    async signOut() {
        try {
            await this._api.signOut();
        } catch (e) { }
        finally {
            location.reload();
        }
    }
}