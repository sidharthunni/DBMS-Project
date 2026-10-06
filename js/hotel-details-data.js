/* TripNest - hotel data (hotels.html grid + hotels-details.html) */
const AMENITY_ICONS = {
 "wifi": "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0\"/><circle cx=\"12\" cy=\"19\" r=\"1\"/></svg>",
 "pool": "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 18c2 0 2-1.5 5-1.5s3 1.5 5 1.5 3-1.5 5-1.5 3 1.5 5 1.5M8 14V6a2 2 0 0 1 4 0M14 14V6a2 2 0 0 1 4 0\"/></svg>",
 "spa": "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21c-4-2-6-5-6-9 3 0 5 2 6 4 1-2 3-4 6-4 0 4-2 7-6 9zM12 3c1.5 2 1.5 5 0 8\"/></svg>",
 "restaurant": "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 3v8M10 3v8M6 7h4M8 11v10M17 3c-2 2-2 6 0 8v10\"/></svg>",
 "gym": "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12\"/></svg>",
 "parking": "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"3\"/><path d=\"M9 17V8h4a3 3 0 0 1 0 6H9\"/></svg>",
 "pin": "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/></svg>",
 "beach": "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 20h18M12 20V9M4 9a8 8 0 0 1 16 0z\"/></svg>",
 "airport": "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2 14l8-2 4-8 2 1-2 8 6 3-1 2-7-1-4 5-2-1 1-6z\"/></svg>"
};
const HOTELS_FALLBACK = {
 "1": {
  "id": 1,
  "name": "Azure Cliff Resort",
  "location": "Oia, Santorini, Greece",
  "rating": 4.9,
  "badges": [
   "Cliffside",
   "Infinity Pool",
   "Top Rated"
  ],
  "priceFrom": 310,
  "reviewsCount": 437,
  "address": "Oia, Santorini, Greece — guest entrance on main road",
  "description": "Azure Cliff Resort offers a memorable stay in Oia, Santorini, Greece, with comfortable rooms, friendly service and easy access to the best local sights.",
  "coords": {
   "lat": 36.4618,
   "lng": 25.3753
  },
  "images": [
   "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80"
  ],
  "videoUrl": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "videoPoster": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
  "panorama": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2400&q=80",
  "amenities": [
   {
    "icon": "wifi",
    "label": "Free Wi-Fi"
   },
   {
    "icon": "pool",
    "label": "Swimming Pool"
   },
   {
    "icon": "spa",
    "label": "Spa & Wellness"
   },
   {
    "icon": "restaurant",
    "label": "Restaurant & Bar"
   },
   {
    "icon": "gym",
    "label": "Fitness Centre"
   },
   {
    "icon": "parking",
    "label": "Free Parking"
   }
  ],
  "rooms": [
   {
    "name": "Deluxe Room",
    "size": "32 m²",
    "capacity": "2 guests",
    "bed": "1 King bed",
    "price": 310,
    "cancellation": "Free cancellation until 48h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Premium Suite",
    "size": "48 m²",
    "capacity": "3 guests",
    "bed": "1 King + Sofa bed",
    "price": 496,
    "cancellation": "Free cancellation until 72h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Family Villa",
    "size": "70 m²",
    "capacity": "5 guests",
    "bed": "2 Queen beds",
    "price": 682,
    "cancellation": "Non-refundable",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80"
    ]
   }
  ],
  "policies": [
   {
    "label": "Check-in",
    "value": "2:00 PM"
   },
   {
    "label": "Check-out",
    "value": "11:00 AM"
   },
   {
    "label": "Pets",
    "value": "On request"
   }
  ],
  "rules": [
   "No smoking inside rooms",
   "Quiet hours 10 PM – 7 AM",
   "Valid photo ID required at check-in"
  ],
  "attractions": [
   {
    "icon": "pin",
    "name": "City Centre",
    "distance": "1.2 km"
   },
   {
    "icon": "beach",
    "name": "Main Viewpoint",
    "distance": "2.5 km"
   },
   {
    "icon": "airport",
    "name": "Nearest Airport",
    "distance": "18 km"
   }
  ],
  "reviews": [
   {
    "name": "Ananya R.",
    "rating": 5,
    "date": "1 month ago",
    "text": "Stunning stay. Staff went out of their way and the views were unreal.",
    "helpful": 3
   },
   {
    "name": "Michael T.",
    "rating": 5,
    "date": "2 months ago",
    "text": "Spotless rooms, great breakfast and a perfect location.",
    "helpful": 5
   },
   {
    "name": "Sofia L.",
    "rating": 4,
    "date": "3 months ago",
    "text": "Lovely hotel overall. Check-in was slow but everything else was great.",
    "helpful": 7
   },
   {
    "name": "Rahul K.",
    "rating": 4,
    "date": "4 months ago",
    "text": "Good value for money and very comfortable beds.",
    "helpful": 9
   },
   {
    "name": "Emma W.",
    "rating": 5,
    "date": "5 months ago",
    "text": "One of the best hotels we have stayed at. Will be back.",
    "helpful": 11
   },
   {
    "name": "David P.",
    "rating": 3,
    "date": "6 months ago",
    "text": "Nice property but a bit noisy in the evenings.",
    "helpful": 13
   }
  ],
  "faqs": [
   {
    "q": "Is breakfast included?",
    "a": "Breakfast is available and can be added to any room at booking."
   },
   {
    "q": "Is airport pickup available?",
    "a": "Yes, airport transfers can be arranged on request for an extra charge."
   },
   {
    "q": "Can I cancel my booking?",
    "a": "Most rooms allow free cancellation. Check the policy shown on each room."
   }
  ],
  "similar": [
   2,
   3,
   4
  ]
 },
 "2": {
  "id": 2,
  "name": "The Nest Boutique Hotel",
  "location": "Trastevere, Rome, Italy",
  "rating": 4.7,
  "badges": [
   "Boutique",
   "City Centre"
  ],
  "priceFrom": 190,
  "reviewsCount": 574,
  "address": "Trastevere, Rome, Italy — guest entrance on main road",
  "description": "The Nest Boutique Hotel offers a memorable stay in Trastevere, Rome, Italy, with comfortable rooms, friendly service and easy access to the best local sights.",
  "coords": {
   "lat": 41.8894,
   "lng": 12.47
  },
  "images": [
   "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80"
  ],
  "videoUrl": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "videoPoster": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
  "panorama": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=2400&q=80",
  "amenities": [
   {
    "icon": "wifi",
    "label": "Free Wi-Fi"
   },
   {
    "icon": "pool",
    "label": "Swimming Pool"
   },
   {
    "icon": "spa",
    "label": "Spa & Wellness"
   },
   {
    "icon": "restaurant",
    "label": "Restaurant & Bar"
   },
   {
    "icon": "gym",
    "label": "Fitness Centre"
   },
   {
    "icon": "parking",
    "label": "Free Parking"
   }
  ],
  "rooms": [
   {
    "name": "Deluxe Room",
    "size": "32 m²",
    "capacity": "2 guests",
    "bed": "1 King bed",
    "price": 190,
    "cancellation": "Free cancellation until 48h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Premium Suite",
    "size": "48 m²",
    "capacity": "3 guests",
    "bed": "1 King + Sofa bed",
    "price": 304,
    "cancellation": "Free cancellation until 72h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Family Villa",
    "size": "70 m²",
    "capacity": "5 guests",
    "bed": "2 Queen beds",
    "price": 418,
    "cancellation": "Non-refundable",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80"
    ]
   }
  ],
  "policies": [
   {
    "label": "Check-in",
    "value": "2:00 PM"
   },
   {
    "label": "Check-out",
    "value": "11:00 AM"
   },
   {
    "label": "Pets",
    "value": "On request"
   }
  ],
  "rules": [
   "No smoking inside rooms",
   "Quiet hours 10 PM – 7 AM",
   "Valid photo ID required at check-in"
  ],
  "attractions": [
   {
    "icon": "pin",
    "name": "City Centre",
    "distance": "1.2 km"
   },
   {
    "icon": "beach",
    "name": "Main Viewpoint",
    "distance": "2.5 km"
   },
   {
    "icon": "airport",
    "name": "Nearest Airport",
    "distance": "18 km"
   }
  ],
  "reviews": [
   {
    "name": "Ananya R.",
    "rating": 5,
    "date": "1 month ago",
    "text": "Stunning stay. Staff went out of their way and the views were unreal.",
    "helpful": 3
   },
   {
    "name": "Michael T.",
    "rating": 5,
    "date": "2 months ago",
    "text": "Spotless rooms, great breakfast and a perfect location.",
    "helpful": 5
   },
   {
    "name": "Sofia L.",
    "rating": 4,
    "date": "3 months ago",
    "text": "Lovely hotel overall. Check-in was slow but everything else was great.",
    "helpful": 7
   },
   {
    "name": "Rahul K.",
    "rating": 4,
    "date": "4 months ago",
    "text": "Good value for money and very comfortable beds.",
    "helpful": 9
   },
   {
    "name": "Emma W.",
    "rating": 5,
    "date": "5 months ago",
    "text": "One of the best hotels we have stayed at. Will be back.",
    "helpful": 11
   },
   {
    "name": "David P.",
    "rating": 3,
    "date": "6 months ago",
    "text": "Nice property but a bit noisy in the evenings.",
    "helpful": 13
   }
  ],
  "faqs": [
   {
    "q": "Is breakfast included?",
    "a": "Breakfast is available and can be added to any room at booking."
   },
   {
    "q": "Is airport pickup available?",
    "a": "Yes, airport transfers can be arranged on request for an extra charge."
   },
   {
    "q": "Can I cancel my booking?",
    "a": "Most rooms allow free cancellation. Check the policy shown on each room."
   }
  ],
  "similar": [
   1,
   3,
   4
  ]
 },
 "3": {
  "id": 3,
  "name": "Harbor View Suites",
  "location": "Le Marais, Paris, France",
  "rating": 4.6,
  "badges": [
   "Suites",
   "Romantic"
  ],
  "priceFrom": 245,
  "reviewsCount": 711,
  "address": "Le Marais, Paris, France — guest entrance on main road",
  "description": "Harbor View Suites offers a memorable stay in Le Marais, Paris, France, with comfortable rooms, friendly service and easy access to the best local sights.",
  "coords": {
   "lat": 48.8566,
   "lng": 2.3522
  },
  "images": [
   "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80"
  ],
  "videoUrl": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "videoPoster": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  "panorama": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2400&q=80",
  "amenities": [
   {
    "icon": "wifi",
    "label": "Free Wi-Fi"
   },
   {
    "icon": "pool",
    "label": "Swimming Pool"
   },
   {
    "icon": "spa",
    "label": "Spa & Wellness"
   },
   {
    "icon": "restaurant",
    "label": "Restaurant & Bar"
   },
   {
    "icon": "gym",
    "label": "Fitness Centre"
   },
   {
    "icon": "parking",
    "label": "Free Parking"
   }
  ],
  "rooms": [
   {
    "name": "Deluxe Room",
    "size": "32 m²",
    "capacity": "2 guests",
    "bed": "1 King bed",
    "price": 245,
    "cancellation": "Free cancellation until 48h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Premium Suite",
    "size": "48 m²",
    "capacity": "3 guests",
    "bed": "1 King + Sofa bed",
    "price": 392,
    "cancellation": "Free cancellation until 72h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Family Villa",
    "size": "70 m²",
    "capacity": "5 guests",
    "bed": "2 Queen beds",
    "price": 539,
    "cancellation": "Non-refundable",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80"
    ]
   }
  ],
  "policies": [
   {
    "label": "Check-in",
    "value": "2:00 PM"
   },
   {
    "label": "Check-out",
    "value": "11:00 AM"
   },
   {
    "label": "Pets",
    "value": "On request"
   }
  ],
  "rules": [
   "No smoking inside rooms",
   "Quiet hours 10 PM – 7 AM",
   "Valid photo ID required at check-in"
  ],
  "attractions": [
   {
    "icon": "pin",
    "name": "City Centre",
    "distance": "1.2 km"
   },
   {
    "icon": "beach",
    "name": "Main Viewpoint",
    "distance": "2.5 km"
   },
   {
    "icon": "airport",
    "name": "Nearest Airport",
    "distance": "18 km"
   }
  ],
  "reviews": [
   {
    "name": "Ananya R.",
    "rating": 5,
    "date": "1 month ago",
    "text": "Stunning stay. Staff went out of their way and the views were unreal.",
    "helpful": 3
   },
   {
    "name": "Michael T.",
    "rating": 5,
    "date": "2 months ago",
    "text": "Spotless rooms, great breakfast and a perfect location.",
    "helpful": 5
   },
   {
    "name": "Sofia L.",
    "rating": 4,
    "date": "3 months ago",
    "text": "Lovely hotel overall. Check-in was slow but everything else was great.",
    "helpful": 7
   },
   {
    "name": "Rahul K.",
    "rating": 4,
    "date": "4 months ago",
    "text": "Good value for money and very comfortable beds.",
    "helpful": 9
   },
   {
    "name": "Emma W.",
    "rating": 5,
    "date": "5 months ago",
    "text": "One of the best hotels we have stayed at. Will be back.",
    "helpful": 11
   },
   {
    "name": "David P.",
    "rating": 3,
    "date": "6 months ago",
    "text": "Nice property but a bit noisy in the evenings.",
    "helpful": 13
   }
  ],
  "faqs": [
   {
    "q": "Is breakfast included?",
    "a": "Breakfast is available and can be added to any room at booking."
   },
   {
    "q": "Is airport pickup available?",
    "a": "Yes, airport transfers can be arranged on request for an extra charge."
   },
   {
    "q": "Can I cancel my booking?",
    "a": "Most rooms allow free cancellation. Check the policy shown on each room."
   }
  ],
  "similar": [
   1,
   2,
   4
  ]
 },
 "4": {
  "id": 4,
  "name": "Alpine Summit Lodge",
  "location": "Zermatt, Switzerland",
  "rating": 4.8,
  "badges": [
   "Ski-in Ski-out",
   "Mountain View"
  ],
  "priceFrom": 260,
  "reviewsCount": 848,
  "address": "Zermatt, Switzerland — guest entrance on main road",
  "description": "Alpine Summit Lodge offers a memorable stay in Zermatt, Switzerland, with comfortable rooms, friendly service and easy access to the best local sights.",
  "coords": {
   "lat": 46.0207,
   "lng": 7.7491
  },
  "images": [
   "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80"
  ],
  "videoUrl": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "videoPoster": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
  "panorama": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2400&q=80",
  "amenities": [
   {
    "icon": "wifi",
    "label": "Free Wi-Fi"
   },
   {
    "icon": "pool",
    "label": "Swimming Pool"
   },
   {
    "icon": "spa",
    "label": "Spa & Wellness"
   },
   {
    "icon": "restaurant",
    "label": "Restaurant & Bar"
   },
   {
    "icon": "gym",
    "label": "Fitness Centre"
   },
   {
    "icon": "parking",
    "label": "Free Parking"
   }
  ],
  "rooms": [
   {
    "name": "Deluxe Room",
    "size": "32 m²",
    "capacity": "2 guests",
    "bed": "1 King bed",
    "price": 260,
    "cancellation": "Free cancellation until 48h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Premium Suite",
    "size": "48 m²",
    "capacity": "3 guests",
    "bed": "1 King + Sofa bed",
    "price": 416,
    "cancellation": "Free cancellation until 72h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Family Villa",
    "size": "70 m²",
    "capacity": "5 guests",
    "bed": "2 Queen beds",
    "price": 572,
    "cancellation": "Non-refundable",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80"
    ]
   }
  ],
  "policies": [
   {
    "label": "Check-in",
    "value": "2:00 PM"
   },
   {
    "label": "Check-out",
    "value": "11:00 AM"
   },
   {
    "label": "Pets",
    "value": "On request"
   }
  ],
  "rules": [
   "No smoking inside rooms",
   "Quiet hours 10 PM – 7 AM",
   "Valid photo ID required at check-in"
  ],
  "attractions": [
   {
    "icon": "pin",
    "name": "City Centre",
    "distance": "1.2 km"
   },
   {
    "icon": "beach",
    "name": "Main Viewpoint",
    "distance": "2.5 km"
   },
   {
    "icon": "airport",
    "name": "Nearest Airport",
    "distance": "18 km"
   }
  ],
  "reviews": [
   {
    "name": "Ananya R.",
    "rating": 5,
    "date": "1 month ago",
    "text": "Stunning stay. Staff went out of their way and the views were unreal.",
    "helpful": 3
   },
   {
    "name": "Michael T.",
    "rating": 5,
    "date": "2 months ago",
    "text": "Spotless rooms, great breakfast and a perfect location.",
    "helpful": 5
   },
   {
    "name": "Sofia L.",
    "rating": 4,
    "date": "3 months ago",
    "text": "Lovely hotel overall. Check-in was slow but everything else was great.",
    "helpful": 7
   },
   {
    "name": "Rahul K.",
    "rating": 4,
    "date": "4 months ago",
    "text": "Good value for money and very comfortable beds.",
    "helpful": 9
   },
   {
    "name": "Emma W.",
    "rating": 5,
    "date": "5 months ago",
    "text": "One of the best hotels we have stayed at. Will be back.",
    "helpful": 11
   },
   {
    "name": "David P.",
    "rating": 3,
    "date": "6 months ago",
    "text": "Nice property but a bit noisy in the evenings.",
    "helpful": 13
   }
  ],
  "faqs": [
   {
    "q": "Is breakfast included?",
    "a": "Breakfast is available and can be added to any room at booking."
   },
   {
    "q": "Is airport pickup available?",
    "a": "Yes, airport transfers can be arranged on request for an extra charge."
   },
   {
    "q": "Can I cancel my booking?",
    "a": "Most rooms allow free cancellation. Check the policy shown on each room."
   }
  ],
  "similar": [
   1,
   2,
   3
  ]
 },
 "5": {
  "id": 5,
  "name": "Bali Jungle Villas",
  "location": "Ubud, Bali, Indonesia",
  "rating": 4.7,
  "badges": [
   "Private Pool",
   "Wellness"
  ],
  "priceFrom": 150,
  "reviewsCount": 985,
  "address": "Ubud, Bali, Indonesia — guest entrance on main road",
  "description": "Bali Jungle Villas offers a memorable stay in Ubud, Bali, Indonesia, with comfortable rooms, friendly service and easy access to the best local sights.",
  "coords": {
   "lat": -8.5069,
   "lng": 115.2625
  },
  "images": [
   "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80"
  ],
  "videoUrl": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "videoPoster": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
  "panorama": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2400&q=80",
  "amenities": [
   {
    "icon": "wifi",
    "label": "Free Wi-Fi"
   },
   {
    "icon": "pool",
    "label": "Swimming Pool"
   },
   {
    "icon": "spa",
    "label": "Spa & Wellness"
   },
   {
    "icon": "restaurant",
    "label": "Restaurant & Bar"
   },
   {
    "icon": "gym",
    "label": "Fitness Centre"
   },
   {
    "icon": "parking",
    "label": "Free Parking"
   }
  ],
  "rooms": [
   {
    "name": "Deluxe Room",
    "size": "32 m²",
    "capacity": "2 guests",
    "bed": "1 King bed",
    "price": 150,
    "cancellation": "Free cancellation until 48h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Premium Suite",
    "size": "48 m²",
    "capacity": "3 guests",
    "bed": "1 King + Sofa bed",
    "price": 240,
    "cancellation": "Free cancellation until 72h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Family Villa",
    "size": "70 m²",
    "capacity": "5 guests",
    "bed": "2 Queen beds",
    "price": 330,
    "cancellation": "Non-refundable",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80"
    ]
   }
  ],
  "policies": [
   {
    "label": "Check-in",
    "value": "2:00 PM"
   },
   {
    "label": "Check-out",
    "value": "11:00 AM"
   },
   {
    "label": "Pets",
    "value": "On request"
   }
  ],
  "rules": [
   "No smoking inside rooms",
   "Quiet hours 10 PM – 7 AM",
   "Valid photo ID required at check-in"
  ],
  "attractions": [
   {
    "icon": "pin",
    "name": "City Centre",
    "distance": "1.2 km"
   },
   {
    "icon": "beach",
    "name": "Main Viewpoint",
    "distance": "2.5 km"
   },
   {
    "icon": "airport",
    "name": "Nearest Airport",
    "distance": "18 km"
   }
  ],
  "reviews": [
   {
    "name": "Ananya R.",
    "rating": 5,
    "date": "1 month ago",
    "text": "Stunning stay. Staff went out of their way and the views were unreal.",
    "helpful": 3
   },
   {
    "name": "Michael T.",
    "rating": 5,
    "date": "2 months ago",
    "text": "Spotless rooms, great breakfast and a perfect location.",
    "helpful": 5
   },
   {
    "name": "Sofia L.",
    "rating": 4,
    "date": "3 months ago",
    "text": "Lovely hotel overall. Check-in was slow but everything else was great.",
    "helpful": 7
   },
   {
    "name": "Rahul K.",
    "rating": 4,
    "date": "4 months ago",
    "text": "Good value for money and very comfortable beds.",
    "helpful": 9
   },
   {
    "name": "Emma W.",
    "rating": 5,
    "date": "5 months ago",
    "text": "One of the best hotels we have stayed at. Will be back.",
    "helpful": 11
   },
   {
    "name": "David P.",
    "rating": 3,
    "date": "6 months ago",
    "text": "Nice property but a bit noisy in the evenings.",
    "helpful": 13
   }
  ],
  "faqs": [
   {
    "q": "Is breakfast included?",
    "a": "Breakfast is available and can be added to any room at booking."
   },
   {
    "q": "Is airport pickup available?",
    "a": "Yes, airport transfers can be arranged on request for an extra charge."
   },
   {
    "q": "Can I cancel my booking?",
    "a": "Most rooms allow free cancellation. Check the policy shown on each room."
   }
  ],
  "similar": [
   1,
   2,
   3
  ]
 },
 "6": {
  "id": 6,
  "name": "Maldives Coral Retreat",
  "location": "Baa Atoll, Maldives",
  "rating": 5,
  "badges": [
   "Overwater Villa",
   "Luxury"
  ],
  "priceFrom": 520,
  "reviewsCount": 1122,
  "address": "Baa Atoll, Maldives — guest entrance on main road",
  "description": "Maldives Coral Retreat offers a memorable stay in Baa Atoll, Maldives, with comfortable rooms, friendly service and easy access to the best local sights.",
  "coords": {
   "lat": 5.1667,
   "lng": 73
  },
  "images": [
   "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
   "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80"
  ],
  "videoUrl": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "videoPoster": "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80",
  "panorama": "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=2400&q=80",
  "amenities": [
   {
    "icon": "wifi",
    "label": "Free Wi-Fi"
   },
   {
    "icon": "pool",
    "label": "Swimming Pool"
   },
   {
    "icon": "spa",
    "label": "Spa & Wellness"
   },
   {
    "icon": "restaurant",
    "label": "Restaurant & Bar"
   },
   {
    "icon": "gym",
    "label": "Fitness Centre"
   },
   {
    "icon": "parking",
    "label": "Free Parking"
   }
  ],
  "rooms": [
   {
    "name": "Deluxe Room",
    "size": "32 m²",
    "capacity": "2 guests",
    "bed": "1 King bed",
    "price": 520,
    "cancellation": "Free cancellation until 48h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Premium Suite",
    "size": "48 m²",
    "capacity": "3 guests",
    "bed": "1 King + Sofa bed",
    "price": 832,
    "cancellation": "Free cancellation until 72h before",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80"
    ]
   },
   {
    "name": "Family Villa",
    "size": "70 m²",
    "capacity": "5 guests",
    "bed": "2 Queen beds",
    "price": 1144,
    "cancellation": "Non-refundable",
    "amenities": [
     "Free Wi-Fi",
     "Air conditioning",
     "Breakfast option"
    ],
    "images": [
     "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=80",
     "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80"
    ]
   }
  ],
  "policies": [
   {
    "label": "Check-in",
    "value": "2:00 PM"
   },
   {
    "label": "Check-out",
    "value": "11:00 AM"
   },
   {
    "label": "Pets",
    "value": "On request"
   }
  ],
  "rules": [
   "No smoking inside rooms",
   "Quiet hours 10 PM – 7 AM",
   "Valid photo ID required at check-in"
  ],
  "attractions": [
   {
    "icon": "pin",
    "name": "City Centre",
    "distance": "1.2 km"
   },
   {
    "icon": "beach",
    "name": "Main Viewpoint",
    "distance": "2.5 km"
   },
   {
    "icon": "airport",
    "name": "Nearest Airport",
    "distance": "18 km"
   }
  ],
  "reviews": [
   {
    "name": "Ananya R.",
    "rating": 5,
    "date": "1 month ago",
    "text": "Stunning stay. Staff went out of their way and the views were unreal.",
    "helpful": 3
   },
   {
    "name": "Michael T.",
    "rating": 5,
    "date": "2 months ago",
    "text": "Spotless rooms, great breakfast and a perfect location.",
    "helpful": 5
   },
   {
    "name": "Sofia L.",
    "rating": 4,
    "date": "3 months ago",
    "text": "Lovely hotel overall. Check-in was slow but everything else was great.",
    "helpful": 7
   },
   {
    "name": "Rahul K.",
    "rating": 4,
    "date": "4 months ago",
    "text": "Good value for money and very comfortable beds.",
    "helpful": 9
   },
   {
    "name": "Emma W.",
    "rating": 5,
    "date": "5 months ago",
    "text": "One of the best hotels we have stayed at. Will be back.",
    "helpful": 11
   },
   {
    "name": "David P.",
    "rating": 3,
    "date": "6 months ago",
    "text": "Nice property but a bit noisy in the evenings.",
    "helpful": 13
   }
  ],
  "faqs": [
   {
    "q": "Is breakfast included?",
    "a": "Breakfast is available and can be added to any room at booking."
   },
   {
    "q": "Is airport pickup available?",
    "a": "Yes, airport transfers can be arranged on request for an extra charge."
   },
   {
    "q": "Can I cancel my booking?",
    "a": "Most rooms allow free cancellation. Check the policy shown on each room."
   }
  ],
  "similar": [
   1,
   2,
   3
  ]
 }
};

// Hotels database nunchi load avthayi (/api/hotels-full). Server ledu ante paatha static data (fallback) vaadutundi.
const HOTELS = {};
window.hotelsReady = fetch('/api/hotels-full')
  .then((r) => { if (!r.ok) throw new Error('api'); return r.json(); })
  .then((data) => { if (!Object.keys(data).length) throw new Error('empty'); Object.assign(HOTELS, data); })
  .catch(() => { Object.assign(HOTELS, HOTELS_FALLBACK); });
