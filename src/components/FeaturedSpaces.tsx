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

const offices = [
  { id: "1", image: office1, name: "CoWrks RMZ Ecoworld", location: "Bellandur, Bangalore", price: 13500, seats: 55, isFeatured: true, video: vid1 },
  { id: "2", image: office2, name: "WeWork Embassy Golf Links", location: "Koramangala, Bangalore", price: 18000, seats: 30, isFeatured: false, video: vid2 },
  { id: "3", image: office3, name: "Smartworks Outer Ring Road", location: "HSR Layout, Bangalore", price: 12000, seats: 45, isFeatured: true, video: vid3 },
  { id: "4", image: office4, name: "Awfis Whitefield", location: "Whitefield, Bangalore", price: 9500, seats: 20, isFeatured: false, video: vid4 },
  { id: "5", image: office5, name: "91Springboard Indiranagar", location: "Indiranagar, Bangalore", price: 15000, seats: 35, isFeatured: false, video: vid5 },
  { id: "6", image: office6, name: "Innov8 Brigade Road", location: "MG Road, Bangalore", price: 16500, seats: 25, isFeatured: true, video: vid6 },
];

import { useNavigate } from "react-router-dom";

const FeaturedSpaces = () => {
  const navigate = useNavigate();

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
            Explore our handpicked selection of premium coworking spaces across Bangalore
          </p>
        </div>

        {/* Mobile Horizontal Scroll */}
        <div className="md:hidden flex overflow-x-auto pb-8 gap-4 snap-x no-scrollbar px-2 -mx-4 scroll-smooth">
          {offices.map((office) => (
            <div
              key={office.id}
              className="min-w-[280px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden snap-center"
              onClick={() => navigate(`/space/${office.id}`)}
            >
              <div className="h-40 relative">
                <img src={office.image} alt={office.name} className="w-full h-full object-cover" />
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
          {offices.map((office) => (
            <OfficeCard key={office.id} {...office} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/search')}
            className="h-12 px-8 rounded-lg border-2 border-teal text-teal bg-transparent hover:bg-teal hover:text-accent-foreground font-semibold transition-all duration-300"
          >
            View All Spaces
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpaces;
