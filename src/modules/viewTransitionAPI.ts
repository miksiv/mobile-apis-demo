// View Transition API functionality

export function initViewTransitionAPI(): void {
    const transitionBtn = document.getElementById('transition-btn')!;
    const transitionCard = document.getElementById('transition-card')!;
    let cardState = 1;

    transitionBtn.addEventListener('click', () => {
        if (!document.startViewTransition) {
            // Fallback for browsers without View Transition API
            transitionCard.innerHTML = `<h3>Card ${cardState + 1}</h3><p>View Transition API not supported</p>`;
            cardState = (cardState + 1) % 3;
            return;
        }

        document.startViewTransition(() => {
            cardState = (cardState + 1) % 3;
            transitionCard.innerHTML = `<h3>Card ${cardState + 1}</h3><p>Click to transition!</p>`;
        });
    });
}
