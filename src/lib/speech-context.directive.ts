import { Directive, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SpeechService } from './speech.service';

@Directive({
    selector: '[ngSpeechContext]'
})
export class SpeechContextDirective implements OnDestroy, OnInit {
    @Input() ngSpeechContext: string[];
    @HostBinding('class') speechClass: string;

    private _destroyed = new Subject<void>();

    constructor(
        public speech: SpeechService
    ) { }

    ngOnInit(): void {
        this.speech.declareContext(this.ngSpeechContext);
        const localContext = this.ngSpeechContext.map(w => w.toLowerCase());
        this.speech.context.pipe(
            takeUntil(this._destroyed)
        ).subscribe(context => {
            if (context === localContext.join('/')) {
                this.speechClass = 'speech-active-context';
            } else if (context === localContext.slice(0, -1).join('/')) {
                this.speechClass = 'speech-active-context-child';
            } else if (context.startsWith(localContext.join('/'))) {
                this.speechClass = 'speech-active-context-ancestor';
            } else {
                this.speechClass = '';
            }
        });
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }
}
