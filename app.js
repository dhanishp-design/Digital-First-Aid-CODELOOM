/* ═══════════════════════════════════════════════
   Digital First Aid — Application Logic
   ═══════════════════════════════════════════════ */

/* ── Emergency Data ─────────────────────────── */
const EMERGENCIES = {
    cpr: {
        emoji: '🚑',
        title: 'CPR',
        steps: [
            'Check responsiveness — tap the person\'s shoulder and shout "Are you okay?"',
            'Call emergency number (108) immediately or ask someone nearby to call.',
            'Place the heel of one hand on the centre of the chest. Place your other hand on top and interlock fingers.',
            'Start chest compressions — push hard and fast at 100–120 compressions per minute, at least 2 inches deep.',
            'Give 2 rescue breaths after every 30 compressions. Tilt the head back, lift the chin, and blow into the mouth for about 1 second each.',
            'Continue the cycle of 30 compressions and 2 breaths until professional help arrives or the person starts breathing.'
        ]
    },
    bleeding: {
        emoji: '🩸',
        title: 'Severe Bleeding',
        steps: [
            'Apply firm, direct pressure to the wound using a clean cloth, bandage, or even your hand.',
            'If possible, elevate the injured area above the level of the heart to slow blood flow.',
            'Keep steady pressure — do not lift the cloth to check. If it soaks through, add more layers on top.',
            'Do NOT remove any embedded objects (glass, metal, etc.). Apply pressure around the object instead.',
            'If bleeding does not stop, apply pressure to the nearest pressure point (e.g., inside of the upper arm or groin area).',
            'Seek emergency medical help immediately. Keep the person calm and still.'
        ]
    },
    burns: {
        emoji: '🔥',
        title: 'Burns',
        steps: [
            'Cool the burn under cool (not ice-cold) running water for 10–20 minutes as soon as possible.',
            'Carefully remove any tight clothing, jewellery, or accessories near the burn area before swelling starts.',
            'Do NOT apply ice, butter, toothpaste, or any home remedies to the burn.',
            'Cover the burn loosely with a sterile, non-stick dressing or clean cloth to protect it from infection.',
            'Do not burst any blisters — they protect the skin beneath from infection.',
            'Seek professional medical attention for burns larger than your palm, or if on the face, hands, or joints.'
        ]
    },
    fractures: {
        emoji: '🤕',
        title: 'Fractures',
        steps: [
            'Keep the injured area as still as possible. Do not attempt to move the person unnecessarily.',
            'Do NOT try to straighten or push back a displaced bone.',
            'If you are trained, apply a padded splint above and below the fracture to immobilise it.',
            'Apply a cold pack wrapped in cloth near (not directly on) the fracture to reduce swelling.',
            'If there is an open wound, cover it with a clean dressing without pressing on the bone.',
            'Seek emergency medical help immediately. Keep the person warm and reassured.'
        ]
    }
};

/* ── DOM References ─────────────────────────── */
const homeScreen = document.getElementById('home-screen');
const detailScreen = document.getElementById('detail-screen');
const detailEmoji = document.getElementById('detail-emoji');
const detailTitle = document.getElementById('detail-title');
const stepsList = document.getElementById('steps-list');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnBack = document.getElementById('btn-back');

/* ── State ──────────────────────────────────── */
let currentKey = null;
let speaking = false;

/* ── Navigation ─────────────────────────────── */
function showDetail(key) {
    const data = EMERGENCIES[key];
    if (!data) return;

    currentKey = key;
    detailEmoji.textContent = data.emoji;
    detailTitle.textContent = data.title;

    stepsList.innerHTML = '';
    data.steps.forEach(text => {
        const li = document.createElement('li');
        li.className = 'steps__item';
        const span = document.createElement('span');
        span.className = 'steps__text';
        span.textContent = text;
        li.appendChild(span);
        stepsList.appendChild(li);
    });

    homeScreen.classList.add('hidden');
    detailScreen.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateVoiceButtons(false);
}

function showHome() {
    stopSpeech();
    detailScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    currentKey = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Voice Guidance (Web Speech API) ────────── */
function speak(textArray) {
    if (!('speechSynthesis' in window)) {
        alert('Sorry — your browser does not support voice guidance.');
        return;
    }

    stopSpeech();

    const fullText = textArray
        .map((t, i) => `Step ${i + 1}. ${t}`)
        .join(' ... ');

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => updateVoiceButtons(true);
    utterance.onend = () => updateVoiceButtons(false);
    utterance.onerror = () => updateVoiceButtons(false);

    window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    updateVoiceButtons(false);
}

function updateVoiceButtons(isSpeaking) {
    speaking = isSpeaking;
    if (isSpeaking) {
        btnPlay.classList.add('speaking');
        btnPlay.disabled = true;
        btnStop.disabled = false;
    } else {
        btnPlay.classList.remove('speaking');
        btnPlay.disabled = false;
        btnStop.disabled = true;
    }
}

/* ── Event Listeners ────────────────────────── */
document.querySelectorAll('[data-emergency]').forEach(btn => {
    btn.addEventListener('click', () => showDetail(btn.dataset.emergency));
});

btnBack.addEventListener('click', showHome);

btnPlay.addEventListener('click', () => {
    if (currentKey && EMERGENCIES[currentKey]) {
        speak(EMERGENCIES[currentKey].steps);
    }
});

btnStop.addEventListener('click', stopSpeech);

/* Handle browser back button in standalone mode */
window.addEventListener('popstate', () => {
    if (!detailScreen.classList.contains('hidden')) {
        showHome();
    }
});

/* Push state when navigating to detail so back button works */
const _origShowDetail = showDetail;
showDetail = function (key) {
    history.pushState({ screen: 'detail', key }, '');
    _origShowDetail(key);
};

/* ── Service Worker Registration ────────────── */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('SW registered:', reg.scope))
            .catch(err => console.warn('SW registration failed:', err));
    });
}
