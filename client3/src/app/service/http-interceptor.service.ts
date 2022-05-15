import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap, map } from "rxjs/operators";
import { CoreService } from "./core.service";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    constructor(private _core: CoreService) {
    }

    isSessionExpired = false;

    intercept(req: HttpRequest<any>, next: HttpHandler)
        : Observable<HttpEvent<any>> {
        const userToken = localStorage.getItem('miniple-user-token');
        const setHeaders: any = {
            'Accept': 'application/json',
            'Cache': 'no-cache',
        };
        if (userToken) {
            setHeaders['Authorization'] = userToken;
        }
        req = req.clone({
            setHeaders,
            withCredentials: true
        });
        return next.handle(req).pipe(
            tap(
                (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                    }
                },
                res => {
                    if (res.status === 400 || res.status === 401) {
                        // this._matSnackBar.open(res.error || '알 수 없는 에러', '', {
                        //     duration: 4000
                        // });
                    }
                    if (res.status === 401 && this._core.isLoggedIn) {
                        this._core.signOut();
                    }
                }
            )
        );
    }
}
