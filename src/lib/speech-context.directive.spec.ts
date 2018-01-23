import { TestBed, inject } from '@angular/core/testing';

import { SpeechContextDirective } from './speech-context.directive';
import { SpeechService } from './speech.service';

describe('SpeechContextDirective', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
        providers: [
            SpeechService,
            { provide: 'SPEECH_LANG', useValue: 'en-US' },
        ],
        });
    });

    it('should create an instance', inject([SpeechService], (service: SpeechService) => {
        const directive = new SpeechContextDirective(service);
        expect(directive).toBeTruthy();
    }));
});
