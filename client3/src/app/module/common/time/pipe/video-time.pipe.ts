import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'videoTime'})
export class VideoTimePipe implements PipeTransform {

    transform(value : number, ...args : unknown[]): unknown {
        value = value / 1000;
        let sec_num: any = parseInt(String(value), 10); // don't forget the second param
        let hours: any = Math.floor(sec_num / 3600);
        let minutes: any = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds: any = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return(hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds;
    }

}
