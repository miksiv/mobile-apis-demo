// Global state
let speechRecognition: any = null;
let computePressureObserver: any = null;
let closeWatcher: any = null;
let pressureData: number[] = [];
let isListening = false;
let anchorPosition = 0;

// Tab navigation
function initTabNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');
    const apiCards = document.querySelectorAll('.api-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });

    // API card navigation
    apiCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetTab = card.getAttribute('data-tab');
            const tabButton = document.querySelector(`[data-tab="${targetTab}"]`) as HTMLElement;
            if (tabButton) {
                tabButton.click();
            }
        });
    });
}

// 1. Web Speech API
function initSpeechAPI() {
    const speechBtn = document.getElementById('speech-btn')!;
    const speechResult = document.getElementById('speech-result')!;
    const speechStatus = document.getElementById('speech-status')!;

    // Check for Speech Recognition support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        speechStatus.textContent = 'Speech Recognition not supported in this browser';
        speechBtn.disabled = true;
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

// 2. Compute Pressure API
function initComputePressureAPI() {
    const pressureBtn = document.getElementById('pressure-btn')!;
    const pressureResult = document.getElementById('pressure-result')!;
    const pressureChart = document.getElementById('pressure-chart')!;

    // Check for Compute Pressure API support
    if (!('computePressure' in navigator)) {
        pressureResult.textContent = 'Compute Pressure API not supported in this browser';
        pressureBtn.disabled = true;
        return;
    }

    let isMonitoring = false;

    pressureBtn.addEventListener('click', async () => {
        if (isMonitoring) {
            computePressureObserver?.disconnect();
            isMonitoring = false;
            pressureBtn.textContent = 'Start Monitoring 📊';
            pressureResult.textContent = 'Monitoring stopped';
            return;
        }

        try {
            computePressureObserver = await (navigator as any).computePressure((update: any) => {
                const pressure = update.cpuUtilization || 0;
                pressureData.push(pressure);
                
                // Keep only last 10 readings
                if (pressureData.length > 10) {
                    pressureData.shift();
                }

                // Update result display
                pressureResult.textContent = `CPU Utilization: ${(pressure * 100).toFixed(1)}%\nThermal State: ${update.thermalState || 'unknown'}\nSpeed: ${update.cpuSpeed || 'unknown'}`;

                // Update chart
                updatePressureChart();
            }, { sampleRate: 1 });

            isMonitoring = true;
            pressureBtn.textContent = 'Stop Monitoring 📊';
            pressureResult.textContent = 'Monitoring started...';
        } catch (error) {
            pressureResult.textContent = `Error: ${error}`;
        }
    });

    function updatePressureChart() {
        pressureChart.innerHTML = '';
        pressureData.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'pressure-bar';
            bar.style.height = `${value * 100}%`;
            bar.title = `${(value * 100).toFixed(1)}%`;
            pressureChart.appendChild(bar);
        });
    }
}

// 3. CSS Anchor Positioning
function initAnchorPositioning() {
    const anchorBtn = document.getElementById('anchor-btn')!;
    const anchoredElement = document.getElementById('anchored-element')!;

    anchorBtn.addEventListener('click', () => {
        anchorPosition = (anchorPosition + 1) % 4;
        
        switch (anchorPosition) {
            case 0:
                anchoredElement.style.top = '20px';
                anchoredElement.style.left = '20px';
                anchoredElement.textContent = 'Top Left';
                break;
            case 1:
                anchoredElement.style.top = '20px';
                anchoredElement.style.right = '20px';
                anchoredElement.style.left = 'auto';
                anchoredElement.textContent = 'Top Right';
                break;
            case 2:
                anchoredElement.style.bottom = '20px';
                anchoredElement.style.right = '20px';
                anchoredElement.style.top = 'auto';
                anchoredElement.textContent = 'Bottom Right';
                break;
            case 3:
                anchoredElement.style.bottom = '20px';
                anchoredElement.style.left = '20px';
                anchoredElement.style.right = 'auto';
                anchoredElement.textContent = 'Bottom Left';
                break;
        }
    });
}

