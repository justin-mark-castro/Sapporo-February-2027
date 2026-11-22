/* Sapporo 2027 — background music: starts on first tap, fades at each loop, mute toggle */
(function () {
  "use strict";
  var VOL = 0.35, FADE_IN = 1.5, FADE_OUT = 2;
  var KEY = "sapporoBgmMuted";
  var muted = false;
  try { muted = localStorage.getItem(KEY) === "1"; } catch (e) {}

  var audio = new Audio("assets/bgm.mp3");
  audio.preload = "auto";
  audio.loop = false;

  var ctx = null, gain = null, started = false, fadingOut = false;

  var btn = document.createElement("button");
  btn.className = "bgm-btn";
  btn.type = "button";
  document.body.appendChild(btn);

  function paint() {
    btn.setAttribute("aria-pressed", String(!muted));
    btn.setAttribute("aria-label", muted ? "Turn music on" : "Mute music");
    btn.title = muted ? "Music off" : "Music on";
    btn.innerHTML = muted
      ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>'
      : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/></svg>';
  }

  function ramp(to, secs) {
    if (!gain) return;
    var t = ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(to, t + secs);
  }

  function setup() {
    if (ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    gain = ctx.createGain();
    gain.gain.value = 0;
    ctx.createMediaElementSource(audio).connect(gain);
    gain.connect(ctx.destination);
  }

  function play() {
    setup();
    if (ctx && ctx.state === "suspended") ctx.resume();
    if (!ctx) audio.volume = VOL;
    fadingOut = false;
    var p = audio.play();
    if (p && p.then) {
      p.then(function () { started = true; ramp(VOL, FADE_IN); },
             function () { started = false; });
    } else { started = true; ramp(VOL, FADE_IN); }
  }

  function stop() {
    ramp(0, 0.4);
    setTimeout(function () { if (muted) audio.pause(); }, 450);
  }

  // fade out near the end, restart with a fade in
  audio.addEventListener("timeupdate", function () {
    if (!audio.duration || fadingOut || muted) return;
    if (audio.duration - audio.currentTime <= FADE_OUT) {
      fadingOut = true;
      ramp(0, Math.max(0.3, audio.duration - audio.currentTime));
    }
  });
  audio.addEventListener("ended", function () {
    audio.currentTime = 0;
    if (!muted) play();
  });

  function firstGesture(e) {
    if (e.target === btn || btn.contains(e.target)) return;
    removeGestureListeners();
    if (!muted && !started) play();
  }
  function removeGestureListeners() {
    ["pointerdown", "touchend", "keydown"].forEach(function (ev) {
      document.removeEventListener(ev, firstGesture, true);
    });
  }
  ["pointerdown", "touchend", "keydown"].forEach(function (ev) {
    document.addEventListener(ev, firstGesture, true);
  });

  btn.addEventListener("click", function () {
    removeGestureListeners();
    muted = !muted;
    try { localStorage.setItem(KEY, muted ? "1" : "0"); } catch (e) {}
    paint();
    if (muted) stop(); else play();
  });

  // pause when the tab is hidden, resume when back
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { audio.pause(); }
    else if (started && !muted) { play(); }
  });

  paint();
  if (!muted) {
    // works only if the browser permits autoplay; otherwise first tap starts it
    play();
  }
})();
