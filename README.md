# NgxSpeech

Voice recognition for Angular 5

![Build Status](https://travis-ci.org/onna/ngx-speech.svg?branch=master)](https://travis-ci.org/onna/ngx-speech)

## Principle

NgxSpeech allows to trigger actions using voice commands.

The `ngSpeechContext` directive allows to define context. For instance, "menu" could be a context that will allow to activate the menu commands, and "search" another context enabling search commands.

Example:

```html
<div [ngSpeechContext]="['pizza']">
  Say "pizza" and then choose your pizza
</div>
```

The `ngSpeechAction` directive allow to register a command into a context and bind it to method.

Example:

```html
<li [ngSpeechActionContext]="['pizza']"
    [ngSpeechActionCommand]="'Napolitana'"
    [ngSpeechAction]="order">Napolitana</li>
```

will trigger the `order()` method if we say "Napolitana" only if we are in the "pizza" context (i.e. we said "pizza" before saying "Napolitana").

All the words corresponding to a command or a context are compisong a **grammar**.

A command or a sub-context can be activcayed only if we are in the parent context, but a first-level context can activatyed from anywhere.

The `SpeechService` exposes useful observables:

- `message`, the last recognized word(s), even if it is not part of the current grammar,
- `context`, the current context as a path (like `"menu/account"`),
- `command`, the last comnmand.

## Installation

```
npm install ngx-speech
```