import { useState, useEffect, useRef } from "react";
import { Heart, MapPin, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface OfficeCardProps {
  id: string;
  image: string;
  name: string;
  location: string;
  price: number;
  seats: number;
  availableSeats?: number;
  isFeatured?: boolean;
  video?: string;
  type?: string;
  rating?: number;
}

const getImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;

  // Normalize slashes for Windows paths
  const cleanUrl = url.replace(/\\/g, '/');
  return `http://localhost:5000${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
};

const OfficeCard = ({ id, image, name, location, price, seats, availableSeats, isFeatured, video, type, rating }: OfficeCardProps) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem("savedSpaces") || "[]");
    setIsSaved(savedIds.includes(String(id)) || savedIds.includes(Number(id)));
  }, [id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const savedIds = JSON.parse(localStorage.getItem("savedSpaces") || "[]");
    const strId = String(id);
    const numId = Number(id);

    let newSavedIds;
    if (isSaved) {
      newSavedIds = savedIds.filter((sid: any) => String(sid) !== strId && Number(sid) !== numId);
    } else {
      newSavedIds = [...savedIds, id];
    }

    localStorage.setItem("savedSpaces", JSON.stringify(newSavedIds));
    setIsSaved(!isSaved);
    window.dispatchEvent(new Event('savedSpacesUpdated'));
  };

  const [isHovered, setIsHovered] = useState(false);

  // Calculate vacancy percentage
  const vacancyPercentage = availableSeats && seats
    ? Math.round((availableSeats / seats) * 100)
    : 0;

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/space/${id}`)}
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={getImageUrl(image) || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {type && (
            <Badge className="bg-[#002b4d] text-white hover:bg-[#002b4d] text-[10px] uppercase font-bold tracking-wider rounded-sm px-2 py-0.5 shadow-sm">
              {type.replace("-", " ")}
            </Badge>
          )}
          <Badge className="bg-teal text-white hover:bg-teal text-[10px] uppercase font-bold tracking-wider rounded-sm px-2 py-0.5 shadow-sm flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" /> VERIFIED
          </Badge>
        </div>

        {/* Heart Button */}
        <button
          onClick={toggleSave}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 ${isSaved ? "bg-red-50 text-red-500" : "bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white"
            }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>

        {/* Hover Overlay with Micro-Market Details */}
        <div className={`absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/90 to-navy/70 backdrop-blur-sm transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-10 flex flex-col justify-end p-4`}>
          <div className="space-y-2 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-white/20" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-teal">Market Insights</span>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <p className="text-[9px] text-white/60 uppercase tracking-wide font-semibold mb-0.5">Micro Market</p>
                <p className="font-bold text-white truncate">{location || 'Central Bangalore'}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <p className="text-[9px] text-white/60 uppercase tracking-wide font-semibold mb-0.5">Center Name</p>
                <p className="font-bold text-white truncate">{name}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <p className="text-[9px] text-white/60 uppercase tracking-wide font-semibold mb-0.5">Available Seats</p>
                <p className="font-bold text-teal">{availableSeats || seats} / {seats}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <p className="text-[9px] text-white/60 uppercase tracking-wide font-semibold mb-0.5">Price Range</p>
                <p className="font-bold text-white">₹{price.toLocaleString()}<span className="text-[9px] text-white/60">/seat</span></p>
              </div>
            </div>

            {vacancyPercentage > 0 && (
              <div className="bg-teal/20 backdrop-blur-sm rounded-lg p-2 border border-teal/30 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-white/80 uppercase tracking-wide font-semibold">Vacancy</span>
                  <span className="font-bold text-teal text-sm">{vacancyPercentage}%</span>
                </div>
                <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full transition-all duration-500" style={{ width: `${vacancyPercentage}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-navy text-lg leading-tight line-clamp-1 group-hover:text-teal transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
          {rating && (
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-700 text-xs font-bold">
              <span>{rating}</span>
              <Star className="w-3 h-3 fill-current" />
            </div>
          )}
        </div>

        {/* Amenities / Features Badges (Simulated) */}
        <div className="flex gap-2 mt-2">
          <div className="bg-gray-50 text-gray-600 text-[10px] px-2 py-1 rounded-sm font-medium flex items-center gap-1">
            24/7 Access
          </div>
          <div className="bg-gray-50 text-gray-600 text-[10px] px-2 py-1 rounded-sm font-medium flex items-center gap-1">
            Parking
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-100 gap-2">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Starting Price</p>
            <div className="flex items-baseline gap-1">
              <span className="text-navy font-bold text-lg">₹{price.toLocaleString()}</span>
              <span className="text-gray-400 text-[10px]">/seat</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-[110px] shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] border-teal text-teal hover:bg-teal hover:text-white w-full rounded-md font-semibold"
              onClick={(e) => { e.stopPropagation(); navigate(`/space/${id}?action=tour`); }}
            >
              Schedule Tour
            </Button>
            <Button
              size="sm"
              className="h-8 text-[11px] bg-[#002b4d] hover:bg-teal text-white w-full rounded-md shadow-sm transition-colors font-semibold"
              onClick={(e) => { e.stopPropagation(); navigate(`/quote/${id}`); }}
            >
              Get Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeCard;
