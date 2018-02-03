import { Component, OnInit } from '@angular/core';
import { SpeechService } from '../../lib';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-calc',
    templateUrl: './calc.component.html',
    styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnInit {

    msg = 'nothing';
    comment = '';
    context = '';
    subscription: Subscription;
    good: any;
    pizzas: any[] = [
        'Sicilienne',
    ];
    started = false;

    constructor(public speech: SpeechService) { }

    ngOnInit() {
        this.speech.start();
        this.speech.message.subscribe(msg => {
            this.msg = msg.message;
        });
        this.speech.context.subscribe(context => {
            this.context = context;
        });
        this.good = {message: 'Try me!'};
        this.speech.started.subscribe(started => this.started = started);
    }

    toggleVoiceRecognition() {
        if (this.started) {
            this.speech.stop();
        } else {
            this.speech.start();
        }
    }

    morePizza() {
        this.pizzas.push('Burger');
    }

    lessPizza() {
        this.pizzas = ['Tomato'];
        console.log(this.speech.recognition);
    }

    recordStart() {
        this.subscription = this.speech.message.subscribe(msg => {
            this.comment += msg.message + '\n';
        });
    }

    recordStop() {
        this.subscription.unsubscribe();
    }

}
