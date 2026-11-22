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
      { c: "ai", l: "Total expense", v: moneyShort(totals.php, "PHP"), s: "about " + moneyShort(totals.sgd, "SGD") },
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

  function renderTimeline() {
    var today = todayLocal();
    $("#timeline").innerHTML = T.itinerary.map(function (d) {
      var dt = parseISO(d.date);
      var open = !d.activity;
      var key = d.activity === "Arrival" || d.activity === "Departure";
      var isToday = dt.getTime() === today.getTime();
      var badges = FEST.filter(function (f) { return d.date >= f.from && d.date <= f.to; }).map(function (f) {
        var extra = d.date === f.from ? " · opens" : d.date === f.to ? " · last day" : "";
        return '<span class="chip ' + f.cls + '">' + f.label + extra + "</span>";
      }).join("");
      var meta = "";
      if (d.time) meta += "<span>" + icClock + esc(d.time) + "</span>";
      if (d.location) meta += "<span>" + icPin + esc(d.location) + "</span>";
      if (d.notes) meta += "<span>" + icNote + esc(d.notes) + "</span>";
      return '<li class="day' + (isToday ? " today" : "") + '">' +
        '<div class="day-date"><span class="dn">Day ' + d.day + '</span><span class="dd">' + MONTHS[dt.getMonth()] + " " + dt.getDate() + '</span><span class="dw">' + d.dow + "</span></div>" +
        '<div class="day-body' + (open ? " open" : "") + (key ? " key" : "") + '">' +
        "<h4>" + (open ? "Open day · plan to be added" : esc(d.activity)) + "</h4>" +
        (meta ? '<div class="meta">' + meta + "</div>" : "") +
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
  var PLACES = [
    { id: "station", n: 1, name: "Sapporo Station", jp: "札幌駅", x: 405, y: 196, cat: "ai", lx: -10, ly: -12, a: "end",
      d: "Main rail hub. JR trains run from here to Otaru and to New Chitose Airport." },
    { id: "odori", n: 2, name: "Odori Park", jp: "大通公園", x: 300, y: 273, cat: "fest", lx: 0, ly: -14, a: "middle",
      d: "The green belt through the middle of the city and the main Snow Festival site (Feb 4–11)." },
    { id: "tower", n: 3, name: "Sapporo TV Tower", jp: "さっぽろテレビ塔", x: 466, y: 273, cat: "ai", lx: 14, ly: 4, a: "start",
      d: "Landmark at the eastern end of Odori Park, with an observation deck." },
    { id: "clock", n: 4, name: "Clock Tower", jp: "時計台", x: 440, y: 238, cat: "ai", lx: 14, ly: 4, a: "start",
      d: "Historic wooden clock tower, a symbol of old Sapporo." },
    { id: "tanuki", n: 5, name: "Tanukikoji Arcade", jp: "狸小路", x: 392, y: 306, cat: "food", lx: -14, ly: 4, a: "end",
      d: "Covered shopping arcade a short walk south of Odori Park." },
    { id: "susukino", n: 6, name: "Susukino", jp: "ススキノ", x: 438, y: 342, cat: "fest", lx: 14, ly: 16, a: "start",
      d: "Dining and nightlife district. One of the three Snow Festival sites, known for ice sculptures." },
    { id: "nijo", n: 7, name: "Nijo Market", jp: "二条市場", x: 490, y: 308, cat: "food", lx: 14, ly: 4, a: "start",
      d: "Fresh seafood market, handy for a morning meal." },
    { id: "beer", n: 8, name: "Sapporo Beer Museum", jp: "サッポロビール博物館", x: 556, y: 214, cat: "food", lx: 14, ly: 4, a: "start",
      d: "Museum in the old brewery buildings, east of the station." },
    { id: "shrine", n: 9, name: "Hokkaido Shrine", jp: "北海道神宮", x: 112, y: 262, cat: "ai", lx: 0, ly: -14, a: "middle",
      d: "Shrine set in Maruyama Park, west of the city center." },
    { id: "moiwa", n: 10, name: "Mt. Moiwa", jp: "藻岩山", x: 150, y: 428, cat: "ai", lx: 16, ly: 4, a: "start",
      d: "Southwest of the center, with a ropeway up to a night-view lookout." },
    { id: "tsudome", n: 11, name: "Tsudome", jp: "つどーむ", x: 684, y: 164, cat: "fest", lx: 0, ly: -14, a: "middle",
      d: "Snow-play site of the Snow Festival, east of the center." }
  ];
  var CAT_COLOR = { fest: "#c8372d", ai: "#24457c", food: "#b8923a" };

  function buildMap() {
    var s = "";
    s += '<defs>' +
      '<pattern id="mgrid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="#e6dcc3" stroke-width="1"/></pattern>' +
      '<pattern id="mtrees" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.4" fill="#9fc08f"/><circle cx="11" cy="10" r="2.4" fill="#9fc08f"/></pattern>' +
      '<linearGradient id="mwash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6efdc"/><stop offset="1" stop-color="#efe5cb"/></linearGradient>' +
      '</defs>';
    s += '<rect width="800" height="580" fill="url(#mwash)"/><rect width="800" height="580" fill="url(#mgrid)"/>';

    // hills & green
    s += '<path d="M40 470 C70 380 130 350 200 372 C250 388 250 452 200 500 C140 548 60 540 40 470Z" fill="#cfe1c3" stroke="#b3cca4" stroke-width="1.5"/>';
    s += '<path d="M70 450 C95 410 135 400 170 416" fill="none" stroke="#b3cca4" stroke-width="1.5"/>';
    s += '<path d="M62 300 C60 238 100 214 150 224 C190 232 196 290 160 316 C124 340 70 342 62 300Z" fill="url(#mtrees)" stroke="#b3cca4" stroke-width="1.5"/>';
    // Moiwa peak mark
    s += '<path d="M138 438 L152 414 L166 438Z" fill="#8fb27e"/>';

    // Toyohira river
    s += '<path d="M236 580 C300 500 420 462 520 400 C590 357 560 296 610 232 C650 180 690 110 760 60" fill="none" stroke="#b9d6ee" stroke-width="18" stroke-linecap="round"/>';
    s += '<path d="M236 580 C300 500 420 462 520 400 C590 357 560 296 610 232 C650 180 690 110 760 60" fill="none" stroke="#d7e9f7" stroke-width="8" stroke-linecap="round"/>';
    s += '<text x="574" y="396" font-size="11" fill="#5d86ad" font-style="italic" transform="rotate(-48 574 396)">Toyohira River 豊平川</text>';

    // main streets (grid emphasis)
    s += '<g stroke="#d9cdb0" stroke-width="3" stroke-linecap="round">' +
      '<path d="M200 205H540"/><path d="M180 330H520"/><path d="M180 306H420" stroke-width="2"/>' +
      '<path d="M418 130V400"/><path d="M360 150V400" stroke-width="2"/><path d="M492 160V380" stroke-width="2"/></g>';
    // railway
    s += '<path d="M250 110 L405 196 L560 260 L700 300" fill="none" stroke="#9aa1b3" stroke-width="3" stroke-dasharray="10 5"/>';

    // Odori Park
    s += '<rect x="176" y="262" width="300" height="24" rx="6" fill="#c3dcb4" stroke="#a6c697" stroke-width="1.5"/>';
    s += '<rect x="176" y="262" width="300" height="24" rx="6" fill="url(#mtrees)" opacity=".7"/>';
    // snow sculpture sparkle on Odori
    [210, 250, 330, 380, 420].forEach(function (x) {
      s += '<path d="M' + x + ' 268v12M' + (x - 5) + ' 274h10M' + (x - 3.5) + ' 270.5l7 7M' + (x + 3.5) + ' 270.5l-7 7" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>';
    });

    // Susukino district glow
    s += '<rect x="402" y="322" width="96" height="48" rx="14" fill="#f3d3d8" opacity=".75" stroke="#e5aab4" stroke-width="1.5"/>';
    // Tsudome blob
    s += '<ellipse cx="684" cy="164" rx="52" ry="34" fill="#dbe8f8" stroke="#bcd3ee" stroke-width="1.5"/>';
    s += '<path d="M650 168 q10 -16 20 0 t20 0 t20 0" fill="none" stroke="#fff" stroke-width="2.5"/>';
    // Nakajima-ish park south
    s += '<ellipse cx="420" cy="440" rx="46" ry="26" fill="#cfe1c3" stroke="#b3cca4" stroke-width="1.5"/><text x="420" y="444" text-anchor="middle" font-size="10" fill="#6a8a58">Nakajima Park</text>';

    // outward arrows
    function arrow(x, y, rot, label, anchor, tx, ty) {
      return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><path d="M0 0H34M26 -7L36 0L26 7" fill="none" stroke="#7b7f8c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>' +
        '<text x="' + tx + '" y="' + ty + '" font-size="11.5" font-weight="600" fill="#4a4f5e" text-anchor="' + anchor + '">' + label + '</text>';
    }
    s += arrow(262, 126, 180, "To Otaru 小樽 · ~30–40 min by train", "start", 282, 130);
    s += arrow(676, 452, 30, "New Chitose Airport 新千歳空港", "end", 700, 506);
    s += arrow(332, 512, 90, "Chitose · Lake Shikotsu 支笏湖", "start", 352, 560);

    // title stamp
    s += '<g transform="translate(40 36)"><rect width="64" height="64" rx="6" fill="#c8372d"/><rect x="5" y="5" width="54" height="54" rx="3" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.5"/>' +
      '<text x="32" y="30" text-anchor="middle" font-size="22" font-weight="800" fill="#fff" font-family="Shippori Mincho, serif">札</text>' +
      '<text x="32" y="53" text-anchor="middle" font-size="22" font-weight="800" fill="#fff" font-family="Shippori Mincho, serif">幌</text></g>';
    s += '<text x="116" y="62" font-size="22" font-weight="800" fill="#16294a" font-family="Shippori Mincho, serif">SAPPORO</text>' +
      '<text x="116" y="84" font-size="12" fill="#7b7f8c" letter-spacing="2">HOKKAIDO · 北海道</text>';

    // compass
    s += '<g transform="translate(742 530)"><circle r="22" fill="#fffdf7" stroke="#e2d9c3"/><path d="M0 -15 L6 4 L0 0 L-6 4Z" fill="#c8372d"/><text y="19" text-anchor="middle" font-size="9" font-weight="700" fill="#16294a">N</text></g>';

    // Hokkaido inset
    s += '<g transform="translate(626 20)"><rect width="150" height="112" rx="12" fill="#fffdf7" stroke="#e2d9c3"/>' +
      '<path d="M14 82 L26 72 L36 78 L44 66 L42 54 L56 46 L58 34 L72 26 L82 30 L90 18 L104 24 L118 14 L134 28 L128 40 L140 46 L126 52 L112 50 L106 60 L114 68 L98 72 L88 68 L78 78 L64 80 L56 92 L40 90 L28 98Z" fill="#dbe8f8" stroke="#9bb8dd" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<circle cx="64" cy="58" r="6" fill="#c8372d" opacity=".3"/><circle cx="64" cy="58" r="3.2" fill="#c8372d"/>' +
      '<text x="75" y="102" text-anchor="middle" font-size="10" fill="#7b7f8c">Hokkaido · stylized</text></g>';

    // pins
    PLACES.forEach(function (p) {
      var col = CAT_COLOR[p.cat];
      s += '<g class="map-pin" data-id="' + p.id + '" tabindex="0" role="button" aria-label="' + esc(p.name) + '">' +
        '<circle class="halo" cx="' + p.x + '" cy="' + p.y + '" r="19" fill="' + col + '"/>' +
        '<circle cx="' + p.x + '" cy="' + p.y + '" r="11.5" fill="' + col + '" stroke="#fff" stroke-width="2.5"/>' +
        '<text x="' + p.x + '" y="' + (p.y + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">' + p.n + '</text>' +
        '<text class="lbl" x="' + (p.x + p.lx) + '" y="' + (p.y + p.ly) + '" text-anchor="' + p.a + '">' + esc(p.name) + '</text></g>';
    });

    // legend
    s += '<g transform="translate(40 552)" font-size="11" fill="#4a4f5e">' +
      '<circle cx="6" cy="6" r="6" fill="#c8372d"/><text x="18" y="10">Snow Festival site</text>' +
      '<circle cx="136" cy="6" r="6" fill="#24457c"/><text x="148" y="10">Sights</text>' +
      '<circle cx="204" cy="6" r="6" fill="#b8923a"/><text x="216" y="10">Food &amp; drink</text></g>';
    $("#sapporoMap").innerHTML = s;

    // list
    $("#placeList").innerHTML = PLACES.map(function (p) {
      return '<li><button data-id="' + p.id + '"><span class="pin-n ' + (p.cat === "ai" ? "ai" : p.cat === "food" ? "gold" : "") + '">' + p.n + "</span>" +
        "<span>" + esc(p.name) + '</span></button></li>';
    }).join("");

    function select(id) {
      var p = PLACES.filter(function (x) { return x.id === id; })[0];
      if (!p) return;
      $$(".map-pin").forEach(function (g) { g.classList.toggle("on", g.dataset.id === id); });
      $$("#placeList button").forEach(function (b) { b.classList.toggle("on", b.dataset.id === id); });
      $("#placeDetail").innerHTML = "<b>" + esc(p.name) + '<span class="jpn">' + esc(p.jp) + "</span></b>" + esc(p.d);
    }
    $$(".map-pin").forEach(function (g) {
      g.addEventListener("click", function () { select(g.dataset.id); });
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(g.dataset.id); } });
    });
    $$("#placeList button").forEach(function (b) { b.addEventListener("click", function () { select(b.dataset.id); }); });
    select("odori");
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

    var rows = T.expenses.map(function (e) {
      var paid = e.status && /paid/i.test(e.status) && !/to be/i.test(e.status);
      return "<tr><td><div class='item-cell'><span class='item-ico'><svg viewBox='0 0 24 24'>" + (ICONS[e.icon] || ICONS.ticket) + "</svg></span>" + esc(e.item) + "</div></td>" +
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
  renderTimeline();
  renderGuide();
  buildMap();
  renderRates();
  recalc("JPY");
  renderExpenses();
  snow();
  navSpy();
  fetchLive();
})();
