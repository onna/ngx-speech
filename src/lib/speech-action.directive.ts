import { Directive, ViewContainerRef, Input, OnInit, OnDestroy } from '@angular/core';
import { SpeechService } from './speech.service';
import { Subscription } from 'rxjs/Subscription';

@Directive({
    selector: '[ngSpeechAction]'
})
export class SpeechActionDirective implements OnInit, OnDestroy {

    @Input() ngSpeechAction: any;
    @Input() ngSpeechActionCommand: string;
    @Input() ngSpeechActionContext: string[] = [];
    subscription: Subscription;

    constructor(
        private _view: ViewContainerRef,
        public speech: SpeechService,
    ) { }

    ngOnInit() {
        this.speech.declareCommand(this.ngSpeechActionCommand, this.ngSpeechActionContext);
        this.subscription = this.speech.command.subscribe(command => {
            if (this.match(command)) {
                const component = (<any>this._view.injector).view.component;
                this.ngSpeechAction.bind(component)();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    match(command): boolean {
        const context = this.ngSpeechActionContext.map(w => w.toLowerCase()).join('/');
        return command.context === context && command.command === this.ngSpeechActionCommand.toLowerCase();
    }

}
