import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import ChatBot from "@/components/ChatBot";
import heroBg from "@/assets/hero.png";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HeroSection = () => {
  const navigate = useNavigate();

  // State for filters
  const [location, setLocation] = useState("");
  const [microMarket, setMicroMarket] = useState("");
  const [price, setPrice] = useState("");

  const microMarkets = {
    bangalore: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "MG Road"],
    mumbai: ["Bandra", "Andheri", "Powai", "Lower Parel", "BKC"],
    delhi: ["Connaught Place", "Saket", "Nehru Place", "Hauz Khas", "Dwarka"],
    hyderabad: ["Hitech City", "Gachibowli", "Jubilee Hills", "Banjara Hills", "Madhapur"],
  };

  // Helper to safely format string to slug
  const toSlug = (str) => {
    return str ? str.toLowerCase().replace(/\s+/g, "-") : "";
  };

  // Handle City Change
  const handleLocationChange = (val) => {
    setLocation(val);
    setMicroMarket(""); 
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (microMarket) params.append("market", microMarket);
    if (price) params.append("price", price);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundPosition: "center 70%",
        }}
      >
        <div className="absolute inset-0 bg-navy/30 pointer-events-none" />
      </div>

      <div className="relative z-20 container mx-auto px-4 pt-20 pb-12 w-full">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 items-center max-w-7xl mx-auto">
          
          {/* 1. TEXT SECTION */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full lg:row-start-1 lg:col-start-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Find your perfect workspace <span className="text-teal">in seconds</span>
            </h1>
            <p className="text-lg md:text-xl text-white mb-0 lg:mb-6 font-light max-w-2xl mx-auto lg:mx-0">
              Let AI help you discover the ideal coworking space for your 
              team or search directly below.
            </p>
          </div>

          {/* 2. CHATBOT SECTION */}
          <div className="w-full flex justify-center lg:justify-end lg:row-start-1 lg:row-span-2 lg:col-start-2">
            <div className="w-full max-w-[80vw] lg:max-w-md overflow-x-hidden flex justify-center lg:justify-end">
              <ChatBot />
            </div>
          </div>

          {/* 3. SEARCH SECTION */}
          <div className="w-full lg:row-start-2 lg:col-start-1 relative isolate">
            {/* --- TEAL GLOW EFFECT --- */}
            <div 
              className="absolute -inset-3 bg-teal/40 rounded-[2rem] blur-3xl -z-10 opacity-80" 
              aria-hidden="true"
            />
            
            <div className="bg-white rounded-2xl shadow-xl shadow-teal/10 p-4 md:p-6 border border-teal/10 text-left relative">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <Search className="w-4 h-4 text-teal" />
                <h2 className="text-lg font-bold text-gray-900">Search Directly</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Location <span className="text-teal">*</span>
                  </label>
                  <Select onValueChange={handleLocationChange} value={location}>
                    <SelectTrigger className="w-full h-11 bg-gray-50 border-gray-200 text-gray-900 text-sm focus:ring-teal focus:border-teal">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900">
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Micro Market */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Micro Market <span className="text-teal">*</span>
                  </label>
                  <Select disabled={!location} onValueChange={setMicroMarket} value={microMarket}>
                    <SelectTrigger className="w-full h-11 bg-gray-50 border-gray-200 text-gray-900 text-sm focus:ring-teal focus:border-teal">
                      <SelectValue placeholder={location ? "Area" : "Select City"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900">
                      {location &&
                        microMarkets[location]?.map((area) => (
                          <SelectItem
                            key={area}
                            value={toSlug(area)}
                          >
                            {area}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Price Range <span className="text-teal">*</span>
                  </label>
                  <Select onValueChange={setPrice} value={price}>
                    <SelectTrigger className="w-full h-11 bg-gray-50 border-gray-200 text-gray-900 text-sm focus:ring-teal focus:border-teal">
                      <SelectValue placeholder="Budget" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900">
                      <SelectItem value="below-10k">&lt; ₹10k</SelectItem>
                      <SelectItem value="10k-20k">₹10k - ₹20k</SelectItem>
                      <SelectItem value="20k-50k">₹20k - ₹50k</SelectItem>
                      <SelectItem value="50k-plus">₹50k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div>
                  <Button
                    onClick={handleSearch}
                    variant="default" 
                    size="lg"
                    className="h-11 w-full rounded-xl font-bold text-sm shadow-lg bg-teal hover:bg-teal/90"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default HeroSection;