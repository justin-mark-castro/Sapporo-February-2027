/* Things to Prepare + Where to Eat. Self-contained: data, rendering and filters. */
(function () {
  "use strict";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ico(path) { return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + path + "</svg>"; }

  /* ---------------- Things to prepare ---------------- */
  var PREP_ICONS = {
    qr:       ico('<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 6h1.5v1.5H10zM12.5 6H14v1.5h-1.5zM10 8.5h1.5V10H10zM13 10.5h1.5V12H13zM10 12.5h1.5V14H10z"/>'),
    gov:      ico('<path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'),
    passport: ico('<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 16h6"/>'),
    cold:     ico('<path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M9 4l3 2 3-2M9 20l3-2 3 2"/>'),
    booking:  ico('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M9 15l2 2 4-4"/>'),
    yen:      ico('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M10 9.5l2 2.5 2-2.5M12 12v3.5M10.5 13.2h3"/>'),
    wifi:     ico('<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>')
  };
  var PREP = [
    { icon: "gov", img: "assets/egov-logo.png", color: "#24457c", when: "Before you fly out · Feb 1 and Feb 12", title: "eTravel (eGovPH)",
      body: "The Philippines' free digital arrival and departure declaration. Register at etravel.gov.ph or in the eGovPH app, and show the QR code at check-in.",
      points: [
        "Feb 1 (departing Manila): register within 72 hours before your flight and no later than 3 hours before it. Your 6:30 AM flight means doing it by Jan 31 is safest.",
        "Feb 12 (arriving Manila, about 6:10 PM): register within the 72 hours before you land, so from about Feb 9.",
        "It applies to Filipino travellers leaving the country. If you travel on another passport, check the site."
      ],
      note: "It is free. Only use etravel.gov.ph or the official eGovPH app, and never pay anyone for it.",
      link: { href: "https://etravel.gov.ph/", label: "Open eTravel" } },
    { icon: "qr", img: "assets/visit-japan-web-logo.png", color: "#c8372d", when: "Before you land in Japan · Feb 1", title: "Visit Japan Web",
      body: "Japan's official online service for immigration, customs and tax-free shopping. You finish the forms ahead of time and get QR codes to scan at New Chitose Airport.",
      points: [
        "Have your passport, flight number (PR 406), arrival date and the hotel address (Hokke Club Sapporo) ready.",
        "Register before you fly, not on the plane. Screenshot the QR codes in case the airport Wi-Fi is slow.",
        "It also holds your tax-free QR code, which is handy for the Feb 11 Donki shopping."
      ],
      note: "It is free and web-only. There is no app to download, and no one should charge you for it. Paper forms are still available on the flight.",
      link: { href: "https://www.vjw.digital.go.jp/main/", label: "Open Visit Japan Web" } },
    { icon: "passport", color: "#7b5ea7", when: "Check now", title: "Passport and entry rules",
      body: "Make sure your passport is valid for your whole stay (many guides suggest at least 6 months) and check whether your passport needs a visa for Japan.",
      points: ["Entry rules depend on nationality, so check the Japanese embassy or consulate page for your passport.", "Carry your return ticket (PR 405 on Feb 12) and the hotel booking."] },
    { icon: "cold", color: "#2f8f9d", when: "Pack", title: "Winter gear",
      body: "Layers, a warm waterproof coat, gloves, hat, thermal base layers and boots with good grip. The Overview section shows February temperatures and snowfall.",
      points: ["Hand warmers and a snow-proof phone case help on snowmobile and Snow Festival days.", "Indoors is warm, so wear layers you can take off."] },
    { icon: "booking", color: "#d9701a", when: "Confirm in advance", title: "Bookings to confirm",
      body: "A few stops need a confirmed time or a reservation before you go.",
      points: ["Wonderland Sapporo snowmobile (Feb 3): session time and hotel pickup.", "Private tour (Feb 5): date, pickup time and exact route.", "Royce' factory tour (Feb 9): reserve online.", "Lake Shikotsu bus (Feb 7): reservation-only, so book ahead."] },
    { icon: "yen", color: "#b8923a", when: "Before you go", title: "Yen and transport card",
      body: "Bring some yen cash plus a card. A transit IC card works on the Sapporo subway, streetcar and JR trains, so you can tap instead of buying tickets.",
      points: ["Small shops, ramen counters and markets sometimes take cash only."] },
    { icon: "wifi", color: "#12908e", when: "Before you go", title: "Data and offline maps",
      body: "Set up an eSIM or pocket Wi-Fi so maps and train apps work from the moment you land, and download offline maps of Sapporo as a backup.",
      points: [] }
  ];

  function renderPrep() {
    var el = document.getElementById("prepGrid");
    if (!el) return;
    el.innerHTML = PREP.map(function (p) {
      var pts = (p.points || []).length ? '<ul class="prep-points">' + p.points.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "";
      return '<article class="prep-card" style="--c:' + p.color + '">' +
        '<div class="prep-head"><span class="prep-ico' + (p.img ? ' has-img' : '') + '">' + (p.img ? '<img src="' + esc(p.img) + '" alt="" loading="lazy">' : PREP_ICONS[p.icon]) + '</span><div><span class="prep-when">' + esc(p.when) + "</span><h3>" + esc(p.title) + "</h3></div></div>" +
        '<p class="prep-body">' + esc(p.body) + "</p>" + pts +
        (p.note ? '<p class="prep-note">' + esc(p.note) + "</p>" : "") +
        (p.link ? '<a class="prep-link" href="' + esc(p.link.href) + '" target="_blank" rel="noopener">' + esc(p.link.label) + " &rarr;</a>" : "") +
        "</article>";
    }).join("");
  }

  /* ---------------- Where to eat ---------------- */
  var CATS = {
    milk:    { label: "Milk & ice cream", color: "#2f8f9d", path: '<path d="M7 11a5 5 0 0 1 10 0zM7 11l5 11 5-11"/>' },
    cafe:    { label: "Cafe & dessert",   color: "#d6336c", path: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h2a2 2 0 0 1 0 4h-2M7 4v2M10 4v2M13 4v2"/>' },
    curry:   { label: "Soup curry",       color: "#d9701a", path: '<path d="M3 11h18c0 5-4 9-9 9s-9-4-9-9zM8 7c0-1 1-1 1-3M12 7c0-1 1-1 1-3M16 7c0-1 1-1 1-3"/>' },
    ramen:   { label: "Ramen",            color: "#c8372d", path: '<path d="M3 12h18c0 5-4 8-9 8s-9-3-9-8zM8 12V6M12 12V4M16 12V6"/>' },
    genghis: { label: "Genghis Khan",     color: "#8a4a12", path: '<path d="M12 3c2 3 5 4 5 8a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-4 1-7zM5 21h14"/>' },
    seafood: { label: "Seafood",          color: "#24457c", path: '<path d="M3 12c3-5 8-6 13-3l5-2-1 5 1 5-5-2c-5 3-10 2-13-3zM9 11.5v.01"/>' },
    chain:   { label: "Budget & chains",   color: "#4a5568", path: '<path d="M4 4v7a3 3 0 0 0 3 3v6M7 4v6M10 4v7a3 3 0 0 1-3 3M17 20V4c-2 1-3 4-3 8h3"/>' },
    matcha:  { label: "Matcha cafe",       color: "#5b8c3a", path: '<path d="M4 10h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 11h2a2 2 0 0 1 0 4h-2M8 4c1 1-1 2 0 3M12 4c1 1-1 2 0 3"/>' },
    local:   { label: "Local specialties", color: "#a8741a", path: '<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>' }
  };
  var TAGS = { milk: "Hokkaido milk", icecream: "Ice cream", specialty: "Hokkaido specialty", otaru: "Otaru day trip" };

  var CLOCK = '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>';
  var HOURS = {
    "Sapporo Agricultural College Rakuno Milk Soft": "Mall hours, about 10:00 AM – 8:00 PM (confirm)",
    "Yukijirushi (Snow Brand) Parlor, Main Store": "10:00 AM – 7:00 PM, open daily",
    "Maruyama Gelato No.24 HACO": "11:00 AM – 5:00 PM, closed Mon",
    "UMIERE": "11:00 AM – 7:00 PM (confirm)",
    "Milk Stand Hokkaido Kono Sha": "8:00 AM – 8:00 PM",
    "Milk & Parfait Yotsuba White Cosy": "11:00 AM – 10:00 PM, follows Paseo holidays",
    "Noymond Organic Cafe": "Varies by branch, confirm on Maps",
    "Morihiko (Main Store)": "10:00 AM – 7:00 PM, closed New Year",
    "Atelier Morihiko": "8:00 AM – 8:00 PM (confirm)",
    "Saera": "10:00 AM – 6:00 PM, closed Wed",
    "Kitakaro Sapporo Honkan": "10:00 AM – 6:00 PM (confirm)",
    "Yukijirushi Parlor (matcha affogato)": "10:00 AM – 7:00 PM, open daily",
    "Soup Curry GARAKU": "11:30 AM – 3:30 PM, 5:00 – 11:30 PM (confirm)",
    "Soup Curry Suage+": "Mon–Fri 11:30 AM – 9:30 PM, Sat 11:00 AM – 10:00 PM",
    "Rojiura Curry SAMURAI": "11:30 AM – 3:30 PM, 5:30 – 11:00 PM (confirm)",
    "Magic Spice": "Mon, Tue, Fri 11 AM – 3 PM and 5:30 – 10 PM; Sat, Sun 11 AM – 10 PM; closed Wed, Thu",
    "Picante": "11:00 AM – 11:00 PM, closed Wed (confirm)",
    "Soup Curry Yellow": "11:30 AM – 9:00 PM (confirm)",
    "Ganso Sapporo Ramen Yokocho": "Varies by shop, many 11:00 AM until late night",
    "Sumire (Susukino)": "5:00 PM – 12:00 AM (confirm)",
    "Ramen Shingen (Minami 6-jo)": "11:30 AM – 1:00 AM, closes when soup sells out",
    "Menya Saimi": "11:00 AM – 3:15 PM, Fri–Sat also 5:00 – 7:30 PM, closed Mon",
    "Ganso Sapporo Ramen Mogura": "Ramen Alley shop, open late (confirm)",
    "Baisensha": "9:00 AM – 2:30 AM, irregular holidays",
    "Jingisukan Daruma (Main Branch)": "Evening until about 12:00 AM (confirm)",
    "Sapporo Jingisukan (Main Branch)": "5:00 – 10:00 PM (last order 9:30 PM)",
    "Matsuo Jingisukan Odori Minami 1-jo": "11 AM – 3 PM and 5 – 11 PM",
    "Sapporo Beer Garden": "11:30 AM – 9:00 PM (last order 8:40 PM)",
    "Kaisendon Ya Oguma Shouten": "Inside Nijo Market (market about 7 AM – 6 PM), confirm",
    "Donburi Chaya": "7:30 AM – 4:30 PM (last order 4:00 PM)",
    "Shiki Hanamaru Susukino": "Sun and holidays 11:00 AM – 10:00 PM, confirm other days",
    "Matsuya": "Open 24 hours",
    "Ichiran Ramen": "Susukino branch open until about 4:00 AM, some listings 24 hrs",
    "Saizeriya": "Susukino branch: Sun–Thu 11 AM – 11:30 PM, Fri–Sat 11 AM – 3 AM",
    "Matcha Cafe & Sweets RIQ (Rikyu)": "10:30 AM – 12:00 AM (last order 11:30 PM)",
    "d:matcha Kyoto Sapporo": "11:00 AM – 9:00 PM (confirm)",
    "108 Matcha Saro": "10:00 AM – 9:00 PM",
    "LeTAO Honten": "9:00 AM – 6:00 PM (cafe last order 5:30 PM)",
    "Kitakaro Otaru Main Shop": "10:00 AM – 6:00 PM, closed New Year's Day (confirm)",
    "Hokkaido Shiki Marche (Stellar Place)": "Mall hours, about 10:00 AM – 8:00 PM (confirm)"
  };
  var HOURS_FALLBACK = "Hours not confirmed, check Google Maps";

  function P(n, c, a, d, tags, q, u) { return { n: n, c: c, a: a, d: d, t: tags || [], q: q || n + " Sapporo", u: u || "" }; }
  var PLACES = [
    P("Sapporo Agricultural College Rakuno Milk Soft", "milk", "Sapporo Station · Stellar Place", "Soft serve made with pasture-raised Hokkaido milk, topped with a crisp milk cookie.", ["milk", "icecream"], "Sapporo Agricultural College Rakuno Milk Soft Stellar Place Sapporo"),
    P("Yukijirushi (Snow Brand) Parlor, Main Store", "milk", "Kita 2-jo Nishi 3, near your hotel", "Open since 1961. Known for Snow Royal ice cream, first made in 1968 for the Showa Emperor's Hokkaido visit, plus parfaits made with Hokkaido milk.", ["milk", "icecream"], "Yukijirushi Parlor Sapporo Main Store"),
    P("Maruyama Gelato No.24 HACO", "milk", "Central Sapporo", "Gelato made with Hokkaido milk. Check opening days before you go.", ["milk", "icecream"]),
    P("UMIERE", "milk", "Near Sapporo Factory", "Started the thick, round \"Moko Moko\" soft serve that went viral on social media. Check opening days.", ["icecream"]),
    P("Machimura Nojo Odori", "milk", "Odori", "Soft serve and milk-based desserts.", ["milk", "icecream"], "Machimura Nojo Odori Sapporo"),
    P("Ishiya Cafe", "milk", "Chi-Ka-Ho, between Sapporo and Odori stations", "Soft serve from the makers of Shiroi Koibito, on the underground walkway.", ["icecream"]),
    P("Milk Stand Hokkaido Kono Sha", "milk", "New Chitose Airport", "Farm-direct soft serve, third in a 2025 airport soft-serve vote. A good stop on Feb 12 before your flight.", ["milk", "icecream"], "Milk Stand Hokkaido Kono Sha New Chitose Airport"),
    P("Milk & Parfait Yotsuba White Cosy", "milk", "Paseo West, Sapporo Station", "Dessert cafe run by the Hokkaido dairy maker Yotsuba, built around milk and parfaits.", ["milk"], "Milk & Parfait Yotsuba White Cosy Sapporo Paseo"),
    P("Baristart Coffee", "milk", "Sapporo", "A coffee stand known for showing off Hokkaido milk.", ["milk"]),

    P("Noymond Organic Cafe", "cafe", "Minami 3-jo Nishi 2, near Susukino", "Organic cafe using Hokkaido ingredients, with French toast made from Tokachi milk and eggs. Credited with starting the shime parfait trend.", ["milk"], "Noymond Organic Cafe Sapporo"),
    P("Morihiko (Main Store)", "cafe", "Near Hokkaido Jingu · Maruyama-koen", "Coffee cafe in a house near the shrine, known for its no-bake cheesecake with a fresh milk taste. Tabelog Cafe EAST 100 (2025). Handy for Feb 2.", ["milk"], "Morihiko Maruyama Sapporo"),
    P("Atelier Morihiko", "cafe", "Chuo Kuyakusho-mae", "A sister cafe of Morihiko with cakes and coffee.", [], "Atelier Morihiko Sapporo"),
    P("INITIAL Sapporo", "cafe", "Tanukikoji", "A shime parfait spot made with seasonal fresh fruit, a sweet end to a night out.", [], "INITIAL Sapporo parfait"),
    P("Parfaiteria PaL", "cafe", "Central Sapporo", "A parfait specialist for a shime parfait after dinner.", []),
    P("Yoru Parfait Nanakamado", "cafe", "Central Sapporo", "A night-time parfait specialty restaurant.", [], "Nanakamado parfait Sapporo"),
    P("Saera", "cafe", "Odori underground", "A beloved Hokkaido coffee chain, in the tunnels under Odori since 1975.", [], "Saera coffee Odori Sapporo"),
    P("Kitakaro Sapporo Honkan", "cafe", "Central Sapporo", "A Hokkaido sweets brand with a shop and cafe in a retro-modern building.", ["specialty"]),
    P("LeTAO Honten", "cafe", "Otaru (Feb 6)", "A well-known cheesecake shop to try on your Otaru day trip.", ["specialty", "otaru"], "LeTAO Honten Otaru"),
    P("Popura Farm Otaru Outlet", "cafe", "Otaru Denuki Koji, Ironai (Feb 6)", "Must eat: Yubari melon ice cream. The signature \"Santa's Beard\" puts melon soft serve on a half melon. Pricey, but a Hokkaido classic for your Otaru day trip.", ["icecream", "specialty", "otaru"], "Popura Farm Otaru Denuki Koji"),
    P("Otaru Rainbow Soft Cream", "cafe", "Otaru (Feb 6)", "Must eat: the 8-layer rainbow soft serve, a colourful Otaru ice cream stop. It is big, so share it or go in a pair.", ["icecream", "otaru"], "Otaru Rainbow Soft Cream", "https://maps.app.goo.gl/LXmRqxB3Unfhi8ck8"),
    P("Shofukuya Ice Cream", "cafe", "Otaru (Feb 6)", "An ice cream stop to add to your Otaru day trip. Open the map link to check the exact location and hours.", ["icecream", "otaru"], "Shofukuya Ice Cream Otaru", "https://maps.app.goo.gl/QRMSGiLoXg5YoLqj9"),
    P("Kitakaro Otaru Main Shop", "cafe", "Sakaimachi 7-22, Otaru (Feb 6)", "The Otaru main shop of the Hokkaido sweets brand, known for baumkuchen, cream puffs and rich soft serve made with fresh cream and milk. You can watch the bakers at work.", ["specialty", "icecream", "otaru"], "Kitakaro Otaru Main Shop", "https://maps.app.goo.gl/FB9YFxc2xVLCa2J68"),
    P("Rokkatei Otaru Canal Store", "cafe", "Otaru Canal (Feb 6)", "A Hokkaido confectionery shop by the canal. Try the cream zenzai, red beans and rice cake over ice cream, which is easy to eat on the move.", ["specialty", "icecream", "otaru"], "Rokkatei Otaru Canal Store", "https://maps.app.goo.gl/1L8W1D9g2ubGEt816"),

    P("Soup Curry GARAKU", "curry", "Susukino (main store) · Sitatte Sapporo", "One of Sapporo's best-known soup curry restaurants, with a queue at busy times. You choose the soup, spice level and toppings.", ["specialty"], "Soup Curry GARAKU Sapporo"),
    P("Soup Curry Suage+", "curry", "Susukino", "Known for crisp, batter-free fried vegetables and an optional squid-ink \"ikakuro\" soup. Tabelog Curry EAST 100 (2026).", ["specialty"], "Soup Curry Suage+ Susukino"),
    P("Rojiura Curry SAMURAI", "curry", "Near Tanukikoji", "Rich soup curry with Hokkaido vegetables. The Samurai Special puts popular meats and vegetables on one plate.", ["specialty"], "Rojiura Curry SAMURAI Tanukikoji Sapporo"),
    P("Magic Spice", "curry", "Sapporo main shop", "A well-known soup curry shop with its main shop in Sapporo.", ["specialty"], "Magic Spice Sapporo Main Shop"),
    P("Picante", "curry", "Sapporo Station front", "A soup curry shop close to the station.", ["specialty"], "Picante Sapporo Eki-mae soup curry"),
    P("Okushiba Shoten", "curry", "Sapporo", "A popular Hokkaido soup curry restaurant.", ["specialty"], "Okushiba Shoten Okushiba-chan Soup Curry Sapporo"),
    P("Soup Curry Yellow", "curry", "Minami 3-jo Nishi 1", "A Sapporo-based chain praised for a soup made with a unique method.", ["specialty"], "Soup Curry Yellow Sapporo"),

    P("Ganso Sapporo Ramen Yokocho", "ramen", "Susukino · Minami 5-jo Nishi 3", "A 42 m alley with 17 miso ramen shops, already on your Feb 11 plan.", ["specialty"], "Ganso Sapporo Ramen Yokocho"),
    P("Sumire (Susukino)", "ramen", "Next to Susukino Station", "Famous since 1964 for hot miso ramen sealed under a layer of lard, with a garlic and pepper aroma.", ["specialty"], "Sumire Ramen Susukino Sapporo"),
    P("Ramen Shingen (Minami 6-jo)", "ramen", "Near Higashi-Honganji-mae", "Miso ramen with tender braised pork. Tabelog Ramen HOKKAIDO 100 (2025).", ["specialty"], "Ramen Shingen Minami 6 jo Sapporo"),
    P("Menya Yukikaze", "ramen", "Sapporo", "A well-regarded Sapporo ramen shop that appears in Navitime's list of the best.", ["specialty"]),
    P("Menya Saimi", "ramen", "Toyohira-ku", "Simple miso ramen from an owner who trained at Sumire.", ["specialty"]),
    P("Ganso Sapporo Ramen Mogura", "ramen", "Shin Ramen Yokocho", "Known for a huge slab of char siu spilling over the bowl, with a mellow miso soup and vegetables.", ["specialty"], "Ganso Sapporo Ramen Mogura"),
    P("Baisensha", "ramen", "Ganso Ramen Yokocho", "A miso ramen specialist in the ramen alley.", ["specialty"], "Baisensha ramen Sapporo Ramen Yokocho"),

    P("Jingisukan Daruma (Main Branch)", "genghis", "Susukino", "Open since 1954, a Susukino institution for grilled mutton and vegetables on a domed grill.", ["specialty"], "Jingisukan Daruma Honten Susukino"),
    P("Sapporo Jingisukan (Main Branch)", "genghis", "5 min from Susukino Station", "A retro counter-seat shop that opened in 1986.", ["specialty"], "Sapporo Jingisukan Honten Susukino"),
    P("Matsuo Jingisukan Odori Minami 1-jo", "genghis", "Odori", "A well-known Genghis Khan chain with a branch near Odori.", ["specialty"], "Matsuo Jingisukan Sapporo Odori Minami Ichijo"),
    P("Jingisukan Yuuhi Susukino", "genghis", "2 min from Susukino Station", "Salt-aged lamb grilled with a view over the area.", ["specialty"], "Jingisukan Yuuhi Susukino"),
    P("Fukuroutei", "genghis", "Susukino area", "A Genghis Khan restaurant on local best-of lists.", ["specialty"], "Fukuroutei Jingisukan Sapporo"),
    P("Higenoushi", "genghis", "Susukino area", "A Genghis Khan restaurant on local best-of lists.", ["specialty"], "Higenoushi Jingisukan Sapporo"),
    P("Tsukisappu Jingisukan Club", "genghis", "Higashi-ku", "Genghis Khan with Sapporo Beer, plus dishes made with Hokkaido ingredients.", ["specialty"], "Tsukisappu Jingisukan Club Sapporo"),
    P("Sapporo Beer Garden", "genghis", "Higashi-ku · Feb 9", "Grill lamb beside the huge brewing kettle in the Beer Garden. It is next to the museum on your Day 9 plan.", ["specialty"], "Sapporo Beer Garden Higashi-ku"),

    P("Kaisendon Ya Oguma Shouten", "seafood", "Nijo Market", "Opened in 2018 in Nijo Market with big seasonal seafood bowls.", ["specialty"], "Kaisendon Ya Oguma Shouten Nijo Market"),
    P("Donburi Chaya", "seafood", "Nijo Market area", "About 20 kinds of Hokkaido seafood bowls to choose from.", ["specialty"], "Donburi Chaya Sapporo Nijo Market"),
    P("Donbe", "seafood", "Central Sapporo", "Seafood bowls in a market atmosphere.", ["specialty"], "Donbe seafood Sapporo Nijo"),
    P("Shiki Hanamaru Susukino", "seafood", "Susukino · RECOLTE 2F", "Hokkaido sushi at reasonable prices, with seasonal fish.", ["specialty"], "Shiki Hanamaru Susukino"),
    P("Sakana no Anyo Susukino", "seafood", "Susukino", "A seafood buffet where you can also grill your own okonomiyaki.", ["specialty"], "Sakana no Anyo Susukino"),
    P("Hassamu Kaneshige Sengyoten", "seafood", "Central Sapporo", "A lesser-known seafood favourite for seafood bowls.", ["specialty"], "Hassamu Kaneshige Sengyoten Sapporo"),

    P("Matsuya", "chain", "Many branches in central Sapporo", "Cheap, fast beef bowls (gyudon) and set meals. You order at a ticket machine, so no Japanese is needed.", [], "Matsuya Sapporo"),
    P("Matsunoya", "chain", "Many branches in central Sapporo", "Tonkatsu (breaded pork cutlet) and katsudon set meals at low prices, from the same group as Matsuya. Order at a ticket machine.", [], "Matsunoya Sapporo"),
    P("Ichiran Ramen", "chain", "Susukino and Sapporo Station area", "Tonkotsu ramen eaten in a solo booth. You fill in an order sheet to set noodle firmness, richness and spice. Some branches are open late.", [], "Ichiran Ramen Sapporo"),
    P("Saizeriya", "chain", "Central Sapporo", "Very cheap Italian family restaurant with pasta, pizza and doria. A safe, low-cost meal when you are tired of queues.", [], "Saizeriya Sapporo"),
    P("Gusto Cafe", "chain", "Sapporo", "A family restaurant with Japanese and Western set meals, a drink bar and desserts. Good for a relaxed, no-queue meal.", [], "Gusto Sapporo"),
    P("Gyukatsu Motomura", "chain", "Sapporo", "Breaded beef cutlet served rare, which you finish yourself on a small hot stone. Expect a queue at peak hours.", [], "Gyukatsu Motomura Sapporo"),
    P("Yakiniku Like", "chain", "Susukino and central Sapporo", "Solo-friendly yakiniku with your own small grill and set meals at budget prices.", [], "Yakiniku Like Sapporo"),

    P("Matcha Cafe & Sweets RIQ (Rikyu)", "matcha", "Tanukikoji 5-chome, Minami 2-jo Nishi 5", "A matcha sweets specialist built around Uji matcha, with about 33 drinks and parfaits in a Japanese-style space. Handy for a stop while on Tanukikoji.", [], "Matcha Cafe Rikyu Tanukikoji Sapporo"),
    P("d:matcha Kyoto Sapporo", "matcha", "Kita 2-jo Nishi 2, near Odori and the Clock Tower", "Run by a Kyoto tea farm. Known for a rich matcha latte made with Hokkaido milk and a double matcha tiramisu. English-speaking staff are mentioned in reviews.", [], "d:matcha Kyoto Sapporo"),
    P("108 Matcha Saro", "matcha", "Kita 5-jo Nishi 2, by Sapporo Station", "A matcha tea room right next to the station, easy to reach from your hotel.", [], "108 Matcha Saro Sapporo"),
    P("Yukijirushi Parlor (matcha affogato)", "matcha", "Kita 2-jo Nishi 3", "Already on your list for ice cream. Its matcha affogato pours Uji matcha over Snow Royal ice cream.", ["icecream"], "Yukijirushi Parlor Sapporo Main Store"),
    P("KANON Pancakes", "matcha", "Shiroishi Ward", "A pancake cafe with a matcha tiramisu pancake that is soaked in liqueur. It is out of the centre, so check the distance first.", [], "KANON pancakes Shiroishi Sapporo"),
    P("Ame no hi to yuki no hi", "matcha", "Jozankei Onsen, Minami Ward", "A matcha dessert cafe near Jozankei. Closed Thursdays, and it is a trip out of town, so only go if you are already heading to Jozankei.", [], "Ame no hi to yuki no hi Jozankei"),
    P("Sa Wa Wa", "matcha", "Sakaimachi Street, Otaru", "A matcha sweets shop on the main street, known for matcha ice cream, mochi and warabi cake. Small and busy, so go early before items sell out.", ["otaru"], "Sa Wa Wa matcha Sakaimachi Otaru"),
    P("Matcha Sweets Dokoro Chawawa", "matcha", "Sakaimachi 4-14, Otaru", "Famous for an intense matcha soft serve that combines koicha and usucha. Stop here on your Otaru day.", ["otaru"], "Chawawa matcha Otaru Sakaimachi"),
    P("Labrado-Ressence Cafe", "matcha", "Okusawa, Otaru", "A quiet cafe with matcha basque cheesecake and sakura sweets. It is away from the canal, so allow time to get there.", ["otaru"], "Labrado Ressence Cafe Otaru"),

    P("Torimatsu", "local", "Sapporo", "Hokkaido-style zangi (soy, ginger and garlic fried chicken), served on the bone.", ["specialty"], "Torimatsu zangi Sapporo"),
    P("Nanbantei", "local", "Sapporo", "Zangi with a tangy sauce called zantare, in generous portions.", ["specialty"], "Nanbantei zangi Sapporo"),
    P("Hokkaido Shiki Marche (Stellar Place)", "local", "Sapporo Station", "A food hall of Hokkaido sweets and snacks, with zangi from Take-out Hotei and cookie sandwiches from Sapporo Agricultural College.", ["specialty", "milk"], "Hokkaido Shiki Marche Sapporo Stellar Place")
  ];

  var FILTERS = [
    { id: "all", label: "All" },
    { id: "t:milk", label: "Hokkaido milk" },
    { id: "t:icecream", label: "Ice cream" },
    { id: "t:specialty", label: "Hokkaido specialties" }, { id: "t:otaru", label: "Otaru day trip" },
    { id: "c:milk", label: CATS.milk.label }, { id: "c:cafe", label: CATS.cafe.label }, { id: "c:curry", label: CATS.curry.label },
    { id: "c:ramen", label: CATS.ramen.label }, { id: "c:genghis", label: CATS.genghis.label }, { id: "c:seafood", label: CATS.seafood.label }, { id: "c:chain", label: CATS.chain.label }, { id: "c:matcha", label: CATS.matcha.label }, { id: "c:local", label: CATS.local.label }
  ];
  var active = "all", LIMIT = 8, showAll = false;

  function mapUrl(q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); }
  function renderEat() {
    var chips = document.getElementById("eatChips"), grid = document.getElementById("eatGrid"), cnt = document.getElementById("eatCount");
    if (!grid) return;
    chips.innerHTML = FILTERS.map(function (f) {
      return '<button type="button" class="eat-chip' + (f.id === active ? " on" : "") + '" data-f="' + f.id + '">' + esc(f.label) + "</button>";
    }).join("");
    var list = PLACES.filter(function (p) {
      if (active === "all") return true;
      var kind = active.charAt(0), key = active.slice(2);
      return kind === "c" ? p.c === key : p.t.indexOf(key) > -1;
    });
    var total = list.length;
    if (!showAll && list.length > LIMIT) list = list.slice(0, LIMIT);
    cnt.textContent = (list.length < total ? "Showing " + list.length + " of " + total : total + " of " + PLACES.length) + " places";
    grid.innerHTML = list.map(function (p) {
      var c = CATS[p.c];
      var tags = p.t.map(function (t) { return '<span class="eat-tag eat-' + t + '">' + esc(TAGS[t]) + "</span>"; }).join("");
      return '<article class="eat-card" style="--c:' + c.color + '">' +
        '<div class="eat-top"><span class="eat-ico" title="' + esc(c.label) + '">' + ico(c.path) + '</span><div><h3>' + esc(p.n) + '</h3><p class="eat-area">' + esc(p.a) + "</p></div></div>" +
        '<p class="eat-desc">' + esc(p.d) + "</p>" +
        '<p class="eat-hours">' + ico(CLOCK) + esc(HOURS[p.n] || HOURS_FALLBACK) + "</p>" +
        '<div class="eat-foot"><div class="eat-tags"><span class="eat-cat">' + esc(c.label) + "</span>" + tags + "</div>" +
        '<a class="eat-map" href="' + esc(p.u || mapUrl(p.q)) + '" target="_blank" rel="noopener">' + ico('<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>') + "Google Maps</a></div></article>";
    }).join("");
    var more = document.getElementById("eatMore");
    if (!more) { more = document.createElement("button"); more.id = "eatMore"; more.type = "button"; more.className = "eat-more"; grid.parentNode.insertBefore(more, grid.nextSibling); }
    more.hidden = total <= LIMIT;
    more.textContent = showAll ? "Show fewer" : "Show all " + total + " places";
    more.onclick = function () { showAll = !showAll; renderEat(); if (!showAll) document.getElementById("eat").scrollIntoView(); };
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".eat-chip");
    if (!b) return;
    active = b.getAttribute("data-f");
    showAll = false;
    renderEat();
  });
  renderPrep();
  renderEat();
})();
