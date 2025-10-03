// CSS Anchor Positioning functionality

export function initAnchorPositioning(): void {
    // Example 1: Basic tooltip toggle
    const anchorButton = document.getElementById('anchor-1');
    const tooltip = document.getElementById('tooltip-1');
    
    if (anchorButton && tooltip) {
        anchorButton.addEventListener('click', () => {
            tooltip.classList.toggle('visible');
        });
    }

    // Example 2: Position Area cycling
    const positionAreaBtn = document.getElementById('position-area-btn');
    const anchoredBox = document.getElementById('anchored-2');
    const positions = ['top', 'right', 'bottom', 'left'];
    let currentPositionIndex = 0;

    if (positionAreaBtn && anchoredBox) {
        positionAreaBtn.addEventListener('click', () => {
            currentPositionIndex = (currentPositionIndex + 1) % positions.length;
            const position = positions[currentPositionIndex];
            
            // Update the class and text
            anchoredBox.className = 'anchored-box';
            anchoredBox.classList.add(`position-${position}`);
            anchoredBox.textContent = position.charAt(0).toUpperCase() + position.slice(1);
        });
    }

    // Example 3: Size slider
    const anchorSizeSlider = document.getElementById('anchor-size-slider') as HTMLInputElement;
    const sizeValue = document.getElementById('size-value');
    const anchorResizable = document.getElementById('anchor-3');

    if (anchorSizeSlider && sizeValue && anchorResizable) {
        anchorSizeSlider.addEventListener('input', (e) => {
            const value = (e.target as HTMLInputElement).value;
            sizeValue.textContent = `${value}px`;
            anchorResizable.style.width = `${value}px`;
        });
    }

    // Example 4: Fallback positioning is handled via CSS
    // The position-try-fallbacks property automatically adjusts based on scroll
    
    // Check browser support
    checkAnchorSupport();
}

function checkAnchorSupport() {
    // Check if CSS.supports is available and test for anchor positioning
    if (typeof CSS !== 'undefined' && CSS.supports) {
        const supportsAnchorName = CSS.supports('anchor-name', '--test');
        const supportsPositionAnchor = CSS.supports('position-anchor', '--test');
        
        console.log('CSS Anchor Positioning Support:');
        console.log('  anchor-name:', supportsAnchorName);
        console.log('  position-anchor:', supportsPositionAnchor);
        
        if (!supportsAnchorName || !supportsPositionAnchor) {
            console.warn('⚠️ CSS Anchor Positioning is not fully supported in this browser.');
            console.warn('Please use Chrome 125+ or enable experimental features.');
            
            // Show a warning banner
            const anchorSection = document.getElementById('anchor');
            if (anchorSection) {
                const warning = document.createElement('div');
                warning.className = 'browser-warning';
                warning.innerHTML = `
                    <strong>⚠️ Browser Support Notice:</strong> 
                    CSS Anchor Positioning requires Chrome 125+ or experimental flags enabled. 
                    The demo may not display correctly in your current browser.
                `;
                anchorSection.insertBefore(warning, anchorSection.querySelector('.demo-container'));
            }
        } else {
            console.log('✅ Full CSS Anchor Positioning support detected!');
        }
    }
}
