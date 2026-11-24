/* Daily digest: today's plan + weather for five Hokkaido towns.
   Picks the itinerary day from the current date in Japan (Asia/Tokyo).
   A "Test the digest" button lets you preview any trip day before the trip. */
(function () {
  "use strict";
  var T = window.TRIP;
  var root = document.getElementById("today");
  if (!T || !root) return;

  var TOWNS = [
    { name: "Sapporo City", jp: "札幌", lat: 43.0618, lng: 141.3545 },
    { name: "Otaru", jp: "小樽", lat: 43.1907, lng: 140.9947 },
    { name: "Asahikawa", jp: "旭川", lat: 43.7706, lng: 142.3650 },
    { name: "Biei", jp: "美瑛", lat: 43.5887, lng: 142.4659 },
    { name: "Furano", jp: "富良野", lat: 43.3420, lng: 142.3830 }
  ];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(s) { return root.querySelector(s); }
  function parseISO(s) { var p = s.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function dayDiff(a, b) { return Math.round((parseISO(b) - parseISO(a)) / 86400000); }
  function tokyoToday() {
    try { return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" }); }
    catch (e) { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  }
  function prettyDate(iso) { var d = parseISO(iso); return DOW[d.getUTCDay()] + ", " + MONTHS[d.getUTCMonth()] + " " + d.getUTCDate() + ", " + d.getUTCFullYear(); }
  function shiftYear(iso, n) { return (+iso.slice(0, 4) + n) + iso.slice(4); }

  /* ---------- weather codes (WMO) ---------- */
  function wx(code) {
    if (code === 0) return { i: "☀️", t: "Clear" };
    if (code === 1) return { i: "🌤️", t: "Mostly clear" };
    if (code === 2) return { i: "⛅", t: "Partly cloudy" };
    if (code === 3) return { i: "☁️", t: "Overcast" };
    if (code === 45 || code === 48) return { i: "🌫️", t: "Fog" };
    if (code >= 51 && code <= 57) return { i: "🌦️", t: "Drizzle" };
    if (code >= 61 && code <= 67) return { i: "🌧️", t: "Rain" };
    if (code >= 71 && code <= 77) return { i: "🌨️", t: "Snow" };
    if (code >= 80 && code <= 82) return { i: "🌧️", t: "Rain showers" };
    if (code === 85 || code === 86) return { i: "🌨️", t: "Snow showers" };
    if (code >= 95) return { i: "⛈️", t: "Thunderstorm" };
    return { i: "🌡️", t: "Mixed" };
  }

  /* ---------- weather fetch ---------- */
  function weatherUrl(iso) {
    var today = tokyoToday(), diff = dayDiff(today, iso), base, date, mode;
    if (diff >= 0 && diff <= 15) { base = "https://api.open-meteo.com/v1/forecast"; date = iso; mode = "forecast"; }
    else if (diff < 0) { base = "https://archive-api.open-meteo.com/v1/archive"; date = iso; mode = "recorded"; }
    else { base = "https://archive-api.open-meteo.com/v1/archive"; date = shiftYear(iso, -1); mode = "sample"; }
    var url = base + "?latitude=" + TOWNS.map(function (t) { return t.lat; }).join(",") +
      "&longitude=" + TOWNS.map(function (t) { return t.lng; }).join(",") +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum,wind_speed_10m_max" +
      "&timezone=Asia%2FTokyo&start_date=" + date + "&end_date=" + date;
    return { url: url, mode: mode, date: date };
  }
  function fetchWeather(iso) {
    var q = weatherUrl(iso), key = "sap27-wx-" + q.mode + "-" + q.date, cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(key)); } catch (e) {}
    if (cached && Date.now() - cached.at < 30 * 60 * 1000) return Promise.resolve({ mode: q.mode, date: q.date, towns: cached.towns });
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 9000);
    return fetch(q.url, ctl ? { signal: ctl.signal } : undefined).then(function (r) {
      clearTimeout(timer);
      if (!r.ok) throw new Error("http " + r.status);
      return r.json();
    }).then(function (j) {
      var arr = Array.isArray(j) ? j : [j];
      var towns = arr.map(function (o) {
        var d = o && o.daily; if (!d || !d.time || !d.time.length) return null;
        return { code: d.weather_code[0], hi: d.temperature_2m_max[0], lo: d.temperature_2m_min[0],
          rain: d.precipitation_sum[0], snow: d.snowfall_sum[0], wind: d.wind_speed_10m_max[0] };
      });
      if (towns.length !== TOWNS.length || towns.every(function (t) { return !t; })) throw new Error("bad data");
      try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), towns: towns })); } catch (e) {}
      return { mode: q.mode, date: q.date, towns: towns };
    });
  }
  function normals() {
    var feb = ((T.guide && T.guide.climate) || []).filter(function (c) { return c.m === "Feb"; })[0] || { hiC: -1, loC: -8 };
    return { mode: "normals", towns: TOWNS.map(function () { return { hi: feb.hiC, lo: feb.loC }; }) };
  }

  function round(n) { return n == null ? "–" : Math.round(n); }
  function weatherHtml(w) {
    var note = {
      forecast: "Live forecast from Open-Meteo for this date.",
      recorded: "Recorded weather for this date (Open-Meteo archive).",
      sample: "Sample only: this date is more than 15 days away, so this shows the weather on the same date in " + (w.date ? w.date.slice(0, 4) : "last year") + ". The real forecast appears automatically within 15 days of the day.",
      normals: "Couldn't reach the weather service, so this shows typical February highs and lows for Sapporo."
    }[w.mode];
    var cards = w.towns.map(function (t, i) {
      var town = TOWNS[i];
      if (!t) return '<li class="wx-card"><b>' + esc(town.name) + '</b><span class="wx-t">Unavailable</span></li>';
      var cond = t.code == null ? { i: "🌡️", t: "Typical" } : wx(t.code);
      var extra = "";
      if (t.snow != null) extra += "<span>❄ " + (t.snow >= 0.1 ? t.snow.toFixed(1) + " cm snow" : "No snow") + "</span>";
      if (t.rain != null && t.rain >= 0.1) extra += "<span>💧 " + t.rain.toFixed(1) + " mm</span>";
      if (t.wind != null) extra += "<span>💨 " + Math.round(t.wind) + " km/h wind</span>";
      return '<li class="wx-card"><div class="wx-top"><span class="wx-ico" aria-hidden="true">' + cond.i + '</span>' +
        '<div><b>' + esc(town.name) + ' <small>' + esc(town.jp) + '</small></b><span class="wx-t">' + esc(cond.t) + "</span></div></div>" +
        '<div class="wx-temp"><b>' + round(t.hi) + '°</b><span> / ' + round(t.lo) + '°C</span></div>' +
        (extra ? '<div class="wx-extra">' + extra + "</div>" : "") + "</li>";
    }).join("");
    return '<h3 class="sub-h">Weather today</h3><ul class="wx-grid">' + cards + '</ul><p class="tiny muted wx-note">' + esc(note) + "</p>";
  }

  /* ---------- plan ---------- */
  function planHtml(d) {
    var stops = (d.stops || []).map(function (s) {
      return '<li class="dg-stop"><span class="dg-time">' + esc(s.time || "") + '</span><div><b>' + esc(s.activity) + "</b>" +
        (s.location ? '<span class="dg-loc">' + esc(s.location) + "</span>" : "") +
        (s.hours ? '<span class="dg-loc">Hours: ' + esc(s.hours) + "</span>" : "") + "</div></li>";
    }).join("");
    return '<div class="dg-plan"><div class="dg-dayhead"><span class="dg-dn">Day ' + d.day + '</span><div><h3>' + esc(d.title) + "</h3>" +
      (d.area ? '<p class="dg-area">' + esc(d.area) + "</p>" : "") + "</div></div>" +
      (d.why ? '<p class="dg-why">' + esc(d.why) + "</p>" : "") +
      (stops ? '<ol class="dg-stops">' + stops + "</ol>" : "") +
      '<a class="dg-full" href="#itinerary">Open full itinerary ↓</a></div>';
  }

  /* ---------- render ---------- */
  var testIso = null;       // null = live date
  var seq = 0;

  function render() {
    var live = tokyoToday(), iso = testIso || live;
    var first = T.itinerary[0].date, last = T.itinerary[T.itinerary.length - 1].date;
    var day = T.itinerary.filter(function (d) { return d.date === iso; })[0];
    var badge = testIso
      ? '<span class="dg-badge test">Test preview</span>'
      : (day ? '<span class="dg-badge live">Live · today in Japan</span>' : '<span class="dg-badge">Waiting for the trip</span>');

    var head = '<header class="section-head"><span class="kicker">今日 · Today</span><h2>Daily digest</h2>' +
      '<p class="lede">' + (day ? esc(prettyDate(iso)) : "Shows the plan and weather for each trip day, automatically, on the day itself.") + " " + badge + "</p></header>";

    var tester = '<div class="dg-test"><button type="button" class="btn dg-btn" id="dgToggle" aria-expanded="' + (testOpen ? "true" : "false") + '">🧪 Test the digest</button>' +
      '<div class="dg-panel" id="dgPanel"' + (testOpen ? "" : " hidden") + '>' +
      '<label for="dgDay">Pretend today is</label>' +
      '<select id="dgDay">' + T.itinerary.map(function (d) {
        return '<option value="' + d.date + '"' + (testIso === d.date ? " selected" : "") + ">Day " + d.day + " · " + MONTHS[+d.date.slice(5, 7) - 1] + " " + (+d.date.slice(8)) + " · " + esc(d.title) + "</option>";
      }).join("") + "</select>" +
      '<button type="button" class="btn dg-live" id="dgLive"' + (testIso ? "" : " disabled") + '>Back to live date</button></div></div>';

    var body;
    if (day) {
      body = '<div id="dgPlan">' + planHtml(day) + '</div><div id="dgWx"><p class="muted small dg-loading">Loading weather…</p></div>';
    } else if (iso < first) {
      var n = dayDiff(iso, first);
      body = '<div class="dg-empty"><b>' + n + " day" + (n === 1 ? "" : "s") + " until Day 1</b><p>The digest switches on by itself on Feb 1, 2027 (Japan time) and shows that day's plan and weather. Use the test button to see how it will look.</p></div>";
    } else {
      body = '<div class="dg-empty"><b>Trip complete 🎉</b><p>The digest only shows during Feb 1–12, 2027. Use the test button to replay any day.</p></div>';
    }

    root.querySelector(".wrap").innerHTML = head + tester + body;
    bind();

    if (day) {
      var my = ++seq, box = $("#dgWx");
      fetchWeather(iso).catch(function () { return normals(); }).then(function (w) {
        if (my !== seq || !box) return;
        box.innerHTML = weatherHtml(w);
      });
    }
  }

  var testOpen = false;
  function bind() {
    $("#dgToggle").onclick = function () {
      testOpen = !testOpen;
      testIso = testOpen ? T.itinerary[Math.min(3, T.itinerary.length - 1)].date : null; // start on Day 4 (Snow Festival opens)
      render();
    };
    $("#dgDay").onchange = function () { testIso = this.value; render(); };
    $("#dgLive").onclick = function () { testIso = null; testOpen = false; render(); };
  }

  render();
  // Roll over to the next day if the page stays open past midnight (Japan time).
  var shown = tokyoToday();
  setInterval(function () { if (!testIso && tokyoToday() !== shown) { shown = tokyoToday(); render(); } }, 60000);
})();
