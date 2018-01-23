    import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SpeechModule } from '../lib';

import { AppComponent } from './app.component';
import { CalcComponent } from './calc/calc.component';
import { PizzaComponent } from './pizza/pizza.component';


@NgModule({
    declarations: [
        AppComponent,
        CalcComponent,
        PizzaComponent
    ],
    imports: [
        BrowserModule,
        SpeechModule,
    ],
    providers: [
        { provide: 'SPEECH_LANG', useValue: 'en-US' },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
