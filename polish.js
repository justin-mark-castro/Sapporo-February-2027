/* Sapporo 2027 — UX polish: collapsible days, "next up" card, rail swipe hints */
(function () {
  "use strict";
  var T = window.TRIP; if (!T) return;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function todayISO() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }

  /* ---- "next up" card under the hero ---- */
  var hero = $(".hero");
  if (hero && T.itinerary && T.itinerary.length) {
    var iso2 = todayISO(), idx = -1;
    T.itinerary.forEach(function (d, i) { if (idx < 0 && d.date >= iso2) idx = i; });
    if (idx >= 0) {
      var d = T.itinerary[idx], on = d.date === iso2;
      var a = document.createElement("a");
      a.className = "nextup-card"; a.href = "#itinerary";
      a.innerHTML = '<div><small>' + (on ? "Today" : "Next up") + ' · Day ' + d.day + ' · ' + d.dow + '</small><b></b><span></span></div><span class="go">Itinerary →</span>';
      $("b", a).textContent = d.title;
      $("div > span", a).textContent = d.area || "";
      var wrap = document.createElement("div"); wrap.className = "nextup"; wrap.appendChild(a);
      hero.parentNode.insertBefore(wrap, hero.nextSibling);
    }
  }

  /* ---- rail diagrams: tell phone users they scroll sideways ---- */
  $$(".rail-frame").forEach(function (f) {
    var p = document.createElement("p");
    p.className = "swipe-hint"; p.textContent = "Swipe sideways to see the whole line →";
    f.parentNode.insertBefore(p, f);
  });

  /* ---- compact checklist view of the itinerary (state kept in localStorage on this device) ---- */
  (function () {
    var tl = $("#timeline"); if (!tl || !T.itinerary) return;
    var KC = "sapporo27.checked", KV = "sapporo27.view", KH = "sapporo27.hidedone";
    function load(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
    function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
    var done = {}; (load(KC, []) || []).forEach(function (k) { done[k] = 1; });
    var hideDone = !!load(KH, false);
    var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    function esc(x) { return String(x == null ? "" : x).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
    function key(d, st) { return d.day + "|" + st.activity; }
    function mapUrl(st) {
      var q = st.map || ((st.activity || "") + " " + (st.location || "")).replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
      if (!/sapporo|hokkaido/i.test(q)) q += " Hokkaido";
      return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
    }
    var pin = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';

    var bar = document.createElement("div"); bar.className = "view-bar";
    bar.innerHTML =
      '<div class="view-seg" role="group" aria-label="Itinerary view"><button type="button" data-v="full">Full</button><button type="button" data-v="compact">Compact checklist</button></div>' +
      '<div class="check-tools" hidden><span class="check-progress" aria-live="polite"></span>' +
      '<label class="hide-done"><input type="checkbox"> Hide done</label>' +
      '<button type="button" class="check-reset">Reset</button></div>';
    var list = document.createElement("div"); list.className = "compact-list"; list.hidden = true;
    var lead = $(".legend-chips") || tl;
    lead.parentNode.insertBefore(bar, lead); tl.parentNode.insertBefore(list, tl);
    var extras = $$(".legend-chips, .type-legend", tl.parentNode);
    var tools = $(".check-tools", bar), prog = $(".check-progress", bar), hd = $(".hide-done input", bar);
    hd.checked = hideDone;

    var iso = todayISO();
    function render() {
      var total = 0, n = 0;
      list.innerHTML = T.itinerary.map(function (d) {
        var dt = new Date(d.date + "T00:00:00");
        var sts = (d.stops || []).filter(function (st) { return st.activity; });
        var dn = 0; sts.forEach(function (st) { if (done[key(d, st)]) dn++; });
        total += sts.length; n += dn;
        var rows = sts.map(function (st) {
          var k = key(d, st), on = !!done[k];
          return '<li class="ck' + (on ? " on" : "") + '"><label><input type="checkbox" data-k="' + esc(k) + '"' + (on ? " checked" : "") + '>' +
            '<span class="ck-box" aria-hidden="true"></span><span class="ck-text"><b>' + esc(st.activity) + '</b>' +
            (st.time || st.location ? '<small>' + esc([st.time, st.location].filter(Boolean).join(" · ")) + '</small>' : "") + '</span></label>' +
            '<a class="ck-map" href="' + esc(mapUrl(st)) + '" target="_blank" rel="noopener" aria-label="Google Maps: ' + esc(st.activity) + '">' + pin + '</a></li>';
        }).join("");
        var allDone = sts.length && dn === sts.length;
        return '<section class="ck-day' + (d.date === iso ? " today" : "") + (allDone ? " all-done" : "") + '" data-day="' + d.day + '"' + (hideDone && allDone ? " hidden" : "") + '>' +
          '<h4><span class="ck-d">Day ' + d.day + " · " + MON[dt.getMonth()] + " " + dt.getDate() + " " + esc(d.dow) + '</span><span class="ck-t">' + esc(d.title) + '</span>' +
          '<span class="ck-n">' + dn + "/" + sts.length + "</span></h4>" + '<ul>' + rows + '</ul></section>';
      }).join("");
      prog.textContent = n + " of " + total + " done";
      list.classList.toggle("hide-done", hideDone);
    }
    function setView(v) {
      var compact = v === "compact";
      tl.hidden = compact; list.hidden = !compact; tools.hidden = !compact;
      extras.forEach(function (x) { x.hidden = compact; });
      $$(".view-seg button", bar).forEach(function (b) { var on = b.dataset.v === v; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
      save(KV, v);
      if (compact) render();
    }
    bar.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button"); if (!b) return;
      if (b.dataset.v) setView(b.dataset.v);
      else if (b.classList.contains("check-reset")) { if (confirm("Clear all checkmarks on this device?")) { done = {}; save(KC, []); render(); } }
    });
    hd.addEventListener("change", function () { hideDone = hd.checked; save(KH, hideDone); render(); });
    list.addEventListener("change", function (e) {
      var i = e.target; if (!i.dataset || !i.dataset.k) return;
      if (i.checked) done[i.dataset.k] = 1; else delete done[i.dataset.k];
      save(KC, Object.keys(done)); render();
    });
    setView(load(KV, "full") === "compact" ? "compact" : "full");
  })();

  /* ---- offline support ---- */
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
