import { Heart, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OfficeCardProps {
  id: string;
  image: string;
  name: string;
  location: string;
  price: number;
  seats: number;
  isFeatured?: boolean;
}

const OfficeCard = ({ id, image, name, location, price, seats, isFeatured }: OfficeCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover-lift cursor-pointer border border-border/50">
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-teal text-accent-foreground text-xs font-bold rounded-full shadow-md">
            Featured
          </div>
        )}
        
        {/* Heart Button */}
        <button className="absolute top-3 right-3 w-9 h-9 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-all shadow-md hover:scale-110">
          <Heart className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-foreground text-lg mb-1.5 group-hover:text-teal transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 text-teal" />
          <span>{location}</span>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Users className="w-4 h-4" />
            <span>{seats} seats</span>
          </div>
          <div className="text-right">
            <span className="text-teal font-bold text-xl">₹{price.toLocaleString()}</span>
            <span className="text-muted-foreground text-xs">/seat</span>
          </div>
        </div>

        <Button 
          variant="teal" 
          className="w-full font-semibold" 
          size="default"
          onClick={() => navigate(`/space/${id}`)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default OfficeCard;
