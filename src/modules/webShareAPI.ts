// Web Share API functionality

import { checkAPISupport, disableButtonAndShowError, formatError, isAbortError } from '../shared/utils';

export function initWebShareAPI(): void {
    const shareTextBtn = document.getElementById('share-text-btn')!;
    const shareUrlBtn = document.getElementById('share-url-btn')!;
    const shareFileBtn = document.getElementById('share-file-btn')!;
    const shareResult = document.getElementById('share-result')!;

    // Check for Web Share API support
    const support = checkAPISupport(
        'Web Share API',
        'share' in navigator
    );

    if (!support.supported) {
        disableButtonAndShowError(shareTextBtn, shareResult, support.message!);
        disableButtonAndShowError(shareUrlBtn, shareResult, '');
        disableButtonAndShowError(shareFileBtn, shareResult, '');
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
            if (!isAbortError(error)) {
                shareResult.textContent = `Error sharing text: ${formatError(error)}`;
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
            if (!isAbortError(error)) {
                shareResult.textContent = `Error sharing URL: ${formatError(error)}`;
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
- CSS Anchor Positioning
- View Transition API
- File System Access API
- Document Picture-in-Picture API
- Vibration API
- Web Share API
- Push API

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
            if (!isAbortError(error)) {
                shareResult.textContent = `Error sharing file: ${formatError(error)}`;
            } else {
                shareResult.textContent = 'File sharing cancelled';
            }
        }
    });
}
