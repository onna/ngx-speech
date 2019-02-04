const ngxSpeechStorageMock = () => {
    let storage = {};
    return {
        getItem: key => key in storage ? storage[key] : null,
        setItem: (key, value) => storage[key] = value || '',
        removeItem: key => delete storage[key],
        clear: () => storage = {},
    };
};

class NgxSpeechRecognitionMock {}

Object.defineProperty(window, 'SpeechRecognition', { value: NgxSpeechRecognitionMock });
Object.defineProperty(window, 'localStorage', { value: ngxSpeechStorageMock() });
Object.defineProperty(window, 'sessionStorage', { value: ngxSpeechStorageMock() });
Object.defineProperty(window, 'getComputedStyle', {
    value: () => ['-webkit-appearance']
});
