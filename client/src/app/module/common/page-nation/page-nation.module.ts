import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNationComponent } from './component/page-nation/page-nation.component';

const declarations = [PageNationComponent];
@NgModule({
    imports: [
        CommonModule
    ],
    declarations,
    exports: declarations
})
export class PageNationModule { }
