// Document Picture-in-Picture API functionality

import { checkAPISupport, disableButtonAndShowError, formatError } from '../shared/utils';

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
            pipStatus.textContent = `Error: ${formatError(error)}`;
        }
    });
}
