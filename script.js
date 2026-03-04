// Digital First Aid Assistant Logic

const EMERGENCIES = {
    cpr: {
        title: "CPR & Unconscious Person",
        image: "images/cpr.png",
        animateCpr: false,
        steps: [
            "Check responsiveness of the unconscious person",
            "Call emergency services (108 in India)",
            "Place hands in the center of the chest with arms straight",
            "Perform chest compressions at 100–120 per minute"
        ],
        stepImages: [
            "images/cpr_step1.png",
            "images/cpr_step2.png",
            "images/cpr_step3.png",
            "images/cpr_step4.png"
        ],
        kidSteps: [
            "Wake them up! Tap their shoulder 🗣️",
            "Call 108! 📞",
            "Straight arms in the middle! 🧍‍♂️",
            "Push fast and strong! ❤️👇"
        ],
        voiceText: "Call emergency services immediately. Place your hands in the center of the chest. Push hard and fast at a rate of 100 to 120 compressions per minute."
    },
    burns: {
        title: "Burns Emergency",
        image: "images/burn.png",
        steps: [
            "Remove from heat source",
            "Cool the burn under running water for 20 minutes",
            "Do NOT apply toothpaste or ice",
            "Cover with sterile cloth"
        ],
        kidSteps: [
            "Move away from hot things! 🔥🏃‍♂️",
            "Put it under cold water 🚰❄️",
            "No ice or toothpaste! 🚫🧊",
            "Cover it gently 🩹"
        ],
        stepImages: [
            "images/burns_step1.png",
            "images/burns_step2.png",
            "images/burns_step3.png",
            "images/burns_step4.png"
        ],
        voiceText: "Remove the person from the heat source. Cool the burn under running water for 20 minutes. Do not apply toothpaste or ice. Cover cautiously with a sterile cloth."
    },
    bleeding: {
        title: "Bleeding Control",
        image: "images/bleeding.png",
        steps: [
            "Apply firm pressure",
            "Elevate wound",
            "Use clean cloth or bandage",
            "Seek medical help if bleeding continues"
        ],
        kidSteps: [
            "Press hard on the cut! 🩸✋",
            "Lift it up high! ✋⬆️",
            "Use a clean cloth 🧻",
            "Get help! 🚑"
        ],
        stepImages: [
            "images/bleed_step1.png",
            "images/bleed_step2.png",
            "images/bleed_step3.png"
        ],
        voiceText: "Apply firm pressure to the wound. Elevate the wounded area. Use a clean cloth or bandage. Seek medical help if bleeding continues."
    },
    choking: {
        title: "Choking",
        image: "images/choking.png",
        steps: [
            "Ask if the person can cough",
            "If not, perform Heimlich maneuver",
            "Give abdominal thrusts",
            "Call emergency services if needed"
        ],
        kidSteps: [
            "Can they cough? 🗣️",
            "Hug them from behind 🤗",
            "Squeeze their tummy hard! 👐",
            "Call 108 if it doesn't pop out! 📞"
        ],
        stepImages: [
            "images/chok_step1.png",
            "images/chok_step2.png",
            "images/chok_step3.png",
            "images/chok_step4.png"
        ],
        voiceText: "Ask if the person can cough. If not, perform the Heimlich maneuver. Give abdominal thrusts. Call emergency services if needed."
    }
};

// DOM Elements
const screenHome = document.getElementById('screen-home');
const screenDetail = document.getElementById('screen-detail');
const btnBack = document.getElementById('btn-back');
const kidModeToggle = document.getElementById('kid-mode-toggle');
const btnHospital = document.getElementById('btn-hospital');
const btnVoiceMode = document.getElementById('btn-voice-mode');
const voiceOverlay = document.getElementById('voice-listening-overlay');
const btnCancelVoice = document.getElementById('btn-cancel-voice');

const shareModal = document.getElementById('share-modal-overlay');
const btnShareSms = document.getElementById('btn-share-sms');
const btnShareWa = document.getElementById('btn-share-wa');
const btnShareNative = document.getElementById('btn-share-native');
const btnCancelShare = document.getElementById('btn-cancel-share');

const detailTitle = document.getElementById('detail-title');
const detailImage = document.getElementById('detail-image');
const standardSteps = document.getElementById('standard-steps');
const kidSteps = document.getElementById('kid-steps');

