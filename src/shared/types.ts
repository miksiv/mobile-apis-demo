// Shared types and interfaces for the demo

export interface DemoResult {
    success: boolean;
    message: string;
    data?: any;
}

export interface NotificationOptions {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
}

// Global state interface
export interface GlobalState {
    speechRecognition: any;
    computePressureObserver: any;
    closeWatcher: any;
    pressureData: number[];
    isListening: boolean;
    anchorPosition: number;
    pushSubscription: PushSubscription | null;
}

// API support check result
export interface APISupport {
    supported: boolean;
    message?: string;
}
