// CSS Anchor Positioning functionality

let anchorPosition = 0;

export function initAnchorPositioning(): void {
    const anchorBtn = document.getElementById('anchor-btn')!;
    const anchoredElement = document.getElementById('anchored-element')!;

    anchorBtn.addEventListener('click', () => {
        anchorPosition = (anchorPosition + 1) % 4;
        
        switch (anchorPosition) {
            case 0:
                anchoredElement.style.top = '20px';
                anchoredElement.style.left = '20px';
                anchoredElement.textContent = 'Top Left';
                break;
            case 1:
                anchoredElement.style.top = '20px';
                anchoredElement.style.right = '20px';
                anchoredElement.style.left = 'auto';
                anchoredElement.textContent = 'Top Right';
                break;
            case 2:
                anchoredElement.style.bottom = '20px';
                anchoredElement.style.right = '20px';
                anchoredElement.style.top = 'auto';
                anchoredElement.textContent = 'Bottom Right';
                break;
            case 3:
                anchoredElement.style.bottom = '20px';
                anchoredElement.style.left = '20px';
                anchoredElement.style.right = 'auto';
                anchoredElement.textContent = 'Bottom Left';
                break;
        }
    });
}
