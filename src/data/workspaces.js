export const workspaces = [
  // ===================================
  // CO-WORKING SPACES (Type: coworking)
  // ===================================
  {
    id: 101,
    name: "WeWork Galaxy",
    city: "Bangalore",
    location: "Residency Road",
    type: "coworking",
    price: 12000,
    seats: 1,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"],
    amenities: ["WiFi", "Coffee", "Community Events", "Pray Room", "Wellness Room"],
    description: "Vibrant coworking space in the heart of Bangalore. Perfect for freelancers and startups.",
    snapshot: {
      capacity: "1-100 Seats",
      area: "25,000 Sq. Ft.",
      lock_in: "1 Month"
    },
    highlights: [
      { title: "Metro Access", desc: "Located right next to MG Road Metro Station." },
      { title: "Community", desc: "Active community with weekly events and workshops." },
      { title: "Wellness", desc: "Dedicated wellness room and meditation zone." },
      { title: "24/7 Access", desc: "Round the clock access for all members." }
    ],
    commercials: [
      { component: "Monthly Rent", cost: "₹12,000 / seat", remarks: "Includes electricity & internet" },
      { component: "Security Deposit", cost: "2 Months", remarks: "Refundable at end of tenure" },
      { component: "Lock-in Period", cost: "1 Month", remarks: "Flexible terms available" }
    ],
    compliance: [
      { title: "Fire NOC Status", status: "Certified & Active", desc: " compliant with 2024 safety standards" },
      { title: "Occupancy Certificate", status: "Available", desc: "Property is fully compliant for commercial use" }
    ]
  },
  {
    id: 102,
    name: "91Springboard Koramangala",
    city: "Bangalore",
    location: "Koramangala",
    type: "coworking",
    price: 9500,
    seats: 1,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"],
    amenities: ["24/7 Access", "Gaming Zone", "Pet Friendly", "Event Space"],
    description: "A fun and energetic workspace with a strong community vibe.",
    snapshot: {
      capacity: "1-200 Seats",
      area: "18,000 Sq. Ft.",
      lock_in: "3 Months"
    },
    highlights: [
      { title: "Gaming Zone", desc: "Relax with PS5 and Table Tennis." },
      { title: "Pet Friendly", desc: "Bring your furry friends to work." },
      { title: "Startup Hub", desc: "Surrounded by top startups and VCs." },
      { title: "Rooftop Cafe", desc: "Amazing views and great coffee." }
    ],
    commercials: [
      { component: "Monthly Rent", cost: "₹9,500 / seat", remarks: "All inclusive price" },
      { component: "Security Deposit", cost: "3 Months", remarks: "Negotiable for large teams" },
      { component: "Maintenance", cost: "Inclusive", remarks: "Daily cleaning included" }
    ],
    compliance: [
      { title: "Zoning", status: "Commercial", desc: "Approved for IT/ITES usage" },
      { title: "Safety", status: "Audited", desc: "Monthly safety drills conducted" }
    ]
  },
  {
    id: 103,
    name: "Innov8 CP",
    city: "Delhi",
    location: "Connaught Place",
    type: "coworking",
    price: 14000,
    seats: 1,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Metro Access", "Rooftop Cafe", "Heritage Building"],
    description: "Premium coworking in a heritage building with modern interiors.",
    snapshot: {
      capacity: "10-150 Seats",
      area: "12,000 Sq. Ft.",
      lock_in: "6 Months"
    },
    highlights: [
      { title: "Heritage", desc: "Work inside a restored heritage property." },
      { title: "Central Loc", desc: "Heart of Delhi, CP Outer Circle." },
      { title: "Premium Interiors", desc: "Design focused on productivity." },
      { title: "Networking", desc: "High profile member base." }
    ],
    commercials: [
      { component: "Monthly Rent", cost: "₹14,000 / seat", remarks: "Premium cabling included" },
      { component: "Security Deposit", cost: "2 Months", remarks: "Standard terms" }
    ],
    compliance: [
      { title: "Heritage Status", status: "Approved", desc: "ASI approved restoration" }
    ]
  },
  {
    id: 104,
    name: "Ministry of New",
    city: "Mumbai",
    location: "Fort",
    type: "coworking",
    price: 18000,
    seats: 1,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Library", "Art Gallery", "Studio"],
    description: "An inspiring, design-led coworking space for creatives.",
    snapshot: {
      capacity: "5-80 Seats",
      area: "8,000 Sq. Ft.",
      lock_in: "3 Months"
    },
    highlights: [
      { title: "Design", desc: "Award winning interior design." },
      { title: "Quiet Zones", desc: "Dedicated library for deep work." },
      { title: "Creative", desc: "In-house photo studio available." },
      { title: "Location", desc: "Historic Fort district." }
    ],
    commercials: [
      { component: "Monthly Rent", cost: "₹18,000 / seat", remarks: "Includes library access" },
      { component: "Security Deposit", cost: "3 Months", remarks: "Refundable" }
    ],
    compliance: [
      { title: "Fire Safety", status: "Certified", desc: "Updated 2024" }
    ]
  },
  {
    id: 105,
    name: "CoWrks Skyview",
    city: "Hyderabad",
    location: "Hitech City",
    type: "coworking",
    price: 11000,
    seats: 1,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Gym Access", "Event Hall"],
    description: "Located in a prime tech park, offering great networking opportunities.",
    snapshot: {
      capacity: "50-500 Seats",
      area: "40,000 Sq. Ft.",
      lock_in: "12 Months"
    },
    highlights: [
      { title: "Tech Park", desc: "Inside RMZ Skyview." },
      { title: "Scalability", desc: "Expand your team easily." },
      { title: "Enterprise Grade", desc: "Cisco Meraki WiFi & Firewall." },
      { title: "Lifestyle", desc: "Shopping & Dining in same complex." }
    ],
    commercials: [
      { component: "Monthly Rent", cost: "₹11,000 / seat", remarks: "Volume discounts available" },
      { component: "Security Deposit", cost: "6 Months", remarks: "Standard for parks" }
    ],
    compliance: [
      { title: "SEZ Status", status: "Available", desc: "SEZ benefits applicable" }
    ]
  },
  {
    id: 106,
    name: "Awfis Powai",
    city: "Mumbai",
    location: "Powai",
    type: "coworking",
    price: 10500,
    seats: 1,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Lake View", "Cafe"],
    description: "Scenic workspace overlooking Powai lake.",
    snapshot: {
      capacity: "1-100 Seats",
      area: "15,000 Sq. Ft.",
      lock_in: "2 Months"
    },
    highlights: [
      { title: "Lake View", desc: "Amazing views of Powai Lake." },
      { title: "Connectivity", desc: "Easy access to JVLR." }
    ],
    commercials: [
      { component: "Rent", cost: "₹10,500", remarks: "Base rate" }
    ],
    compliance: []
  },
  {
    id: 107,
    name: "IndiQube Golf View",
    city: "Bangalore",
    location: "Indiranagar",
    type: "coworking",
    price: 13000,
    seats: 1,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1556761175-4b46a89116bc?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Golf Course View", "Valet"],
    description: "Executive coworking space with premium finishings.",
    snapshot: { capacity: "10-200", area: "22,000 sqft", lock_in: "6 mo" },
    highlights: [{ title: "Golf View", desc: "Overlooking KGA Golf Course" }],
    commercials: [{ component: "Rent", cost: "₹13,000", remarks: "" }],
    compliance: []
  },
  {
    id: 108,
    name: "DevX Ahmedabad",
    city: "Ahmedabad",
    location: "SG Highway",
    type: "coworking",
    price: 8000,
    seats: 1,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Mentorship", "3D Printing"],
    description: "Gujarat's largest coworking space with tech labs.",
    snapshot: { capacity: "50-1000", area: "50,000 sqft", lock_in: "12 mo" },
    highlights: [{ title: "Accelerator", desc: "In-house accelerator program" }],
    commercials: [{ component: "Rent", cost: "₹8,000", remarks: "" }],
    compliance: []
  },

  // ===================================
  // MANAGED OFFICES (Type: managed)
  // ===================================
  {
    id: 201,
    name: "Table Space Tech Park",
    city: "Bangalore",
    location: "Bellandur",
    type: "managed",
    price: 85000,
    seats: 20,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"],
    amenities: ["IT Support", "Custom Branding"],
    description: "Fully managed office floor for mid-sized tech companies.",
    snapshot: {
      capacity: "100-500 Seats",
      area: "35,000 Sq. Ft.",
      lock_in: "3 Years"
    },
    highlights: [
      { title: "Custom Branding", desc: "Your logo, your colors, your office." },
      { title: "Managed IT", desc: "Server rooms and enterprise grade security." },
      { title: "Grade A Building", desc: "LEED Gold certified building." },
      { title: "Food Court", desc: "Large cafeteria with multiple cuisines." }
    ],
    commercials: [
      { component: "Monthly Rent", cost: "₹85,000 / seat", remarks: "Fully managed" },
      { component: "Security Deposit", cost: "6 Months", remarks: "Bank Guarantee accepted" },
      { component: "Fitout Cost", cost: "Amortized", remarks: "Included in rent" }
    ],
    compliance: [
      { title: "Fire NOC", status: "Valid", desc: "Valid till 2028" },
      { title: "Building Plan", status: "Approved", desc: "BBMP Approved" }
    ]
  },
  {
    id: 202,
    name: "Smartworks Equinox",
    city: "Mumbai",
    location: "BKC",
    type: "managed",
    price: 120000,
    seats: 30,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Concierge", "Visitor Management"],
    description: "Premium managed workspace in the financial district.",
    snapshot: { capacity: "50-300", area: "20,000 sqft", lock_in: "2 Years" },
    highlights: [{ title: "BKC Loc", desc: "Best address in Mumbai" }],
    commercials: [{ component: "Rent", cost: "₹1,20,000", remarks: "" }],
    compliance: []
  },
  {
    id: 203,
    name: "Skootr Cyber City",
    city: "Delhi",
    location: "Gurgaon",
    type: "managed",
    price: 90000,
    seats: 25,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800"],
    amenities: ["IoT Enabled", "Fine Dining"],
    description: "Intelligent workspace solutions for modern enterprises.",
    snapshot: { capacity: "30-150", area: "10,000 sqft", lock_in: "18 mo" },
    highlights: [{ title: "Smart Office", desc: "IoT controls for lights/AC" }],
    commercials: [{ component: "Rent", cost: "₹90,000", remarks: "" }],
    compliance: []
  },
  // ... All other items should utilize defaults if fields missing in UI logic ...
  // Keeping the rest as is for brevity, they will default in UI if fields missing.
  {
    id: 204,
    name: "Urban Vault HSR",
    city: "Bangalore",
    location: "HSR Layout",
    type: "managed",
    price: 45000,
    seats: 10,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Private Entry", "Pantry"],
    description: "Standalone building option for complete privacy."
  },
  {
    id: 205,
    name: "IndiQube Alpha",
    city: "Bangalore",
    location: "Marathahalli",
    type: "managed",
    price: 60000,
    seats: 15,
    rating: 4.2,
    images: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Transport Service", "Food Court"],
    description: "Campus-style managed office with employee transport."
  },
  {
    id: 206,
    name: "Awfis Gold",
    city: "Hyderabad",
    location: "Banjara Hills",
    type: "managed",
    price: 70000,
    seats: 12,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Gold Standard Service", "Lounge"],
    description: "Ultra-luxury managed suites for VIPs."
  },

  // ===================================
  // ENTERPRISE SOLUTIONS (Type: enterprise)
  // ===================================
  {
    id: 301,
    name: "Embassy Tech Village",
    city: "Bangalore",
    location: "ORR",
    type: "enterprise",
    price: 500000,
    seats: 100,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Campus", "Helipad"],
    description: "Large scale campus solution for MNCs."
  },
  {
    id: 302,
    name: "DLF Cyber Park",
    city: "Delhi",
    location: "Gurgaon",
    type: "enterprise",
    price: 450000,
    seats: 150,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Retail Plaza", "Gym"],
    description: "Integrated business district for headquarters."
  },
  {
    id: 303,
    name: "Mindspace Malad",
    city: "Mumbai",
    location: "Malad",
    type: "enterprise",
    price: 300000,
    seats: 80,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Recreation Zone", "Parking"],
    description: "Cost-effective enterprise spaces in Mumbai suburbs."
  },
  {
    id: 304,
    name: "Prestige Tech Park",
    city: "Bangalore",
    location: "Marathahalli",
    type: "enterprise",
    price: 400000,
    seats: 120,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Auditorium", "Sports Complex"],
    description: "Tech-focused park with world-class amenities."
  },
  {
    id: 305,
    name: "One BKC",
    city: "Mumbai",
    location: "BKC",
    type: "enterprise",
    price: 800000,
    seats: 100,
    rating: 5.0,
    images: ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"],
    amenities: ["High Security", "Fine Dining"],
    description: "The most prestigious business address in India."
  },

  // ===================================
  // DAY PASSES (Type: day-pass)
  // ===================================
  {
    id: 401,
    name: "WeWork Day Pass",
    city: "Bangalore",
    location: "Galaxy, Residency Rd",
    type: "day-pass",
    price: 800,
    seats: 1,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800"],
    amenities: ["WiFi", "Unlimited Coffee"],
    description: "Access any open desk/lounge area for the day."
  },
  {
    id: 402,
    name: "Bhive Day Pass",
    city: "Bangalore",
    location: "HSR Layout",
    type: "day-pass",
    price: 450,
    seats: 1,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800"],
    amenities: ["High Speed Internet", "Community Access"],
    description: "Affordable productivity for digital nomads."
  },
  {
    id: 403,
    name: "Awfis Flexi Pass",
    city: "Delhi",
    location: "Connaught Place",
    type: "day-pass",
    price: 550,
    seats: 1,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Meeting Room Credits", "Hot Desk"],
    description: "Flexible access across Delhi NCR centers."
  },
  {
    id: 404,
    name: "91Springboard Day Access",
    city: "Mumbai",
    location: "Andheri East",
    type: "day-pass",
    price: 600,
    seats: 1,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Networking Events", "Pantry"],
    description: "Join the community for a day."
  },
  {
    id: 405,
    name: "GoWork Day Pass",
    city: "Delhi",
    location: "Gurgaon",
    type: "day-pass",
    price: 350,
    seats: 1,
    rating: 4.2,
    images: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Shuttle Service", "Big Campus"],
    description: "Experience the world's largest coworking campus."
  },
  {
    id: 406,
    name: "MyBranch Day Pass",
    city: "Hyderabad",
    location: "Banjara Hills",
    type: "day-pass",
    price: 400,
    seats: 1,
    rating: 4.1,
    images: ["https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Basic WiFi", "Desk"],
    description: "Simple, no-frills workspace for focused work."
  },

  // ===================================
  // PRIVATE OFFICES (Type: private)
  // ===================================
  {
    id: 501,
    name: "Regus Private Suite",
    city: "Bangalore",
    location: "UB City",
    type: "private",
    price: 45000,
    seats: 4,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Prestige Address", "Secretary"],
    description: "Global standard private offices in Bangalore's luxury landmark."
  },
  {
    id: 502,
    name: "WeWork Private Cabin",
    city: "Mumbai",
    location: "Vikhroli",
    type: "private",
    price: 35000,
    seats: 5,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Sound Proof", "Glass Walls"],
    description: "Modern glass cabins perfect for small teams."
  },
  {
    id: 503,
    name: "Innov8 Office",
    city: "Delhi",
    location: "Saket",
    type: "private",
    price: 28000,
    seats: 3,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Mall Access", "Ergonomic Chairs"],
    description: "Stylish private offices inside Select Citywalk mall."
  },
  {
    id: 504,
    name: "ClayWorks Office",
    city: "Bangalore",
    location: "JP Nagar",
    type: "private",
    price: 22000,
    seats: 4,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Terrace", "Showers"],
    description: "Private office in a boutique building with charm."
  },
  {
    id: 505,
    name: "Dextrus Cabin",
    city: "Mumbai",
    location: "Lower Parel",
    type: "private",
    price: 60000,
    seats: 6,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1517502884422-41e157d5ed93?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Sea View", "Premium Coffee"],
    description: "High-end cabins with breathtaking views."
  },
  {
    id: 506,
    name: "Smartworks Cabin",
    city: "Hyderabad",
    location: "Hitech City",
    type: "private",
    price: 40000,
    seats: 8,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Gaming", "Gym"],
    description: "Spacious private offices for tech teams."
  },

  // ===================================
  // BUILT-TO-SUIT OFFICES (Type: built-to-suit)
  // ===================================
  {
    id: 601,
    name: "Bagmane Compel",
    city: "Bangalore",
    location: "Mahadevapura",
    type: "built-to-suit",
    price: 1500000,
    seats: 500,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Custom Layout", "Dedicated Entrance"],
    description: "Fully customizable building for large enterprises."
  },
  {
    id: 602,
    name: "RMZ Ecoworld Block 3",
    city: "Bangalore",
    location: "Bellandur",
    type: "built-to-suit",
    price: 1200000,
    seats: 300,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Lakeside", "Food Court"],
    description: "Shell space ready for YOUR interior design."
  },
  {
    id: 603,
    name: "DLF Cyber City Tower 8",
    city: "Delhi",
    location: "Gurgaon",
    type: "built-to-suit",
    price: 2000000,
    seats: 600,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Metro Connected", "LEED Platinum"],
    description: "Green building ready for custom fitouts."
  },
  {
    id: 604,
    name: "K Raheja Mindspace",
    city: "Hyderabad",
    location: "Madhapur",
    type: "built-to-suit",
    price: 900000,
    seats: 250,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Campus Feel", "Ample Parking"],
    description: "Custom office solutions in the IT heart of Hyderabad."
  },
  {
    id: 605,
    name: "Godrej One",
    city: "Mumbai",
    location: "Vikhroli",
    type: "built-to-suit",
    price: 1100000,
    seats: 300,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Mangroves View", "Sustainable"],
    description: "Eco-friendly built-to-suit options."
  },

  // ===================================
  // MEETING ROOMS (Type: meeting)
  // ===================================
  {
    id: 701,
    name: "Boardroom @ WeWork",
    city: "Bangalore",
    location: "Residency Road",
    type: "meeting",
    price: 3000,
    seats: 12,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Video Conf", "Catering"],
    description: "Premium boardroom for high-stakes meetings."
  },
  {
    id: 702,
    name: "Huddle Room",
    city: "Mumbai",
    location: "Andheri",
    type: "meeting",
    price: 1000,
    seats: 4,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1517502884422-41e157d5ed93?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Whiteboard", "TV"],
    description: "Small room for quick syncs and interviews."
  },
  {
    id: 703,
    name: "Training Room",
    city: "Delhi",
    location: "Nehru Place",
    type: "meeting",
    price: 5000,
    seats: 30,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800"],
    amenities: ["Projector", "Classroom Style"],
    description: "Ideal for workshops and training sessions."
  }
];

export default workspaces;