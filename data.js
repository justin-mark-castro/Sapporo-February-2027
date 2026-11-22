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
    { item: "Hotel Accommodation", php: 155000.00, sgd: 3123.10, original: "155,000 PHP",    status: "",  note: "Hokke Club Sapporo · 15,780.8 CNY", icon: "hotel" },
    { item: "Snowmobile",          php: 25000.00,  sgd: 503.73,  original: "25,000 PHP",     status: "",  note: "Wanderland Sapporo",  icon: "snow" },
    { item: "Private Tour",        php: 39704.16,  sgd: 800.00,  original: "800 SGD",        status: "",  note: "",                    icon: "tour" }
  ],
  paid: { php: 0, sgd: 0 },

  // Total estimated budget for the trip
  budget: { php: 500000 },

  // Airline logo: drop the official file at assets/pal-logo.png (or .svg) and it appears automatically.
  airlineLogo: "assets/pal-logo.png",

  // Hotel
  hotel: {
    name: "Hokke Club Sapporo",
    jp: "ホテル法華クラブ札幌",
    address: "Chuo-ku, Kita 2-jo Nishi 3, Sapporo 060-0002",
    checkIn: "15:00", checkOut: "10:00",
    access: "About 5 min on foot from JR Sapporo Station (South Exit) and about 3 min from the Clock Tower. Large public bath on site.",
    nights: "Feb 1 – Feb 12 (11 nights)",
    lat: 43.0652, lng: 141.3495
  },

  // Map places. Coordinates are approximate (pin to the area, not the door).
  // day: itinerary day number, 0 = base / not tied to a day.
  places: [
    { id: "hotel",   name: "Hokke Club Sapporo", jp: "ホテル法華クラブ札幌", lat: 43.0652, lng: 141.3495, day: 0, cat: "hotel", t: "Hotel · check-in 15:00", d: "Your base for all 11 nights, a short walk from JR Sapporo Station." },
    { id: "jingu",   name: "Hokkaido Jingu", jp: "北海道神宮", lat: 43.0538, lng: 141.3086, day: 2, cat: "sight", t: "Day 2", d: "Shrine in Maruyama Park, west of the center." },
    { id: "maruyama",name: "Maruyama Park", jp: "円山公園", lat: 43.0545, lng: 141.3180, day: 2, cat: "sight", t: "Day 2", d: "Park next to the shrine. Tozai Line, Maruyama-koen (T06)." },
    { id: "inari",   name: "Hokkaido Fushimi Inari Shrine", jp: "北海道伏見稲荷神社", lat: 43.0345, lng: 141.3235, day: 2, cat: "sight", t: "Day 2", d: "Red torii path on the slope towards Mt. Moiwa." },
    { id: "moiwa",   name: "Mt. Moiwa Ropeway", jp: "藻岩山ロープウェイ", lat: 43.0285, lng: 141.3255, day: 2, cat: "sight", t: "Day 2 · evening", d: "Ropeway and lookout for the night view." },
    { id: "wonder",  name: "Wonderland Sapporo Snowmobile", jp: "ワンダーランド札幌", lat: 43.1050, lng: 141.2700, day: 3, cat: "sight", t: "Day 3", d: "Snowmobile tour, 478 Fukui, Nishi-ku. Booked." },
    { id: "shiroi",  name: "Shiroi Koibito Park", jp: "白い恋人パーク", lat: 43.0855, lng: 141.2745, day: 3, cat: "food", t: "Day 3", d: "Chocolate factory park near Miyanosawa Station (Tozai Line)." },
    { id: "buddha",  name: "Hill of the Buddha", jp: "頭大仏", lat: 42.9740, lng: 141.3190, day: 4, cat: "sight", t: "Day 4 · morning", d: "Makomanai Takino Cemetery. Namboku Line to Makomanai, then a bus." },
    { id: "odori",   name: "Odori Park · Snow Festival", jp: "大通公園", lat: 43.0605, lng: 141.3470, day: 4, cat: "fest", t: "Day 4 · afternoon", d: "Main Snow Festival site (Feb 4–11)." },
    { id: "clocktower", name: "Sapporo Clock Tower", jp: "札幌市時計台", lat: 43.0625, lng: 141.3537, day: 4, cat: "sight", t: "Day 4 · late afternoon", d: "Wooden clock tower, one block west of the TV Tower." },
    { id: "tower",   name: "Sapporo TV Tower", jp: "さっぽろテレビ塔", lat: 43.0611, lng: 141.3564, day: 4, cat: "sight", t: "Day 4 · dusk", d: "Observation deck at the east end of Odori Park." },
    { id: "asahi",   name: "Asahiyama Zoo (private tour)", jp: "旭山動物園", lat: 43.7683, lng: 142.4795, day: 5, cat: "tour", t: "Day 5", d: "Private tour day trip: zoo, Ningle Terrace, waterfall, Lonely Tree." },
    { id: "otaru",   name: "Otaru Canal", jp: "小樽運河", lat: 43.1990, lng: 141.0010, day: 6, cat: "sight", t: "Day 6", d: "JR Hakodate Main Line from Sapporo. Snow Light Path in the evening." },
    { id: "shikotsu",name: "Lake Shikotsu Ice Festival", jp: "支笏湖氷濤まつり", lat: 42.7640, lng: 141.3880, day: 7, cat: "fest", t: "Day 7", d: "Day trip via Chitose. Check the festival dates before going." },
    { id: "royce",   name: "Royce' Cacao & Chocolate Town", jp: "ロイズタウン", lat: 43.2120, lng: 141.5260, day: 9, cat: "food", t: "Day 9", d: "JR Gakuen Toshi Line to Royce Town." },
    { id: "moere",   name: "Moerenuma Park", jp: "モエレ沼公園", lat: 43.1243, lng: 141.4290, day: 9, cat: "sight", t: "Day 9", d: "Isamu Noguchi's park in the northeast." },
    { id: "beer",    name: "Sapporo Beer Garden & Museum", jp: "サッポロビール博物館", lat: 43.0720, lng: 141.3670, day: 9, cat: "food", t: "Day 9", d: "Closed Mondays." },
    { id: "bibai",   name: "Bibai Snowland", jp: "美唄スノーランド", lat: 43.3300, lng: 141.8590, day: 10, cat: "sight", t: "Day 10", d: "JR Hakodate Main Line to Bibai." },
    { id: "nijo",    name: "Nijo Market", jp: "二条市場", lat: 43.0575, lng: 141.3600, day: 11, cat: "food", t: "Day 11", d: "Seafood, crab and milk soft-serve." },
    { id: "ramen",   name: "Ramen Lane (Ganso Yokocho)", jp: "元祖さっぽろラーメン横丁", lat: 43.0546, lng: 141.3534, day: 11, cat: "food", t: "Day 11", d: "Alley of ramen shops in Susukino." },
    { id: "nikka",   name: "Susukino Nikka Sign & Shopping Street", jp: "ススキノ", lat: 43.0556, lng: 141.3538, day: 11, cat: "fest", t: "Day 11 · night", d: "Ice World Susukino runs here in the evening." },
    { id: "donki",   name: "MEGA Don Quijote Tanukikoji", jp: "ドン・キホーテ狸小路", lat: 43.0570, lng: 141.3510, day: 11, cat: "food", t: "Day 11 · flexible", d: "Last-minute shopping. Open 24 hours." },
    { id: "cts",     name: "New Chitose Airport", jp: "新千歳空港", lat: 42.7752, lng: 141.6923, day: 0, cat: "air", t: "PR 406 / PR 405", d: "Arrive Feb 1 (12:15), depart Feb 12 (13:15). JR Airport Rapid to Sapporo." }
  ],

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
      "note": "Arrival time varies by a few minutes between sources. Feb 11 is a flexible day with last-minute Donki shopping."
    }
  ],
  flightsNote: "Times follow Philippine Airlines' published Manila-Sapporo schedule for the 2025-26 season. Confirm against your booking.",

  // Itinerary, grouped by area. Feb 1 is arrival only; Feb 8 and Feb 11 are flexible days (Feb 11 includes last-minute Donki shopping); Feb 12 is departure only.
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
            "notes": "Philippine Airlines PR 406 from Manila (departs 06:30). No activities planned.",
            "how": "JR Rapid Airport from New Chitose Airport Station (under the terminal) to Sapporo Station, about 37 min, ¥1,150 (reserved seat +¥840, optional). Then about 5 min on foot to the hotel."
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
            "notes": "Hokkaido's main shrine, set inside the park grounds.",
            "how": "Subway Tozai Line to Maruyama-koen (T06), then walk through the park."
          },
          {
            "time": "Morning",
            "activity": "Maruyama Park",
            "location": "Next to Hokkaido Jingu",
            "notes": "Walk the park right after the shrine.",
            "how": "Same stop as the shrine, Maruyama-koen (T06)."
          },
          {
            "time": "Afternoon",
            "activity": "Hokkaido Fushimi Inari Shrine",
            "location": "Mt. Moiwa slope, Chuo-ku",
            "notes": "27 red torii gates.",
            "how": "No rail. Taxi from Maruyama-koen is easiest (about 15 min), or bus. Check the route the day before."
          },
          {
            "time": "Evening",
            "activity": "Mt. Moiwa Ropeway",
            "location": "Fushimi, Chuo-ku",
            "notes": "Go up around sunset for the night view. Check ropeway operating days and the last ride up.",
            "how": "Streetcar to Ropeway-iriguchi (about 20 to 25 min from Susukino or Nishi 4-chome, about ¥230), then the free shuttle bus (5 min, every 15 min; weekday service starts 17:15) or walk uphill about 10 min."
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
            "notes": "Listed in the expense log (25,000 PHP). Confirm the session time and hotel pickup.",
            "how": "Check whether the booking includes the free hotel shuttle. On your own: subway Tozai Line to Kotoni, JR Bus (Kotoni 41) to Fukui Entei-mae, then about 2 min on foot."
          },
          {
            "time": "Afternoon",
            "activity": "Shiroi Koibito Park",
            "location": "Miyanosawa, Nishi-ku",
            "notes": "Chocolate factory park. Miyanosawa is the west end of the Tozai Line.",
            "how": "Subway Tozai Line to Miyanosawa (west end), then a short walk."
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
            "notes": "Great Buddha Hall is open 10:00 to 15:00 from Nov to Mar, so leave early.",
            "how": "Subway Namboku Line (Sapporo to Makomanai, N16), then Chuo Bus 108 (about 23 min)."
          },
          {
            "time": "Afternoon",
            "activity": "Odori Park · Sapporo Snow Festival (Odori site)",
            "location": "Odori Park, Nishi 1 to 12-chome",
            "notes": "The large snow sculptures line the park. Opening day.",
            "how": "Subway Odori Station (Namboku, Tozai and Toho lines meet here), or walk from the hotel."
          },
          {
            "time": "Late afternoon",
            "activity": "Sapporo Clock Tower",
            "location": "Kita 1-jo Nishi 2-chome, Chuo-ku (one block west of the TV Tower)",
            "notes": "Sapporo's wooden clock tower and a city landmark. Check opening hours before you go.",
            "how": "A short walk from Odori Station or the west end of the TV Tower block."
          },
          {
            "time": "Dusk",
            "activity": "Sapporo TV Tower",
            "location": "East end of Odori Park (Nishi 1-chome)",
            "notes": "Observation deck with a view over the park as the lights come on.",
            "how": "At the east end of Odori Park, a short walk from Odori Station."
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
            "notes": "Listed in the expense log (800 SGD). Confirm the tour date, pickup time and exact route with the operator.",
            "how": "Pickup by the tour operator. Confirm the meeting point and time."
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
            "notes": "Spend the day in the canal area and town.",
            "how": "JR Hakodate Main Line, Rapid Airport from Sapporo Station to Otaru, about 32 min. Otaru Station is a short walk from the canal."
          },
          {
            "time": "Evening",
            "activity": "Otaru Snow Light Path",
            "location": "Otaru Canal and the former Temiya railway line",
            "notes": "Free to enter. Opening night. Check the last trains back to Sapporo.",
            "how": "Walk from the canal area. Take the train back to Sapporo; check the last trains."
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
            "notes": "Arrive late afternoon to see the ice in daylight and lit up. About 40 min by car from Sapporo. Dates can shift with the weather.",
            "how": "JR Chitose Line from Sapporo to Chitose Station, then the reservation-only Blue Liner bus to Lake Shikotsu. Reserve ahead."
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
            "notes": "Reserve the factory tour online ahead of time.",
            "how": "JR Gakuen Toshi Line from Sapporo Station to Royce' Town Station, about 30 min, then about 7 min on foot (a free shuttle bus also runs)."
          },
          {
            "time": "Midday",
            "activity": "Moerenuma Park",
            "location": "Higashi-ku",
            "notes": "Check winter opening hours before going.",
            "how": "Subway Toho Line to Kanjodori-Higashi (about 15 to 20 min), then Chuo Bus 東69 or 東79 to Moerenuma-koen Higashi-guchi (about 25 min, about ¥240)."
          },
          {
            "time": "Late afternoon",
            "activity": "Sapporo Beer Garden Museum",
            "location": "9-2-10 Kita 7-jo Higashi, Higashi-ku",
            "notes": "Museum is open 11:00 to 18:00 (last entry 17:30) and closed Mondays. Today is a Tuesday.",
            "how": "Toho Line to Higashi-Kuyakusho-mae (2 stops from Sapporo), about 10 min on foot. Or Loop 88 Factory Line bus from Sapporo Station (south side) or Odori, or Bus 188 from the station's North Exit."
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
            "notes": "Last season ran Dec 6 to Mar 22, 9:00 to 16:15 (last entry 15:00). Confirm the 2026-27 dates and hours.",
            "how": "JR Hakodate Main Line from Sapporo to Bibai Station, then the shuttle. Check the timetable the day before."
          }
        ]
      },
      {
        "day": 11,
        "date": "2027-02-11",
        "dow": "Thu",
        "kind": "flex",
        "title": "Hokkaido food day · flexible · last-minute Donki",
        "area": "Nijo · Tanukikoji · Susukino",
        "why": "A day for Hokkaido milk, ice cream and local specialties, all within walking distance. It stays flexible for last-minute Donki shopping and ends at the Snow Festival's last night.",
        "stops": [
          {
            "time": "Morning",
            "activity": "Nijo Market: king crab and seafood bowl",
            "location": "Nijo Market, Chuo-ku",
            "notes": "Seafood breakfast. A kaisendon (raw seafood on rice) is a Sapporo classic.",
            "how": "A short subway or taxi ride from the hotel, or walk. Nearest subway: Odori or Bus Center-mae."
          },
          {
            "time": "Late morning",
            "activity": "Hokkaido milk soft-serve and ice cream",
            "location": "Central Sapporo (Odori to Sapporo Station)",
            "notes": "Hokkaido makes about half of Japan's raw milk. Shops to pick from: Yukijirushi (Snow Brand) Parlor main store, Kitakaro, and the Sapporo Agricultural College Rakuno Milk Soft.",
            "how": "On foot between Odori and Sapporo Station, or one stop on the Namboku Line."
          },
          {
            "time": "Lunch",
            "activity": "Soup curry",
            "location": "Near Susukino Station",
            "notes": "Soup Curry Garaku is a popular choice and often has a queue. Soup curry is a Sapporo specialty.",
            "how": "Subway Namboku Line to Susukino (N08)."
          },
          {
            "time": "Afternoon",
            "activity": "Flexible · last-minute Donki shopping",
            "location": "MEGA Don Quijote Sapporo Tanukikoji (open 24 hours)",
            "notes": "Tax-free shopping is offered. Do the souvenir run today so Feb 12 stays free for the trip to the airport.",
            "how": "Walk from Susukino Station (Namboku Line, N08) or the Tanukikoji arcade."
          },
          {
            "time": "Afternoon",
            "activity": "Susukino Nikka & Shopping Street",
            "location": "Susukino",
            "notes": "The Nikka sign at Susukino Crossing and the nearby shopping street.",
            "how": "Susukino Station (Namboku Line, N08), right at the crossing."
          },
          {
            "time": "Evening",
            "activity": "Ramen Lane (miso ramen)",
            "location": "Susukino",
            "notes": "Sapporo is known for rich miso ramen. Genghis Khan lamb is the other local dish to try; the Beer Garden on Feb 9 covers it.",
            "how": "Susukino, a short walk from the Nikka sign."
          },
          {
            "time": "Night",
            "activity": "Ice World Susukino",
            "location": "Ekimae-dori, Minami 4-jo to 6-jo",
            "notes": "Snow Festival's last day. Past years' ice sculptures were lit until 23:00 (22:00 on the final day). 2027 hours come out in mid-December.",
            "how": "Susukino Station (Namboku Line, N08). Walk home or take the Namboku Line one or two stops north."
          }
        ]
      },
      {
        "day": 12,
        "date": "2027-02-12",
        "dow": "Fri",
        "kind": "departure",
        "title": "Departure · PR 405",
        "area": "New Chitose Airport",
        "why": "Departure day with no activities planned. The flight leaves at 13:15.",
        "stops": [
          {
            "time": "Departs 13:15",
            "activity": "Departure · PR 405",
            "location": "New Chitose Airport (CTS)",
            "notes": "Philippine Airlines PR 405 to Manila (arrives about 18:10). Leave Sapporo in the morning for the airport; check-out is 10:00.",
            "how": "JR Rapid Airport from Sapporo Station to New Chitose Airport, about 37 min, ¥1,150 (Special Rapid about 33 min). Aim for a train around 10:00 so you reach the airport with time to spare."
          }
        ]
      }
    ],

  // Sunrise and sunset in Sapporo (local time), from the National Astronomical Observatory of Japan.
  sun: {
  "2027-02-01": {
    "rise": "06:50",
    "set": "16:46"
  },
  "2027-02-02": {
    "rise": "06:49",
    "set": "16:48"
  },
  "2027-02-03": {
    "rise": "06:48",
    "set": "16:49"
  },
  "2027-02-04": {
    "rise": "06:47",
    "set": "16:50"
  },
  "2027-02-05": {
    "rise": "06:46",
    "set": "16:52"
  },
  "2027-02-06": {
    "rise": "06:45",
    "set": "16:53"
  },
  "2027-02-07": {
    "rise": "06:44",
    "set": "16:54"
  },
  "2027-02-08": {
    "rise": "06:42",
    "set": "16:56"
  },
  "2027-02-09": {
    "rise": "06:41",
    "set": "16:57"
  },
  "2027-02-10": {
    "rise": "06:40",
    "set": "16:58"
  },
  "2027-02-11": {
    "rise": "06:39",
    "set": "17:00"
  },
  "2027-02-12": {
    "rise": "06:37",
    "set": "17:01"
  }
},

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
