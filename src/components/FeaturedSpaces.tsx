import OfficeCard from "@/components/OfficeCard";
import office1 from "@/assets/office-1.jpg";
import office2 from "@/assets/office-2.jpg";
import office3 from "@/assets/office-3.jpg";
import office4 from "@/assets/office-4.jpg";
import office5 from "@/assets/office-5.jpg";
import office6 from "@/assets/office-6.jpg";

// Import Videos
import vid1 from "@/assets/WhatsApp Video 2026-01-06 at 10.16.59 PM.mp4";
import vid2 from "@/assets/Office_Scene_Video_Generation.mp4";
import vid3 from "@/assets/manyathy1.mp4";
import vid4 from "@/assets/manyathy2.mp4";
import vid5 from "@/assets/Realistic_Coworking_Space_Video_Generation.mp4";
import vid6 from "@/assets/Hero_Section_Video_Prompt_Generation.mp4";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const FeaturedSpaces = () => {
  const navigate = useNavigate();
  const [offices, setOffices] = useState([]);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await axios.get("/api/spaces");
        // Limit to 6 for featured section, or filter by 'isFeatured' if property exists
        setOffices(res.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching featured spaces:", error);
      }
    };
    fetchSpaces();
  }, []);

  return (
    <section id="featured" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-4">
            Premium Workspaces
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Spaces
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore handpicked workspaces across Bengaluru's prime business districts.
          </p>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden flex overflow-x-auto pb-8 gap-4 snap-x no-scrollbar px-2 -mx-4 scroll-smooth">
          {offices.map((office: any) => (
            <div
              key={office.id}
              className="min-w-[280px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden snap-center"
              onClick={() => navigate(`/space/${office.id}`)}
            >
              <div className="h-40 relative">
                <img src={office.images?.[0] || office.image} alt={office.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-teal shadow-sm">
                  ₹{office.price.toLocaleString()}/mo
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-navy truncate">{office.name}</h3>
                <p className="text-sm text-gray-500 truncate mb-3">{office.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{office.seats} Seats</span>
                  <span className="text-teal text-sm font-bold">View</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offices.map((office: any) => (
            <OfficeCard key={office.id} {...office} image={office.images?.[0] || office.image} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpaces;