// 4. View Transition API
function initViewTransitionAPI() {
    const transitionBtn = document.getElementById('transition-btn')!;
    const transitionCard = document.getElementById('transition-card')!;
    let cardState = 1;

    transitionBtn.addEventListener('click', () => {
        if (!document.startViewTransition) {
            // Fallback for browsers without View Transition API
            transitionCard.innerHTML = `<h3>Card ${cardState + 1}</h3><p>View Transition API not supported</p>`;
            cardState = (cardState + 1) % 3;
            return;
        }

        document.startViewTransition(() => {
            cardState = (cardState + 1) % 3;
            transitionCard.innerHTML = `<h3>Card ${cardState + 1}</h3><p>Click to transition!</p>`;
        });
    });
}

// 5. Navigation API
function initNavigationAPI() {
    const navBackBtn = document.getElementById('nav-back-btn')!;
    const navForwardBtn = document.getElementById('nav-forward-btn')!;
    const navPushBtn = document.getElementById('nav-push-btn')!;
    const navResult = document.getElementById('nav-result')!;

    let stateCounter = 0;

    // Check for Navigation API support
    if (!('navigation' in window)) {
        navResult.textContent = 'Navigation API not supported in this browser';
        navBackBtn.disabled = true;
        navForwardBtn.disabled = true;
        navPushBtn.disabled = true;
        return;
    }

    const navigation = (window as any).navigation;

    navBackBtn.addEventListener('click', () => {
        if (navigation.canGoBack) {
            navigation.back();
        } else {
            navResult.textContent = 'Cannot go back - no history';
        }
    });

    navForwardBtn.addEventListener('click', () => {
        if (navigation.canGoForward) {
            navigation.forward();
        } else {
            navResult.textContent = 'Cannot go forward - no history';
        }
    });

    navPushBtn.addEventListener('click', () => {
        stateCounter++;
        navigation.navigate(`/state-${stateCounter}`, {
            state: { counter: stateCounter, timestamp: Date.now() }
        });
        navResult.textContent = `Pushed state ${stateCounter} at ${new Date().toLocaleTimeString()}`;
    });

    // Listen for navigation events
    navigation.addEventListener('navigate', (event: any) => {
        console.log('Navigation event:', event);
    });
}

// 6. File System Access API
function initFileSystemAPI() {
    const fileReadBtn = document.getElementById('file-read-btn')!;
    const fileWriteBtn = document.getElementById('file-write-btn')!;
    const fileResult = document.getElementById('file-result')!;
    const fileContent = document.getElementById('file-content') as HTMLTextAreaElement;

    // Check for File System Access API support
    if (!('showOpenFilePicker' in window)) {
        fileResult.textContent = 'File System Access API not supported in this browser';
        fileReadBtn.disabled = true;
        fileWriteBtn.disabled = true;
        return;
    }

    let currentFileHandle: any = null;

    fileReadBtn.addEventListener('click', async () => {
        try {
            const [fileHandle] = await (window as any).showOpenFilePicker({
                types: [{
                    description: 'Text files',
                    accept: { 'text/plain': ['.txt'] }
                }]
            });

            currentFileHandle = fileHandle;
            const file = await fileHandle.getFile();
            const content = await file.text();
            
            fileContent.value = content;
            fileResult.textContent = `File loaded: ${file.name} (${file.size} bytes)`;
        } catch (error) {
            if (error.name !== 'AbortError') {
                fileResult.textContent = `Error reading file: ${error}`;
            }
        }
    });

    fileWriteBtn.addEventListener('click', async () => {
        try {
            if (!currentFileHandle) {
                // Create new file
                const [fileHandle] = await (window as any).showSaveFilePicker({
                    types: [{
                        description: 'Text files',
                        accept: { 'text/plain': ['.txt'] }
                    }]
                });
                currentFileHandle = fileHandle;
            }

            const writable = await currentFileHandle.createWritable();
            await writable.write(fileContent.value);
            await writable.close();

            fileResult.textContent = `File saved: ${currentFileHandle.name}`;
        } catch (error) {
            if (error.name !== 'AbortError') {
                fileResult.textContent = `Error writing file: ${error}`;
            }
        }
    });
}

