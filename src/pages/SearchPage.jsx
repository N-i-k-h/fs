import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import workspaces from "../data/workspaces";
import { Button } from "@/components/ui/button";
import { MapPin, Users, IndianRupee, ArrowRight, ImageOff, Search, ChevronDown, ChevronUp, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MICRO_MARKETS = {
  bangalore: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "MG Road"],
  mumbai: ["Bandra", "Andheri", "Powai", "Lower Parel", "BKC"],
  delhi: ["Connaught Place", "Saket", "Nehru Place", "Hauz Khas", "Dwarka"],
  hyderabad: ["Hitech City", "Gachibowli", "Jubilee Hills", "Banjara Hills", "Madhapur"],
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State for Results
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [suggestedSpaces, setSuggestedSpaces] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Local State for Filters
  const [selectedCity, setSelectedCity] = useState(searchParams.get("location") || "");
  const [selectedMarket, setSelectedMarket] = useState(searchParams.get("market") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "");
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get("price") || "");
  const [selectedSeats, setSelectedSeats] = useState(searchParams.get("seats") || "");

  // Sync state with URL when URL changes
  useEffect(() => {
    setSelectedCity(searchParams.get("location") || "");
    setSelectedMarket(searchParams.get("market") || "");
    setSelectedType(searchParams.get("type") || "");
    setSelectedPrice(searchParams.get("price") || "");
    setSelectedSeats(searchParams.get("seats") || "");
  }, [searchParams]);

  // --- FILTER LOGIC (UPDATED) ---
  useEffect(() => {
    const data = workspaces || [];

    // Get raw params
    const locParam = searchParams.get("location");
    const mktParam = searchParams.get("market");
    const typeParam = searchParams.get("type");
    const priceParam = searchParams.get("price");
    const seatsParam = searchParams.get("seats");

    // 1. EXACT MATCHES LOGIC
    // If a parameter is NULL/EMPTY, it means "Match Anything".
    // If it HAS VALUE, it must match.
    const exactMatches = data.filter((space) => {

      // City (Main Location)
      if (locParam && space.city.toLowerCase() !== locParam.toLowerCase()) return false;

      // Market: Fuzzy match on location string
      if (mktParam) {
        const spaceLoc = space.location.toLowerCase().replace(/[^a-z0-9]/g, '');
        const searchLoc = mktParam.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!spaceLoc.includes(searchLoc)) return false;
      }

      // Type
      if (typeParam && space.type !== typeParam) return false;

      // Price
      if (priceParam) {
        const p = space.price;
        if (priceParam === "below-10k" && p >= 10000) return false;
        if (priceParam === "10k-20k" && (p < 10000 || p > 20000)) return false;
        if (priceParam === "20k-50k" && (p < 20000 || p > 50000)) return false;
        if (priceParam === "50k-plus" && p <= 50000) return false;
      }

      // Seats
      if (seatsParam) {
        const s = parseInt(space.seats) || 0;
        if (seatsParam === "1-5" && s > 5) return false;
        if (seatsParam === "6-10" && (s < 6 || s > 10)) return false;
        if (seatsParam === "11-20" && (s < 11 || s > 20)) return false;
        if (seatsParam === "20-plus" && s < 20) return false;
      }

      return true;
    });

    setFilteredSpaces(exactMatches);

    // 2. SUGGESTIONS
    // Show other spaces in the same city if the specific filters yielded 0 results, 
    // or just generally suggest things in the same city.
    let suggestions = [];
    if (locParam) {
      suggestions = data.filter(space => {
        const isSameCity = space.city.toLowerCase() === locParam.toLowerCase();
        const isAlreadyShown = exactMatches.find(match => match.id === space.id);
        return isSameCity && !isAlreadyShown;
      });
    }
    setSuggestedSpaces(suggestions);

  }, [searchParams]);

  const handleUpdateSearch = () => {
    const params = new URLSearchParams();
    // Only append if they have a value. If empty, don't append (allows "Any").
    if (selectedCity) params.append("location", selectedCity);
    if (selectedMarket) params.append("market", selectedMarket);
    if (selectedType) params.append("type", selectedType);
    if (selectedPrice) params.append("price", selectedPrice);
    if (selectedSeats) params.append("seats", selectedSeats);

    navigate(`/search?${params.toString()}`);
    setIsFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCity("");
    setSelectedMarket("");
    setSelectedType("");
    setSelectedPrice("");
    setSelectedSeats("");
    navigate("/search");
    setIsFiltersOpen(false);
  };

  const formatType = (type) => type ? type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Workspace";

  // --- CARD RENDERER ---
  const renderSpaceCard = (space) => (
    <div
      key={space.id}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/space/${space.id}`)}
    >
      <div className="h-60 w-full relative overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-navy/10 group-hover:bg-navy/0 transition-all z-10" />
        {space.images && space.images.length > 0 ? (
          <img
            src={space.images[0]}
            alt={space.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            onError={(e) => { e.target.src = "https://via.placeholder.com/800x600?text=No+Image"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground"><ImageOff className="w-10 h-10" /></div>
        )}

        <div className="absolute top-4 left-4 z-20">
          <span className="bg-navy text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wide">
            {formatType(space.type)}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-foreground group-hover:text-teal transition-colors line-clamp-1">{space.name}</h3>
          <div className="flex items-center text-xs font-bold text-muted-foreground bg-secondary px-2 py-1 rounded shrink-0">★ {space.rating}</div>
        </div>
        <div className="flex items-center text-muted-foreground text-sm mb-6">
          <MapPin className="w-4 h-4 mr-1.5 text-teal shrink-0" />
          <span className="capitalize truncate">{space.location}, {space.city}</span>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-border/50 mb-6">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-0.5">Starting at</span>
            <div className="flex items-center text-foreground font-bold">
              <IndianRupee className="w-4 h-4" />{space.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground ml-1">/mo</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground mb-0.5">Capacity</span>
            <div className="flex items-center text-foreground font-medium"><Users className="w-4 h-4 mr-1.5 text-teal" />{space.seats} Seats</div>
          </div>
        </div>

        <Button
          className="w-full bg-teal hover:bg-teal/90 text-white transition-all duration-300 font-bold"
          onClick={(e) => { e.stopPropagation(); navigate(`/space/${space.id}`); }}
        >
          View Details <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-full xl:max-w-7xl">

          {/* --- FILTER BAR --- */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6 mb-10">

            <div
              className="flex items-center justify-between cursor-pointer md:cursor-default md:hidden mb-4 md:mb-0"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <div className="flex items-center gap-2 text-navy font-bold text-sm uppercase tracking-wider">
                <Filter className="w-4 h-4" /> Filter Workspace
              </div>
              <div className="text-gray-500">
                {isFiltersOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>

            <div className={`${isFiltersOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4 items-end`}>

              {/* City (Filter) */}
              <div className="w-full md:w-1/6 space-y-1.5">
                <label className="text-xs font-bold text-navy">City</label>
                <Select value={selectedCity} onValueChange={(val) => { setSelectedCity(val); setSelectedMarket(""); }}>
                  <SelectTrigger className="h-10 bg-white border-gray-200 focus:ring-teal"><SelectValue placeholder="City" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location/Market (Filter) */}
              <div className="w-full md:w-1/6 space-y-1.5">
                <label className="text-xs font-bold text-navy">Location</label>
                <Select value={selectedMarket} onValueChange={setSelectedMarket} disabled={!selectedCity}>
                  <SelectTrigger className="h-10 bg-white border-gray-200 focus:ring-teal"><SelectValue placeholder={selectedCity ? "Any Area" : "Select City"} /></SelectTrigger>
                  <SelectContent>
                    {/* Add "Any Area" option to clear market filter */}
                    <SelectItem value="all-areas">All Areas</SelectItem>
                    {selectedCity && MICRO_MARKETS[selectedCity]?.map((area) => (
                      <SelectItem key={area} value={area.toLowerCase().replace(/\s+/g, '-')}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type (Filter) */}
              <div className="w-full md:w-1/6 space-y-1.5">
                <label className="text-xs font-bold text-navy">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-10 bg-white border-gray-200 focus:ring-teal"><SelectValue placeholder="Any Type" /></SelectTrigger>
                  <SelectContent>
                    {/* Allow clearing this filter */}
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="private-office">Private Office</SelectItem>
                    <SelectItem value="dedicated-desk">Dedicated Desk</SelectItem>
                    <SelectItem value="hot-desk">Hot Desk</SelectItem>
                    <SelectItem value="meeting-room">Meeting Room</SelectItem>
                    <SelectItem value="virtual-office">Virtual Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price (Filter) */}
              <div className="w-full md:w-1/6 space-y-1.5">
                <label className="text-xs font-bold text-navy">Price Range</label>
                <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                  <SelectTrigger className="h-10 bg-white border-gray-200 focus:ring-teal"><SelectValue placeholder="Any Budget" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-prices">Any Budget</SelectItem>
                    <SelectItem value="below-10k">&lt; ₹10k</SelectItem>
                    <SelectItem value="10k-20k">₹10k - ₹20k</SelectItem>
                    <SelectItem value="20k-50k">₹20k - ₹50k</SelectItem>
                    <SelectItem value="50k-plus">₹50k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size (Filter) */}
              <div className="w-full md:w-1/6 space-y-1.5">
                <label className="text-xs font-bold text-navy">Size</label>
                <Select value={selectedSeats} onValueChange={setSelectedSeats}>
                  <SelectTrigger className="h-10 bg-white border-gray-200 focus:ring-teal"><SelectValue placeholder="Any Size" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-sizes">Any Size</SelectItem>
                    <SelectItem value="1-5">1 - 5 Seats</SelectItem>
                    <SelectItem value="6-10">6 - 10 Seats</SelectItem>
                    <SelectItem value="11-20">11 - 20 Seats</SelectItem>
                    <SelectItem value="20-plus">20+ Seats</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 w-full md:w-auto flex-1">
                <Button
                  onClick={handleUpdateSearch}
                  className="flex-1 bg-teal hover:bg-teal/90 text-white font-bold h-10 shadow-sm"
                >
                  Search
                </Button>

                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="flex-1 border-teal text-teal hover:bg-teal/10 hover:text-teal h-10 font-bold"
                >
                  Clear
                </Button>
              </div>

            </div>
          </div>

          {/* Results Header */}
          {(filteredSpaces.length > 0 || suggestedSpaces.length > 0) && (
            <div className="mb-6 flex items-baseline justify-between">
              <h1 className="text-2xl font-bold text-navy">
                Search Results
              </h1>
              <span className="text-sm font-bold text-teal">
                {filteredSpaces.length} Exact Matches Found
              </span>
            </div>
          )}

          {/* 1. EXACT MATCHES */}
          {filteredSpaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredSpaces.map(renderSpaceCard)}
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center mb-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">No exact matches found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your filters (e.g., select 'Any Type' or 'Any Budget') to see more results.
              </p>
            </div>
          )}

          {/* 2. SUGGESTIONS */}
          {suggestedSpaces.length > 0 && (
            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-teal" />
                <h2 className="text-xl font-bold text-navy">
                  More options in <span className="capitalize">{selectedCity || "this city"}</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {suggestedSpaces.map(renderSpaceCard)}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;