import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './pipe/time-ago.pipe';
import { VideoTimePipe } from './pipe/video-time.pipe';

const declarations = [TimeAgoPipe, VideoTimePipe];
@NgModule({
    imports: [
        CommonModule
    ],
    declarations,
    exports: declarations,
})
export class TimeModule { }
