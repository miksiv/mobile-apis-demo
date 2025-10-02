// Tab navigation functionality

export function initTabNavigation(): void {
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');
    const apiCards = document.querySelectorAll('.api-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });

    // API card navigation
    apiCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetTab = card.getAttribute('data-tab');
            const tabButton = document.querySelector(`[data-tab="${targetTab}"]`) as HTMLElement;
            if (tabButton) {
                tabButton.click();
            }
        });
    });
}
