import { Inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

const DEFAULT_GRAMMAR = `#JSGF V1.0; grammar Digits;
public <Digits> = ( <digit> ) + ;
<digit> = ( zero | one | two | three | four | five | six | seven | eight | nine );`;

@Injectable()
export class SpeechService implements OnDestroy {
    recognition: any;
    message: Subject<any> = new Subject();
    command: Subject<any> = new Subject();
    commands: {} = {};
    context: BehaviorSubject<string> = new BehaviorSubject('');
    refreshGrammar: BehaviorSubject<boolean> = new BehaviorSubject(false);
    started: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private _destroyed = new Subject<void>();

    constructor(
        private zone: NgZone,
        @Inject('SPEECH_LANG') public lang: string,
    ) {
        const SpeechRecognition = window['SpeechRecognition'] || window['webkitSpeechRecognition'];
        this.recognition = new SpeechRecognition();
        this.recognition.lang = lang;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;
        this.recognition.continuous = true;

        this.recognition.onresult = event => {
            let message = {};
            let word = '';
            if (event.results) {
                const result = event.results[event.resultIndex];
                if (result.isFinal) {
                    if (result[0].confidence < 0.3) {
                        message = {error: true, message: 'Cannot recognize'};
                    } else {
                        word = result[0].transcript.trim().toLowerCase();
                        message = {success: true, message: word};
                    }
                }
            }
            this.zone.run(() => {
                if (message['error']) {
                    this.message.error(message);
                } else {
                    this.message.next(message);
                    const context = this.getContextForWord(word);
                    if (context) {
                        this.context.next(context);
                    } else {
                        const isCommand = this.commands[this.context.value] && this.commands[this.context.value][word];
                        if (isCommand) {
                            this.command.next({context: this.context.value, command: word});
                        } else {
                            // try to match a global context command
                            const isGlobalCommand = this.commands[''] && this.commands[''][word];
                            if (isGlobalCommand) {
                                this.command.next({context: '', command: word});
                            }
                        }
                    }
                }
            });
        };
        this.recognition.onerror = error => {
            this.zone.run(() => {
                this.message.error(error);
            });
        };
        this.recognition.onstart = () => {
            this.zone.run(() => {
                this.started.next(true);
            });
        };
        this.recognition.onend = () => {
            this.zone.run(() => {
                this.started.next(false);
            });
        };

        this.refreshGrammar.pipe(
            takeUntil(this._destroyed),
            debounceTime(500)
        ).subscribe(() => {
            this.setGrammar();
        });
    }

    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
    }

    start(): void {
        this.recognition.start();
    }

    stop(): void {
        this.recognition.stop();
    }

    declareContext(context: string[]): void {
        const contextKey = context.map(w => w.toLowerCase()).join('/');
        if (!this.commands[contextKey]) {
            this.commands[contextKey] = {};
        }
        this.refreshGrammar.next(true);
    }

    declareCommand(command, context): void {
        const contextKey = context.map(w => w.toLowerCase()).join('/');
        if (!this.commands[contextKey]) {
            this.commands[contextKey] = {};
        }
        this.commands[contextKey][command.toLowerCase()] = true;
        this.refreshGrammar.next(true);
    }

    setContext(context: string[]): void {
        const contextKey = context.map(w => w.toLowerCase()).join('/');
        this.context.next(contextKey);
    }

    getContextForWord(word: string): string | null {
        // first try to match a subcontext of the current context
        const context = this.context.value ? this.context.value + '/' + word : word;
        if (this.commands[context]) {
            return context;
        }
        // then try top-level context
        if (this.commands[word]) {
            return word;
        }
        return null;
    }

    private setGrammar(): void {
        const SpeechGrammarList = window['SpeechGrammarList'] || window['webkitSpeechGrammarList'];
        const words = {};
        Object.keys(this.commands).forEach(context => {
            context.split('/').forEach(word => {
                words[word] = true;
            });
            Object.keys(this.commands[context]).forEach(command => words[command] = true);
        });
        const grammar = DEFAULT_GRAMMAR + ' public <command> = ' + Object.keys(words).join(' | ') + ' ;';
        const speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        this.recognition.grammars = speechRecognitionList;
    }
}
