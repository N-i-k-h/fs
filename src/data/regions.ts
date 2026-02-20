export const BANGALORE_REGIONS = [
    {
        id: "central",
        name: "Central Bangalore",
        description: "CBD & Core Commercial",
        image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80",
        microLocations: [
            "MG Road", "Brigade Road", "Church Street", "St. Marks Road", "Residency Road",
            "Richmond Road", "Lavelle Road", "Vittal Mallya Road", "Queens Road", "Race Course Road",
            "Commissariat Road", "Primrose Road", "Magrath Road", "Brunton Road", "Kasturba Road",
            "Cunningham Road", "Raj Bhavan Road", "Palace Road", "Infantry Road", "Mission Road",
            "Shantala Nagar", "Ashok Nagar", "Vasanth Nagar", "Shanti Nagar", "Langford Road",
            "Langford Town", "Ali Askar Road", "Millers Road", "Craig Park Layout (MG Road)",
            "Trinity Circle", "CBD"
        ]
    },
    {
        id: "east",
        name: "East Bangalore",
        description: "Indiranagar – Whitefield Belt",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
        microLocations: [
            "Indiranagar", "HAL 2nd Stage", "HAL 3rd Stage", "Domlur", "Jeevan Bhima Nagar",
            "CV Raman Nagar", "New Tippasandra", "Ulsoor", "Halasuru", "Cambridge Layout",
            "Brookefield", "Whitefield", "Whitefield Main Road", "ITPL Main Road", "ITPL Road",
            "EPIP Zone", "Whitefield – EPIP", "Siddhapura", "Pattandur Agrahara", "Kadugodi",
            "Hoodi", "Sathya Sai", "Graphite India Main Road", "Mahadevapura", "Garudacharpalya",
            "KR Puram", "Old Madras Road", "Banaswadi", "Agrahara", "Embassy Tech Square Main Road",
            "Peripheral East", "Kattamalanur"
        ]
    },
    {
        id: "southeast",
        name: "South-East Bangalore",
        description: "HSR – ORR – Electronic City Corridor",
        image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80",
        microLocations: [
            "HSR Layout", "HSR Road", "Opp. HSR Club", "Bellandur", "Devarabisanahalli",
            "Iblur", "ORR", "Outer Ring Road", "Sarjapur Road", "Marathahalli", "Kadubisanahalli",
            "Electronic City", "Electronic City Phase 1", "Electronic City Phase 2", "Hosur Road",
            "Hosur Road (Kudlu Gate)", "Silk Board", "OMR"
        ]
    },
    {
        id: "south",
        name: "South Bangalore",
        description: "Koramangala – JP Nagar – Bannerghatta Belt",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        microLocations: [
            "Koramangala", "Adugodi", "BTM Layout", "Madiwala", "Dairy Circle",
            "Bannerghatta Road", "Bannerghatta", "JP Nagar", "Jayanagar", "South End Circle",
            "Lalbagh", "Kanakpura Road", "Wind Tunnel Road", "19th Main", "24th Main",
            "14th Main", "17th Cross", "Mini Forest"
        ]
    },
    {
        id: "north",
        name: "North Bangalore",
        description: "Hebbal – Airport Belt",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
        microLocations: [
            "Hebbal", "Nagawara", "HBR Layout", "Thanisandra Main Road", "Hennur",
            "Yelahanka", "Devanahalli", "Bagalur Cross", "Bellary Road"
        ]
    },
    {
        id: "west",
        name: "West Bangalore",
        description: "Rajajinagar – Yeshwanthpur Side",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        microLocations: [
            "Rajajinagar", "Malleshwaram", "Yeshwanthpur", "Goraguntepalya"
        ]
    }
];

export const getRegionByLocation = (locationName) => {
    if (!locationName) return null;
    const normalized = locationName.toLowerCase().trim();
    for (const region of BANGALORE_REGIONS) {
        if (region.microLocations.some(ml => normalized.includes(ml.toLowerCase()))) {
            return region.name;
        }
    }
    return null;
};
