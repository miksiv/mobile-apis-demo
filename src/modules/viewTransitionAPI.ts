// View Transition API functionality

export function initViewTransitionAPI(): void {
    const transitionBtn = document.getElementById('transition-btn')!;
    const transitionCard = document.getElementById('transition-card')!;
    let cardState = 0;

    // Define different card states with dramatic visual differences
    const cardStates = [
        {
            title: '🚀 Welcome Card',
            content: 'This is the first state with a gradient background and centered content.',
            className: 'card-welcome',
            layout: 'centered'
        },
        {
            title: '🎨 Design Card',
            content: 'Now we have a completely different layout with sidebar content and different colors.',
            className: 'card-design',
            layout: 'sidebar'
        },
        {
            title: '⚡ Performance Card',
            content: 'Final state with a grid layout, multiple elements, and vibrant colors.',
            className: 'card-performance',
            layout: 'grid'
        },
        {
            title: '🌟 Interactive Card',
            content: 'This state features animated elements and a modern card design.',
            className: 'card-interactive',
            layout: 'modern'
        }
    ];

    function updateCardContent() {
        const state = cardStates[cardState];
        
        // Create different layouts based on the state
        let content = '';
        
        switch (state.layout) {
            case 'centered':
                content = `
                    <div class="card-header">
                        <h3>${state.title}</h3>
                        <div class="card-icon">🚀</div>
                    </div>
                    <div class="card-body">
                        <p>${state.content}</p>
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                `;
                break;
                
            case 'sidebar':
                content = `
                    <div class="card-sidebar">
                        <div class="sidebar-icon">🎨</div>
                        <div class="sidebar-stats">
                            <div class="stat">Design</div>
                            <div class="stat">UI/UX</div>
                            <div class="stat">Colors</div>
                        </div>
                    </div>
                    <div class="card-main">
                        <h3>${state.title}</h3>
                        <p>${state.content}</p>
                        <div class="color-palette">
                            <div class="color-swatch" style="background: #ff6b6b;"></div>
                            <div class="color-swatch" style="background: #4ecdc4;"></div>
                            <div class="color-swatch" style="background: #45b7d1;"></div>
                            <div class="color-swatch" style="background: #96ceb4;"></div>
                        </div>
                    </div>
                `;
                break;
                
            case 'grid':
                content = `
                    <div class="card-grid">
                        <div class="grid-item">
                            <h3>${state.title}</h3>
                            <p>${state.content}</p>
                        </div>
                        <div class="grid-item">
                            <div class="metric">
                                <span class="metric-value">99%</span>
                                <span class="metric-label">Performance</span>
                            </div>
                        </div>
                        <div class="grid-item">
                            <div class="metric">
                                <span class="metric-value">⚡</span>
                                <span class="metric-label">Speed</span>
                            </div>
                        </div>
                        <div class="grid-item">
                            <div class="metric">
                                <span class="metric-value">🔥</span>
                                <span class="metric-label">Hot</span>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'modern':
                content = `
                    <div class="card-modern">
                        <div class="modern-header">
                            <div class="avatar">🌟</div>
                            <div class="header-text">
                                <h3>${state.title}</h3>
                                <span class="subtitle">Interactive Demo</span>
                            </div>
                        </div>
                        <div class="modern-content">
                            <p>${state.content}</p>
                            <div class="interactive-elements">
                                <button class="mini-btn">Click</button>
                                <button class="mini-btn">Hover</button>
                                <button class="mini-btn">Tap</button>
                            </div>
                        </div>
                        <div class="modern-footer">
                            <div class="footer-item">✨ Smooth</div>
                            <div class="footer-item">🎯 Precise</div>
                            <div class="footer-item">🚀 Fast</div>
                        </div>
                    </div>
                `;
                break;
        }
        
        return content;
    }

    transitionBtn.addEventListener('click', () => {
        if (!document.startViewTransition) {
            // Fallback for browsers without View Transition API
            cardState = (cardState + 1) % cardStates.length;
            transitionCard.className = `transition-card ${cardStates[cardState].className}`;
            transitionCard.innerHTML = updateCardContent();
            return;
        }

        document.startViewTransition(() => {
            cardState = (cardState + 1) % cardStates.length;
            const state = cardStates[cardState];
            
            // Update the card with new content and class
            transitionCard.className = `transition-card ${state.className}`;
            transitionCard.innerHTML = updateCardContent();
        });
    });

    // Initialize with first state
    transitionCard.className = `transition-card ${cardStates[cardState].className}`;
    transitionCard.innerHTML = updateCardContent();
}
