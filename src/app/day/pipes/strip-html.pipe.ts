import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml'
})
export class StripHtmlPipe implements PipeTransform {
  transform(input: string): string {
    if (!input) return '';

    return input.replace(/<.*?>/g, '');
  }
}
