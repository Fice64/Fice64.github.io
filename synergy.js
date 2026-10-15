/* ==========================================================================
   CONTROLADOR DE SISTEMAS DEL JARDÍN DIGITAL (synergy.js)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const menuLinks = document.querySelectorAll(".menu-link");
    const container = document.getElementById("dynamic-tab-content");

    // --- SPLASH TEXT POOLS (MINECRAFT STYLE) ---
    const leftSplashPool = [
        "burp",
        "meow",
        "bwoof",
        "squeak",
        "honk",
        "rawr",
        "beep boop",
        "mew",
        "awooo",
        "pico",
        "gasp",
        "snort"
    ];

    const rightSplashPool = [
        "i am a big fat chud",
        "puppy pilled day x",
        "do cows dream?",
        "baby vs nuclear bomb",
        "brain empty, no thoughts",
        "cower before the campsite",
        "i forgot why i entered this room",
        "procrastinating in 4k",
        "the rot consumes",
        "powered by cold pizza",
        "who let me code this",
        "100% certified silly"
    ];

    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    function randomizeBadges() {
        if (sidebar) sidebar.setAttribute("data-badge", getRandomItem(leftSplashPool));
        if (mainContent) mainContent.setAttribute("data-badge", getRandomItem(rightSplashPool));
    }

    randomizeBadges();

    // --- PALETTE RANDOMIZER & TRANSITION GIF LOGIC ---
    const GIF_URL = "resources/kronked.gif";
    const randomBtn = document.getElementById("random-theme-btn");
    const gifOverlay = document.getElementById("gif-overlay");
    const gifImg = document.getElementById("transition-gif");

    function generateRandomPalette() {
        const hue = Math.floor(Math.random() * 360);
        const accentHue = (hue + 120 + Math.floor(Math.random() * 120)) % 360;

        return {
            "--color-bg": `hsl(${hue}, 40%, 4%)`,
            "--color-panel-bg": `hsl(${hue}, 35%, 10%)`,
            "--color-sub-panel": `hsl(${hue}, 30%, 15%)`,
            "--color-border": `hsl(${hue}, 25%, 22%)`,
            "--color-accent": `hsl(${accentHue}, 70%, 50%)`,
            "--color-text-title": `hsl(${accentHue}, 50%, 70%)`,
            "--color-text-body": `hsl(${hue}, 10%, 60%)`
        };
    }

    function applyPalette(palette) {
        const root = document.documentElement;
        for (const [key, value] of Object.entries(palette)) {
            root.style.setProperty(key, value);
        }
    }

    if (randomBtn && gifOverlay && gifImg) {
        randomBtn.addEventListener("click", () => {
            if (window.location.protocol === "file:") {
                gifImg.src = GIF_URL;
            } else {
                gifImg.src = `${GIF_URL}?t=${Date.now()}`;
            }

            gifOverlay.classList.add("active");

            setTimeout(() => {
                const newPalette = generateRandomPalette();
                applyPalette(newPalette);
                randomizeBadges();
            }, 800);

            setTimeout(() => {
                gifOverlay.classList.remove("active");
            }, 1500);
        });
    }

    // --- LAST.FM INTEGRATION ---
    const LASTFM_USERNAME = "Fice64";
    const LASTFM_API_KEY = "dbb6dfc446c31cc2ea125f5ac3672e65";

    const trackNameEl = document.getElementById("track-name");
    const artistNameEl = document.getElementById("artist-name");
    const musicStatusEl = document.getElementById("music-status");
    const albumCoverEl = document.getElementById("album-cover");

    async function fetchLastFmTrack() {
        try {
            const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.recenttracks && data.recenttracks.track.length > 0) {
                const currentTrack = data.recenttracks.track[0];
                const trackName = currentTrack.name;
                const artistName = currentTrack.artist["#text"];
                const isNowPlaying = currentTrack["@attr"] && currentTrack["@attr"].nowplaying === "true";
                
                const albumArt = currentTrack.image && currentTrack.image[1] ? currentTrack.image[1]["#text"] : "";

                if (trackNameEl) trackNameEl.textContent = trackName;
                if (artistNameEl) artistNameEl.textContent = artistName;

                if (albumCoverEl) {
                    if (albumArt) {
                        albumCoverEl.src = albumArt;
                        albumCoverEl.classList.remove("hidden");
                    } else {
                        albumCoverEl.classList.add("hidden");
                    }
                }

                if (musicStatusEl) {
                    if (isNowPlaying) {
                        musicStatusEl.textContent = "PLAYING";
                        musicStatusEl.classList.add("now-playing");
                    } else {
                        musicStatusEl.textContent = "LAST PLAYED";
                        musicStatusEl.classList.remove("now-playing");
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching Last.fm track:", err);
            if (artistNameEl) artistNameEl.textContent = "Error de conexión";
        }
    }

    fetchLastFmTrack();
    setInterval(fetchLastFmTrack, 30000);

    // --- FARD EASTER EGG ---
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const konamiOverlay = document.getElementById("konami-overlay");
    const closeKonamiBtn = document.getElementById("close-konami-btn");
    const secretSound = new Audio("https://cdn.freesound.org/previews/274/274178_5123851-lq.mp3");

    function triggerKonamiSecret() {
        if (konamiOverlay) {
            konamiOverlay.classList.add("active");
            secretSound.currentTime = 0;
            secretSound.play().catch(e => console.log("Audio playback blocked:", e));
        }
    }

    document.addEventListener("keydown", (e) => {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        const expectedKey = konamiCode[konamiIndex].length === 1 ? konamiCode[konamiIndex].toLowerCase() : konamiCode[konamiIndex];

        if (key === expectedKey) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                triggerKonamiSecret();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    if (closeKonamiBtn && konamiOverlay) {
        closeKonamiBtn.addEventListener("click", () => {
            konamiOverlay.classList.remove("active");
        });
    }

    // --- TAB LOADER ---
    async function fetchTabComponent(tabName) {
        try {
            container.style.opacity = "0";
            container.style.transform = "translateY(8px)";
            container.style.transition = "opacity 0.15s ease, transform 0.15s ease";

            const response = await fetch(`tabs/${tabName}.html`);
            if (!response.ok) {
                throw new Error(`HTTP status: ${response.status}`);
            }
            const htmlContent = await response.text();

            setTimeout(() => {
                container.innerHTML = htmlContent;
                const targetSection = container.querySelector(".tab-section");
                if (targetSection) {
                    targetSection.offsetHeight; 
                    targetSection.classList.add("active-tab");
                }
                container.style.opacity = "1";
                container.style.transform = "translateY(0)";
            }, 150);

        } catch (error) {
            console.error(`Error: ${error}`);
            container.innerHTML = `
                <section class="tab-section active-tab">
                    <header class="content-header">
                        <h1>Módulo no encontrado</h1>
                        <p class="subtitle">[ Error de Enrutamiento ]</p>
                    </header>
                    <article class="content-body">
                        <p>No se pudo inicializar la pestaña modular <code>tabs/${tabName}.html</code>.</p>
                    </article>
                </section>
            `;
            container.style.opacity = "1";
            container.style.transform = "translateY(0)";
        }
    }

    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetTab = link.getAttribute("data-target");
            menuLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
            fetchTabComponent(targetTab);
        });
    });

    fetchTabComponent("about");
});