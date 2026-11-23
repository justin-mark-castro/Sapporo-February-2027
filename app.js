/* Sapporo 2027 — site logic (no dependencies) */
(function () {
  "use strict";
  var T = window.TRIP;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };

  /* ---------- storage helpers (safe) ---------- */
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- dates ---------- */
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function parseISO(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function todayLocal() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function dayDiff(a, b) { return Math.round((b - a) / 86400000); }
  var startD = parseISO(T.start), endD = parseISO(T.end);
  var totalDays = dayDiff(startD, endD) + 1;

  /* ---------- number formats ---------- */
  var SYM = { PHP: "₱", SGD: "S$", JPY: "¥" };
  function money(v, cur) {
    var d = cur === "JPY" ? 0 : 2;
    if (d) v = Math.round(v * 100 + 1e-6) / 100; // match the sheet's round-half-up (e.g. 166,924.17)
    return SYM[cur] + v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function moneyShort(v, cur) {
    var d = cur === "JPY" ? 0 : 0;
    return SYM[cur] + v.toLocaleString("en-US", { maximumFractionDigits: d });
  }
  var round2 = function (n) { return Math.round(n * 100) / 100; };

  /* ---------- derived totals (from the sheet's own columns) ---------- */
  var totals = T.expenses.reduce(function (a, e) { a.php += e.php; a.sgd += e.sgd; return a; }, { php: 0, sgd: 0 });
  totals.php = round2(totals.php); totals.sgd = round2(totals.sgd);

  /* =========================================================
     FX state
     ========================================================= */
  var fx = { SGD: 1, PHP: T.fxFallback.PHP, JPY: T.fxFallback.JPY };
  var fxMeta = { source: "fallback", time: null };
  var prefs = store.get("sap27-fx") || { sheet: false, customJpy: "" };

  function liveRates() { return store.get("sap27-live") || null; }
  function applyRates() {
    var base = { SGD: 1, PHP: T.fxFallback.PHP, JPY: T.fxFallback.JPY };
    var live = liveRates();
    if (live && live.rates && live.rates.PHP && live.rates.JPY) {
      base.PHP = live.rates.PHP; base.JPY = live.rates.JPY;
      fxMeta = { source: "live", time: live.time };
    } else {
      fxMeta = { source: "fallback", time: null };
    }
    if (prefs.sheet) base.PHP = T.sheetRateSgdPhp;
    var c = parseFloat(String(prefs.customJpy).replace(/,/g, ""));
    if (prefs.customJpy && c > 0) base.JPY = c;
    fx = base;
  }
  function rate(from, to) { return fx[to] / fx[from]; }
  /* "MM/DD/YY, hh:mm am/pm PH" in Philippine time (Asia/Manila), whatever the device timezone */
  function fmtPH(t) {
    var d = new Date(t);
    if (isNaN(d.getTime())) return "unknown time";
    try {
      var p = {};
      new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", month: "2-digit", day: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true })
        .formatToParts(d).forEach(function (x) { p[x.type] = x.value; });
      return p.month + "/" + p.day + "/" + p.year + ", " + p.hour + ":" + p.minute + " " + String(p.dayPeriod).toLowerCase() + " PH";
    } catch (e) {
      var m = new Date(d.getTime() + 8 * 3600000), h = m.getUTCHours(), pad = function (n) { return (n < 10 ? "0" : "") + n; };
      return pad(m.getUTCMonth() + 1) + "/" + pad(m.getUTCDate()) + "/" + pad(m.getUTCFullYear() % 100) + ", " + pad(h % 12 || 12) + ":" + pad(m.getUTCMinutes()) + " " + (h < 12 ? "am" : "pm") + " PH";
    }
  }
  function fmtRate(v) { return v >= 100 ? v.toFixed(2) : v >= 1 ? v.toFixed(3) : v.toFixed(4); }

  /* =========================================================
     Hero + countdown
     ========================================================= */
  function fmtRange() {
    var s = startD, e = endD;
    return MONTHS_FULL[s.getMonth()] + " " + s.getDate() + " – " + e.getDate() + ", " + e.getFullYear();
  }
  $("#heroDates").textContent = fmtRange();
  $("#heroNights").textContent = T.nights + " nights";
  $("#footDates").textContent = fmtRange();

  function tickCountdown() {
    var t = todayLocal(), d = dayDiff(t, startD);
    var wrap = $(".countdown");
    if (d > 0) {
      $("#cdDays").textContent = d;
      $("#cdHours").textContent = (d / 7).toFixed(1);
      $("#cdMins").textContent = totalDays;
    } else if (t <= endD) {
      wrap.innerHTML = '<div><b>Day ' + (dayDiff(startD, t) + 1) + '</b><small>of ' + totalDays + ' · enjoy Sapporo</small></div>';
    } else {
      wrap.innerHTML = '<div><b>おかえり</b><small>welcome home</small></div>';
    }
  }
  tickCountdown();
  setInterval(tickCountdown, 60 * 60 * 1000);

  /* =========================================================
     Overview
     ========================================================= */
  function renderStats() {
    var t = todayLocal(), d = Math.max(0, dayDiff(t, startD));
    var paidPct = totals.php ? Math.min(100, (T.paid.php / totals.php) * 100) : 0;
    var half = round2(totals.php / T.travelers.length);
    var halfS = round2(totals.sgd / T.travelers.length);
    var cards = [
      { c: "", l: "Days to go", v: d, s: "until " + MONTHS[startD.getMonth()] + " " + startD.getDate() + ", " + startD.getFullYear() },
      { c: "ai", l: "Total expense", v: moneyShort(totals.php, "PHP"), s: "of " + moneyShort(T.budget.php, "PHP") + " budget · about " + moneyShort(totals.sgd, "SGD") },
      { c: "", l: "Your share · 50%", v: moneyShort(half, "PHP"), s: "about " + moneyShort(halfS, "SGD") },
      { c: "ai", l: "Paid so far", v: Math.round(paidPct) + "%", s: "of " + moneyShort(totals.php, "PHP") + " total",
        bar: paidPct }
    ];
    $("#stats").innerHTML = cards.map(function (c) {
      return '<div class="stat ' + c.c + '"><label>' + c.l + '</label><b>' + c.v + '</b><span>' + c.s + '</span>' +
        (c.bar != null ? '<div class="progress" role="progressbar" aria-valuenow="' + Math.round(c.bar) + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + c.bar + '%"></i></div>' : "") + '</div>';
    }).join("");

    var ic = {
      temp: '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z"/>',
      snow: '<path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5l-14.2 11M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5"/>',
      fest: '<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
    };
    var g = T.guide;
    var items = [
      ["temp", "Feb high / low", g.highLow],
      ["snow", "Feb snowfall", g.snowfall],
      ["fest", "Snow Festival", g.festival],
      ["clock", "Time difference", g.timeDiff + " vs SG / MNL"]
    ];
    $("#guideStats").innerHTML = items.map(function (i) {
      return '<div class="glance"><span class="ico"><svg viewBox="0 0 24 24">' + ic[i[0]] + '</svg></span><div><small>' + i[1] + '</small><b>' + esc(i[2]) + '</b></div></div>';
    }).join("");
  }

  /* =========================================================
     Itinerary
     ========================================================= */
  var FEST = [
    { id: "snow", label: "雪まつり Snow Festival", cls: "chip-snow", from: "2027-02-04", to: "2027-02-11" },
    { id: "light", label: "小樽 Otaru Snow Light Path", cls: "chip-light", from: "2027-02-06", to: "2027-02-13" }
  ];
  var icPin = '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  var icClock = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  var icNote = '<svg viewBox="0 0 24 24"><path d="M5 4h11l3 3v13H5z"/><path d="M8 11h8M8 15h6"/></svg>';

  var icPlane = '<svg viewBox="0 0 24 24"><path d="M2 16l20-6-3-2-6 1-5-5-2 1 3 6-5 2-2-2-1 1 3 4 5-2 2 2 1-1-1-4z"/></svg>';

  function fmtFlightDate(iso, dow) {
    var d = parseISO(iso);
    return dow + ", " + MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function logoImg(cls) {
    if (!T.airlineLogo) return "";
    return '<img class="airline-logo ' + (cls || "") + '" src="' + esc(T.airlineLogo) + '" alt="Philippine Airlines" loading="lazy" onerror="this.style.display=\'none\';if(this.nextElementSibling)this.nextElementSibling.style.display=\'\'">';
  }
  function renderHotel() {
    var el = $("#hotel"), h = T.hotel;
    if (!el || !h) return;
    el.innerHTML = (h.photo ? '<figure class="hotel-photo"><img src="' + esc(h.photo) + '" alt="' + esc(h.name) + ' exterior" loading="lazy" onerror="this.parentNode.style.display=\'none\'"></figure>' : '') + '<div class="hotel-ico"><svg viewBox="0 0 24 24"><path d="M3 20V6M3 12h18v8M21 12V9a2 2 0 0 0-2-2h-8v5"/><circle cx="7" cy="9.5" r="1.8"/></svg></div>' +
      '<div class="hotel-body"><small>Hotel · ' + esc(h.nights) + '</small><b>' + esc(h.name) + ' <span class="jpn">' + esc(h.jp) + '</span></b>' +
      '<p>' + esc(h.address) + '</p><p>Check-in ' + esc(h.checkIn) + ' · Check-out ' + esc(h.checkOut) + '</p><p class="muted">' + esc(h.access) + '</p>' +
      '<a href="#map">See on map</a></div>';
  }
  function renderFlights() {
    var el = $("#flights");
    if (!el || !T.flights) return;
    el.innerHTML = T.flights.map(function (f) {
      return '<article class="flight">' +
        '<div class="flight-top">' + (T.airlineLogo ? '<span class="flight-logo">' + logoImg("") + '<span class="flight-ico" style="display:none">' + icPlane + '</span></span>' : '<span class="flight-ico">' + icPlane + '</span>') +
        '<div><b class="flight-code">' + esc(f.code) + '</b><small>' + esc(f.airline) + " · " + esc(f.aircraft) + "</small></div>" +
        '<span class="flight-date">' + esc(fmtFlightDate(f.date, f.dow)) + "</span></div>" +
        '<div class="flight-route">' +
        '<div class="fl-end"><b>' + esc(f.dep) + '</b><span class="fl-code">' + esc(f.from) + "</span><small>" + esc(f.fromName) + "</small></div>" +
        '<div class="fl-line" aria-hidden="true"><i></i></div>' +
        '<div class="fl-end"><b>' + esc(f.arr) + '</b><span class="fl-code">' + esc(f.to) + "</span><small>" + esc(f.toName) + "</small></div>" +
        "</div>" +
        '<p class="flight-note">' + esc(f.note) + "</p></article>";
    }).join("") + '<p class="muted tiny flights-foot">' + esc(T.flightsNote || "") + "</p>";
  }

  var icTrain = '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l2-4M15 21l-2-4"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/></svg>';
  var icSunrise = '<svg viewBox="0 0 24 24"><path d="M12 2.5v5M9.5 5L12 2.5 14.5 5M4.6 11.2l1.8 1.8M19.4 11.2L17.6 13M2.5 19h19M6.5 19a5.5 5.5 0 0 1 11 0M7 22h10"/></svg>';
  var icSunset = '<svg viewBox="0 0 24 24"><path d="M12 2.5v5M9.5 5L12 7.5 14.5 5M4.6 11.2l1.8 1.8M19.4 11.2L17.6 13M2.5 19h19M6.5 19a5.5 5.5 0 0 1 11 0M7 22h10"/></svg>';
  function sunLine(date) {
    var s = T.sun && T.sun[date];
    if (!s) return "";
    return '<p class="day-sun" title="Sapporo, local time">' +
      '<span class="sun-rise" aria-label="Sunrise ' + esc(s.rise) + '" title="Sunrise">' + icSunrise + "<small>Sunrise</small><b>" + esc(s.rise) + "</b></span>" +
      '<span class="sun-set" aria-label="Sunset ' + esc(s.set) + '" title="Sunset">' + icSunset + "<small>Sunset</small><b>" + esc(s.set) + "</b></span></p>";
  }
  // Train line colors (same palette as the rail map)
  var LINE_CHIPS = {
    "Namboku Line": "#1f9d55", "Tozai Line": "#f08a1c", "Toho Line": "#1e88d6",
    "Hakodate Main Line": "#7b4fb3", "Chitose Line": "#d6336c", "Gakuen Toshi Line": "#12908e",
    "Streetcar": "#8a5a2b"
  };
  var CODE_COLORS = { N: "#1f9d55", T: "#f08a1c", H: "#1e88d6" };
  function howHtml(text) {
    return esc(text).replace(/(JR Rapid Airport|Special Rapid|Rapid Airport|Namboku Line|Tozai Line|Toho Line|Gakuen Toshi Line|Hakodate Main Line|Chitose Line|Streetcar)|\b([NTH]\d\d)\b/g, function (m, name, code) {
      if (code) return '<span class="lcode" style="--c:' + CODE_COLORS[code.charAt(0)] + '">' + code + "</span>";
      if (name === "JR Rapid Airport" || name === "Rapid Airport" || name === "Special Rapid") return '<span class="lchip rapid">' + name + "</span>";
      return '<span class="lchip" style="--c:' + LINE_CHIPS[name] + '">' + name + "</span>";
    });
  }
  var STOP_TYPES = {
    flight:   { label: "Flight",        color: "#2563a8", svg: '<path d="M2 16l20-6-3-2-6 1-5-5-2 1 3 6-5 2-2-2-1 1 3 4 5-2 2 2 1-1-1-4z"/>' },
    train:    { label: "Train / transit", color: "#3b6fd1", svg: '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l2-4M15 21l-2-4"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/>' },
    shrine:   { label: "Shrine",        color: "#c8372d", svg: '<path d="M2.5 6c3 1.2 16 1.2 19 0M5 10h14M7 6v14M17 6v14M12 7v3"/>' },
    temple:   { label: "Temple",        color: "#a8402a", svg: '<path d="M3 10l9-6 9 6M5 10v9h14v-9M10 19v-5h4v5"/>' },
    nature:   { label: "Park / nature", color: "#2e8b57", svg: '<path d="M12 3l5 7h-3l4 6H6l4-6H7z"/><path d="M12 16v5"/>' },
    mountain: { label: "Mountain / view", color: "#4b7f52", svg: '<path d="M3 19l6-10 4 6 2-3 6 7z"/>' },
    snow:     { label: "Snow & ice",    color: "#1b8fb5", svg: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>' },
    landmark: { label: "Landmark",      color: "#4f46a5", svg: '<path d="M12 2v6M9 8h6l1.5 13h-9zM9.5 13h5"/>' },
    food:     { label: "Food",          color: "#d9701a", svg: '<path d="M3 11h18c0 5-4 9-9 9s-9-4-9-9zM8 7c0-1 1-1 1-3M12 7c0-1 1-1 1-3M16 7c0-1 1-1 1-3"/>' },
    sweets:   { label: "Sweets",        color: "#d6336c", svg: '<path d="M7 11a5 5 0 0 1 10 0zM7 11l5 11 5-11"/>' },
    shopping: { label: "Shopping",      color: "#8e44ad", svg: '<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>' },
    tour:     { label: "Tour / animals", color: "#12908e", svg: '<path d="M12 14c-3 0-5 2-5 4 0 1.5 1.5 2 3 1.5l2-.5 2 .5c1.5.5 3 0 3-1.5 0-2-2-4-5-4z"/><circle cx="6" cy="10" r="1.6"/><circle cx="10" cy="6.5" r="1.6"/><circle cx="14" cy="6.5" r="1.6"/><circle cx="18" cy="10" r="1.6"/>' },
    beer:     { label: "Beer / museum", color: "#a8741a", svg: '<path d="M6 7h9v13H6zM15 10h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3M9 11v6M12 11v6M6 7c0-2 3-2 3-1 0-1 3-1 3 0 0-1 3-1 3 1"/>' },
    flex:     { label: "Free time",     color: "#7b7f8c", svg: '<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/>' }
  };
  function stopIcon(s) {
    var t = STOP_TYPES[s && s.icon];
    if (!t) return "";
    return '<span class="stop-ico" style="--c:' + t.color + '" title="' + t.label + '" role="img" aria-label="' + t.label + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + t.svg + "</svg></span>";
  }
  function typeLegend() {
    var used = {};
    T.itinerary.forEach(function (d) { (d.stops || []).forEach(function (s) { if (STOP_TYPES[s.icon]) used[s.icon] = 1; }); });
    return '<ul class="type-legend" aria-label="Icon colour key">' + Object.keys(STOP_TYPES).filter(function (k) { return used[k]; }).map(function (k) {
      var t = STOP_TYPES[k];
      return '<li style="--c:' + t.color + '"><span class="stop-ico sm"><svg viewBox="0 0 24 24" aria-hidden="true">' + t.svg + "</svg></span>" + t.label + "</li>";
    }).join("") + "</ul>";
  }
  function stopMapLink(s) {
    if (!s || s.map === false || (!s.location && !s.map)) return "";
    var q = s.map || ((s.activity || "") + " " + (s.location || "")).replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
    if (!/sapporo|hokkaido/i.test(q)) q += " Hokkaido";
    var url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
    return '<a class="map-link" href="' + url + '" target="_blank" rel="noopener">' + icPin + "View on map</a>";
  }
  function stopExtras(s) {
    var h = "";
    if (s.photo) h += '<figure class="stop-photo"><img src="' + esc(s.photo) + '" alt="' + esc(s.activity) + '" loading="lazy" onerror="this.parentNode.style.display=\'none\'"></figure>';
    else if (s.wiki || s.commons) h += '<figure class="stop-photo" hidden><img ' + (s.wiki ? 'data-wiki="' + esc(s.wiki) + '"' : "") + (s.commons ? ' data-commons="' + esc(JSON.stringify(s.commons)) + '"' : "") + ' alt="' + esc(s.activity) + '" loading="lazy"><figcaption></figcaption></figure>';
    if (s.desc) h += '<p class="stop-desc">' + esc(s.desc) + "</p>";
    if (s.fact) h += '<p class="stop-fact"><b>Fact:</b> ' + esc(s.fact) + "</p>";
    return h;
  }
  function prepMeta(s) {
    return (s.prep || []).map(function (t) { return "<span>" + icClock + esc(t) + "</span>"; }).join("");
  }
  function loadStopPhotos() {
    var cache = {};
    function fetchPhoto(q) {
      if (cache[q]) return cache[q];
      var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages|info&inprop=url&piprop=thumbnail&pithumbsize=640&titles=" + encodeURIComponent(q);
      cache[q] = fetch(url).then(function (r) { return r.json(); }).then(function (j) {
        var pages = (j.query && j.query.pages) || {}, best = null;
        Object.keys(pages).forEach(function (k) { var p = pages[k]; if (!best && p.thumbnail && p.thumbnail.source) best = { src: p.thumbnail.source, page: p.fullurl, title: p.title }; });
        return best;
      }).catch(function () { return null; });
      return cache[q];
    }
    function plain(h) { var d = document.createElement("div"); d.innerHTML = h || ""; return (d.textContent || "").trim(); }
    function fetchCommons(c) {
      var key = "c:" + c.q;
      if (cache[key]) return cache[key];
      var url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=15&gsrsearch=" + encodeURIComponent(c.q) + "&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=640";
      cache[key] = fetch(url).then(function (r) { return r.json(); }).then(function (j) {
        var pages = (j.query && j.query.pages) || {};
        var list = Object.keys(pages).map(function (k) { return pages[k]; }).sort(function (a, b) { return (a.index || 0) - (b.index || 0); });
        for (var i = 0; i < list.length; i++) {
          var p = list[i], ii = p.imageinfo && p.imageinfo[0];
          if (!ii || !/^image\/(jpeg|png)$/.test(ii.mime) || !ii.thumburl) continue;
          var t = p.title.toLowerCase();
          var ok = (c.must || []).every(function (m) { return m.split("|").some(function (w) { return t.indexOf(w) > -1; }); });
          if (!ok) continue;
          var md = ii.extmetadata || {};
          return { src: ii.thumburl, page: ii.descriptionurl, title: p.title.replace(/^File:/, ""), artist: plain(md.Artist && md.Artist.value), license: plain(md.LicenseShortName && md.LicenseShortName.value), commons: true };
        }
        return null;
      }).catch(function () { return null; });
      return cache[key];
    }
    document.querySelectorAll("img[data-wiki], img[data-commons]").forEach(function (img) {
      var w = img.getAttribute("data-wiki"), cm = img.getAttribute("data-commons");
      var first = w ? fetchPhoto(w) : Promise.resolve(null);
      first.then(function (r) { return r || (cm ? fetchCommons(JSON.parse(cm)) : null); }).then(function (r) {
        if (!r) return;
        img.onload = function () { img.parentNode.hidden = false; };
        img.src = r.src;
        var cap = img.parentNode.querySelector("figcaption");
        if (cap) cap.innerHTML = r.commons
          ? 'Photo: <a href="' + esc(r.page) + '" target="_blank" rel="noopener">' + esc(r.artist || "Wikimedia Commons") + (r.license ? " · " + esc(r.license) : "") + " · Wikimedia Commons</a>"
          : 'Photo: <a href="' + esc(r.page) + '" target="_blank" rel="noopener">Wikipedia · ' + esc(r.title) + "</a>";
      });
    });
  }
  function renderTimeline() {
    var today = todayLocal();
    var tl = $("#timeline");
    var lg = document.getElementById("typeLegend");
    if (!lg) { lg = document.createElement("div"); lg.id = "typeLegend"; tl.parentNode.insertBefore(lg, tl); }
    lg.innerHTML = typeLegend();
    tl.innerHTML = T.itinerary.map(function (d) {
      var dt = parseISO(d.date);
      var isToday = dt.getTime() === today.getTime();
      var kind = d.kind || "day";
      var badges = FEST.filter(function (f) { return d.date >= f.from && d.date <= f.to; }).map(function (f) {
        var extra = d.date === f.from ? " · opens" : d.date === f.to ? " · last day" : "";
        return '<span class="chip ' + f.cls + '">' + f.label + extra + "</span>";
      }).join("");
      var cls = "day-body" + (kind === "arrival" || kind === "departure" ? " key" : "") + (kind === "flex" ? " flex" : "");
      var head = '<h4>' + esc(d.title) + "</h4>" +
        (d.area ? '<p class="day-area">' + icPin + esc(d.area) + "</p>" : "") +
        (d.why ? '<p class="day-why">' + esc(d.why) + "</p>" : "") + sunLine(d.date);
      var stops = (d.stops || []).map(function (s) {
        var meta = "";
        if (s.location) meta += "<span>" + icPin + esc(s.location) + "</span>";
        if (s.how) meta += "<span class='how'>" + icTrain + "<span>" + howHtml(s.how) + "</span></span>";
        meta = prepMeta(s) + meta;
        if (s.notes) meta += "<span>" + icNote + esc(s.notes) + "</span>";
        return '<li class="stop"><span class="stop-time">' + esc(s.time || "") + "</span>" +
          '<div class="stop-main"><div class="stop-title">' + stopIcon(s) + "<b>" + esc(s.activity) + "</b></div>" + stopExtras(s) + (meta ? '<div class="meta">' + meta + "</div>" : "") + stopMapLink(s) + "</div></li>";
      }).join("");
      var body;
      if (kind === "arrival") {
        var s0 = (d.stops || [])[0] || {};
        var meta0 = "";
        if (s0.time) meta0 += "<span>" + icClock + esc(s0.time) + "</span>";
        if (s0.location) meta0 += "<span>" + icPin + esc(s0.location) + "</span>";
        if (s0.how) meta0 += "<span class='how'>" + icTrain + "<span>" + howHtml(s0.how) + "</span></span>";
        meta0 = prepMeta(s0) + meta0;
        if (s0.notes) meta0 += "<span>" + icNote + esc(s0.notes) + "</span>";
        body = '<h4 class="stop-title">' + stopIcon(s0) + "<span>" + esc(s0.activity || d.title) + "</span></h4>" + stopExtras(s0) + (meta0 ? '<div class="meta">' + meta0 + "</div>" : "") + stopMapLink(s0) + sunLine(d.date);
      } else {
        body = head + (stops ? '<ul class="stops">' + stops + "</ul>" : "");
      }
      return '<li class="day' + (isToday ? " today" : "") + '">' +
        '<div class="day-date"><span class="dn">Day ' + d.day + '</span><span class="dd">' + MONTHS[dt.getMonth()] + " " + dt.getDate() + '</span><span class="dw">' + d.dow + "</span></div>" +
        '<div class="' + cls + '">' + body +
        (badges ? '<div class="badges">' + badges + "</div>" : "") +
        "</div></li>";
    }).join("");
  }

  function renderGuide() {
    var g = T.guide;
    var minT = -10, maxT = 12, span = maxT - minT, maxSnow = 140;
    $("#climate").innerHTML = g.climate.map(function (c) {
      var l = ((c.loC - minT) / span) * 100, w = ((c.hiC - c.loC) / span) * 100;
      return '<div class="climate-row' + (c.m === "Feb" ? " feb" : "") + '">' +
        '<span class="mo">' + c.m + "</span>" +
        '<div><div class="temp-track"><div class="temp-bar" style="left:' + l + "%;width:" + w + '%"></div></div>' +
        '<div class="snow-bar"><i style="width:' + (c.cm / maxSnow) * 100 + '%"></i></div></div>' +
        '<span class="val">' + c.hiC + "° / " + c.loC + "°<small>" + c.cm + " cm snow</small></span></div>";
    }).join("");
    $("#climateSrc").textContent = "Bars: temperature range (top) and snowfall (bottom). Source: " + g.climateSource;

    $("#events").innerHTML = g.events.map(function (e) {
      return "<li><div class='ev-top'><b>" + esc(e.name) + "</b><span class='on" + (e.onDates === "Yes" ? "" : " check") + "'>" +
        (e.onDates === "Yes" ? "On your dates" : esc(e.onDates)) + "</span></div>" +
        "<div class='when'>" + esc(e.starts) + " – " + esc(e.ends) + " · " + esc(e.where) + "</div>" +
        "<p>" + esc(e.note) + "</p></li>";
    }).join("");
    $("#sources").innerHTML = "Sources: " + g.sources.map(function (s) {
      return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>";
    }).join(" · ");
  }

  /* =========================================================
     Sapporo map
     ========================================================= */
  var CAT_COLOR = { hotel: "#c8372d", sight: "#24457c", food: "#b8923a", fest: "#2f8f9d", tour: "#6b4fa0", air: "#555e6b" };
  var CAT_NAME = { hotel: "Hotel", sight: "Sights", food: "Food & drink", fest: "Festival & night", tour: "Private tour", air: "Airport" };

  function gmapsUrl(p) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.name + " Sapporo") ;
  }

  function buildMap() {
    var places = T.places || [];
    var listEl = $("#placeList"), detail = $("#placeDetail"), chips = $("#mapDays");
    var state = { day: "all", sel: null };
    var hasL = typeof window.L !== "undefined";
    var map = null, markers = {};

    function popupHtml(p) {
      return "<b>" + esc(p.name) + "</b><br><span class='jpn'>" + esc(p.jp) + "</span><br>" +
        "<small>" + esc(p.t) + "</small><p>" + esc(p.d) + "</p>" +
        "<a href='" + gmapsUrl(p) + "' target='_blank' rel='noopener'>Open in Google Maps</a>";
    }
    function visible(p) { return state.day === "all" || p.day === 0 || String(p.day) === state.day; }

    if (hasL) {
      map = L.map("leafMap", { scrollWheelZoom: false, tap: true }).setView([T.hotel.lat, T.hotel.lng], 12);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "&copy; OpenStreetMap contributors" }).addTo(map);
      places.forEach(function (p) {
        var col = CAT_COLOR[p.cat] || "#24457c";
        var label = p.cat === "hotel" ? "★" : (p.day || "");
        var icon = L.divIcon({ className: "pin-wrap", html: "<span class='pin' style='background:" + col + "'>" + label + "</span>", iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14] });
        var m = L.marker([p.lat, p.lng], { icon: icon, title: p.name }).bindPopup(popupHtml(p));
        m.on("click", function () { select(p.id, true); });
        markers[p.id] = m;
      });
    } else {
      $("#leafMap").innerHTML = "<div class='map-fallback'><b>The map could not load.</b> Check your connection. The place list still works and each place links to Google Maps.</div>";
    }

    function select(id, fromMap) {
      var p = places.filter(function (x) { return x.id === id; })[0];
      if (!p) return;
      state.sel = id;
      $$("#placeList button").forEach(function (b) { b.classList.toggle("on", b.dataset.id === id); });
      detail.innerHTML = "<b>" + esc(p.name) + '<span class="jpn">' + esc(p.jp) + "</span></b><small>" + esc(p.t) + "</small>" + esc(p.d) +
        ' <a href="' + gmapsUrl(p) + '" target="_blank" rel="noopener">Google Maps</a>';
      if (map && markers[id] && !fromMap) {
        map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
        markers[id].openPopup();
        $("#leafMap").scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }

    function render() {
      var vis = places.filter(visible), pts = [];
      listEl.innerHTML = vis.map(function (p) {
        return '<li><button data-id="' + p.id + '"><span class="pin-n" style="background:' + (CAT_COLOR[p.cat] || "#24457c") + '">' + (p.cat === "hotel" ? "★" : (p.day || "•")) + "</span><span>" + esc(p.name) + "</span></button></li>";
      }).join("");
      $$("#placeList button").forEach(function (b) { b.addEventListener("click", function () { select(b.dataset.id); }); });
      if (map) {
        places.forEach(function (p) {
          var m = markers[p.id];
          if (visible(p)) { m.addTo(map); pts.push([p.lat, p.lng]); } else { map.removeLayer(m); }
        });
        if (pts.length > 1) map.fitBounds(pts, { padding: [30, 30], maxZoom: 14 });
        // a far-away day (e.g. Asahikawa) fits to a wide view on its own
      }
      if (state.sel && !vis.some(function (p) { return p.id === state.sel; })) { state.sel = null; detail.innerHTML = ""; }
      $$("#placeList button").forEach(function (b) { b.classList.toggle("on", b.dataset.id === state.sel); });
    }

    var days = [];
    places.forEach(function (p) { if (p.day && days.indexOf(p.day) < 0) days.push(p.day); });
    days.sort(function (a, b) { return a - b; });
    chips.innerHTML = '<button class="on" data-day="all">All</button>' + days.map(function (d) { return '<button data-day="' + d + '">Day ' + d + "</button>"; }).join("");
    $$("#mapDays button").forEach(function (b) {
      b.addEventListener("click", function () {
        state.day = b.dataset.day;
        $$("#mapDays button").forEach(function (x) { x.classList.toggle("on", x === b); });
        render();
      });
    });
    render();
    if (map) {
      // all-places view is huge (Asahikawa, Bibai); start on Sapporo city instead
      map.setView([T.hotel.lat, T.hotel.lng], 12);
      select("hotel", true);
      markers.hotel.openPopup();
    }
  }

  /* =========================================================
     Rail maps (schematic SVG, no dependencies)
     ========================================================= */
  function buildRail() {
    var NS = "http://www.w3.org/2000/svg";
    var LINES = {
      N: { name: "Namboku Line", jp: "南北線", color: "#1f9d55", kind: "sub" },
      T: { name: "Tozai Line", jp: "東西線", color: "#f08a1c", kind: "sub" },
      H: { name: "Toho Line", jp: "東豊線", color: "#1e88d6", kind: "sub" },
      HM: { name: "Hakodate Main Line", jp: "函館本線", color: "#7b4fb3", kind: "jr" },
      CH: { name: "Chitose Line", jp: "千歳線", color: "#d6336c", kind: "jr" },
      GT: { name: "Gakuen Toshi Line", jp: "学園都市線", color: "#12908e", kind: "jr" }
    };
    function el(tag, attrs, txt) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      if (txt != null) e.textContent = txt;
      return e;
    }
    // [code, name, x, y, labelSide, key?]
    function stationsLine(svg, id, pts, opts) {
      var L = LINES[id], g = el("g", { "data-line": id, class: "rl" });
      g.appendChild(el("polyline", { points: pts.map(function (p) { return p[2] + "," + p[3]; }).join(" "), fill: "none", stroke: L.color, "stroke-width": 8, "stroke-linecap": "round", "stroke-linejoin": "round", class: "rl-path" }));
      pts.forEach(function (p) {
        var key = p[5], hub = p[6];
        g.appendChild(el("circle", { cx: p[2], cy: p[3], r: hub ? 8 : (key ? 6 : 4.5), fill: hub ? "#fff" : (key ? "#fff" : "#fff"), stroke: hub ? "#16294a" : L.color, "stroke-width": hub ? 3 : 2.5 }));
        var side = p[4], dx = 0, dy = 0, anchor = "start";
        if (side === "r") { dx = 12; dy = 4; }
        else if (side === "l") { dx = -12; dy = 4; anchor = "end"; }
        else if (side === "t") { dy = -13; anchor = "middle"; }
        else if (side === "b") { dy = 20; anchor = "middle"; }
        if (side) {
          var t = el("text", { x: p[2] + dx, y: p[3] + dy, "text-anchor": anchor, class: "st" + (key ? " key" : "") });
          if (p[0]) { t.appendChild(el("tspan", { class: "code", fill: L.color }, p[0] + " ")); }
          t.appendChild(document.createTextNode(p[1]));
          g.appendChild(t);
        }
      });
      if (opts && opts.title) {
        var tt = el("text", { x: opts.title[0], y: opts.title[1], class: "line-title", fill: L.color, "text-anchor": opts.title[2] || "start" });
        tt.textContent = L.name + " " + L.jp;
        g.appendChild(tt);
      }
      svg.appendChild(g);
    }

    /* ----- subway ----- */
    var sub = $("#subwayMap");
    if (sub) {
      sub.innerHTML = "";
      var NAM = [
        ["N01", "Asabu"], ["N02", "Kita-34-jo"], ["N03", "Kita-24-jo"], ["N04", "Kita-18-jo"], ["N05", "Kita-12-jo"],
        ["N06", "Sapporo"], ["N07", "Odori"], ["N08", "Susukino"], ["N09", "Nakajima-koen"], ["N10", "Horohirabashi"],
        ["N11", "Nakanoshima"], ["N12", "Hiragishi"], ["N13", "Minami-Hiragishi"], ["N14", "Sumikawa"], ["N15", "Jieitai-mae"], ["N16", "Makomanai"]
      ];
      var KEYN = { N06: 1, N07: 1, N08: 1, N16: 1 };
      var np = NAM.map(function (s, i) {
        var hub = s[0] === "N06" || s[0] === "N07";
        return [s[0], s[1], 300, 40 + i * 28, hub ? null : "l", KEYN[s[0]], hub];
      });
      stationsLine(sub, "N", np, { title: [300, 18, "middle"] });

      var TOZ = [
        ["T01", "Miyanosawa", 50, 208, "b", 1], ["T06", "Maruyama-koen", 130, 208, "t", 1],
        ["T07", "Nishi-18", 190, 208, "b"], ["T08", "Nishi-11", 250, 208, "t"],
        ["T09", "Odori", 300, 208, null, 0, 1],
        ["T11", "Kikusui", 420, 208, "t"],
        ["T13", "Shiroishi", 500, 208, "t"], ["T19", "Shin-Sapporo", 760, 208, "t", 1]
      ];
      stationsLine(sub, "T", TOZ, { title: [20, 168] });

      var tohPts = [
        ["H01", "Sakaemachi", 800, 40, "l", 1], ["H02", "Shindo-Higashi", 770, 68, "r"], ["H03", "Motomachi", 740, 96, "r"],
        ["H04", "Kanjodori-Higashi", 710, 124, "r", 1], ["H05", "Higashi-Kuyakusho-mae", 680, 152, "r", 1], ["H06", "Kita-13-jo-Higashi", 650, 180, "b"],
        ["H07", "Sapporo", 300, 180, null, 0, 1]
      ];
      stationsLine(sub, "H", tohPts, { title: [800, 18, "end"] });
      var HS = [
        ["H09", "Hosui-Susukino", 330, 262, 1], ["H10", "Gakuen-mae", 400, 300, 0], ["H11", "Toyohira-koen", 470, 336, 0],
        ["H12", "Misono", 540, 372, 0], ["H13", "Tsukisamu-Chuo", 610, 408, 0], ["H14", "Tsukisamu-koen", 680, 444, 0], ["H15", "Fukuzumi", 750, 480, 1]
      ];
      var gH2 = el("g", { "data-line": "H", class: "rl" });
      gH2.appendChild(el("polyline", { points: "300,180 300,208 330,262 400,300 470,336 540,372 610,408 680,444 750,480", fill: "none", stroke: LINES.H.color, "stroke-width": 8, "stroke-linecap": "round", "stroke-linejoin": "round", class: "rl-path" }));
      HS.forEach(function (p) {
        gH2.appendChild(el("circle", { cx: p[2], cy: p[3], r: p[4] ? 6 : 4.5, fill: "#fff", stroke: LINES.H.color, "stroke-width": 2.5 }));
        var t = el("text", { x: p[2] + 12, y: p[3] + 4, class: "st" + (p[4] ? " key" : "") });
        t.appendChild(el("tspan", { class: "code", fill: LINES.H.color }, p[0] + " "));
        t.appendChild(document.createTextNode(p[1]));
        gH2.appendChild(t);
      });
      sub.appendChild(gH2);

      // interchange labels
      [["N06 / H07", "Sapporo", 300, 170], ["N07 / T09 / H08", "Odori", 300, 228]].forEach(function (x) {
        var t = el("text", { x: 316, y: x[3], class: "st key hub-lbl" });
        t.appendChild(el("tspan", { class: "code", fill: "#16294a" }, x[0] + " "));
        t.appendChild(document.createTextNode(x[1]));
        sub.appendChild(t);
      });
      // JR connection and streetcar notes
      sub.appendChild(el("text", { x: 430, y: 170, class: "note-lbl" }, "Underground link to JR Sapporo"));
      sub.appendChild(el("text", { x: 430, y: 248, class: "note-lbl" }, "Streetcar runs above Odori and Susukino"));
      // hotel marker near Sapporo
      var hg = el("g", {});
      hg.appendChild(el("rect", { x: 20, y: 498, width: 14, height: 14, rx: 3, fill: "#c8372d" }));
      hg.appendChild(el("text", { x: 42, y: 510, class: "note-lbl" }, "Hotel: Hokke Club Sapporo, between Sapporo (N06/H07) and Odori"));
      sub.appendChild(hg);
      var hint = el("text", { x: 20, y: 530, class: "note-lbl" }, "Bold stations are the ones used on this trip.");
      sub.appendChild(hint);
    }

    /* ----- JR ----- */
    var jr = $("#jrMap");
    if (jr) {
      jr.innerHTML = "";
      stationsLine(jr, "HM", [
        ["", "Otaru", 70, 210, "t", 1], ["", "Zenibako", 140, 210, "b"], ["", "Teine", 240, 210, "t"], ["", "Sapporo", 450, 210, null, 0, 1],
        ["", "Ebetsu", 590, 210, "t"], ["", "Iwamizawa", 680, 210, "b"], ["", "Bibai", 790, 210, "t", 1]
      ], { title: [70, 160] });
      stationsLine(jr, "CH", [
        ["", "Sapporo", 450, 210, null, 0, 1], ["", "Shin-Sapporo", 500, 270, "r"], ["", "Kita-Hiroshima", 540, 315, "r"],
        ["", "Chitose", 590, 355, "r"], ["", "New Chitose Airport", 650, 392, "r", 1]
      ], { title: [330, 410, "end"] });
      stationsLine(jr, "GT", [
        ["", "Sapporo", 450, 210, null, 0, 1], ["", "Royce Town", 520, 140, "r", 1], ["", "Ishikari-Tobetsu", 590, 85, "r"]
      ], { title: [470, 50] });
      var hub = el("text", { x: 430, y: 240, "text-anchor": "end", class: "st key" });
      hub.textContent = "JR Sapporo";
      jr.appendChild(hub);
      jr.appendChild(el("text", { x: 70, y: 245, class: "note-lbl" }, "Day 6 · Otaru"));
      jr.appendChild(el("text", { x: 790, y: 245, "text-anchor": "end", class: "note-lbl" }, "Day 10 · Bibai"));
      jr.appendChild(el("text", { x: 890, y: 414, "text-anchor": "end", class: "note-lbl" }, "Flights · Day 7 Lake Shikotsu (bus from Chitose)"));
      jr.appendChild(el("text", { x: 634, y: 135, class: "note-lbl" }, "Day 9 · Royce' Chocolate Town"));
    }

    /* ----- highlight chips ----- */
    var chips = $("#railChips");
    var order = ["N", "T", "H", "HM", "CH", "GT"];
    chips.innerHTML = '<button class="on" data-l="all">All lines</button>' + order.map(function (k) {
      return '<button data-l="' + k + '"><i style="background:' + LINES[k].color + '"></i>' + LINES[k].name + "</button>";
    }).join("");
    $$("#railChips button").forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.dataset.l;
        $$("#railChips button").forEach(function (x) { x.classList.toggle("on", x === b); });
        $$(".rail-frame .rl").forEach(function (g) {
          g.classList.toggle("dim", k !== "all" && g.getAttribute("data-line") !== k);
        });
      });
    });
  }

  /* =========================================================
     Expenses
     ========================================================= */
  var ICONS = {
    plane: '<path d="M2 16l20-6-3-2-6 1-5-5-2 1 3 6-5 2-2-2-1 1 3 4 5-2 2 2 1-1-1-4z"/>',
    ticket: '<path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4v0a2 2 0 0 0 0-4V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
    hotel: '<path d="M3 20V6M3 12h18v8M21 12V9a2 2 0 0 0-2-2h-6v5"/><circle cx="7.5" cy="9" r="1.5"/>',
    snow: '<path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5l-14.2 11"/>',
    tour: '<path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3z"/><path d="M9 4v13M15 7v13"/>'
  };
  var COLORS = ["#c8372d", "#24457c", "#b8923a", "#5a9fd4", "#d98a9a"];
  var curr = store.get("sap27-cur") || "PHP";

  function conv(e, cur) {
    if (cur === "PHP") return e.php;
    if (cur === "SGD") return e.sgd;
    return e.sgd * fx.JPY; // JPY estimate via SGD
  }
  function convTotal(cur) {
    if (cur === "PHP") return totals.php;
    if (cur === "SGD") return totals.sgd;
    return totals.sgd * fx.JPY;
  }

  function renderExpenses() {
    $$("#curSeg button").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.cur === curr)); });
    $("#thAmt").textContent = curr;
    $("#curNote").textContent = curr === "JPY"
      ? "Yen is an estimate using the rate in the Forex section (1 SGD ≈ ¥" + fx.JPY.toFixed(2) + ")."
      : "Figures match the PHP and SGD columns of the trip sheet.";

    // budget strip
    var bud = T.budget ? T.budget.php : 0;
    if (bud) {
      var rate = totals.php / totals.sgd, bObj = { php: bud, sgd: bud / rate }, rObj = { php: bud - totals.php, sgd: (bud - totals.php) / rate };
      var pct = Math.min(100, totals.php / bud * 100), over = totals.php > bud;
      $("#budget").innerHTML =
        '<div class="bud-cell"><small>Total estimated budget</small><b>' + money(conv(bObj, curr), curr) + '</b></div>' +
        '<div class="bud-cell"><small>Planned expenses</small><b>' + money(convTotal(curr), curr) + '</b></div>' +
        '<div class="bud-cell ' + (over ? "over" : "ok") + '"><small>' + (over ? "Over budget" : "Left in budget") + '</small><b>' + money(Math.abs(conv(rObj, curr)), curr) + '</b></div>' +
        '<div class="bud-bar" role="progressbar" aria-valuenow="' + Math.round(pct) + '" aria-valuemin="0" aria-valuemax="100"><i class="' + (over ? "over" : "") + '" style="width:' + pct.toFixed(1) + '%"></i></div>' +
        '<p class="tiny muted bud-foot">' + pct.toFixed(0) + '% of the budget is planned so far.</p>';
    }

    var rows = T.expenses.map(function (e) {
      var paid = e.status && /paid/i.test(e.status) && !/to be/i.test(e.status);
      return "<tr><td><div class='item-cell'>" + (e.icon === "plane" && T.airlineLogo ? "<span class='item-logo'>" + logoImg("sm") + "<span class='item-ico' style='display:none'><svg viewBox='0 0 24 24'>" + ICONS.plane + "</svg></span></span>" : "<span class='item-ico'><svg viewBox='0 0 24 24'>" + (ICONS[e.icon] || ICONS.ticket) + "</svg></span>") + esc(e.item) + "</div></td>" +
        "<td class='num'>" + money(conv(e, curr), curr) + "</td>" +
        "<td class='num td-orig'>" + esc(e.original) + "</td>" +
        "<td><span class='status" + (paid ? " paid" : "") + "'>" + (paid ? "Paid" : "To be paid") + "</span></td>" +
        "<td class='td-note" + (e.note ? "" : " none") + "'>" + esc(e.note || "–") + "</td></tr>";
    }).join("");
    $("#expTable tbody").innerHTML = rows;
    $("#expTable tfoot").innerHTML = "<tr><td>Total</td><td class='num'>" + money(convTotal(curr), curr) + "</td><td></td><td></td><td></td></tr>";

    // donut
    var R = 70, C = 2 * Math.PI * R, acc = 0, sum = T.expenses.reduce(function (a, e) { return a + e.php; }, 0);
    var segs = T.expenses.map(function (e, i) {
      var frac = e.php / sum, len = frac * C;
      var seg = '<circle cx="100" cy="100" r="' + R + '" fill="none" stroke="' + COLORS[i % COLORS.length] + '" stroke-width="28" stroke-dasharray="' + (len - 2).toFixed(2) + " " + (C - len + 2).toFixed(2) + '" stroke-dashoffset="' + (-acc).toFixed(2) + '" transform="rotate(-90 100 100)"><title>' + esc(e.item) + " " + (frac * 100).toFixed(1) + '%</title></circle>';
      acc += len; return seg;
    }).join("");
    $("#donut").innerHTML = '<circle cx="100" cy="100" r="' + R + '" fill="none" stroke="#efe7d3" stroke-width="28"/>' + segs;
    $("#donutTotal").textContent = moneyShort(convTotal(curr), curr);
    $("#donutLegend").innerHTML = T.expenses.map(function (e, i) {
      return "<li><i style='background:" + COLORS[i % COLORS.length] + "'></i><span>" + esc(e.item) + "</span><span class='pct'>" + ((e.php / sum) * 100).toFixed(1) + "%</span></li>";
    }).join("");
  }
  $$("#curSeg button").forEach(function (b) {
    b.addEventListener("click", function () { curr = b.dataset.cur; store.set("sap27-cur", curr); renderExpenses(); });
  });

  /* =========================================================
     Forex calculator
     ========================================================= */
  var inputs = { JPY: $("#fxJPY"), PHP: $("#fxPHP"), SGD: $("#fxSGD") };
  var lastActive = "JPY";
  function parseNum(s) { var n = parseFloat(String(s).replace(/,/g, "")); return isFinite(n) ? n : NaN; }
  function fmtField(v, cur) {
    if (!isFinite(v)) return "";
    var d = cur === "JPY" ? 0 : 2;
    return v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: d });
  }
  function recalc(from) {
    lastActive = from;
    var v = parseNum(inputs[from].value);
    Object.keys(inputs).forEach(function (c) {
      if (c === from) return;
      inputs[c].value = isNaN(v) ? "" : fmtField(v * rate(from, c), c);
    });
  }
  Object.keys(inputs).forEach(function (c) {
    inputs[c].addEventListener("input", function () { recalc(c); });
    inputs[c].addEventListener("focus", function () { inputs[c].select(); });
  });
  $$("#quick button").forEach(function (b) {
    b.addEventListener("click", function () { inputs.JPY.value = Number(b.dataset.yen).toLocaleString("en-US"); recalc("JPY"); });
  });

  function renderRates() {
    var cs = ["JPY", "PHP", "SGD"];
    $("#ratesTable tbody").innerHTML = cs.map(function (a) {
      var one = a === "JPY" ? 100 : 1;
      return "<tr><td>" + one + " " + a + "</td>" + cs.map(function (b) {
        return "<td class='num'>" + (a === b ? "–" : fmtRate(one * rate(a, b))) + "</td>";
      }).join("") + "</tr>";
    }).join("");
    $("#sheetRate").textContent = T.sheetRateSgdPhp;

    var dot = fxMeta.source === "live" ? "dot live" : "dot";
    var txt = fxMeta.source === "live"
      ? "Live mid-market rates · Rate as of " + fmtPH(fxMeta.time)
      : "Offline estimate · SGD→PHP from your sheet, SGD→JPY approximate. Connect to the internet for live rates, or set your own below.";
    if (prefs.sheet || (prefs.customJpy && parseNum(prefs.customJpy) > 0)) txt += " · custom rate in use";
    $("#rateStatus").innerHTML = '<span class="' + dot + '"></span><span>' + txt + "</span>";

    var yen = totals.sgd * fx.JPY;
    $("#tripInYen").innerHTML = "Trip total in yen ≈ <b>" + money(yen, "JPY") + "</b><br><span class='small'>Each share ≈ " + money(yen / 2, "JPY") + " (" + money(totals.php, "PHP") + " · " + money(totals.sgd, "SGD") + ")</span>";
  }

  var chkSheet = $("#useSheetRate"), chkJpy = $("#useCustomJpy"), customJpy = $("#customJpy");
  chkSheet.checked = !!prefs.sheet;
  chkJpy.checked = !!prefs.customJpy;
  customJpy.disabled = !chkJpy.checked;
  customJpy.value = prefs.customJpy || "";
  function refreshAll() { applyRates(); renderRates(); recalc(lastActive); renderExpenses(); }
  chkSheet.addEventListener("change", function () { prefs.sheet = chkSheet.checked; store.set("sap27-fx", prefs); refreshAll(); });
  chkJpy.addEventListener("change", function () {
    customJpy.disabled = !chkJpy.checked;
    if (!chkJpy.checked) prefs.customJpy = "";
    store.set("sap27-fx", prefs); refreshAll();
    if (chkJpy.checked) customJpy.focus();
  });
  customJpy.addEventListener("input", function () { prefs.customJpy = customJpy.value; store.set("sap27-fx", prefs); refreshAll(); });

  function fetchLive() {
    var live = liveRates();
    if (live && Date.now() - live.fetched < 6 * 3600 * 1000) return; // fresh enough
    if (!window.fetch) return;
    var ctrl = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { if (ctrl) ctrl.abort(); }, 7000);
    fetch("https://open.er-api.com/v6/latest/SGD", ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { return r.json(); })
      .then(function (j) {
        clearTimeout(to);
        if (j && j.rates && j.rates.PHP && j.rates.JPY) {
          store.set("sap27-live", { rates: { PHP: j.rates.PHP, JPY: j.rates.JPY }, time: j.time_last_update_utc || new Date().toUTCString(), fetched: Date.now() });
          refreshAll();
        }
      })
      .catch(function () { clearTimeout(to); });
  }

  /* =========================================================
     Snow animation
     ========================================================= */
  function snow() {
    var cv = $("#snow"); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"), W, H, flakes = [], raf, visible = true;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    function size() {
      var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.width = r.width * dpr; H = cv.height = r.height * dpr; ctx.setTransform(1, 0, 0, 1, 0, 0); cv.dpr = dpr;
      var n = Math.round((r.width / 1440) * 110 + 40);
      flakes = [];
      for (var i = 0; i < n; i++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 2.2 + 0.8) * dpr, s: (Math.random() * 0.6 + 0.25) * dpr, d: Math.random() * Math.PI * 2 });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = "rgba(255,255,255,.85)";
      flakes.forEach(function (f) {
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.283); ctx.fill();
        if (!reduce) { f.y += f.s; f.d += 0.01; f.x += Math.sin(f.d) * 0.35 * cv.dpr; if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; } }
      });
    }
    function loop() { if (visible) draw(); raf = requestAnimationFrame(loop); }
    size(); draw();
    window.addEventListener("resize", function () { size(); draw(); });
    if (!reduce) { loop(); if (window.IntersectionObserver) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(cv); }
  }

  /* =========================================================
     Nav highlight
     ========================================================= */
  function navSpy() {
    var links = $$(".nav-links a");
    if (!window.IntersectionObserver) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section").forEach(function (s) { io.observe(s); });
  }

  /* ---------- init ---------- */
  applyRates();
  renderStats();
  renderFlights();
  renderHotel();
  renderTimeline();
  loadStopPhotos();
  renderGuide();
  buildMap();
  buildRail();
  renderRates();
  recalc("JPY");
  renderExpenses();
  snow();
  navSpy();
  fetchLive();
})();
