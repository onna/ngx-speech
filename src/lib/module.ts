import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SpeechService } from './speech.service';
import { SpeechActionDirective } from './speech-action.directive';
import { SpeechContextDirective } from './speech-context.directive';

@NgModule({
    declarations: [
        SpeechActionDirective,
        SpeechContextDirective
    ],
    imports: [
        CommonModule
    ],
    providers: [SpeechService],
    exports: [
        SpeechActionDirective,
        SpeechContextDirective
    ]
})
export class SpeechModule { }
