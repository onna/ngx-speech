import { TestBed, inject } from '@angular/core/testing';
import { ViewContainerRef } from '@angular/core';

import { SpeechActionDirective } from './speech-action.directive';
import { SpeechService } from './speech.service';

describe('SpeechActionDirective', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SpeechService,
                { provide: 'SPEECH_LANG', useValue: 'en-US' },
                ViewContainerRef,
            ],
        });
    });

    it('should create an instance', inject([SpeechService, ViewContainerRef], (service: SpeechService, viewContainer: ViewContainerRef) => {
        const directive = new SpeechActionDirective(viewContainer, service);
        expect(directive).toBeTruthy();
    }));
});
