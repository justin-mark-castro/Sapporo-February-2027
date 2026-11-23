/* Sapporo 2027 — UX polish: collapsible days, "next up" card, rail swipe hints */
(function () {
  "use strict";
  var T = window.TRIP; if (!T) return;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function todayISO() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }

  /* ---- collapsible days ---- */
  var tl = $("#timeline");
  if (tl) {
    var iso = todayISO(), openIdx = 0;
    T.itinerary.forEach(function (d, i) { if (d.date === iso) openIdx = i; });
    var days = $$(".day", tl);
    days.forEach(function (li, i) {
      var body = $(".day-body", li);
      var panel = $(".stops", body);
      if (!panel) { // arrival-style day: collapse everything after the heading
        var kids = $$(".stop-title,.stop-photo,.meta,.map-link", body);
        kids.forEach(function (k, j) { if (j > 0 || k.className.indexOf("stop-title") < 0) k.classList.add("collapsible"); });
        panel = kids.length > 1 ? true : null;
      }
      if (!panel) return;
      var count = $$(".stop", body).length;
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "day-toggle";
      var label = count ? count + " stop" + (count > 1 ? "s" : "") : "Details";
      btn.dataset.label = label;
      function set(open) {
        body.classList.toggle("collapsed", !open);
        btn.setAttribute("aria-expanded", String(open));
        btn.firstChild && (btn.firstChild.nodeValue = (open ? "Hide " : "Show ") + label);
      }
      btn.appendChild(document.createTextNode(""));
      btn.addEventListener("click", function () { set(body.classList.contains("collapsed")); });
      // place the toggle right after the sunrise/sunset row (or heading block)
      var anchor = $(".day-sun", body) || $(".day-why", body) || $("h4", body);
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
      li._set = set;
      set(i === openIdx);
    });
    var tools = document.createElement("div");
    tools.className = "timeline-tools";
    tools.innerHTML = '<button type="button" data-a="open">Expand all days</button><button type="button" data-a="close">Collapse all</button>';
    tools.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      days.forEach(function (li) { if (li._set) li._set(b.dataset.a === "open"); });
    });
    tl.parentNode.insertBefore(tools, $("#typeLegend") || tl);
  }

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
