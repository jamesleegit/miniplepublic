import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

    constructor(private _api: ApiService, private _router: Router, private _domSnaitizer: DomSanitizer) { }

    iframeUrl: any;
    ngOnInit() {
        this.iframeUrl = this._domSnaitizer.bypassSecurityTrustResourceUrl(`${environment.apiDomain}/sign-in/google`);
    }

}
