import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
  //Formats the seconds to days, hours and minutes
  transform(seconds: number | string, ...args: void[]): string {
    seconds = typeof seconds === 'string' ? parseInt(seconds) : seconds;
    const secInDay = 3600 * 24;
    const days = Math.floor(seconds / secInDay);
    seconds -= days * secInDay;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const min = Math.floor(seconds / 60);

    const display = {
      hours: hours.toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      }),
      min: min.toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      }),
    };

    return `${days > 0 ? `${days} Days` : ''} ${display.hours}:${display.min}`;
  }
}
