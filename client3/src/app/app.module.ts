import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from './service/api.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreService } from './service/core.service';
import { HttpInterceptorService } from './service/http-interceptor.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogConfig,  MatDialogModule,  MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { VideoListPageModule } from './module/page/video-list-page/video-list-page.module';
import { VideoDetailModule } from './module/common/video-detail/video-detail.module';
import { BoardPageModule } from './module/page/board-page/board-page.module';
import { VideoDetailPageModule } from './module/page/video-detail-page/video-detail-page.module';
import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';
@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        VideoDetailModule,
        MatDialogModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'list', pathMatch: 'prefix' },
            { path: 'list', loadChildren: ()=>VideoListPageModule},
            { path: 'board', loadChildren: ()=>BoardPageModule},
            { path: 'v', loadChildren: ()=>VideoDetailPageModule},
            // { path: 'auth', loadChildren: './module/page/auth-page/auth-page.module#AuthPageModule' },
            // { path: 'user', loadChildren: './module/page/user-page/user-page.module#UserPageModule' },
            // { path: 'board', loadChildren: './module/page/board-page/board-page.module#BoardPageModule' },
        ], { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' }),
        HttpClientModule,
    ],
    providers: [
        ApiService,
        CoreService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true,
        },
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
              ...new MatDialogConfig(),
              panelClass: 'custom-mat-dialog-container'
            } as MatDialogConfig
        },
        { provide: OverlayContainer, useClass: FullscreenOverlayContainer }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