// 7. Document Picture-in-Picture API
function initPictureInPictureAPI() {
    const pipBtn = document.getElementById('pip-btn')!;
    const pipContent = document.getElementById('pip-content')!;
    const pipStatus = document.getElementById('pip-status')!;

    // Check for Document Picture-in-Picture API support
    if (!('documentPictureInPicture' in window)) {
        pipStatus.textContent = 'Document Picture-in-Picture API not supported in this browser';
        pipBtn.disabled = true;
        return;
    }

    pipBtn.addEventListener('click', async () => {
        try {
            if (document.documentElement.hasAttribute('data-pip')) {
                // Exit PiP
                await (window as any).documentPictureInPicture.exit();
                pipStatus.textContent = 'Exited Picture-in-Picture mode';
                pipBtn.textContent = 'Open PiP 🖼️';
            } else {
                // Enter PiP
                const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
                    width: 400,
                    height: 300
                });

                // Copy content to PiP window
                pipWindow.document.body.innerHTML = pipContent.innerHTML;
                pipWindow.document.head.innerHTML = document.head.innerHTML;

                // Mark as in PiP
                document.documentElement.setAttribute('data-pip', 'true');
                pipStatus.textContent = 'Opened in Picture-in-Picture mode';
                pipBtn.textContent = 'Exit PiP 🖼️';
            }
        } catch (error) {
            pipStatus.textContent = `Error: ${error}`;
        }
    });
}

// 8. CloseWatcher API
function initCloseWatcherAPI() {
    const closeWatcherBtn = document.getElementById('closewatcher-btn')!;
    const closeWatcherResult = document.getElementById('closewatcher-result')!;

    // Check for CloseWatcher API support
    if (!('CloseWatcher' in window)) {
        closeWatcherResult.textContent = 'CloseWatcher API not supported in this browser';
        closeWatcherBtn.disabled = true;
        return;
    }

    let isWatching = false;

    closeWatcherBtn.addEventListener('click', () => {
        if (isWatching) {
            closeWatcher?.close();
            isWatching = false;
            closeWatcherBtn.textContent = 'Start Watching 👁️';
            closeWatcherResult.textContent = 'CloseWatcher stopped';
            return;
        }

        try {
            closeWatcher = new (window as any).CloseWatcher();
            
            closeWatcher.addEventListener('close', () => {
                closeWatcherResult.textContent = `Close attempt detected at ${new Date().toLocaleTimeString()}`;
                isWatching = false;
                closeWatcherBtn.textContent = 'Start Watching 👁️';
            });

            closeWatcher.addEventListener('cancel', () => {
                closeWatcherResult.textContent = `Close attempt cancelled at ${new Date().toLocaleTimeString()}`;
            });

            isWatching = true;
            closeWatcherBtn.textContent = 'Stop Watching 👁️';
            closeWatcherResult.textContent = 'CloseWatcher active - try closing the tab or navigating away!';
        } catch (error) {
            closeWatcherResult.textContent = `Error: ${error}`;
        }
    });
}

