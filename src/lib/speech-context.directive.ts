import { Directive, Input, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { SpeechService } from './speech.service';
import { Subscription } from 'rxjs/Subscription';

@Directive({
    selector: '[ngSpeechContext]'
})
export class SpeechContextDirective implements OnInit, OnDestroy {

    @Input() ngSpeechContext: string[];
    @HostBinding('class') speechClass: string;
    subscription: Subscription;

    constructor(
        public speech: SpeechService,
    ) { }

    ngOnInit() {
        this.speech.declareContext(this.ngSpeechContext);
        const localContext = this.ngSpeechContext.map(w => w.toLowerCase());
        this.subscription = this.speech.context.subscribe(context => {
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

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
