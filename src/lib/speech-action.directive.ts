import { Directive, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { SpeechService } from './speech.service';

@Directive({
    selector: '[ngSpeechAction]'
})
export class SpeechActionDirective implements OnDestroy, OnInit {
    @Input() ngSpeechAction: any;
    @Input() ngSpeechActionCommand: string;
    @Input() ngSpeechActionContext: string[] = [];

    private _destroyed = new Subject<void>();

    constructor(
        private _view: ViewContainerRef,
        public speech: SpeechService,
    ) { }

    ngOnInit(): void {
        this.speech.declareCommand(this.ngSpeechActionCommand, this.ngSpeechActionContext);
        this.speech.command.pipe(
            takeUntil(this._destroyed),
            filter(command => this.match(command))
        ).subscribe(
            _command => {
                const component = (<any>this._view.injector).view.component;
                this.ngSpeechAction.bind(component)();
            }
        );
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    match(command): boolean {
        const context = this.ngSpeechActionContext.map(w => w.toLowerCase()).join('/');
        return command.context === context && command.command === this.ngSpeechActionCommand.toLowerCase();
    }
}
