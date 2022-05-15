import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from './service/api.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreService } from './service/core.service';
import { HttpInterceptorService } from './service/http-interceptor.service';
import { MatSnackBarModule } from '@angular/material/core';
@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'video/list', pathMatch: 'prefix' },
            { path: 'main', redirectTo: 'video/list', pathMatch: 'prefix' },
            { path: 'auth', loadChildren: './module/page/auth-page/auth-page.module#AuthPageModule' },
            { path: 'video', loadChildren: './module/page/video-page/video-page.module#VideoPageModule' },
            { path: 'user', loadChildren: './module/page/user-page/user-page.module#UserPageModule' },
            { path: 'board', loadChildren: './module/page/board-page/board-page.module#BoardPageModule' },
        ], { onSameUrlNavigation: 'reload' }),
        HttpClientModule,
        MatSnackBarModule
    ],
    providers: [
        ApiService,
        CoreService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
