// Web Speech API functionality

import { checkAPISupport, disableButtonAndShowError } from '../shared/utils';

let speechRecognition: any = null;
let isListening = false;

export function initSpeechAPI(): void {
    const speechBtn = document.getElementById('speech-btn')!;
    const speechResult = document.getElementById('speech-result')!;
    const speechStatus = document.getElementById('speech-status')!;

    // Check for Speech Recognition support
    const support = checkAPISupport(
        'Speech Recognition',
        ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window)
    );

    if (!support.supported) {
        disableButtonAndShowError(speechBtn, speechStatus, support.message!);
        return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    speechRecognition = new SpeechRecognition();
    
    speechRecognition.continuous = false;
    speechRecognition.interimResults = true;
    speechRecognition.lang = 'en-US';

    speechRecognition.onstart = () => {
        isListening = true;
        speechBtn.textContent = 'Listening... 🎤';
        speechBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
        speechStatus.textContent = 'Listening... Speak now!';
        speechStatus.style.background = '#d4edda';
        speechStatus.style.color = '#155724';
    };

    speechRecognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        speechResult.textContent = finalTranscript || interimTranscript;
    };

    speechRecognition.onerror = (event: any) => {
        speechStatus.textContent = `Error: ${event.error}`;
        speechStatus.style.background = '#f8d7da';
        speechStatus.style.color = '#721c24';
        resetSpeechButton();
    };

    speechRecognition.onend = () => {
        resetSpeechButton();
    };

    function resetSpeechButton() {
        isListening = false;
        speechBtn.textContent = 'Start Listening 🎤';
        speechBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        speechStatus.textContent = 'Click to start speech recognition';
        speechStatus.style.background = '#fff3cd';
        speechStatus.style.color = '#856404';
    }

    speechBtn.addEventListener('click', () => {
        if (isListening) {
            speechRecognition.stop();
        } else {
            speechRecognition.start();
        }
    });
}
