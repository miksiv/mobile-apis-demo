const emojiClubs: [string, string][] = [
    ["😂", "Crying Laugh Club"],
    ["🐸", "Froggoland"],
    ["🔥", "Fire Nation"],
    ["🚀", "Rocket Riders"],
    ["🍕", "Pizza Syndicate"],
    ["🦄", "Unicorn Valley"],
    ["😎", "Cool Kids Club"],
    ["👽", "Alien Invasion"],
    ["🤖", "Robot Rebellion"],
    ["💀", "Skull Squad"]
]

const spinBtn = document.getElementById("spin-btn")!;
const shareBtn = document.getElementById("share-btn")!;
const result = document.getElementById("result")!;
const spinner = document.getElementById("spinner")!;

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function setDisplay(element: HTMLElement, display: string) {
    element.style.display = display;
}

function showInvite(emoji: string, club: string) {
    result.innerHTML = `${emoji} has invited you to the <b>${club}</b>!`;
    setDisplay(result, 'inline-block');
}

spinBtn.addEventListener("click", () => {
    // Spin effect
    setDisplay(shareBtn, 'none');
    setDisplay(result, 'none');
    setDisplay(spinner, 'flex');

    setTimeout(() => {
        const [emoji, club] = pickRandom(emojiClubs)

        // Vibrate if supported
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }

        showInvite(emoji, club);
        setDisplay(spinner, 'none');
        setDisplay(shareBtn, 'inline-block');

        // Save selection for sharing
        shareBtn.onclick = async () => {
            const url = `${location.origin}${location.pathname}?emoji=${encodeURIComponent(emoji)}&club=${encodeURIComponent(club)}`;
            console.log(url);
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "Emoji Party Invite 🎉",
                        text: `${emoji} has invited you to the ${club}!`,
                        url
                    });
                } catch (e) {
                    //😂
                }
            } else {
                alert(`Copy this link: ${url}`);
            }
        };
    }, 1500);
});

// On load: check if opening via invite link
const params = new URLSearchParams(location.search);
const emoji = params.get("emoji");
const club = params.get("club");
if (emoji && club) {
    showInvite(emoji, club);
}