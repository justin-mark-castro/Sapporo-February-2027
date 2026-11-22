/* ------------------------------------------------------------------
   TRIP DATA  — copied from the private Google Sheet (tab "Sapporo 2027"
   and "Sapporo Guide"). Edit this file to update the site.
   Sheet snapshot taken: 2026-11-22
------------------------------------------------------------------- */
window.TRIP = {
  title: "Sapporo 2027",
  place: "Sapporo, Hokkaido, Japan",
  start: "2027-02-01",
  end: "2027-02-12",
  nights: 11,
  travelers: ["Justin", "Ino"],
  splitPct: { Justin: 50, Ino: 50 },

  // Rate from the sheet (SGD -> PHP). Used as the offline fallback.
  sheetRateSgdPhp: 49.6302,

  // Expense log (PHP and SGD columns are exactly as in the sheet)
  expenses: [
    { item: "PAL Flight",          php: 110904.17, sgd: 2234.61, original: "110,904.17 PHP", status: "",  note: "",                    icon: "plane" },
    { item: "Travel Tax",          php: 3240.00,   sgd: 65.28,   original: "3,240 PHP",      status: "",  note: "",                    icon: "ticket" },
    { item: "Hotel Accommodation", php: 155000.00, sgd: 3123.10, original: "155,000 PHP",    status: "",  note: "15,780.8 CNY",        icon: "hotel" },
    { item: "Snowmobile",          php: 25000.00,  sgd: 503.73,  original: "25,000 PHP",     status: "",  note: "Wanderland Sapporo",  icon: "snow" },
    { item: "Private Tour",        php: 39704.16,  sgd: 800.00,  original: "800 SGD",        status: "",  note: "",                    icon: "tour" }
  ],
  paid: { php: 0, sgd: 0 },

  // Itinerary (Day / Date / Time / Activity / Location / Notes)
  itinerary: [
    { day: 1,  date: "2027-02-01", dow: "Mon", time: "", activity: "Arrival",   location: "", notes: "" },
    { day: 2,  date: "2027-02-02", dow: "Tue", time: "", activity: "", location: "", notes: "" },
    { day: 3,  date: "2027-02-03", dow: "Wed", time: "", activity: "", location: "", notes: "" },
    { day: 4,  date: "2027-02-04", dow: "Thu", time: "", activity: "", location: "", notes: "", tag: "Snow Festival begins" },
    { day: 5,  date: "2027-02-05", dow: "Fri", time: "", activity: "", location: "", notes: "" },
    { day: 6,  date: "2027-02-06", dow: "Sat", time: "", activity: "", location: "", notes: "", tag: "Otaru Snow Light Path begins" },
    { day: 7,  date: "2027-02-07", dow: "Sun", time: "", activity: "", location: "", notes: "" },
    { day: 8,  date: "2027-02-08", dow: "Mon", time: "", activity: "", location: "", notes: "" },
    { day: 9,  date: "2027-02-09", dow: "Tue", time: "", activity: "", location: "", notes: "" },
    { day: 10, date: "2027-02-10", dow: "Wed", time: "", activity: "", location: "", notes: "" },
    { day: 11, date: "2027-02-11", dow: "Thu", time: "", activity: "", location: "", notes: "", tag: "Snow Festival ends" },
    { day: 12, date: "2027-02-12", dow: "Fri", time: "", activity: "Departure", location: "", notes: "" }
  ],

  // "Sapporo Guide" tab
  guide: {
    highLow: "1 / -6 °C",
    snowfall: "116 cm",
    festival: "Feb 4 – Feb 11",
    timeDiff: "+1 hour",
    climate: [
      { m: "Nov", hiC: 8.9,  loC: 1.7,  cm: 30.0 },
      { m: "Dec", hiC: 2.2,  loC: -3.9, cm: 113.0 },
      { m: "Jan", hiC: -0.6, loC: -6.7, cm: 136.9 },
      { m: "Feb", hiC: 0.6,  loC: -6.1, cm: 116.1 },
      { m: "Mar", hiC: 4.4,  loC: -2.2, cm: 73.9 }
    ],
    climateSource: "Japan Meteorological Agency 1991–2020 normals for Sapporo, via climate-zone.com.",
    events: [
      { name: "Sapporo Snow Festival", starts: "Feb 4, 2027", ends: "Feb 11, 2027", onDates: "Yes", where: "Odori Park, Susukino and Tsudome", note: "Large snow sculptures at Odori; Tsudome is the snow-play site" },
      { name: "Otaru Snow Light Path", starts: "Feb 6, 2027", ends: "Feb 13, 2027", onDates: "Yes", where: "Otaru Canal and the former Temiya railway line", note: "Free to enter; 30 to 40 minutes from Sapporo by train" },
      { name: "Chitose and Lake Shikotsu Ice Festival", starts: "Early Feb", ends: "Late Feb", onDates: "Check dates", where: "Lake Shikotsu hot springs, Chitose", note: "Exact dates not listed yet" },
      { name: "Sapporo White Illumination", starts: "Nov 20, 2026", ends: "Mar 14, 2027", onDates: "Yes", where: "Odori Park, Ekimae-dori and other sites", note: "Winter light display, on before, during and after your trip" }
    ],
    sources: [
      { label: "Sapporo event list", url: "https://www.sapporo.travel/en/event/event-list/" },
      { label: "Otaru Snow Light Path", url: "https://www.sapporo.travel/en/event/event-list/otaru-snow-light-path/" }
    ]
  },

  // Offline fallback FX (per 1 SGD). Live rates replace these when online.
  // SGD->PHP is the sheet's rate; SGD->JPY is an approximate estimate.
  fxFallback: { SGD: 1, PHP: 49.6302, JPY: 125 }
};
