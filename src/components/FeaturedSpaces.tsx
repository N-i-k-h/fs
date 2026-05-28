import OfficeCard from "@/components/OfficeCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const FeaturedSpaces = () => {
  const navigate = useNavigate();
  const [offices, setOffices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await axios.get("/api/feature-bids/featured");
        if (res.data && res.data.length > 0) {
          setOffices(res.data.slice(0, 6));
        }
      } catch (err) {
        console.error("Error fetching featured spaces:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, []);

  if (loading || offices.length === 0) {
    return null;
  }

  return (
    <section id="featured" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-4">
            Handpicked Workspaces
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
              key={office.id || office._id}
              className="min-w-[280px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden snap-center"
              onClick={() => navigate(`/space/${office.id || office._id}`)}
            >
              <div className="h-40 relative">
                <img src={office.images?.[0] || office.image} alt={office.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-teal shadow-sm">
                  ₹{office.price?.toLocaleString()}/mo
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
            <OfficeCard key={office.id || office._id} {...office} id={office.id || office._id} image={office.images?.[0] || office.image} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpaces;
