// Main entry point for the Modern Web APIs Demo
// This file imports and initializes all demo modules

import { initTabNavigation } from './modules/tabNavigation';
import { initSpeechAPI } from './modules/speechAPI';
import { initAnchorPositioning } from './modules/anchorPositioning';
import { initViewTransitionAPI } from './modules/viewTransitionAPI';
import { initFileSystemAPI } from './modules/fileSystemAPI';
import { initPictureInPictureAPI } from './modules/pictureInPictureAPI';
import { initVibrationAPI } from './modules/vibrationAPI';
import { initWebShareAPI } from './modules/webShareAPI';
import { initPushAPI } from './modules/pushAPI';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Modern Web APIs Demo...');
    
    // Initialize tab navigation first
    initTabNavigation();
    
    // Initialize all API demos
    initSpeechAPI();
    initAnchorPositioning();
    initViewTransitionAPI();
    initFileSystemAPI();
    initPictureInPictureAPI();
    initVibrationAPI();
    initWebShareAPI();
    initPushAPI();
    
    console.log('✅ All demo modules initialized successfully!');
});
