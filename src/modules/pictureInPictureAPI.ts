// Document Picture-in-Picture API functionality

import { checkAPISupport, disableButtonAndShowError, formatError } from '../shared/utils';

let pipWindowRef: Window | null = null;

export function initPictureInPictureAPI(): void {
    const pipBtn = document.getElementById('pip-btn')!;
    const pipContent = document.getElementById('pip-content')!;
    const pipStatus = document.getElementById('pip-status')!;

    // Check for Document Picture-in-Picture API support
    const support = checkAPISupport(
        'Document Picture-in-Picture API',
        'documentPictureInPicture' in window
    );

    if (!support.supported) {
        disableButtonAndShowError(pipBtn, pipStatus, support.message!);
        return;
    }

    pipBtn.addEventListener('click', async () => {
        try {
            if (pipWindowRef && !pipWindowRef.closed) {
                // Close the PiP window
                pipWindowRef.close();
                pipWindowRef = null;
                document.documentElement.removeAttribute('data-pip');
                pipStatus.textContent = 'Closed Picture-in-Picture mode';
                pipBtn.textContent = 'Open PiP 🖼️';
            } else {
                // Enter PiP
                const pipWindow = await (window as any).documentPictureInPicture.requestWindow({
                    width: 400,
                    height: 300
                });

                // Store reference to PiP window
                pipWindowRef = pipWindow;

                // Copy content to PiP window
                pipWindow.document.body.innerHTML = pipContent.innerHTML;
                pipWindow.document.head.innerHTML = document.head.innerHTML;

                // Listen for when user closes the window
                pipWindow.addEventListener('pagehide', () => {
                    pipWindowRef = null;
                    document.documentElement.removeAttribute('data-pip');
                    pipStatus.textContent = 'Picture-in-Picture window closed';
                    pipBtn.textContent = 'Open PiP 🖼️';
                });

                // Mark as in PiP
                document.documentElement.setAttribute('data-pip', 'true');
                pipStatus.textContent = 'Opened in Picture-in-Picture mode';
                pipBtn.textContent = 'Close PiP ❌';
            }
        } catch (error) {
            pipStatus.textContent = `Error: ${formatError(error)}`;
        }
    });
}
