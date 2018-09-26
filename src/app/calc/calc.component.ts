import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SpeechService } from '../../lib';

@Component({
    selector: 'app-calc',
    templateUrl: './calc.component.html',
    styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnDestroy, OnInit {
    msg = 'nothing';
    comment = '';
    context = '';
    subscription = Subscription.EMPTY;
    good: any;
    pizzas: any[] = [
        'Sicilienne'
    ];
    started = false;

    private _destroyed = new Subject<void>();

    constructor(public speech: SpeechService) { }

    ngOnInit(): void {
        this.speech.start();
        this.speech.message.pipe(
            takeUntil(this._destroyed)
        ).subscribe(msg => this.msg = msg.message);
        this.speech.context.pipe(
            takeUntil(this._destroyed)
        ).subscribe(context =>  this.context = context);
        this.good = {message: 'Try me!'};
        this.speech.started.pipe(
            takeUntil(this._destroyed)
        ).subscribe(started => this.started = started);
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
        this.subscription.unsubscribe();
    }

    toggleVoiceRecognition(): void {
        if (this.started) {
            this.speech.stop();
        } else {
            this.speech.start();
        }
    }

    morePizza(): void {
        this.pizzas.push('Burger');
    }

    lessPizza(): void {
        this.pizzas = ['Tomato'];
        console.log(this.speech.recognition);
    }

    recordStart(): void {
        this.subscription = this.speech.message.subscribe(msg => {
            this.comment += msg.message + '\n';
        });
    }

    recordStop(): void {
        this.subscription.unsubscribe();
    }

    hello(): void {
        console.log('hello');
    }
}