// 9. Vibration API
function initVibrationAPI() {
    const vibrationSingleBtn = document.getElementById('vibration-single-btn')!;
    const vibrationPatternBtn = document.getElementById('vibration-pattern-btn')!;
    const vibrationStopBtn = document.getElementById('vibration-stop-btn')!;
    const vibrationResult = document.getElementById('vibration-result')!;

    // Check for Vibration API support
    if (!('vibrate' in navigator)) {
        vibrationResult.textContent = 'Vibration API not supported in this browser/device';
        vibrationSingleBtn.disabled = true;
        vibrationPatternBtn.disabled = true;
        vibrationStopBtn.disabled = true;
        return;
    }

    vibrationSingleBtn.addEventListener('click', () => {
        try {
            navigator.vibrate(200);
            vibrationResult.textContent = 'Single vibration triggered (200ms)';
        } catch (error) {
            vibrationResult.textContent = `Error: ${error}`;
        }
    });

    vibrationPatternBtn.addEventListener('click', () => {
        try {
            // Pattern: vibrate for 300ms, pause for 100ms, vibrate for 200ms, pause for 100ms, vibrate for 300ms
            navigator.vibrate([300, 100, 200, 100, 300]);
            vibrationResult.textContent = 'Pattern vibration triggered: [300, 100, 200, 100, 300]ms';
        } catch (error) {
            vibrationResult.textContent = `Error: ${error}`;
        }
    });

    vibrationStopBtn.addEventListener('click', () => {
        try {
            navigator.vibrate(0);
            vibrationResult.textContent = 'Vibration stopped';
        } catch (error) {
            vibrationResult.textContent = `Error: ${error}`;
        }
    });
}

// 10. Web Share API
function initWebShareAPI() {
    const shareTextBtn = document.getElementById('share-text-btn')!;
    const shareUrlBtn = document.getElementById('share-url-btn')!;
    const shareFileBtn = document.getElementById('share-file-btn')!;
    const shareResult = document.getElementById('share-result')!;

    // Check for Web Share API support
    if (!('share' in navigator)) {
        shareResult.textContent = 'Web Share API not supported in this browser';
        shareTextBtn.disabled = true;
        shareUrlBtn.disabled = true;
        shareFileBtn.disabled = true;
        return;
    }

    shareTextBtn.addEventListener('click', async () => {
        try {
            await navigator.share({
                title: 'Modern Web APIs Demo',
                text: 'Check out this amazing demo of modern web APIs! 🚀',
            });
            shareResult.textContent = 'Text shared successfully!';
        } catch (error) {
            if (error.name !== 'AbortError') {
                shareResult.textContent = `Error sharing text: ${error}`;
            } else {
                shareResult.textContent = 'Text sharing cancelled';
            }
        }
    });

    shareUrlBtn.addEventListener('click', async () => {
        try {
            await navigator.share({
                title: 'Modern Web APIs Demo',
                text: 'Explore cutting-edge web APIs!',
                url: window.location.href,
            });
            shareResult.textContent = 'URL shared successfully!';
        } catch (error) {
            if (error.name !== 'AbortError') {
                shareResult.textContent = `Error sharing URL: ${error}`;
            } else {
                shareResult.textContent = 'URL sharing cancelled';
            }
        }
    });

    shareFileBtn.addEventListener('click', async () => {
        try {
            // Create a simple text file
            const content = `Modern Web APIs Demo Report
Generated: ${new Date().toLocaleString()}

This demo showcases the following APIs:
- Web Speech API
- Compute Pressure API
- CSS Anchor Positioning
- View Transition API
- Navigation API
- File System Access API
- Document Picture-in-Picture API
- CloseWatcher API
- Vibration API
- Web Share API

Visit: ${window.location.href}`;

            const blob = new Blob([content], { type: 'text/plain' });
            const file = new File([blob], 'web-apis-demo-report.txt', { type: 'text/plain' });

            await navigator.share({
                title: 'Web APIs Demo Report',
                text: 'Report from Modern Web APIs Demo',
                files: [file],
            });
            shareResult.textContent = 'File shared successfully!';
        } catch (error) {
            if (error.name !== 'AbortError') {
                shareResult.textContent = `Error sharing file: ${error}`;
            } else {
                shareResult.textContent = 'File sharing cancelled';
            }
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTabNavigation();
    initSpeechAPI();
    initComputePressureAPI();
    initAnchorPositioning();
    initViewTransitionAPI();
    initNavigationAPI();
    initFileSystemAPI();
    initPictureInPictureAPI();
    initCloseWatcherAPI();
    initVibrationAPI();
    initWebShareAPI();
});