const btnPlayVoice = document.getElementById('btn-play-voice');
const btnStopVoice = document.getElementById('btn-stop-voice');

let currentEmergencyId = null;
let isKidMode = false;

// Navigation
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => openEmergency(card.dataset.target));
});

btnBack.addEventListener('click', () => {
    screenDetail.classList.add('hidden');
    screenHome.classList.remove('hidden');
    btnBack.classList.add('hidden');
    stopVoice();
    currentEmergencyId = null;
    detailImage.classList.remove('animate-cpr');
});

kidModeToggle.addEventListener('change', (e) => {
    isKidMode = e.target.checked;
    if (currentEmergencyId) {
        renderSteps(EMERGENCIES[currentEmergencyId]);
    }
});

function openEmergency(id) {
    const data = EMERGENCIES[id];
    currentEmergencyId = id;

    detailTitle.textContent = data.title;
    detailImage.src = data.image;

    if (data.animateCpr) detailImage.classList.add('animate-cpr');
    else detailImage.classList.remove('animate-cpr');

    renderSteps(data);

    screenHome.classList.add('hidden');
    screenDetail.classList.remove('hidden');
    btnBack.classList.remove('hidden');
    window.scrollTo(0, 0);
}

function renderSteps(data) {
    standardSteps.innerHTML = '';
    kidSteps.innerHTML = '';

    if (isKidMode && data.kidSteps) {
        standardSteps.classList.add('hidden');
        kidSteps.classList.remove('hidden');
        data.kidSteps.forEach((text, index) => {
            const div = document.createElement('div');
            div.className = 'kid-step';

            const p = document.createElement('p');
            p.textContent = text;
            div.appendChild(p);

            if (data.stepImages && data.stepImages[index]) {
                const img = document.createElement('img');
                img.src = data.stepImages[index];
                img.className = 'step-inline-image';
                img.alt = `Kid Step ${index + 1} illustration`;
                div.appendChild(img);
            }

            kidSteps.appendChild(div);
        });
    } else {
        kidSteps.classList.add('hidden');
        standardSteps.classList.remove('hidden');
        data.steps.forEach((text, index) => {
            const li = document.createElement('li');

            const p = document.createElement('p');
            p.textContent = text;
            li.appendChild(p);

            if (data.stepImages && data.stepImages[index]) {
                const img = document.createElement('img');
                img.src = data.stepImages[index];
                img.className = 'step-inline-image';
                img.alt = `Step ${index + 1} illustration`;
                li.appendChild(img);
            }

            standardSteps.appendChild(li);
        });
    }
}

// Map link
btnHospital.addEventListener('click', () => {
    window.open("https://www.google.com/maps/search/hospital+near+me", "_blank");
});

// Emergency Alert Location Sharing (Geolocation API + Web Share API)
const btnAlert = document.getElementById('btn-alert');

function sendEmergencyAlert() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser. You will need to share your location manually.");
        return;
    }

    // UI state while loading
    const originalText = btnAlert.innerHTML;
    btnAlert.innerHTML = "⏳ Locating...";
    btnAlert.disabled = true;
    btnAlert.classList.remove('pulse-alert');

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const mapsLink = `https://maps.google.com/?q=${lat},${lon}`;
            const message = `🚨 Emergency! I need help. My location: ${mapsLink}`;

            showShareOptions(message, originalText);
        },
        (error) => {
            btnAlert.innerHTML = originalText;
            btnAlert.disabled = false;
            btnAlert.classList.add('pulse-alert');

            // Provide sensible error feedback
            let errorMsg = "Unable to retrieve your location.";
            if (error.code === error.PERMISSION_DENIED) errorMsg = "Location permission denied. Please allow location access in your browser settings.";
            alert(errorMsg);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
}

btnAlert.addEventListener('click', sendEmergencyAlert);

function showShareOptions(message, originalText) {
    // Restore primary button state
    btnAlert.innerHTML = originalText;
    btnAlert.disabled = false;
    btnAlert.classList.add('pulse-alert');

    // Encode message for protocol links
    const encodedMessage = encodeURIComponent(message);

    // Set up explicit offline-compatible deep links
    btnShareSms.href = `sms:?body=${encodedMessage}`;
    btnShareWa.href = `whatsapp://send?text=${encodedMessage}`;

    // Native share fallback loop
    btnShareNative.onclick = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Emergency Alert',
                text: message
            }).catch(() => {
                copyToClipboard(message);
            });
        } else {
            copyToClipboard(message);
        }
        shareModal.classList.add('hidden');
    };

    // Reveal the custom share modal
    shareModal.classList.remove('hidden');
}

