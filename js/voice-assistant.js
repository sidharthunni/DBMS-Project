/**
 * TripNest AI Voice Assistant
 * Hands-free Voice Search, Speech Navigation & Conversational Agent
 * Uses Web Speech Recognition (STT) + Web Speech Synthesis (TTS)
 */
(function() {
  'use strict';

  // Inject Styles for Voice Assistant Widget
  const style = document.createElement('style');
  style.id = 'tripnest-voice-assistant-styles';
  style.textContent = `
    /* Floating Mic Button */
    .tn-voice-trigger {
      position: fixed;
      bottom: 26px;
      right: 26px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb, #06b6d4);
      color: #ffffff;
      border: none;
      cursor: pointer;
      box-shadow: 0 10px 25px -4px rgba(37, 99, 235, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
    }
    .tn-voice-trigger:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 16px 32px -4px rgba(37, 99, 235, 0.55);
    }
    .tn-voice-trigger.listening {
      background: linear-gradient(135deg, #ef4444, #f97316);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
      animation: tn-pulse-ring 1.5s infinite;
    }
    @keyframes tn-pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
      70% { box-shadow: 0 0 0 18px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .tn-voice-trigger svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
      transition: transform 0.2s ease;
    }

    /* Voice Modal Card */
    .tn-voice-card {
      position: fixed;
      bottom: 96px;
      right: 26px;
      width: 360px;
      max-width: calc(100vw - 32px);
      background: rgba(15, 23, 42, 0.94);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 18px;
      box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.65);
      z-index: 99999;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 18px;
      display: none;
      flex-direction: column;
      gap: 12px;
      transform-origin: bottom right;
      animation: tn-slide-up 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes tn-slide-up {
      from { opacity: 0; transform: scale(0.92) translateY(12px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .tn-voice-card.active {
      display: flex;
    }
    .tn-vc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 10px;
    }
    .tn-vc-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 14px;
      color: #38bdf8;
      letter-spacing: 0.3px;
    }
    .tn-live-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 10px;
      padding: 2px 8px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      border-radius: 20px;
      text-transform: uppercase;
      font-weight: 700;
    }
    .tn-live-dot {
      width: 6px;
      height: 6px;
      background: #34d399;
      border-radius: 50%;
      animation: tn-blink 1.2s infinite;
    }
    @keyframes tn-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    .tn-vc-close {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 16px;
      padding: 2px 6px;
      border-radius: 6px;
    }
    .tn-vc-close:hover {
      color: #f8fafc;
      background: rgba(255, 255, 255, 0.08);
    }

    /* Sound Waves animation */
    .tn-wave-bar-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      height: 24px;
      margin: 4px 0;
    }
    .tn-wave-bar {
      width: 3.5px;
      height: 6px;
      background: #06b6d4;
      border-radius: 2px;
      transition: height 0.2s ease;
    }
    .tn-voice-trigger.listening ~ .tn-voice-card .tn-wave-bar:nth-child(1) { animation: tn-wave 0.8s infinite 0.1s; }
    .tn-voice-trigger.listening ~ .tn-voice-card .tn-wave-bar:nth-child(2) { animation: tn-wave 0.8s infinite 0.3s; }
    .tn-voice-trigger.listening ~ .tn-voice-card .tn-wave-bar:nth-child(3) { animation: tn-wave 0.8s infinite 0.2s; }
    .tn-voice-trigger.listening ~ .tn-voice-card .tn-wave-bar:nth-child(4) { animation: tn-wave 0.8s infinite 0.4s; }
    .tn-voice-trigger.listening ~ .tn-voice-card .tn-wave-bar:nth-child(5) { animation: tn-wave 0.8s infinite 0.15s; }
    @keyframes tn-wave {
      0%, 100% { height: 6px; background: #06b6d4; }
      50% { height: 22px; background: #38bdf8; }
    }

    /* Transcript & Feedback */
    .tn-vc-speech-box {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 12px;
      min-height: 52px;
      font-size: 13px;
      line-height: 1.5;
    }
    .tn-vc-heard {
      color: #e2e8f0;
      font-weight: 500;
    }
    .tn-vc-heard span.recognized {
      color: #38bdf8;
      font-weight: 600;
    }
    .tn-vc-reply {
      margin-top: 6px;
      font-size: 12px;
      color: #a78bfa;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Command Pills / Suggestions */
    .tn-vc-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .tn-pill {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      padding: 4px 10px;
      border-radius: 14px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
    }
    .tn-pill:hover {
      background: rgba(56, 189, 248, 0.15);
      border-color: rgba(56, 189, 248, 0.4);
      color: #38bdf8;
    }
    .tn-vc-hint {
      font-size: 10px;
      color: #64748b;
      text-align: center;
      margin-top: 2px;
    }
  `;
  document.head.appendChild(style);

  // Inject DOM Elements
  const container = document.createElement('div');
  container.id = 'tripnest-voice-assistant-root';
  container.innerHTML = `
    <button class="tn-voice-trigger" id="tnVoiceBtn" title="TripNest AI Voice Assistant" aria-label="TripNest Voice Search">
      <svg viewBox="0 0 24 24">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
      </svg>
    </button>

    <div class="tn-voice-card" id="tnVoiceCard">
      <div class="tn-vc-header">
        <div class="tn-vc-brand">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z"/>
          </svg>
          <span>TripNest Voice AI</span>
        </div>
        <div class="tn-live-badge" id="tnLiveBadge">
          <span class="tn-live-dot"></span>
          <span id="tnStatusText">Listening</span>
        </div>
        <button class="tn-vc-close" id="tnCloseCard" title="Close">&times;</button>
      </div>

      <div class="tn-wave-bar-wrapper">
        <div class="tn-wave-bar"></div>
        <div class="tn-wave-bar"></div>
        <div class="tn-wave-bar"></div>
        <div class="tn-wave-bar"></div>
        <div class="tn-wave-bar"></div>
      </div>

      <div class="tn-vc-speech-box">
        <div class="tn-vc-heard" id="tnHeard">Speak now... (e.g. "Search Paris", "Show Hotels")</div>
        <div class="tn-vc-reply" id="tnReply" style="display:none;"></div>
      </div>

      <div class="tn-vc-suggestions">
        <div class="tn-pill" data-cmd="Search Paris">Search Paris</div>
        <div class="tn-pill" data-cmd="Show Packages">Show Packages</div>
        <div class="tn-pill" data-cmd="Show Hotels">Explore Hotels</div>
        <div class="tn-pill" data-cmd="Plan My Trip">Plan Trip</div>
        <div class="tn-pill" data-cmd="My Bookings">My Bookings</div>
      </div>

      <div class="tn-vc-hint">Tip: Click any pill or say it aloud for hands-free voice control.</div>
    </div>
  `;
  document.body.appendChild(container);

  // References
  const voiceBtn = document.getElementById('tnVoiceBtn');
  const voiceCard = document.getElementById('tnVoiceCard');
  const closeBtn = document.getElementById('tnCloseCard');
  const heardEl = document.getElementById('tnHeard');
  const replyEl = document.getElementById('tnReply');
  const statusText = document.getElementById('tnStatusText');
  const liveBadge = document.getElementById('tnLiveBadge');

  let isListening = false;
  let recognition = null;

  // Initialize Speech Recognition
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRec) {
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      voiceBtn.classList.add('listening');
      voiceCard.classList.add('active');
      statusText.innerText = 'Listening';
      liveBadge.style.color = '#34d399';
      heardEl.innerHTML = 'Listening to your command...';
      replyEl.style.display = 'none';
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (interimTranscript) {
        heardEl.innerHTML = `Listening: <span class="recognized">"${interimTranscript}"</span>`;
      }

      if (finalTranscript) {
        heardEl.innerHTML = `Command: <span class="recognized">"${finalTranscript.trim()}"</span>`;
        handleVoiceCommand(finalTranscript.trim());
      }
    };

    recognition.onerror = (e) => {
      console.warn('TripNest Speech error:', e.error);
      if (e.error === 'not-allowed') {
        heardEl.innerHTML = '<span style="color:#f87171;">Microphone access denied. Please allow mic in browser settings.</span>';
        speakText('Please allow microphone permissions to use voice search.');
      } else {
        heardEl.innerHTML = 'Didn\'t catch that. Try saying "Search Paris" or "Show Hotels".';
      }
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
    };
  }

  function startListening() {
    if (!SpeechRec) {
      alert('Voice recognition is supported in Google Chrome, Microsoft Edge, and Android Chrome.');
      return;
    }
    try {
      recognition.start();
    } catch(err) {
      console.warn('Recognition start error:', err);
    }
  }

  function stopListening() {
    isListening = false;
    voiceBtn.classList.remove('listening');
    statusText.innerText = 'Ready';
  }

  // Text-To-Speech (TTS)
  function speakText(text, callback) {
    if (!('speechSynthesis' in window)) {
      if (callback) callback();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Pick pleasant English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen')) && v.lang.startsWith('en'));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => {
      if (callback) callback();
    };
    window.speechSynthesis.speak(utterance);
  }

  // Command Execution Engine
  function handleVoiceCommand(cmd) {
    const lower = cmd.toLowerCase().trim();
    replyEl.style.display = 'block';

    // 1. Search Destination (e.g. "Search Paris", "Find Bali", "Trip to Tokyo")
    const destMatch = lower.match(/(?:search|find|explore|trip to|go to|visit)\s+([a-z\s]+)/i);
    if (destMatch && destMatch[1] && !lower.includes('package') && !lower.includes('hotel') && !lower.includes('destinations')) {
      const targetCity = destMatch[1].trim();
      replyEl.innerHTML = `TripNest AI: Searching trips to <b>${targetCity.toUpperCase()}</b>...`;
      speakText(`Searching destinations and trips to ${targetCity}.`, () => {
        executeDestinationSearch(targetCity);
      });
      return;
    }

    // 2. Navigation to Destinations
    if (lower.includes('destination') || lower.includes('places') || lower.includes('explore all')) {
      replyEl.innerHTML = 'TripNest AI: Opening global destinations catalog...';
      speakText('Opening destinations catalog.', () => {
        window.location.href = 'destinations.html';
      });
      return;
    }

    // 3. Navigation to Packages
    if (lower.includes('package') || lower.includes('tour') || lower.includes('vacation')) {
      replyEl.innerHTML = 'TripNest AI: Loading vacation and tour packages...';
      speakText('Loading popular vacation packages.', () => {
        window.location.href = 'packages.html';
      });
      return;
    }

    // 4. Navigation to Hotels
    if (lower.includes('hotel') || lower.includes('resort') || lower.includes('stay') || lower.includes('room')) {
      replyEl.innerHTML = 'TripNest AI: Opening luxury hotels and suites...';
      speakText('Opening luxury accommodations and hotels.', () => {
        window.location.href = 'hotels.html';
      });
      return;
    }

    // 5. Navigation to Plan Trip
    if (lower.includes('plan') || lower.includes('itinerary') || lower.includes('custom trip')) {
      replyEl.innerHTML = 'TripNest AI: Opening customized trip planner...';
      speakText('Opening your custom trip planner.', () => {
        window.location.href = 'plan-trip.html';
      });
      return;
    }

    // 6. Navigation to My Trips / Bookings
    if (lower.includes('my trip') || lower.includes('my booking') || lower.includes('reservations')) {
      replyEl.innerHTML = 'TripNest AI: Opening your bookings and trips dashboard...';
      speakText('Opening your active bookings and travel history.', () => {
        window.location.href = 'my-trips.html';
      });
      return;
    }

    // 7. Contact / Support
    if (lower.includes('contact') || lower.includes('support') || lower.includes('help center')) {
      replyEl.innerHTML = 'TripNest AI: Opening customer support...';
      speakText('Opening customer support and contact desk.', () => {
        window.location.href = 'contact.html';
      });
      return;
    }

    // 8. Auth: Login / Register
    if (lower.includes('login') || lower.includes('sign in')) {
      replyEl.innerHTML = 'TripNest AI: Opening user login...';
      speakText('Navigating to user sign in.', () => {
        window.location.href = 'login.html';
      });
      return;
    }
    if (lower.includes('register') || lower.includes('sign up') || lower.includes('create account')) {
      replyEl.innerHTML = 'TripNest AI: Opening member registration...';
      speakText('Navigating to member registration.', () => {
        window.location.href = 'register.html';
      });
      return;
    }

    // 9. Home page
    if (lower.includes('home') || lower.includes('landing') || lower.includes('main page')) {
      replyEl.innerHTML = 'TripNest AI: Returning to homepage...';
      speakText('Returning to homepage.', () => {
        window.location.href = 'index.html';
      });
      return;
    }

    // 10. Scrolling commands
    if (lower.includes('scroll down') || lower.includes('down')) {
      window.scrollBy({ top: 600, behavior: 'smooth' });
      replyEl.innerHTML = 'TripNest AI: Scrolling page down.';
      speakText('Scrolling down.');
      return;
    }
    if (lower.includes('scroll up') || lower.includes('top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      replyEl.innerHTML = 'TripNest AI: Scrolled to top of page.';
      speakText('Returning to top.');
      return;
    }

    // 11. Conversational Queries & Help
    if (lower.includes('who are you') || lower.includes('what are you') || lower.includes('hello') || lower.includes('hi') || lower.includes('help')) {
      replyEl.innerHTML = 'TripNest AI: I am your AI travel copilot. Ask me to search cities, view packages, or open hotels!';
      speakText('Hello! I am your TripNest voice assistant. You can tell me to search destinations like Paris, show tour packages, browse luxury hotels, or view your bookings.');
      return;
    }

    // Generic fallback: Treat as destination search
    replyEl.innerHTML = `TripNest AI: Searching destinations matching "${cmd}"...`;
    speakText(`Searching destinations matching ${cmd}.`, () => {
      executeDestinationSearch(cmd);
    });
  }

  function executeDestinationSearch(term) {
    const destInput = document.getElementById('searchDestination');
    if (destInput) {
      destInput.value = term;
      destInput.focus();
      // Animate highlight
      destInput.style.transition = 'all 0.3s ease';
      destInput.style.boxShadow = '0 0 0 4px rgba(56, 189, 248, 0.4)';
      setTimeout(() => { destInput.style.boxShadow = ''; }, 2000);

      const searchBtn = document.querySelector('.search-card__submit') || document.querySelector('#searchCard button[type="submit"]');
      if (searchBtn) {
        searchBtn.click();
      } else {
        const destSec = document.getElementById('destinations');
        if (destSec) destSec.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page without the hero search, navigate to destinations with query
      window.location.href = `destinations.html?search=${encodeURIComponent(term)}`;
    }
  }

  // Event Listeners
  voiceBtn.addEventListener('click', () => {
    if (isListening) {
      if (recognition) recognition.stop();
      stopListening();
    } else {
      voiceCard.classList.add('active');
      startListening();
    }
  });

  closeBtn.addEventListener('click', () => {
    voiceCard.classList.remove('active');
    if (isListening && recognition) recognition.stop();
    stopListening();
  });

  // Suggestion Pills Click Handler
  document.querySelectorAll('.tn-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const cmd = e.target.getAttribute('data-cmd');
      heardEl.innerHTML = `Selected: <span class="recognized">"${cmd}"</span>`;
      handleVoiceCommand(cmd);
    });
  });

})();
