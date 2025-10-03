// Web Speech API functionality with on-device recognition support

import { checkAPISupport, disableButtonAndShowError, showSuccess, showWarning, showError } from '../shared/utils';

let speechRecognition: any = null;
let isListening = false;
let languagePackAvailable = false;
let currentLanguage = 'en-US';

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
    
    // Configure speech recognition
    speechRecognition.continuous = false;
    speechRecognition.interimResults = true;
    speechRecognition.lang = currentLanguage;
    
    // Enable on-device processing if available
    if ('processLocally' in speechRecognition) {
        speechRecognition.processLocally = true;
        console.log('On-device speech recognition enabled');
    } else {
        console.log('On-device speech recognition not available, using cloud-based recognition');
    }

    // Check for language pack availability
    checkLanguagePackAvailability();

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

    // Check language pack availability
    async function checkLanguagePackAvailability() {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        console.log('Checking language pack availability for:', currentLanguage);
        
        // Check if the API supports language pack availability
        if (typeof SpeechRecognition.available === 'function') {
            try {
                // Use the correct format: langs array and processLocally flag
                const result = await SpeechRecognition.available({ 
                    langs: [currentLanguage], 
                    processLocally: true 
                });
                
                console.log('Language pack availability result:', result);
                
                if (result === 'unavailable') {
                    showError(speechStatus, `${currentLanguage} is not available to download at this time.`);
                    languagePackAvailable = false;
                } else if (result === 'available') {
                    showSuccess(speechStatus, `✓ On-device language pack for ${currentLanguage} is available!`);
                    console.log(`Language pack for ${currentLanguage} is available`);
                    languagePackAvailable = true;
                } else {
                    // result === 'not-downloaded' or similar
                    showWarning(speechStatus, `⚠️ Language pack for ${currentLanguage} not downloaded. Click 'Install Language Pack' to download.`);
                    console.log(`Language pack for ${currentLanguage} needs to be downloaded`);
                    languagePackAvailable = false;
                    
                    // Add install button if language pack is not available
                    addInstallButton();
                }
            } catch (error) {
                console.log('Language pack check not supported or failed:', error);
                showWarning(speechStatus, 'Using cloud-based speech recognition');
                languagePackAvailable = false;
            }
        } else {
            console.log('SpeechRecognition.available() not supported');
            showWarning(speechStatus, 'On-device recognition check not available. Using default recognition.');
            languagePackAvailable = false;
        }
    }

    // Install language pack
    async function installLanguagePack() {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (typeof SpeechRecognition.install === 'function') {
            try {
                showWarning(speechStatus, `📥 ${currentLanguage} language pack is downloading...`);
                console.log(`Installing language pack for ${currentLanguage}...`);
                
                // Use the correct format: langs array and processLocally flag
                const result = await SpeechRecognition.install({
                    langs: [currentLanguage],
                    processLocally: true
                });
                
                console.log('Language pack installation result:', result);
                
                if (result) {
                    languagePackAvailable = true;
                    showSuccess(speechStatus, `✓ ${currentLanguage} language pack downloaded successfully! Start recognition again.`);
                    console.log(`Language pack for ${currentLanguage} installed successfully`);
                    
                    // Remove install button after successful installation
                    removeInstallButton();
                    
                    // Re-enable on-device processing
                    if ('processLocally' in speechRecognition) {
                        speechRecognition.processLocally = true;
                    }
                } else {
                    showError(speechStatus, `${currentLanguage} language pack failed to download. Try again later.`);
                    console.error('Language pack installation failed');
                }
            } catch (error) {
                console.error('Failed to install language pack:', error);
                showError(speechStatus, `Failed to install language pack: ${error instanceof Error ? error.message : String(error)}`);
            }
        } else {
            showError(speechStatus, 'Language pack installation not supported');
            console.log('SpeechRecognition.install() not supported');
        }
    }

    // Add install button to the UI
    function addInstallButton() {
        // Check if button already exists
        if (document.getElementById('install-language-btn')) {
            return;
        }
        
        const installBtn = document.createElement('button');
        installBtn.id = 'install-language-btn';
        installBtn.className = 'demo-btn install-btn';
        installBtn.textContent = '📥 Install Language Pack';
        installBtn.style.background = 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)';
        
        installBtn.addEventListener('click', installLanguagePack);
        
        // Insert after the main speech button
        speechBtn.parentElement?.insertBefore(installBtn, speechBtn.nextSibling);
    }

    // Remove install button from the UI
    function removeInstallButton() {
        const installBtn = document.getElementById('install-language-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }

    // Language selector change handler
    function changeLanguage(newLanguage: string) {
        currentLanguage = newLanguage;
        speechRecognition.lang = newLanguage;
        console.log(`Language changed to: ${newLanguage}`);
        
        // Re-check language pack availability for new language
        checkLanguagePackAvailability();
    }

    // Add language selector
    function addLanguageSelector() {
        const languageSelector = document.getElementById('language-selector') as HTMLSelectElement;
        
        if (languageSelector) {
            languageSelector.addEventListener('change', (e) => {
                const target = e.target as HTMLSelectElement;
                changeLanguage(target.value);
            });
        }
    }

    speechBtn.addEventListener('click', async () => {
        if (isListening) {
            speechRecognition.stop();
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        // Check availability before starting (if supported)
        if (typeof SpeechRecognition.available === 'function') {
            try {
                const result = await SpeechRecognition.available({ 
                    langs: [currentLanguage], 
                    processLocally: true 
                });
                
                console.log('Language pack check result:', result);
                
                if (result === 'unavailable') {
                    showError(speechStatus, `${currentLanguage} is not available to download at this time. Sorry!`);
                    return;
                } else if (result === 'available') {
                    console.log('Starting speech recognition with on-device processing');
                    speechRecognition.start();
                } else {
                    // Language pack needs to be downloaded
                    showWarning(speechStatus, `📥 ${currentLanguage} language pack is downloading...`);
                    
                    const installResult = await SpeechRecognition.install({
                        langs: [currentLanguage],
                        processLocally: true
                    });
                    
                    if (installResult) {
                        showSuccess(speechStatus, `✓ ${currentLanguage} language pack downloaded. Starting recognition...`);
                        languagePackAvailable = true;
                        
                        // Re-enable on-device processing
                        if ('processLocally' in speechRecognition) {
                            speechRecognition.processLocally = true;
                        }
                        
                        // Start recognition after successful install
                        setTimeout(() => {
                            speechRecognition.start();
                        }, 500);
                    } else {
                        showError(speechStatus, `${currentLanguage} language pack failed to download. Try again later.`);
                    }
                }
            } catch (error) {
                console.log('Language pack check failed, using standard recognition:', error);
                speechRecognition.start();
            }
        } else {
            // No availability check support, just start
            console.log('Starting speech recognition (no availability check)');
            speechRecognition.start();
        }
    });

    // Initialize language selector if present
    addLanguageSelector();
}