btnCancelShare.addEventListener('click', () => {
    shareModal.classList.add('hidden');
});

function copyToClipboard(message) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(message).then(() => {
            alert("Emergency message and location copied to clipboard!\nYou can now paste it into any messaging app (WhatsApp, SMS, etc.).");
        }).catch(() => {
            prompt("Failed to auto-copy. Please manually copy the message below:", message);
        });
    } else {
        prompt("Copy the emergency message below and paste it in your messaging app:", message);
    }
}

// Voice Playback (SpeechSynthesis)
btnPlayVoice.addEventListener('click', () => {
    if (!currentEmergencyId) return;
    const text = EMERGENCIES[currentEmergencyId].voiceText;

    stopVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onstart = () => {
        btnPlayVoice.classList.add('hidden');
        btnStopVoice.classList.remove('hidden');
    };
    utterance.onend = () => {
        btnStopVoice.classList.add('hidden');
        btnPlayVoice.classList.remove('hidden');
    };
    utterance.onerror = utterance.onend;
    window.speechSynthesis.speak(utterance);
});

btnStopVoice.addEventListener('click', stopVoice);

function stopVoice() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    btnStopVoice.classList.add('hidden');
    btnPlayVoice.classList.remove('hidden');
}

// Voice Assistant Mode (SpeechRecognition)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    let recognition = null;

    btnVoiceMode.addEventListener('click', () => {
        if (!navigator.onLine) {
            alert("Voice Recognition requires an active internet connection on most devices to process speech. Please connect to the internet to use this feature.");
            return;
        }

        // Clean up any previous instance
        if (recognition) {
            try { recognition.stop(); } catch (e) { }
        }

        // Instantiate freshly to avoid dreaded state bugs in Web Speech API
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            voiceOverlay.classList.remove('hidden');
        };

        recognition.onresult = (event) => {
            const speechResult = event.results[event.results.length - 1][0].transcript.toLowerCase();
            voiceOverlay.classList.add('hidden');

            if (speechResult.includes('emergency') || speechResult.includes('location') || speechResult.includes('help')) {
                sendEmergencyAlert();
            } else if (speechResult.includes('faint') || speechResult.includes('cpr') || speechResult.includes('breath') || speechResult.includes('unconscious') || speechResult.includes('compress')) {
                openEmergency('cpr');
            } else if (speechResult.includes('burn') || speechResult.includes('fire') || speechResult.includes('hot')) {
                openEmergency('burns');
            } else if (speechResult.includes('bleed') || speechResult.includes('cut') || speechResult.includes('blood') || speechResult.includes('wound')) {
                openEmergency('bleeding');
            } else if (speechResult.includes('chok') || speechResult.includes('swallow') || speechResult.includes('cough')) {
                openEmergency('choking');
            } else {
                alert(`Heard: "${speechResult}". I didn't understand the emergency. Please try again or tap a category manually.`);
            }
        };

        recognition.onerror = (event) => {
            voiceOverlay.classList.add('hidden');
            if (event.error === 'network') {
                alert("Voice recognition network error. This feature requires an active internet connection.");
            } else if (event.error !== 'no-speech') {
                alert(`Voice recognition error: ${event.error}. Ensure microphone permissions are allowed.`);
            }
        };

        recognition.onend = () => {
            // Failsafe: hide overlay if recognition ends without a result or error
            if (!voiceOverlay.classList.contains('hidden')) {
                voiceOverlay.classList.add('hidden');
            }
        };

        try {
            recognition.start();
        } catch (e) {
            console.warn("Speech recognition failed to start", e);
        }
    });

    btnCancelVoice.addEventListener('click', () => {
        voiceOverlay.classList.add('hidden');
        if (recognition) {
            try { recognition.stop(); } catch (e) { }
        }
    });
} else {
    btnVoiceMode.style.display = 'none'; // hide if unsupported
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .catch(console.error);
    });
}
