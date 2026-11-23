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

  /* ---- offline support ---- */
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
