import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {CoreService} from 'src/app/service/core.service';

@Component({selector: 'app-my-profile', templateUrl: './my-profile.component.html', styleUrls: ['./my-profile.component.scss']})
export class MyProfileComponent implements OnInit {

    constructor(public _core : CoreService, public _matDialogRef : MatDialogRef < MyProfileComponent >) {}

    ngOnInit(): void {}

    tabType = 'bookmark';
}
