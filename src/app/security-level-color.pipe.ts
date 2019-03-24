import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({name: 'securityLevelColor'})
export class SecurityLevelColor implements PipeTransform {
    constructor(protected sanitizer: DomSanitizer) {}
    transform(value: string): SafeHtml {
        const level = parseFloat(value);
        const securityStatusColor: any = {
            1.0: '#2FEFEF',
            0.9: '#48F0C0',
            0.8: '#00EF47',
            0.7: '#00F000',
            0.6: '#8FEF2F',
            0.5: '#EFEF00',
            0.4: '#D77700',
            0.3: '#F06000',
            0.2: '#F04800',
            0.1: '#D73000',
            0.0: '#F00000'
        };
        if (level < 0) {
            return this.sanitizer.bypassSecurityTrustHtml(`<span style=color:#F00000;>${level} </span>`);
        } else {
            return this.sanitizer.bypassSecurityTrustHtml(`<span style=color:${securityStatusColor[level]};>${level} </span>`);
        }
    }
}
