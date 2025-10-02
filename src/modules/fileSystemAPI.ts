// File System Access API functionality

import { checkAPISupport, disableButtonAndShowError, formatError, isAbortError } from '../shared/utils';

export function initFileSystemAPI(): void {
    const fileReadBtn = document.getElementById('file-read-btn')!;
    const fileWriteBtn = document.getElementById('file-write-btn')!;
    const fileResult = document.getElementById('file-result')!;
    const fileContent = document.getElementById('file-content') as HTMLTextAreaElement;

    // Check for File System Access API support
    const support = checkAPISupport(
        'File System Access API',
        'showOpenFilePicker' in window
    );

    if (!support.supported) {
        disableButtonAndShowError(fileReadBtn, fileResult, support.message!);
        disableButtonAndShowError(fileWriteBtn, fileResult, '');
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
            if (!isAbortError(error)) {
                fileResult.textContent = `Error reading file: ${formatError(error)}`;
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
            if (!isAbortError(error)) {
                fileResult.textContent = `Error writing file: ${formatError(error)}`;
            }
        }
    });
}
