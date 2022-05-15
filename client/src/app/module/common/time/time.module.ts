import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './pipe/time-ago.pipe';

const declarations = [TimeAgoPipe];
@NgModule({
    imports: [
        CommonModule
    ],
    declarations,
    exports: declarations
})
export class TimeModule { }
