import { Component, OnInit } from '@angular/core';
import { SpeechService } from '../../lib';

@Component({
    selector: 'app-calc',
    templateUrl: './calc.component.html',
    styleUrls: ['./calc.component.css']
})
export class CalcComponent implements OnInit {

    msg = 'nothing';
    context = '';
    good: any;
    pizzas: any[] = [
        'Sicilienne',
    ];

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
    }

    morePizza() {
        this.pizzas.push('Burger');
    }

    lessPizza() {
        this.pizzas = ['Tomato'];
        console.log(this.speech.recognition);
    }

}
