import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
        const gap = new Date().getTime() - new Date(value).getTime();
        if (gap < 1000 * 1) {
            return `방금전`;
        }
        if (gap < 1000 * 60) {
            return `${Math.floor(gap / 1000)}초전`;
        }
        if (gap < 1000 * 60 * 60) {
            return `${Math.floor(gap / 1000 / 60)}분전`;
        }

        if (gap < 1000 * 60 * 60 * 24) {
            return `${Math.floor(gap / 1000 / 60 / 60)}시간전`;
        }

        if (gap < 1000 * 60 * 60 * 24 * 30) {
            return `${Math.floor(gap / 1000 / 60 / 60 / 24)}일전`;
        }

        if (gap < 1000 * 60 * 60 * 24 * 30 * 365) {
            return `${Math.floor(gap / 1000 / 60 / 60 / 24 / 30)}개월전`;
        }

        if (gap >= 1000 * 60 * 60 * 24 * 30 * 365) {
            return `${Math.floor(gap / 1000 / 60 / 60 / 24 / 30 / 365)}년전`;
        }
    }

}
