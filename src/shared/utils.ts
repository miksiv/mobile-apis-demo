// Shared utility functions

import { APISupport } from './types';

// Check if an API is supported
export function checkAPISupport(apiName: string, condition: boolean): APISupport {
    if (!condition) {
        return {
            supported: false,
            message: `${apiName} not supported in this browser`
        };
    }
    return { supported: true };
}

// Disable button and show error message
export function disableButtonAndShowError(
    button: HTMLElement, 
    resultElement: HTMLElement, 
    message: string
): void {
    (button as HTMLButtonElement).disabled = true;
    resultElement.textContent = message;
    resultElement.style.background = '#f8d7da';
    resultElement.style.color = '#721c24';
}

// Show success message
export function showSuccess(
    resultElement: HTMLElement, 
    message: string
): void {
    resultElement.textContent = message;
    resultElement.style.background = '#d4edda';
    resultElement.style.color = '#155724';
}

// Show warning message
export function showWarning(
    resultElement: HTMLElement, 
    message: string
): void {
    resultElement.textContent = message;
    resultElement.style.background = '#fff3cd';
    resultElement.style.color = '#856404';
}

// Show error message
export function showError(
    resultElement: HTMLElement, 
    message: string
): void {
    resultElement.textContent = message;
    resultElement.style.background = '#f8d7da';
    resultElement.style.color = '#721c24';
}

// Format error message
export function formatError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

// Check for AbortError
export function isAbortError(error: unknown): boolean {
    return (error as Error).name === 'AbortError';
}
