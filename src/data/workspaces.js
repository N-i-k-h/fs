export const workspaces = [
  // =================================================================
  // BANGALORE (Koramangala, Indiranagar, HSR, Whitefield, MG Road)
  // =================================================================

  // 1. The "Budget Private Office"
  {
    id: 1,
    description: "A vibrant startup hub located in the heart of Koramangala. Perfect for small teams looking for energy and collaboration.",
    name: "Startup Den Koramangala",
    city: "Bangalore",
    location: "Koramangala",
    type: "private-office",
    price: 8500,        // < 10k
    seats: 4,           // 1-5
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", // Main: People working
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800", // Bright office
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800"  // Meeting area
    ],
    amenities: ["WiFi", "Coffee", "24/7 Access"]
  },
  // 2. Mid-Range Dedicated Desk
  {
    id: 2,
    description: "Modern dedicated desks in a premium setting. Ideal for freelancers and remote workers who need a professional environment.",
    name: "IndiQube Gamma",
    city: "Bangalore",
    location: "Koramangala",
    type: "dedicated-desk",
    price: 12000,       // 10k-20k
    seats: 30,          // 20+
    rating: 4.2,
    images: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800", // Main: Glass office
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800", // Open desk area
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800"  // Reception
    ],
    amenities: ["Gym", "Food Court"]
  },
  // 3. Luxury Team Office
  {
    id: 3,
    description: "Luxury private offices with state-of-the-art amenities. Designed for established companies valuing prestige and comfort.",
    name: "WeWork Prestige",
    city: "Bangalore",
    location: "MG Road",
    type: "private-office",
    price: 65000,       // 50k+
    seats: 15,          // 11-20
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=80&w=800", // Main: Luxury Interior
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", // Wide open space
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800", // Executive cabin
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"  // Lounge
    ],
    amenities: ["Concierge", "Valet", "Premium Lounge"]
  },
  // 4. Standard Hot Desk
  {
    id: 4,
    description: "A bustling hot desk area in HSR Layout. great for networking and meeting like-minded entrepreneurs.",
    name: "Bhive HSR Sector 6",
    city: "Bangalore",
    location: "HSR Layout",
    type: "hot-desk",
    price: 6500,        // < 10k
    seats: 100,         // 20+
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800", // Main: Busy workspace
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800", // Group working
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&q=80&w=800"  // Desk row
    ],
    amenities: ["Tea/Coffee", "Printer"]
  },
  // 5. Small Meeting Room
  {
    id: 5,
    description: "Compact and efficient meeting room equipped with whiteboard and projector. Suitable for quick team syncs and interviews.",
    name: "CoWrks Indiranagar",
    city: "Bangalore",
    location: "Indiranagar",
    type: "meeting-room",
    price: 1500,        // < 10k
    seats: 6,           // 6-10
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1517502884422-41e157d5ed93?auto=format&fit=crop&q=80&w=800", // Main: Meeting room
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=800", // Conference table
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"  // Presentation area
    ],
    amenities: ["Projector", "Whiteboard"]
  },
  // 6. Large Meeting Room
  {
    id: 6,
    description: "Spacious meeting room with video conferencing facilities. Perfect for board meetings and client presentations.",
    name: "91Springboard 7th Block",
    city: "Bangalore",
    location: "Koramangala",
    type: "meeting-room",
    price: 3500,        // < 10k
    seats: 15,          // 11-20
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", // Main: Large room
      "https://images.unsplash.com/photo-1556761175-4b46a89116bc?auto=format&fit=crop&q=80&w=800", // Collaborative space
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800"  // Boardroom
    ],
    amenities: ["Video Conf", "Catering"]
  },
  // 7. Tech Park Desk
  {
    id: 7,
    description: "Professional dedicated desks in the IT hub of Whitefield. Surrounded by tech parks and major corporate offices.",
    name: "Urban Vault Whitefield",
    city: "Bangalore",
    location: "Whitefield",
    type: "dedicated-desk",
    price: 9500,        // < 10k
    seats: 50,          // 20+
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800", // Main: Modern office
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", // Building Exterior
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"  // Desks
    ],
    amenities: ["Parking", "Cafeteria"]
  },
  // 8. Virtual Office
  {
    id: 8,
    description: "Prestigious virtual office address on MG Road. Includes mail handling and reception services for your business registration.",
    name: "Regus Barton Centre",
    city: "Bangalore",
    location: "MG Road",
    type: "virtual-office",
    price: 2500,        // < 10k
    seats: 0,           // 0 seats
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=800", // Main: Reception
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", // Lobby
      "https://images.unsplash.com/photo-1556761175-4b46a89116bc?auto=format&fit=crop&q=80&w=800"  // Signage area
    ],
    amenities: ["Mailing Address", "Reception"]
  },
  // 9. Premium Private Office
  {
    id: 9,
    description: "High-end private cabins in Indiranagar. Features wellness rooms and a swimming pool for a balanced work-life experience.",
    name: "WeWork Galaxy",
    city: "Bangalore",
    location: "Indiranagar",
    type: "private-office",
    price: 45000,       // 20k-50k
    seats: 10,          // 6-10
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800", // Main: Bright
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800", // Fancy furniture
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"  // Glass cabin
    ],
    amenities: ["Wellness Room", "Pool"]
  },
  // 10. Mid-sized Office
  {
    id: 10,
    description: "Cozy mid-sized office with a beautiful terrace garden. A calm and creative space for growing teams.",
    name: "ClayWorks JP Nagar",
    city: "Bangalore",
    location: "HSR Layout",
    type: "private-office",
    price: 18000,       // 10k-20k
    seats: 6,           // 6-10
    rating: 4.1,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800", // Terrace
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800"  // Cabin
    ],
    amenities: ["Terrace Garden"]
  },

  // =================================================================
  // MUMBAI (Bandra, Andheri, Powai, Lower Parel, BKC)
  // =================================================================

  // 11. Cheap Hot Desk
  {
    id: 11,
    description: "Affordable hot desks in Andheri near the Metro. A popular choice for digital nomads and early-stage startups.",
    name: "91Springboard Andheri",
    city: "Mumbai",
    location: "Andheri",
    type: "hot-desk",
    price: 8000,        // < 10k
    seats: 120,         // 20+
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800", // Open desk
      "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800"  // Detail
    ],
    amenities: ["Metro Access"]
  },
  // 12. Ultra Luxury Office
  {
    id: 12,
    description: "Ultra-luxury office suites in BKC using premium materials. Offers concierge services, gym, and spa access.",
    name: "WeWork BKC One",
    city: "Mumbai",
    location: "BKC",
    type: "private-office",
    price: 85000,       // 50k+
    seats: 12,          // 11-20
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=80&w=800", // Lobby
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"  // Modern team
    ],
    amenities: ["Bar", "Gym", "Spa"]
  },
  // 13. Creative Studio
  {
    id: 13,
    description: "Creative studio space in Bandra with inspiring sea views. tailored for design agencies and media professionals.",
    name: "Redbrick Bandra",
    city: "Mumbai",
    location: "Bandra",
    type: "private-office",
    price: 35000,       // 20k-50k
    seats: 4,           // 1-5
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", // Creative
      "https://images.unsplash.com/photo-1534190239940-9ba8944ea261?auto=format&fit=crop&q=80&w=800"  // View
    ],
    amenities: ["Sea View", "WiFi"]
  },
  // 14. Lake View Desk
  {
    id: 14,
    description: "Scenic dedicated desks overlooking Powai Lake. A peaceful and productive environment away from the city noise.",
    name: "Awfis Powai",
    city: "Mumbai",
    location: "Powai",
    type: "dedicated-desk",
    price: 13000,       // 10k-20k
    seats: 25,          // 20+
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800", // Workspace
      "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?auto=format&fit=crop&q=80&w=800"  // Coffee area
    ],
    amenities: ["Lake View"]
  },
  // 15. Corporate Suite
  {
    id: 15,
    description: "Corporate suites in Lower Parel's business district. Includes expansive lounge areas and ample parking.",
    name: "Mosaic Lower Parel",
    city: "Mumbai",
    location: "Lower Parel",
    type: "private-office",
    price: 48000,       // 20k-50k
    seats: 10,          // 6-10
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800", // Meeting room
      "https://images.unsplash.com/photo-1556761175-4b46a89116bc?auto=format&fit=crop&q=80&w=800"  // Lounge
    ],
    amenities: ["Lounge", "Parking"]
  },
  // 16. BKC Virtual
  {
    id: 16,
    description: "Virtual office solution in the financial heart of Mumbai (BKC). Establish a premium presence instantly.",
    name: "The Hive BKC",
    city: "Mumbai",
    location: "BKC",
    type: "virtual-office",
    price: 6000,        // < 10k
    seats: 0,
    rating: 4.2,
    images: [
      "https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=800", // Reception
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", // Building
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"  // Interior
    ],
    amenities: ["Mail Handling"]
  },
  // 17. Meeting Room
  {
    id: 17,
    description: "Premium meeting room in Lower Parel with high-speed internet and catering options. Ideal for client pitches.",
    name: "Dextrus Lower Parel",
    city: "Mumbai",
    location: "Lower Parel",
    type: "meeting-room",
    price: 4000,        // < 10k
    seats: 8,           // 6-10
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1517502884422-41e157d5ed93?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=800", // Table
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800"  // Coffee
    ],
    amenities: ["Premium Coffee"]
  },

  // =================================================================
  // DELHI (Connaught Place, Saket, Nehru Place, Hauz Khas, Dwarka)
  // =================================================================

  // 18. Budget Meeting Room
  {
    id: 18,
    description: "Budget-friendly meeting space in Connaught Place. centrally located and accessible, perfect for quick consultations.",
    name: "Innov8 Cyber Hub",
    city: "Delhi",
    location: "Connaught Place",
    type: "meeting-room",
    price: 2500,        // < 10k
    seats: 10,          // 6-10
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1556761175-4b46a89116bc?auto=format&fit=crop&q=80&w=800", // Side view
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"  // Chairs
    ],
    amenities: ["Projector"]
  },
  // 19. Central Desk
  {
    id: 19,
    description: "Central dedicated desks in CP with excellent metro connectivity. vibrant community of professionals.",
    name: "Awfis Connaught Place",
    city: "Delhi",
    location: "Connaught Place",
    type: "dedicated-desk",
    price: 14000,       // 10k-20k
    seats: 40,          // 20+
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", // Team
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&q=80&w=800"  // Desks
    ],
    amenities: ["Metro Access"]
  },
  // 20. Affordable Office
  {
    id: 20,
    description: "Affordable private offices in Nehru Place. Includes essential IT support and infrastructure for tech teams.",
    name: "91Springboard Nehru Place",
    city: "Delhi",
    location: "Nehru Place",
    type: "private-office",
    price: 28000,       // 20k-50k
    seats: 6,           // 6-10
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800", // Cabin
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"  // Detail
    ],
    amenities: ["IT Support"]
  },
  // 21. Luxury Mall Office
  {
    id: 21,
    description: "Luxury office space within a premium mall in Saket. combines work with world-class dining and shopping access.",
    name: "CoWrks Saket",
    city: "Delhi",
    location: "Saket",
    type: "private-office",
    price: 52000,       // 50k+
    seats: 18,          // 11-20
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", // Wide
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"  // Lounge
    ],
    amenities: ["Mall Access"]
  },
  // 22. Social Hub
  {
    id: 22,
    description: "Social hub and coworking space in Hauz Khas. Features a cafe and bar setting for a relaxed work culture.",
    name: "Social Hauz Khas",
    city: "Delhi",
    location: "Hauz Khas",
    type: "hot-desk",
    price: 6000,        // < 10k
    seats: 60,          // 20+
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800", // Cafe style
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"  // People
    ],
    amenities: ["Cafe", "Bar"]
  },
  // 23. Suburb Office
  {
    id: 23,
    description: "Quiet suburb office in Dwarka. Offers a distraction-free environment with easy parking.",
    name: "GoHive Dwarka",
    city: "Delhi",
    location: "Dwarka",
    type: "private-office",
    price: 18000,       // 10k-20k
    seats: 4,           // 1-5
    rating: 4.1,
    images: [
      "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800", // Desk
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"  // Outside
    ],
    amenities: ["Parking"]
  },

  // =================================================================
  // HYDERABAD (Hitech City, Gachibowli, Jubilee Hills, Banjara Hills, Madhapur)
  // =================================================================

  // 24. Tech Hub Office
  {
    id: 24,
    description: "Tech-focused office in Hitech City with modern amenities. Includes access to a gym and ergonomic furniture.",
    name: "CoWrks Hitech City",
    city: "Hyderabad",
    location: "Hitech City",
    type: "private-office",
    price: 35000,       // 20k-50k
    seats: 12,          // 11-20
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800", // Office
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"  // Tech
    ],
    amenities: ["Gym"]
  },
  // 25. Budget Desk
  {
    id: 25,
    description: "Budget dedicated desks in Gachibowli. A large open floor plan fostering collaboration among startups.",
    name: "Awfis Gachibowli",
    city: "Hyderabad",
    location: "Gachibowli",
    type: "dedicated-desk",
    price: 8500,        // < 10k
    seats: 50,          // 20+
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800", // Desks
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800"  // Cafe
    ],
    amenities: ["Cafeteria"]
  },
  // 26. Premium Villa Office
  {
    id: 26,
    description: "Exquisite villa office in Jubilee Hills. Features private gardens and luxurious lounges for VIP meetings.",
    name: "Rent A Desk Jubilee Hills",
    city: "Hyderabad",
    location: "Jubilee Hills",
    type: "private-office",
    price: 60000,       // 50k+
    seats: 15,          // 11-20
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800", // Garden view
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"  // Lounge
    ],
    amenities: ["Garden", "Lounge"]
  },
  // 27. Small Meeting Room
  {
    id: 27,
    description: "Compact meeting facility in Banjara Hills. Equipped with video conferencing gear for global calls.",
    name: "iSprout Banjara Hills",
    city: "Hyderabad",
    location: "Banjara Hills",
    type: "meeting-room",
    price: 2000,        // < 10k
    seats: 5,           // 1-5
    rating: 4.4,
    images: [
      "https://images.unsplash.com/photo-1517502884422-41e157d5ed93?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=800", // Table
      "https://images.unsplash.com/photo-1556761175-4b46a89116bc?auto=format&fit=crop&q=80&w=800"  // Presentation
    ],
    amenities: ["VC Facility"]
  },
  // 28. Large Hot Desk Area
  {
    id: 28,
    description: "Large scale hot desk area in Madhapur. Hosts regular networking events and has a massive event space.",
    name: "WeWork Krishe Emerald",
    city: "Hyderabad",
    location: "Madhapur",
    type: "hot-desk",
    price: 11500,       // 10k-20k
    seats: 200,         // 20+
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", // Wide
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"  // People
    ],
    amenities: ["Event Space"]
  },
  // 29. Start-up Pod
  {
    id: 29,
    description: "Incubator-style startup pods in Madhapur. offers mentorship opportunities and 24/7 access.",
    name: "Hatch Station",
    city: "Hyderabad",
    location: "Madhapur",
    type: "private-office",
    price: 15000,       // 10k-20k
    seats: 4,           // 1-5
    rating: 4.2,
    images: [
      "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", // People
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800"  // Small room
    ],
    amenities: ["24/7 Access"]
  },

  // =================================================================
  // EDGE CASES (Mixing Categories for robustness)
  // =================================================================
  {
    id: 30,
    description: "A rare budget private office in Indiranagar. Minimalist design focused on productivity.",
    name: "Budget Pod Indiranagar",
    city: "Bangalore",
    location: "Indiranagar",
    type: "private-office",
    price: 9000,        // < 10k Private Office (Rare!)
    seats: 2,           // 1-5
    rating: 4.0,
    images: [
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800", // Desk
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"  // Detail
    ],
    amenities: ["WiFi Only"]
  },
  {
    id: 31,
    description: "Exclusive luxury dedicated desk in Whitefield. Includes butler service and premium privacy.",
    name: "Luxury Desk Whitefield",
    city: "Bangalore",
    location: "Whitefield",
    type: "dedicated-desk",
    price: 22000,       // 20k-50k (Expensive Desk)
    seats: 1,           // 1-5
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800", // Main
      "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=80&w=800", // Lobby
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"  // High end
    ],
    amenities: ["Butler Service"]
  }
];

export default workspaces;