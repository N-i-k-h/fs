export const workspaces = [
    // =================================================================
    // BANGALORE (Koramangala, Indiranagar, HSR, Whitefield, MG Road)
    // =================================================================
    
    // 1. The "Budget Private Office" (Your specific request)
    {
      id: 1,
      name: "Startup Den Koramangala",
      city: "Bangalore",
      location: "Koramangala",
      type: "private-office",
      price: 8500,        // < 10k
      seats: 4,           // 1-5
      rating: 4.8,
      images: ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"],
      amenities: ["WiFi", "Coffee", "24/7 Access"]
    },
    // 2. Mid-Range Dedicated Desk
    {
      id: 2,
      name: "IndiQube Gamma",
      city: "Bangalore",
      location: "Koramangala",
      type: "dedicated-desk",
      price: 12000,       // 10k-20k
      seats: 30,          // 20+
      rating: 4.2,
      images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Gym", "Food Court"]
    },
    // 3. Luxury Team Office
    {
      id: 3,
      name: "WeWork Prestige",
      city: "Bangalore",
      location: "MG Road",
      type: "private-office",
      price: 65000,       // 50k+
      seats: 15,          // 11-20
      rating: 4.9,
      images: ["https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Concierge", "Valet", "Premium Lounge"]
    },
    // 4. Standard Hot Desk
    {
      id: 4,
      name: "Bhive HSR Sector 6",
      city: "Bangalore",
      location: "HSR Layout",
      type: "hot-desk",
      price: 6500,        // < 10k
      seats: 100,         // 20+
      rating: 4.4,
      images: ["https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Tea/Coffee", "Printer"]
    },
    // 5. Small Meeting Room
    {
      id: 5,
      name: "CoWrks Indiranagar",
      city: "Bangalore",
      location: "Indiranagar",
      type: "meeting-room",
      price: 1500,        // < 10k
      seats: 6,           // 6-10
      rating: 4.7,
      images: ["https://images.unsplash.com/photo-1517502884422-41e157d5ed93?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Projector", "Whiteboard"]
    },
    // 6. Large Meeting Room
    {
      id: 6,
      name: "91Springboard 7th Block",
      city: "Bangalore",
      location: "Koramangala",
      type: "meeting-room",
      price: 3500,        // < 10k
      seats: 15,          // 11-20
      rating: 4.5,
      images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Video Conf", "Catering"]
    },
    // 7. Tech Park Desk
    {
      id: 7,
      name: "Urban Vault Whitefield",
      city: "Bangalore",
      location: "Whitefield",
      type: "dedicated-desk",
      price: 9500,        // < 10k
      seats: 50,          // 20+
      rating: 4.3,
      images: ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Parking", "Cafeteria"]
    },
    // 8. Virtual Office
    {
      id: 8,
      name: "Regus Barton Centre",
      city: "Bangalore",
      location: "MG Road",
      type: "virtual-office",
      price: 2500,        // < 10k
      seats: 0,           // 0 seats
      rating: 4.3,
      images: ["https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Mailing Address", "Reception"]
    },
    // 9. Premium Private Office
    {
      id: 9,
      name: "WeWork Galaxy",
      city: "Bangalore",
      location: "Indiranagar",
      type: "private-office",
      price: 45000,       // 20k-50k
      seats: 10,          // 6-10
      rating: 4.8,
      images: ["https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Wellness Room", "Pool"]
    },
    // 10. Mid-sized Office
    {
      id: 10,
      name: "ClayWorks JP Nagar",
      city: "Bangalore",
      location: "HSR Layout",
      type: "private-office",
      price: 18000,       // 10k-20k
      seats: 6,           // 6-10
      rating: 4.1,
      images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Terrace Garden"]
    },
  
    // =================================================================
    // MUMBAI (Bandra, Andheri, Powai, Lower Parel, BKC)
    // =================================================================
    
    // 11. Cheap Hot Desk
    {
      id: 11,
      name: "91Springboard Andheri",
      city: "Mumbai",
      location: "Andheri",
      type: "hot-desk",
      price: 8000,        // < 10k
      seats: 120,         // 20+
      rating: 4.5,
      images: ["https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Metro Access"]
    },
    // 12. Ultra Luxury Office
    {
      id: 12,
      name: "WeWork BKC One",
      city: "Mumbai",
      location: "BKC",
      type: "private-office",
      price: 85000,       // 50k+
      seats: 12,          // 11-20
      rating: 4.9,
      images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Bar", "Gym", "Spa"]
    },
    // 13. Creative Studio
    {
      id: 13,
      name: "Redbrick Bandra",
      city: "Mumbai",
      location: "Bandra",
      type: "private-office",
      price: 35000,       // 20k-50k
      seats: 4,           // 1-5
      rating: 4.6,
      images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Sea View", "WiFi"]
    },
    // 14. Lake View Desk
    {
      id: 14,
      name: "Awfis Powai",
      city: "Mumbai",
      location: "Powai",
      type: "dedicated-desk",
      price: 13000,       // 10k-20k
      seats: 25,          // 20+
      rating: 4.3,
      images: ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Lake View"]
    },
    // 15. Corporate Suite
    {
      id: 15,
      name: "Mosaic Lower Parel",
      city: "Mumbai",
      location: "Lower Parel",
      type: "private-office",
      price: 48000,       // 20k-50k
      seats: 10,          // 6-10
      rating: 4.7,
      images: ["https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Lounge", "Parking"]
    },
    // 16. BKC Virtual
    {
      id: 16,
      name: "The Hive BKC",
      city: "Mumbai",
      location: "BKC",
      type: "virtual-office",
      price: 6000,        // < 10k
      seats: 0,
      rating: 4.2,
      images: ["https://images.unsplash.com/photo-1664575602276-acd073f104c1?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Mail Handling"]
    },
    // 17. Meeting Room
    {
      id: 17,
      name: "Dextrus Lower Parel",
      city: "Mumbai",
      location: "Lower Parel",
      type: "meeting-room",
      price: 4000,        // < 10k
      seats: 8,           // 6-10
      rating: 4.8,
      images: ["https://images.unsplash.com/photo-1517502884422-41e157d5ed93?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Premium Coffee"]
    },
  
    // =================================================================
    // DELHI (Connaught Place, Saket, Nehru Place, Hauz Khas, Dwarka)
    // =================================================================
    
    // 18. Budget Meeting Room
    {
      id: 18,
      name: "Innov8 Cyber Hub",
      city: "Delhi",
      location: "Connaught Place",
      type: "meeting-room",
      price: 2500,        // < 10k
      seats: 10,          // 6-10
      rating: 4.9,
      images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Projector"]
    },
    // 19. Central Desk
    {
      id: 19,
      name: "Awfis Connaught Place",
      city: "Delhi",
      location: "Connaught Place",
      type: "dedicated-desk",
      price: 14000,       // 10k-20k
      seats: 40,          // 20+
      rating: 4.4,
      images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Metro Access"]
    },
    // 20. Affordable Office
    {
      id: 20,
      name: "91Springboard Nehru Place",
      city: "Delhi",
      location: "Nehru Place",
      type: "private-office",
      price: 28000,       // 20k-50k
      seats: 6,           // 6-10
      rating: 4.3,
      images: ["https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800"],
      amenities: ["IT Support"]
    },
    // 21. Luxury Mall Office
    {
      id: 21,
      name: "CoWrks Saket",
      city: "Delhi",
      location: "Saket",
      type: "private-office",
      price: 52000,       // 50k+
      seats: 18,          // 11-20
      rating: 4.7,
      images: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Mall Access"]
    },
    // 22. Social Hub
    {
      id: 22,
      name: "Social Hauz Khas",
      city: "Delhi",
      location: "Hauz Khas",
      type: "hot-desk",
      price: 6000,        // < 10k
      seats: 60,          // 20+
      rating: 4.8,
      images: ["https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Cafe", "Bar"]
    },
    // 23. Suburb Office
    {
      id: 23,
      name: "GoHive Dwarka",
      city: "Delhi",
      location: "Dwarka",
      type: "private-office",
      price: 18000,       // 10k-20k
      seats: 4,           // 1-5
      rating: 4.1,
      images: ["https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Parking"]
    },
  
    // =================================================================
    // HYDERABAD (Hitech City, Gachibowli, Jubilee Hills, Banjara Hills, Madhapur)
    // =================================================================
    
    // 24. Tech Hub Office
    {
      id: 24,
      name: "CoWrks Hitech City",
      city: "Hyderabad",
      location: "Hitech City",
      type: "private-office",
      price: 35000,       // 20k-50k
      seats: 12,          // 11-20
      rating: 4.8,
      images: ["https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Gym"]
    },
    // 25. Budget Desk
    {
      id: 25,
      name: "Awfis Gachibowli",
      city: "Hyderabad",
      location: "Gachibowli",
      type: "dedicated-desk",
      price: 8500,        // < 10k
      seats: 50,          // 20+
      rating: 4.3,
      images: ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Cafeteria"]
    },
    // 26. Premium Villa Office
    {
      id: 26,
      name: "Rent A Desk Jubilee Hills",
      city: "Hyderabad",
      location: "Jubilee Hills",
      type: "private-office",
      price: 60000,       // 50k+
      seats: 15,          // 11-20
      rating: 4.9,
      images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Garden", "Lounge"]
    },
    // 27. Small Meeting Room
    {
      id: 27,
      name: "iSprout Banjara Hills",
      city: "Hyderabad",
      location: "Banjara Hills",
      type: "meeting-room",
      price: 2000,        // < 10k
      seats: 5,           // 1-5
      rating: 4.4,
      images: ["https://images.unsplash.com/photo-1517502884422-41e157d5ed93?auto=format&fit=crop&q=80&w=800"],
      amenities: ["VC Facility"]
    },
    // 28. Large Hot Desk Area
    {
      id: 28,
      name: "WeWork Krishe Emerald",
      city: "Hyderabad",
      location: "Madhapur",
      type: "hot-desk",
      price: 11500,       // 10k-20k
      seats: 200,         // 20+
      rating: 4.7,
      images: ["https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Event Space"]
    },
    // 29. Start-up Pod
    {
      id: 29,
      name: "Hatch Station",
      city: "Hyderabad",
      location: "Madhapur",
      type: "private-office",
      price: 15000,       // 10k-20k
      seats: 4,           // 1-5
      rating: 4.2,
      images: ["https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800"],
      amenities: ["24/7 Access"]
    },
  
    // =================================================================
    // EDGE CASES (Mixing Categories for robustness)
    // =================================================================
    {
      id: 30,
      name: "Budget Pod Indiranagar",
      city: "Bangalore",
      location: "Indiranagar",
      type: "private-office",
      price: 9000,        // < 10k Private Office (Rare!)
      seats: 2,           // 1-5
      rating: 4.0,
      images: ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"],
      amenities: ["WiFi Only"]
    },
    {
      id: 31,
      name: "Luxury Desk Whitefield",
      city: "Bangalore",
      location: "Whitefield",
      type: "dedicated-desk",
      price: 22000,       // 20k-50k (Expensive Desk)
      seats: 1,           // 1-5
      rating: 4.9,
      images: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"],
      amenities: ["Butler Service"]
    }
  ];
  
  export default workspaces;