/* ------------------------------------------------------------------
   TRIP DATA  — copied from the private Google Sheet (tab "Sapporo 2027"
   and "Sapporo Guide"). Edit this file to update the site.
   Sheet snapshot taken: 2026-11-23
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

  // Flights (Philippine Airlines). Times are local to each airport.
  flights: [
    {
      "code": "PR 406",
      "airline": "Philippine Airlines",
      "date": "2027-02-01",
      "dow": "Mon",
      "from": "MNL",
      "fromName": "Manila",
      "dep": "06:30",
      "to": "CTS",
      "toName": "Sapporo New Chitose",
      "arr": "12:15",
      "aircraft": "Airbus A321neo",
      "note": "Lands the same day. No activities are planned for Feb 1."
    },
    {
      "code": "PR 405",
      "airline": "Philippine Airlines",
      "date": "2027-02-12",
      "dow": "Fri",
      "from": "CTS",
      "fromName": "Sapporo New Chitose",
      "dep": "13:15",
      "to": "MNL",
      "toName": "Manila",
      "arr": "18:10",
      "aircraft": "Airbus A321neo",
      "note": "Arrival time varies by a few minutes between sources. Feb 12 is a flexible morning with an optional Donki stop."
    }
  ],
  flightsNote: "Times follow Philippine Airlines' published Manila-Sapporo schedule for the 2025-26 season. Confirm against your booking.",

  // Itinerary, grouped by area. Feb 1 is arrival only; Feb 8 is the flexible day; Feb 12 is a flexible last morning (Donki) before the flight.
  // kind: arrival | day | flex | departure. Each day has a title, area, a one-line reason for the grouping, and its stops.
  itinerary: [
    {
      "day": 1,
      "date": "2027-02-01",
      "dow": "Mon",
      "kind": "arrival",
      "title": "Arrival",
      "area": "New Chitose Airport",
      "why": "",
      "stops": [
        {
          "time": "12:15",
          "activity": "Arrival · PR 406",
          "location": "New Chitose Airport (CTS)",
          "notes": "Philippine Airlines PR 406 from Manila (departs 06:30). No activities planned."
        }
      ]
    },
    {
      "day": 2,
      "date": "2027-02-02",
      "dow": "Tue",
      "kind": "day",
      "title": "Southwest Sapporo",
      "area": "Maruyama · Mt. Moiwa",
      "why": "Four stops on the southwest side, a short ride apart. A quiet day before the festival opens.",
      "stops": [
        {
          "time": "Morning",
          "activity": "Hokkaido Jingu",
          "location": "Maruyama Park, Chuo-ku (Maruyama-koen Station)",
          "notes": "Hokkaido's main shrine, set inside the park grounds."
        },
        {
          "time": "Morning",
          "activity": "Maruyama Park",
          "location": "Next to Hokkaido Jingu",
          "notes": "Walk the park right after the shrine."
        },
        {
          "time": "Afternoon",
          "activity": "Hokkaido Fushimi Inari Shrine",
          "location": "Mt. Moiwa slope, Chuo-ku",
          "notes": "27 red torii gates. About 15 min by car from Maruyama-koen Station."
        },
        {
          "time": "Evening",
          "activity": "Mt. Moiwa Ropeway",
          "location": "Fushimi, Chuo-ku",
          "notes": "Go up around sunset for the night view. Check ropeway operating days and the last ride up."
        }
      ]
    },
    {
      "day": 3,
      "date": "2027-02-03",
      "dow": "Wed",
      "kind": "day",
      "title": "West Sapporo (Nishi-ku)",
      "area": "Fukui · Miyanosawa",
      "why": "Both stops are in Nishi-ku, on the west side of the city.",
      "stops": [
        {
          "time": "Morning",
          "activity": "Wonderland Sapporo Snowmobile",
          "location": "478 Fukui, Nishi-ku",
          "notes": "Listed in the expense log (25,000 PHP). Confirm the session time and hotel pickup."
        },
        {
          "time": "Afternoon",
          "activity": "Shiroi Koibito Park",
          "location": "Miyanosawa, Nishi-ku",
          "notes": "Chocolate factory park. Miyanosawa is the west end of the Tozai Line."
        }
      ]
    },
    {
      "day": 4,
      "date": "2027-02-04",
      "dow": "Thu",
      "kind": "day",
      "title": "Namboku Line day · Snow Festival opens",
      "area": "Makomanai · Odori",
      "why": "Hill of the Buddha is at the end of the Namboku Line, which runs back through Odori for the festival's opening day (runs to Feb 11).",
      "stops": [
        {
          "time": "Morning",
          "activity": "Hill of the Buddha",
          "location": "Makomanai Takino Cemetery, Minami-ku",
          "notes": "Namboku Line to Makomanai, then Chuo Bus 108 (about 23 min). Great Buddha Hall is open 10:00 to 15:00 from Nov to Mar, so leave early."
        },
        {
          "time": "Afternoon",
          "activity": "Odori Park · Sapporo Snow Festival (Odori site)",
          "location": "Odori Park, Nishi 1 to 12-chome",
          "notes": "The large snow sculptures line the park. Opening day."
        },
        {
          "time": "Dusk",
          "activity": "Sapporo TV Tower",
          "location": "East end of Odori Park (Nishi 1-chome)",
          "notes": "Observation deck with a view over the park as the lights come on."
        }
      ]
    },
    {
      "day": 5,
      "date": "2027-02-05",
      "dow": "Fri",
      "kind": "day",
      "title": "Private tour day trip",
      "area": "Asahikawa · Biei · Furano",
      "why": "A full day with a driver, leaving the city early.",
      "stops": [
        {
          "time": "All day",
          "activity": "Private Tour: Asahiyama Zoo, Ningle Terrace, waterfall, Lonely Tree",
          "location": "North-central Hokkaido (Asahikawa, Biei and Furano area)",
          "notes": "Listed in the expense log (800 SGD). Confirm the tour date, pickup time and exact route with the operator."
        }
      ]
    },
    {
      "day": 6,
      "date": "2027-02-06",
      "dow": "Sat",
      "kind": "day",
      "title": "Otaru and the Snow Light Path",
      "area": "Otaru",
      "why": "Go in the day and stay for the Snow Light Path, which opens tonight (Feb 6 to 13).",
      "stops": [
        {
          "time": "Morning",
          "activity": "Otaru day trip",
          "location": "JR from Sapporo Station, about 30 to 40 min",
          "notes": "Spend the day in the canal area and town."
        },
        {
          "time": "Evening",
          "activity": "Otaru Snow Light Path",
          "location": "Otaru Canal and the former Temiya railway line",
          "notes": "Free to enter. Opening night. Check the last trains back to Sapporo."
        }
      ]
    },
    {
      "day": 7,
      "date": "2027-02-07",
      "dow": "Sun",
      "kind": "day",
      "title": "Chitose day trip",
      "area": "Chitose",
      "why": "The festival runs Jan 30 to Feb 23, so today falls in the middle of it.",
      "stops": [
        {
          "time": "Afternoon to evening",
          "activity": "Chitose · Lake Shikotsu Ice Festival",
          "location": "Lake Shikotsu Onsen, Chitose",
          "notes": "Arrive late afternoon to see the ice in daylight and lit up. About 40 min by car from Sapporo. A reservation-only Blue Liner bus runs from New Chitose Airport and JR Chitose Station. Dates can shift with the weather."
        }
      ]
    },
    {
      "day": 8,
      "date": "2027-02-08",
      "dow": "Mon",
      "kind": "flex",
      "title": "Flexible day",
      "area": "Anywhere",
      "why": "Left open as a buffer for snow delays, a rest day, or anything you missed.",
      "stops": [
        {
          "time": "All day",
          "activity": "Open · no bookings",
          "location": "",
          "notes": "Use it to reschedule a weather-hit trip (Otaru, Lake Shikotsu, Bibai) or add the Snow Festival's Tsudome site. Avoid the Sapporo Beer Museum today: it is closed on Mondays."
        }
      ]
    },
    {
      "day": 9,
      "date": "2027-02-09",
      "dow": "Tue",
      "kind": "day",
      "title": "North and East Sapporo",
      "area": "Tobetsu · Higashi-ku",
      "why": "Chocolate to the north, then two stops in Higashi-ku.",
      "stops": [
        {
          "time": "Morning",
          "activity": "Royce' Cacao & Chocolate Town (Royce Factory)",
          "location": "Tobetsu, about 40 min from central Sapporo (7 min walk from Royce Town Station)",
          "notes": "Reserve the factory tour online ahead of time."
        },
        {
          "time": "Midday",
          "activity": "Moerenuma Park",
          "location": "Higashi-ku",
          "notes": "Check winter opening hours before going."
        },
        {
          "time": "Late afternoon",
          "activity": "Sapporo Beer Garden Museum",
          "location": "9-2-10 Kita 7-jo Higashi, Higashi-ku",
          "notes": "Museum is open 11:00 to 18:00 (last entry 17:30) and closed Mondays. Today is a Tuesday."
        }
      ]
    },
    {
      "day": 10,
      "date": "2027-02-10",
      "dow": "Wed",
      "kind": "day",
      "title": "Bibai day trip",
      "area": "Bibai",
      "why": "A full-day trip northeast of Sapporo.",
      "stops": [
        {
          "time": "All day",
          "activity": "Bibai Snowland",
          "location": "Alpen Snowland Bibai, Bibai (JR to Bibai Station, then a shuttle)",
          "notes": "Last season ran Dec 6 to Mar 22, 9:00 to 16:15 (last entry 15:00). Confirm the 2026-27 dates and hours."
        }
      ]
    },
    {
      "day": 11,
      "date": "2027-02-11",
      "dow": "Thu",
      "kind": "day",
      "title": "Hokkaido food day · Susukino finale",
      "area": "Nijo · Tanukikoji · Susukino",
      "why": "A day for Hokkaido milk, ice cream and local specialties, all within walking distance, ending at the Snow Festival's last night.",
      "stops": [
        {
          "time": "Morning",
          "activity": "Nijo Market: king crab and seafood bowl",
          "location": "Nijo Market, Chuo-ku",
          "notes": "Seafood breakfast. A kaisendon (raw seafood on rice) is a Sapporo classic."
        },
        {
          "time": "Late morning",
          "activity": "Hokkaido milk soft-serve and ice cream",
          "location": "Central Sapporo (Odori to Sapporo Station)",
          "notes": "Hokkaido makes about half of Japan's raw milk. Shops to pick from: Yukijirushi (Snow Brand) Parlor main store, Kitakaro, and the Sapporo Agricultural College Rakuno Milk Soft."
        },
        {
          "time": "Lunch",
          "activity": "Soup curry",
          "location": "Near Susukino Station",
          "notes": "Soup Curry Garaku is a popular choice and often has a queue. Soup curry is a Sapporo specialty."
        },
        {
          "time": "Afternoon",
          "activity": "Susukino Nikka & Shopping Street",
          "location": "Susukino",
          "notes": "The Nikka sign at Susukino Crossing and the nearby shopping street."
        },
        {
          "time": "Evening",
          "activity": "Ramen Lane (miso ramen)",
          "location": "Susukino",
          "notes": "Sapporo is known for rich miso ramen. Genghis Khan lamb is the other local dish to try; the Beer Garden on Feb 9 covers it."
        },
        {
          "time": "Night",
          "activity": "Ice World Susukino",
          "location": "Ekimae-dori, Minami 4-jo to 6-jo",
          "notes": "Snow Festival's last day. Past years' ice sculptures were lit until 23:00 (22:00 on the final day). 2027 hours come out in mid-December."
        }
      ]
    },
    {
      "day": 12,
      "date": "2027-02-12",
      "dow": "Fri",
      "kind": "departure",
      "title": "Departure · flexible last morning",
      "area": "Tanukikoji · New Chitose Airport",
      "why": "Left open on purpose. The flight leaves at 13:15, so keep any shopping to the early morning.",
      "stops": [
        {
          "time": "Early morning",
          "activity": "Flexible · last-minute Donki shopping",
          "location": "MEGA Don Quijote Sapporo Tanukikoji (open 24 hours)",
          "notes": "Tax-free shopping is offered. Finish early and leave time for the trip to New Chitose Airport."
        },
        {
          "time": "Departs 13:15",
          "activity": "Departure · PR 405",
          "location": "New Chitose Airport (CTS)",
          "notes": "Philippine Airlines PR 405 to Manila (arrives about 18:10)."
        }
      ]
    }
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
      {
        "name": "Sapporo Snow Festival",
        "starts": "Feb 4, 2027",
        "ends": "Feb 11, 2027",
        "onDates": "Yes",
        "where": "Odori Park, Susukino and Tsudome",
        "note": "Dates confirmed. Large snow sculptures at Odori, ice sculptures at Susukino, Tsudome is the snow-play site"
      },
      {
        "name": "Otaru Snow Light Path",
        "starts": "Feb 6, 2027",
        "ends": "Feb 13, 2027",
        "onDates": "Yes",
        "where": "Otaru Canal and the former Temiya railway line",
        "note": "Free to enter; 30 to 40 minutes from Sapporo by train"
      },
      {
        "name": "Chitose and Lake Shikotsu Ice Festival",
        "starts": "Jan 30, 2027",
        "ends": "Feb 23, 2027",
        "onDates": "Yes",
        "where": "Lake Shikotsu hot springs, Chitose",
        "note": "Dates can shift with the weather. Sapporo tourism's English page still says early to late Feb"
      },
      {
        "name": "Sapporo White Illumination",
        "starts": "Nov 20, 2026",
        "ends": "Mar 14, 2027",
        "onDates": "Yes",
        "where": "Odori Park, Ekimae-dori and other sites",
        "note": "Winter light display, on before, during and after your trip"
      },
      {
        "name": "Ice World Susukino",
        "starts": "Feb 4, 2027",
        "ends": "Feb 11, 2027",
        "onDates": "Yes",
        "where": "Ekimae-dori, Minami 4-jo to 6-jo",
        "note": "The Snow Festival's Susukino site. Past years lit until 23:00 (22:00 on the last day); 2027 hours due mid-December"
      },
      {
        "name": "Bibai Snowland",
        "starts": "Winter season",
        "ends": "To be confirmed",
        "onDates": "Check dates",
        "where": "Alpen Snowland Bibai, Bibai",
        "note": "Not a festival. 2025-26 season ran Dec 6 to Mar 22; 2026-27 dates not found yet"
      }
    ],
    sources: [
      {
        "label": "Sapporo event list",
        "url": "https://www.sapporo.travel/en/event/event-list/"
      },
      {
        "label": "Otaru Snow Light Path",
        "url": "https://www.sapporo.travel/en/event/event-list/otaru-snow-light-path/"
      },
      {
        "label": "Sapporo Snow Festival",
        "url": "https://www.sapporo.travel/en/event/winter_activities/sapporo_snow_festival/"
      },
      {
        "label": "Lake Shikotsu Ice Festival",
        "url": "https://www.iwafu.com/en/events/1171363"
      },
      {
        "label": "PAL Manila-Sapporo schedule",
        "url": "https://www.aeroroutes.com/eng/250708-prnw25cts"
      }
    ]

  },

  // Offline fallback FX (per 1 SGD). Live rates replace these when online.
  // SGD->PHP is the sheet's rate; SGD->JPY is an approximate estimate.
  fxFallback: { SGD: 1, PHP: 49.6302, JPY: 125 }
};
