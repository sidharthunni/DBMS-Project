/**
 * TripNest AI Voice Assistant (v2 - Multi-Field Compound Voice Parser)
 * Hands-free Voice Search, Speech Navigation & Conversational Agent
 * Supports: "Search Paris 24 October 26 October 2" auto-populating Destination, CheckIn, CheckOut, Guests!
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
      width: 380px;
      max-width: calc(100vw - 32px);
      background: rgba(15, 23, 42, 0.95);
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
      margin: 2px 0;
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
      min-height: 54px;
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
      line-height: 1.4;
    }

    /* Command Pills / Suggestions */
    .tn-vc-suggestions {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 4px;
    }
    .tn-pill-title {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tn-pill-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
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
    .tn-pill.compound {
      background: rgba(56, 189, 248, 0.08);
      border-color: rgba(56, 189, 248, 0.25);
      color: #7dd3fc;
      font-weight: 500;
    }
    .tn-vc-hint {
      font-size: 10px;
      color: #64748b;
      text-align: center;
      margin-top: 2px;
    }

    /* Input Glow Highlights */
    .tn-glow-active {
      box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.5) !important;
      border-color: #38bdf8 !important;
      transition: all 0.3s ease !important;
    }

    /* Floating Fullscreen / Maximize Screen Button */
    .tn-fullscreen-floating-btn {
      position: fixed;
      bottom: 26px;
      right: 94px;
      height: 48px;
      padding: 0 16px 0 14px;
      border-radius: 24px;
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      color: #f8fafc;
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      z-index: 99998;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Poppins, sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.2px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
      user-select: none;
    }
    .tn-fullscreen-floating-btn:hover {
      transform: translateY(-2px);
      background: rgba(30, 41, 59, 0.98);
      border-color: rgba(56, 189, 248, 0.55);
      color: #38bdf8;
      box-shadow: 0 14px 28px -4px rgba(0, 0, 0, 0.6), 0 0 14px rgba(56, 189, 248, 0.35);
    }
    .tn-fullscreen-floating-btn:active {
      transform: scale(0.96);
    }
    .tn-fullscreen-floating-btn svg {
      width: 17px;
      height: 17px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      flex-shrink: 0;
    }

    /* Navbar Fullscreen / Maximize Screen Button */
    .tn-fullscreen-nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      background: rgba(37, 99, 235, 0.12);
      color: #2563eb;
      border: 1px solid rgba(37, 99, 235, 0.35);
      transition: all 0.2s ease;
      font-family: inherit;
      outline: none;
      user-select: none;
      text-decoration: none;
      margin-right: 6px;
    }
    .tn-fullscreen-nav-btn:hover {
      background: #2563eb;
      color: #ffffff;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .tn-fullscreen-nav-btn:active {
      transform: scale(0.96);
    }
    .tn-fullscreen-nav-btn svg {
      width: 15px;
      height: 15px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    @media (max-width: 640px) {
      .tn-fullscreen-floating-btn {
        right: 86px;
        bottom: 26px;
        width: 44px;
        height: 44px;
        padding: 0;
        justify-content: center;
        border-radius: 50%;
      }
      .tn-fullscreen-floating-btn .tn-fs-label {
        display: none;
      }
      .tn-fullscreen-nav-btn .tn-fs-label {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  function getSuggestionsHtml() {
    const isHotelDetails = window.location.pathname.includes('hotels-details.html');
    if (isHotelDetails) {
      return `
        <div class="tn-pill-title">Swiss Reservation Commands:</div>
        <div class="tn-pill-row">
          <div class="tn-pill compound" data-cmd="Fill reservation details">Fill Details (18 Oct - 20 Oct)</div>
          <div class="tn-pill compound" data-cmd="Reserve this room">Reserve This Room</div>
          <div class="tn-pill compound" data-cmd="Complete payment">Complete Payment ($582.40)</div>
          <div class="tn-pill compound" data-cmd="Open GPay">GPay (Google Pay)</div>
        </div>
        <div class="tn-pill-title" style="margin-top:4px;">Quick Actions & Navigation:</div>
        <div class="tn-pill-row">
          <div class="tn-pill compound" data-cmd="Maximize screen">Maximize Screen</div>
          <div class="tn-pill" data-cmd="Plan my trip to Europe">Plan Trip to Europe</div>
          <div class="tn-pill" data-cmd="Take me to Switzerland">Switzerland Hotel</div>
          <div class="tn-pill" data-cmd="My Bookings">My Trips</div>
        </div>
      `;
    }
    return `
      <div class="tn-pill-title">Suggested Voice Commands:</div>
      <div class="tn-pill-row">
        <div class="tn-pill compound" data-cmd="Plan my trip to Europe">Plan trip to Europe</div>
        <div class="tn-pill compound" data-cmd="Take me to Switzerland">Take me to Switzerland</div>
        <div class="tn-pill compound" data-cmd="Search Paris 24 October 26 October 2">Paris 24 Oct - 26 Oct (2)</div>
        <div class="tn-pill compound" data-cmd="Find Bali 15 November 20 November 4">Bali 15 Nov - 20 Nov (4)</div>
      </div>
      <div class="tn-pill-title" style="margin-top:4px;">Quick Actions & Navigation:</div>
      <div class="tn-pill-row">
        <div class="tn-pill compound" data-cmd="Maximize screen">Maximize Screen</div>
        <div class="tn-pill" data-cmd="Show Hotels">Hotels</div>
        <div class="tn-pill" data-cmd="Plan My Trip">Plan Trip</div>
        <div class="tn-pill" data-cmd="Show Packages">Packages</div>
        <div class="tn-pill" data-cmd="My Bookings">My Bookings</div>
      </div>
    `;
  }

  // Inject DOM Elements
  const container = document.createElement('div');
  container.id = 'tripnest-voice-assistant-root';
  container.innerHTML = `
    <!-- Floating Fullscreen / Maximize Screen Button -->
    <button class="tn-fullscreen-floating-btn tn-fs-toggle" id="tnFloatingFsBtn" title="Maximize Screen (Fullscreen View)" aria-label="Maximize Screen">
      <svg class="tn-fs-icon-enter" viewBox="0 0 24 24">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
      </svg>
      <svg class="tn-fs-icon-exit" viewBox="0 0 24 24" style="display:none;">
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
      </svg>
      <span class="tn-fs-label">Maximize</span>
    </button>

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
        <div class="tn-vc-heard" id="tnHeard">Speak now... e.g. "Plan my trip to Europe" or "Take me to Switzerland"</div>
        <div class="tn-vc-reply" id="tnReply" style="display:none;"></div>
      </div>

      <div class="tn-vc-suggestions" id="tnSuggestions">
        ${getSuggestionsHtml()}
      </div>

      <div class="tn-vc-hint">Say aloud or click any command to perform action hands-free.</div>
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

  // Month lookup dictionary
  const monthMap = {
    'january': '01', 'jan': '01',
    'february': '02', 'feb': '02',
    'march': '03', 'mar': '03',
    'april': '04', 'apr': '04',
    'may': '05',
    'june': '06', 'jun': '06',
    'july': '07', 'jul': '07',
    'august': '08', 'aug': '08',
    'september': '09', 'sep': '09', 'sept': '09',
    'october': '10', 'oct': '10',
    'november': '11', 'nov': '11',
    'december': '12', 'dec': '12'
  };

  const monthRegexStr = Object.keys(monthMap).join('|');

  // Word number map
  const wordNumMap = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  };

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
      heardEl.innerHTML = 'Listening to your voice command...';
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
        heardEl.innerHTML = 'Didn\'t catch that. Try saying "Search Paris 24 October 26 October 2".';
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

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen')) && v.lang.startsWith('en'));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => {
      if (callback) callback();
    };
    window.speechSynthesis.speak(utterance);
  }

  // Helper to format date YYYY-MM-DD
  function toISODate(dayStr, monthStr, year = '2026') {
    const day = parseInt(dayStr, 10);
    const dayPad = (day < 10 ? '0' : '') + day;
    const monthPad = monthMap[monthStr.toLowerCase()] || '10';
    return `${year}-${monthPad}-${dayPad}`;
  }

  // Multi-Field Compound Command Parser
  function tryParseCompoundCommand(lower) {
    // Regex Pattern: (search|find|book|plan trip|explore) <city> (from)? <day1> <month1> (to)? <day2> <month2> (for)? <guests> (guests)?
    const compoundRegex = new RegExp(
      '(?:search|find|book|plan trip to|plan trip|explore)?\\s*([a-z]+)\\s*(?:from)?\\s*(\\d{1,2})\\s*(' + monthRegexStr + ')\\s*(?:to)?\\s*(\\d{1,2})\\s*(' + monthRegexStr + ')(?:\\s*(?:for)?\\s*(\\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten)?\\s*(?:guests?|people|travelers?)?)?',
      'i'
    );

    const match = lower.match(compoundRegex);
    if (match && match[2] && match[3] && match[4] && match[5]) {
      const city = match[1].trim();
      // Avoid matching keywords as cities
      if (['hotel', 'hotels', 'package', 'packages', 'destination', 'destinations'].includes(city)) return null;

      const d1 = match[2];
      const m1 = match[3];
      const d2 = match[4];
      const m2 = match[5];
      let rawGuests = match[6];
      let guests = 2;
      if (rawGuests) {
        guests = wordNumMap[rawGuests.toLowerCase()] || parseInt(rawGuests, 10) || 2;
      }

      const checkInISO = toISODate(d1, m1);
      const checkOutISO = toISODate(d2, m2);

      return {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        checkIn: checkInISO,
        checkOut: checkOutISO,
        guests: guests,
        summary: `${city.charAt(0).toUpperCase() + city.slice(1)} (${d1} ${m1} - ${d2} ${m2}, ${guests} guests)`
      };
    }
    return null;
  }

  // Command Execution Engine
  function handleVoiceCommand(cmd) {
    const lower = cmd.toLowerCase().trim();
    replyEl.style.display = 'block';

    // 0. Fullscreen / Maximize Screen Commands
    if (lower.includes('maximize') || lower.includes('fullscreen') || lower.includes('full screen') || lower.includes('expand screen')) {
      replyEl.innerHTML = 'TripNest AI: Maximizing screen to full view...';
      speakText('Maximizing screen to full view.', () => {
        toggleFullscreen(true);
      });
      return;
    }
    if (lower.includes('minimize screen') || lower.includes('exit fullscreen') || lower.includes('restore screen') || lower.includes('normal screen')) {
      replyEl.innerHTML = 'TripNest AI: Restoring normal screen view...';
      speakText('Restoring normal screen view.', () => {
        toggleFullscreen(false);
      });
      return;
    }

    // 1. Check for Compound Travel Command (e.g. "search paris 24 october 26 october 2")
    const compound = tryParseCompoundCommand(lower);
    if (compound) {
      replyEl.innerHTML = `TripNest AI: Found trip for <b>${compound.guests} guests</b> to <b>${compound.city}</b> (${compound.checkIn} to ${compound.checkOut})`;
      speakText(`Searching trip to ${compound.city} for ${compound.guests} guests from ${compound.checkIn} to ${compound.checkOut}.`, () => {
        executeCompoundSearch(compound);
      });
      return;
    }

    // 2. Specialized Presentation Pathway: Europe Trip -> Hotels
    if (lower.includes('europe') || (lower.includes('plan') && lower.includes('europe'))) {
      replyEl.innerHTML = 'TripNest AI: Planning your trip to Europe. Opening luxury hotels and stays...';
      speakText('Planning your trip to Europe. Exploring available hotels.', () => {
        window.location.href = 'hotels.html';
      });
      return;
    }

    // 3. Specialized Presentation Pathway: Switzerland / Swiss Alps -> hotels-details.html?id=4
    if (lower.includes('switzerland') || lower.includes('swiss') || lower.includes('zermatt') || lower.includes('alpine summit') || lower.includes('hotel 4')) {
      replyEl.innerHTML = 'TripNest AI: Taking you to Alpine Summit Lodge in Zermatt, Switzerland...';
      speakText('Navigating to Alpine Summit Lodge in Zermatt, Switzerland.', () => {
        window.location.href = 'hotels-details.html?id=4';
      });
      return;
    }

    // 4. Specialized Presentation Pathway: Fill details (18 Oct - 20 Oct)
    if (lower.includes('fill') || lower.includes('second pic') || lower.includes('pic') || (lower.includes('18') && lower.includes('20'))) {
      if (typeof window.tnFillSwissBooking === 'function') {
        const ok = window.tnFillSwissBooking();
        if (ok) {
          replyEl.innerHTML = 'TripNest AI: Populated reservation for <b>2 Adults</b> (18/10/2026 to 20/10/2026). Total: <b>$582.40</b>';
          speakText('Filled reservation for 2 adults from October 18 to October 20 at Alpine Summit Lodge. Total is 582 dollars and 40 cents.');
          return;
        }
      } else {
        replyEl.innerHTML = 'TripNest AI: Opening Alpine Summit Lodge with prefilled reservation...';
        speakText('Opening Alpine Summit Lodge with prefilled reservation.', () => {
          window.location.href = 'hotels-details.html?id=4&autofill=true';
        });
        return;
      }
    }

    // 5. Specialized Presentation Pathway: Reserve Room -> Open Payment Checkout
    if (lower.includes('reserve') || lower.includes('hold room')) {
      if (typeof window.tnTriggerReserveRoom === 'function') {
        replyEl.innerHTML = 'TripNest AI: Reserving Deluxe Room. Opening payment details...';
        speakText('Reserving Deluxe Room. Opening payment details.', () => {
          window.tnTriggerReserveRoom();
        });
        return;
      }
    }

    // 6. Specialized Presentation Pathway: Complete Payment
    if (lower.includes('complete payment') || lower.includes('pay now') || lower.includes('pay 582') || lower === 'pay') {
      if (typeof window.tnCompleteHotelPayment === 'function') {
        replyEl.innerHTML = 'TripNest AI: Processing payment of $582.40...';
        speakText('Processing payment of 582 dollars and 40 cents.', () => {
          window.tnCompleteHotelPayment();
        });
        return;
      }
    }

    // 7. Specialized Presentation Pathway: GPay / Google Pay
    if (lower.includes('gpay') || lower.includes('google pay')) {
      replyEl.innerHTML = 'TripNest AI: Redirecting to Google Pay website...';
      speakText('Redirecting to Google Pay.', () => {
        window.location.href = 'https://pay.google.com/';
      });
      return;
    }

    // 7. Navigation to Destinations
    if (lower.includes('destination') || lower.includes('places') || lower.includes('explore all')) {
      replyEl.innerHTML = 'TripNest AI: Opening global destinations catalog...';
      speakText('Opening destinations catalog.', () => {
        window.location.href = 'destinations.html';
      });
      return;
    }

    // 8. Navigation to Packages
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

    // 9. Single City Search (e.g. "Search Paris", "Find Bali", "Trip to Tokyo")
    const destMatch = lower.match(/(?:search|find|explore|trip to|go to|visit)\s+([a-z\s]+)/i);
    if (destMatch && destMatch[1] && !lower.includes('package') && !lower.includes('hotel')) {
      const targetCity = destMatch[1].trim();
      replyEl.innerHTML = `TripNest AI: Searching trips to <b>${targetCity.toUpperCase()}</b>...`;
      speakText(`Searching destinations and trips to ${targetCity}.`, () => {
        executeDestinationSearch(targetCity);
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
      replyEl.innerHTML = 'TripNest AI: I am your AI travel copilot. Ask me to search cities with dates, view packages, or open hotels!';
      speakText('Hello! I am your TripNest voice assistant. Try saying: Search Paris 24 October 26 October 2, or show tour packages.');
      return;
    }

    // Generic fallback: Treat as destination search
    replyEl.innerHTML = `TripNest AI: Searching destinations matching "${cmd}"...`;
    speakText(`Searching destinations matching ${cmd}.`, () => {
      executeDestinationSearch(cmd);
    });
  }

  // Execute Compound Multi-Field Search
  function executeCompoundSearch(data) {
    const destInput = document.getElementById('searchDestination');
    const checkInInput = document.getElementById('searchCheckIn');
    const checkOutInput = document.getElementById('searchCheckOut');
    const guestsInput = document.getElementById('searchGuests');

    if (destInput) {
      // 1. Populate Destination
      destInput.value = data.city;
      destInput.classList.add('tn-glow-active');

      // 2. Populate Dates
      if (checkInInput) {
        checkInInput.value = data.checkIn;
        checkInInput.classList.add('tn-glow-active');
      }
      if (checkOutInput) {
        checkOutInput.value = data.checkOut;
        checkOutInput.classList.add('tn-glow-active');
      }

      // 3. Populate Guests
      if (guestsInput) {
        guestsInput.value = data.guests;
        guestsInput.classList.add('tn-glow-active');
      }

      // Remove glow after 3.5s
      setTimeout(() => {
        destInput.classList.remove('tn-glow-active');
        if (checkInInput) checkInInput.classList.remove('tn-glow-active');
        if (checkOutInput) checkOutInput.classList.remove('tn-glow-active');
        if (guestsInput) guestsInput.classList.remove('tn-glow-active');
      }, 3500);

      // Scroll search card into view smoothly
      const searchCard = document.getElementById('searchCard');
      if (searchCard) {
        searchCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Trigger search if submit button exists
      const searchBtn = document.querySelector('.search-card__submit') || document.querySelector('#searchCard button[type="submit"]');
      if (searchBtn) {
        setTimeout(() => { searchBtn.click(); }, 600);
      }
    } else {
      // If on another page, navigate to destinations
      window.location.href = `destinations.html?search=${encodeURIComponent(data.city)}`;
    }
  }

  function executeDestinationSearch(term) {
    const destInput = document.getElementById('searchDestination');
    if (destInput) {
      destInput.value = term;
      destInput.focus();
      destInput.classList.add('tn-glow-active');
      setTimeout(() => { destInput.classList.remove('tn-glow-active'); }, 2500);

      const searchBtn = document.querySelector('.search-card__submit') || document.querySelector('#searchCard button[type="submit"]');
      if (searchBtn) {
        searchBtn.click();
      } else {
        const destSec = document.getElementById('destinations');
        if (destSec) destSec.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
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

  // Suggestion Pills Click Handler (delegated)
  container.addEventListener('click', (e) => {
    const pill = e.target.closest('.tn-pill');
    if (pill) {
      const cmd = pill.getAttribute('data-cmd');
      if (cmd) {
        heardEl.innerHTML = `Selected: <span class="recognized">"${cmd}"</span>`;
        if (cmd.toLowerCase().includes('maximize')) {
          toggleFullscreen();
          return;
        }
        handleVoiceCommand(cmd);
      }
    }
  });

  // ==========================================
  // FULLSCREEN / MAXIMIZE SCREEN SYSTEM
  // ==========================================
  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  }

  function toggleFullscreen(forceState) {
    const currentlyFs = isFullscreen();
    const shouldFs = typeof forceState === 'boolean' ? forceState : !currentlyFs;

    if (shouldFs) {
      const elem = document.documentElement;
      const request = elem.requestFullscreen || elem.webkitRequestFullscreen || elem.mozRequestFullScreen || elem.msRequestFullscreen;
      if (request) {
        request.call(elem).catch((err) => {
          console.warn('Fullscreen request:', err);
        });
      }
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
      if (exit) {
        exit.call(document).catch((err) => {
          console.warn('Fullscreen exit:', err);
        });
      }
    }
  }
  window.tnToggleFullscreen = toggleFullscreen;

  function updateFullscreenUI() {
    const fsActive = isFullscreen();
    const buttons = document.querySelectorAll('.tn-fs-toggle');
    buttons.forEach((btn) => {
      const label = btn.querySelector('.tn-fs-label');
      const enterIcon = btn.querySelector('.tn-fs-icon-enter');
      const exitIcon = btn.querySelector('.tn-fs-icon-exit');

      if (fsActive) {
        btn.setAttribute('title', 'Exit Fullscreen (Restore Normal View)');
        btn.setAttribute('aria-label', 'Exit Fullscreen');
        if (label) label.textContent = 'Exit';
        if (enterIcon) enterIcon.style.display = 'none';
        if (exitIcon) exitIcon.style.display = 'inline-block';
        btn.classList.add('is-fullscreen');
      } else {
        btn.setAttribute('title', 'Maximize Screen (Fullscreen View)');
        btn.setAttribute('aria-label', 'Maximize Screen');
        if (label) label.textContent = 'Maximize';
        if (enterIcon) enterIcon.style.display = 'inline-block';
        if (exitIcon) exitIcon.style.display = 'none';
        btn.classList.remove('is-fullscreen');
      }
    });
  }

  // Bind browser fullscreen change events
  document.addEventListener('fullscreenchange', updateFullscreenUI);
  document.addEventListener('webkitfullscreenchange', updateFullscreenUI);
  document.addEventListener('mozfullscreenchange', updateFullscreenUI);
  document.addEventListener('MSFullscreenChange', updateFullscreenUI);

  // Inject Navbar Fullscreen Button across all page layouts
  function injectNavbarFullscreenButton() {
    if (document.getElementById('tnNavFsBtn')) return;

    const navTarget = document.querySelector('.navbar__auth') || 
                      document.querySelector('.navbar__actions') || 
                      document.querySelector('.mt-nav') ||
                      document.querySelector('.navbar__inner') ||
                      document.querySelector('.navbar__container');
    
    if (navTarget) {
      const navBtn = document.createElement('button');
      navBtn.id = 'tnNavFsBtn';
      navBtn.className = 'tn-fullscreen-nav-btn tn-fs-toggle';
      navBtn.title = 'Maximize Screen (Fullscreen View)';
      navBtn.setAttribute('aria-label', 'Maximize Screen');
      navBtn.innerHTML = `
        <svg class="tn-fs-icon-enter" viewBox="0 0 24 24">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
        <svg class="tn-fs-icon-exit" viewBox="0 0 24 24" style="display:none;">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
        <span class="tn-fs-label">Maximize</span>
      `;
      navBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFullscreen();
      });

      if (navTarget.classList.contains('mt-nav')) {
        navTarget.appendChild(navBtn);
      } else {
        navTarget.prepend(navBtn);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavbarFullscreenButton);
  } else {
    injectNavbarFullscreenButton();
  }

  // Floating Fullscreen Button Click Handler
  const floatingFsBtn = document.getElementById('tnFloatingFsBtn');
  if (floatingFsBtn) {
    floatingFsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleFullscreen();
    });
  }

  // Global Keyboard Shortcut: Press 'm' or 'f' to toggle fullscreen
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'm' || e.key === 'M' || e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
        toggleFullscreen();
      }
    }
  });

})();
