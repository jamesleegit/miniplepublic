import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainPageComponent } from './component/main-page/main-page.component';
import { LayoutModule } from '../../common/layout/layout.module';
import { VideoModule } from '../../common/video/video.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        LayoutModule,
        RouterModule.forChild([
            { path: '', component: MainPageComponent }
        ]),
        VideoModule,
        FormsModule
    ],
    declarations: [MainPageComponent]
})
export class MainPageModule { }
