import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponent } from './component/video/video.component';
import { RouterModule } from '@angular/router';
import { TimeModule } from '../time/time.module';
import { MatTooltipModule } from '@angular/material/core';
const declarations = [VideoComponent];
const exports = declarations;
@NgModule({
    declarations,
    exports,
    imports: [
        RouterModule,
        TimeModule,
        MatTooltipModule,
        CommonModule
    ],
})
export class UtilModule { }
