// Vibration API functionality

import { checkAPISupport, disableButtonAndShowError, formatError } from '../shared/utils';

export function initVibrationAPI(): void {
    const vibrationSingleBtn = document.getElementById('vibration-single-btn')!;
    const vibrationPatternBtn = document.getElementById('vibration-pattern-btn')!;
    const vibrationStopBtn = document.getElementById('vibration-stop-btn')!;
    const vibrationResult = document.getElementById('vibration-result')!;

    // Check for Vibration API support
    const support = checkAPISupport(
        'Vibration API',
        'vibrate' in navigator
    );

    if (!support.supported) {
        disableButtonAndShowError(vibrationSingleBtn, vibrationResult, support.message!);
        disableButtonAndShowError(vibrationPatternBtn, vibrationResult, '');
        disableButtonAndShowError(vibrationStopBtn, vibrationResult, '');
        return;
    }

    vibrationSingleBtn.addEventListener('click', () => {
        try {
            navigator.vibrate(200);
            vibrationResult.textContent = 'Single vibration triggered (200ms)';
        } catch (error) {
            vibrationResult.textContent = `Error: ${formatError(error)}`;
        }
    });

    vibrationPatternBtn.addEventListener('click', () => {
        try {
            // Pattern: vibrate for 300ms, pause for 100ms, vibrate for 200ms, pause for 100ms, vibrate for 300ms
            navigator.vibrate([300, 100, 200, 100, 300]);
            vibrationResult.textContent = 'Pattern vibration triggered: [300, 100, 200, 100, 300]ms';
        } catch (error) {
            vibrationResult.textContent = `Error: ${formatError(error)}`;
        }
    });

    vibrationStopBtn.addEventListener('click', () => {
        try {
            navigator.vibrate(0);
            vibrationResult.textContent = 'Vibration stopped';
        } catch (error) {
            vibrationResult.textContent = `Error: ${formatError(error)}`;
        }
    });
}
