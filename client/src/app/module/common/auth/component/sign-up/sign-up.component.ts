import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

    constructor(private _api: ApiService, private _router: Router) { }

    ngOnInit() {
    }

}
