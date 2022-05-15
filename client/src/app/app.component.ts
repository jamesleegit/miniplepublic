import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { CoreService } from './service/core.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private _core: CoreService, private _router: Router) {
        this._router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this._core.updateStandardData();
            }
            if (event instanceof NavigationEnd) {
                window.document.body.scrollTop = 0;
                window.document.body.scrollLeft = 0;
            }
            if (event instanceof NavigationError) {
            }
        });
    }
}
