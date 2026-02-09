import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, ChevronDown, Check, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import OfficeCard from "@/components/OfficeCard";
import Footer from "@/components/Footer";

// Import Videos
import vid1 from "@/assets/WhatsApp Video 2026-01-06 at 10.16.59 PM.mp4";
import vid2 from "@/assets/Office_Scene_Video_Generation.mp4";
import vid3 from "@/assets/manyathy1.mp4";
import vid4 from "@/assets/manyathy2.mp4";
import vid5 from "@/assets/Realistic_Coworking_Space_Video_Generation.mp4";
import vid6 from "@/assets/Hero_Section_Video_Prompt_Generation.mp4";

const videos = [vid1, vid2, vid3, vid4, vid5, vid6];

const AMENITIES_OPTIONS = [
  { id: "wifi", label: "High Speed WiFi" },
  { id: "security", label: "24/7 Access" },
  { id: "parking", label: "Parking" },
  { id: "cafe", label: "In-house Cafe" },
  { id: "meeting", label: "Meeting Rooms" },
  { id: "printer", label: "Printer & Scanner" },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // --- STATE INITIALIZATION ---
  const initialQuery = searchParams.get("query") || "";
  const initialCity = searchParams.get("location") || "";
  const initialBudget = searchParams.get("price") || "";
  const initialSeats = searchParams.get("seats") || "";
  const initialAmenities = searchParams.get("amenities") ? searchParams.get("amenities").split(",") : [];

  const [query, setQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedBudget, setSelectedBudget] = useState(initialBudget);
  const [selectedAvailability, setSelectedAvailability] = useState(initialSeats);
  const [selectedAmenities, setSelectedAmenities] = useState(initialAmenities);

  const [workspaces, setWorkspaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const amenitiesRef = useRef(null);

  // Fetch Data from API
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await axios.get("/api/spaces");
        setWorkspaces(res.data);
      } catch (error) {
        console.error("Error fetching spaces:", error);
      }
    };
    fetchSpaces();
  }, []);

  // --- FILTER & SYNC LOGIC ---
  const updateFilters = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          if (value.length > 0) newParams.set(key, value.join(","));
          else newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      } else {
        newParams.delete(key);
      }
    });
    newParams.delete("page");
    setSearchParams(newParams);
  };

  useEffect(() => {
    const qParam = searchParams.get("query") || "";
    const cityParam = searchParams.get("location") || "";
    const priceParam = searchParams.get("price") || "";
    const seatsParam = searchParams.get("seats") || "";
    const amParam = searchParams.get("amenities") ? searchParams.get("amenities").split(",") : [];

    setQuery(qParam);
    setSelectedCity(cityParam);
    setSelectedBudget(priceParam);
    setSelectedAvailability(seatsParam);
    setSelectedAmenities(amParam);

    const data = workspaces || [];
    const lowerQ = qParam.toLowerCase();

    // TYPO CORRECTION / NORMALIZATION
    let normalizedQ = lowerQ;
    const typoMap = {
      "kormangala": "koramangala",
      "kormangla": "koramangala",
      "bengaluru": "bangalore",
      "bombay": "mumbai",
      "gurugram": "gurgaon",
      "hyd": "hyderabad"
    };

    Object.keys(typoMap).forEach(typo => {
      if (normalizedQ.includes(typo)) {
        normalizedQ = normalizedQ.replace(new RegExp(typo, 'g'), typoMap[typo]);
      }
    });

    const stopWords = ["in", "at", "for", "the", "a", "an", "of", "and", "or", "to", "with", "office", "space"];

    // SCORING LOGIC
    let scoredSpaces = data.map((space) => {
      // 1. Static Filters (Strict)
      if (cityParam && space.city.toLowerCase() !== cityParam.toLowerCase()) return null;
      if (priceParam === "below-10k" && space.price >= 10000) return null;
      if (priceParam === "10k-20k" && (space.price < 10000 || space.price > 20000)) return null;
      if (priceParam === "20k-50k" && (space.price < 20000 || space.price > 50000)) return null;
      if (priceParam === "50k-plus" && space.price <= 50000) return null;
      if (seatsParam === "1-5" && space.seats > 5) return null;
      if (seatsParam === "6-10" && (space.seats < 6 || space.seats > 10)) return null;
      if (seatsParam === "11-20" && (space.seats < 11 || space.seats > 20)) return null;
      if (seatsParam === "20-plus" && space.seats < 20) return null;

      // 2. Search Text Scoring (Fuzzy-ish)
      let score = 0;
      if (lowerQ) {
        // Construct a highly descriptive search blob
        let searchableText = [
          space.name,
          space.city,
          space.location, // This maps to micro-market or specific location
          space.type,
          space.description,
          ...(space.amenities || []),
          ...(space.highlights?.map((h) => h.title + " " + h.desc) || []),
          space.price.toString(),
          space.seats.toString(),
          space.snapshot?.area || "", // Include area in search
        ].join(" ").toLowerCase();

        // Enrich text for broader matching
        if (space.price < 10000) searchableText += " budget cheap affordable economy low cost 10k";
        if (space.price >= 10000 && space.price <= 20000) searchableText += " mid-range 10k 20k";
        if (space.price > 20000) searchableText += " premium luxury expensive high-end 20k";

        if (space.type === "coworking" || space.description.includes("startup")) searchableText += " startup start-up start up";
        if (space.type === "private") searchableText += " cabin private office suite";
        if (space.type === "managed") searchableText += " enterprise managed floor";

        // Manual common typo fixes & synonyms
        if (space.location.toLowerCase().includes("koramangala")) searchableText += " kormangala kormangla";
        if (space.location.toLowerCase().includes("indiranagar")) searchableText += " indira nagar";
        if (space.city === "Bangalore") searchableText += " bengaluru";
        if (space.city === "Hyderabad") searchableText += " hyd";
        if (space.city === "Mumbai") searchableText += " bombay";

        // Logic for "under X" queries
        if (normalizedQ.includes("under") || normalizedQ.includes("below")) {
          const priceMatch = normalizedQ.match(/(\d+)k?/);
          if (priceMatch) {
            let limit = parseInt(priceMatch[1]);
            if (normalizedQ.includes("k")) limit *= 1000;
            if (space.price <= limit) score += 50;
          }
        }

        const tokens = normalizedQ.split(/[\s,]+/).filter((t) => t && !stopWords.includes(t));

        // Scoring: Count how many tokens match partially or fully
        tokens.forEach((token) => {
          if (searchableText.includes(token)) {
            score += 10; // Base match score

            // SIGNIFICANT BOOSTS for User Priorities:
            if (space.location.toLowerCase().includes(token)) score += 30; // Micro-market / Location priority
            if (space.city.toLowerCase().includes(token)) score += 20;     // City priority
            if (space.name.toLowerCase().includes(token)) score += 25;     // Name priority
            if (space.price.toString().includes(token)) score += 15;       // Exact price match
            if (searchableText.includes(token + " sq ft") || searchableText.includes(token + " sq. ft")) score += 10; // Area match
          }
        });

        // Ensure at least ONE token triggered a match if query exists
        if (score === 0) return null;
      } else {
        score = 1; // Default score to show all if no query
      }

      return { ...space, score };
    });

    // Filter nulls and Sort
    const finalResults = scoredSpaces
      .filter((item) => item !== null)
      .sort((a, b) => b.score - a.score);

    const matchesWithVideo = finalResults.map((space, index) => ({
      ...space,
      image: space.images?.[0] || "",
      video: videos[index % videos.length],
    }));

    setFilteredSpaces(matchesWithVideo);
    setCurrentPage(1);
  }, [searchParams, workspaces]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (amenitiesRef.current && !amenitiesRef.current.contains(event.target)) setAmenitiesOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCityChange = (val) => updateFilters({ location: val });
  const handleBudgetChange = (val) => updateFilters({ price: val });
  const handleSeatsChange = (val) => updateFilters({ seats: val });
  const handleAmenityToggle = (id) => setSelectedAmenities(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const applyAmenities = () => updateFilters({ amenities: selectedAmenities });
  const handleSearchSubmit = () => updateFilters({ query: query });
  const clearAll = () => setSearchParams(new URLSearchParams());

  const totalPages = Math.ceil(filteredSpaces.length / itemsPerPage);
  const currentSpaces = filteredSpaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.getElementById("results-top")?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      <Header />

      {/* CENTERED FILTER HEADER - Sticky */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md pt-24 pb-4 border-b border-gray-200 shrink-0">
        <div className="px-4 mx-auto w-full max-w-[1600px] flex flex-col items-center gap-4">

          {/* 1. Search Bar */}
          <div className="w-full max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-teal transition-colors" />
              </div>
              <input
                className="block w-full pl-11 pr-14 md:pr-32 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all shadow-sm hover:shadow-md"
                placeholder="Search for locations, amenities, or workspace types..."
                value={query || ""}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
              <Button
                className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full bg-teal hover:bg-teal/90 w-10 h-10 md:w-auto md:h-auto md:px-6 p-0 md:py-2 shadow-sm flex items-center justify-center transition-all"
                onClick={handleSearchSubmit}
              >
                <span className="md:hidden"><Search className="w-5 h-5" /></span>
                <span className="hidden md:inline">Search</span>
              </Button>
            </div>
          </div>

          {/* 2. Horizontal Filter Pills */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-3 w-full">
            <Select value={selectedCity || ""} onValueChange={handleCityChange}>
              <SelectTrigger className={`h-10 px-5 w-auto min-w-[140px] rounded-full border bg-white text-sm font-medium hover:border-teal/50 transition-all ${selectedCity ? "border-teal text-teal bg-teal/5" : "border-gray-200 text-gray-700"}`}><SelectValue placeholder="City" /></SelectTrigger>
              <SelectContent>
                {/* Dynamic Cities */}
                {Array.from(new Set(workspaces.map(w => w.city))).sort().map(city => (
                  <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                ))}
                {/* Fallback if no data or just to ensure major cities are always an option if desired, though Set covers it if data exists */}
                {workspaces.length === 0 && (
                  <>
                    <SelectItem value="bangalore">Bengaluru</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            <Select value={selectedBudget || ""} onValueChange={handleBudgetChange}>
              <SelectTrigger className={`h-10 px-5 w-auto min-w-[140px] rounded-full border bg-white text-sm font-medium hover:border-teal/50 transition-all ${selectedBudget ? "border-teal text-teal bg-teal/5" : "border-gray-200 text-gray-700"}`}><SelectValue placeholder="Budget" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="below-10k">Below ₹10k</SelectItem>
                <SelectItem value="10k-20k">₹10k - ₹20k</SelectItem>
                <SelectItem value="20k-50k">₹20k - ₹50k</SelectItem>
                <SelectItem value="50k-plus">Above ₹50k</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAvailability || ""} onValueChange={handleSeatsChange}>
              <SelectTrigger className={`h-10 px-5 w-auto min-w-[160px] rounded-full border bg-white text-sm font-medium hover:border-teal/50 transition-all ${selectedAvailability ? "border-teal text-teal bg-teal/5" : "border-gray-200 text-gray-700"}`}><SelectValue placeholder="Available Seats" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5">1-5 Seats</SelectItem>
                <SelectItem value="6-10">6-10 Seats</SelectItem>
                <SelectItem value="11-20">11-20 Seats</SelectItem>
                <SelectItem value="20-plus">20+ Seats</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative" ref={amenitiesRef}>
              <button
                className={`h-10 px-5 rounded-full border flex items-center gap-2 text-sm font-medium transition-all ${amenitiesOpen || selectedAmenities.length > 0 ? "border-teal text-teal bg-teal/5" : "border-gray-200 text-gray-700 hover:border-teal/50"}`}
                onClick={() => setAmenitiesOpen(!amenitiesOpen)}
              >
                Amenities
                {selectedAmenities.length > 0 && <span className="bg-teal text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{selectedAmenities.length}</span>}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${amenitiesOpen ? "rotate-180" : ""}`} />
              </button>
              {amenitiesOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-gray-100 w-[280px] p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select Amenities</h4>
                  <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {AMENITIES_OPTIONS.map(opt => (
                      <div key={opt.id} className="flex items-center justify-between cursor-pointer group p-1 hover:bg-gray-50 rounded" onClick={() => handleAmenityToggle(opt.id)}>
                        <span className="text-gray-700 text-sm">{opt.label}</span>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedAmenities.includes(opt.id) ? "bg-teal border-teal" : "border-gray-300"}`}>{selectedAmenities.includes(opt.id) && <Check className="w-3 h-3 text-white" />}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button className="text-xs font-semibold text-gray-500 hover:text-red-500" onClick={() => setSelectedAmenities([])}>Reset</button>
                    <button className="bg-navy text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-teal transition-colors" onClick={() => { applyAmenities(); setAmenitiesOpen(false); }}>Apply</button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
            <Button variant="ghost" className="text-teal hover:text-teal/80 hover:bg-teal/5 h-10 px-4 rounded-full text-sm" onClick={clearAll}>Clear All</Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT (60% List / 40% Map) - Full Page Scroll */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-full">

          {/* LEFT: RESULTS (60%) */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <div className="flex items-center justify-between" id="results-top">
              <div>
                <h2 className="text-xl font-bold text-navy">
                  {filteredSpaces.length > 0 ? `${filteredSpaces.length} Workspaces Found` : "No Workspaces Found"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedCity ? `Showing results in ${selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}` : "Showing all available spaces"}
                </p>
              </div>
            </div>

            {filteredSpaces.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {currentSpaces.map((space) => (
                  <OfficeCard key={space.id} {...space} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6"><Search className="w-8 h-8 text-gray-400" /></div>
                <h3 className="text-xl font-bold text-navy">No matches found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">We couldn't find any workspaces matching your specific criteria. Try removing some filters.</p>
                <Button className="bg-teal hover:bg-teal/90 rounded-full px-8" onClick={clearAll}>Clear All Filters</Button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-12 mb-12 gap-2">
                <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="h-8 w-8 p-0 rounded-full"><ChevronLeft className="w-4 h-4" /></Button>
                <span className="flex items-center px-4 text-sm font-bold text-navy bg-white border border-gray-200 rounded-full h-8">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="h-8 w-8 p-0 rounded-full"><ChevronRight className="w-4 h-4" /></Button>
              </div>
            )}
          </div>

          {/* RIGHT: MAP (40%) - Sticky */}
          <div className="hidden md:block md:col-span-2 relative">
            <div className="sticky top-44 h-[calc(100vh-200px)] min-h-[500px] w-full bg-[#f0f0f0] rounded-xl border border-gray-200 shadow-xl overflow-hidden z-10">
              {/* Map Image Layer */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg"
                  className="w-full h-full object-cover opacity-10 absolute inset-0 z-0"
                  alt="Map Background"
                />
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] opacity-10 bg-repeat space-x-4"></div>
                <div className="absolute inset-0 bg-[#e5e3df] mix-blend-multiply opacity-50"></div>
              </div>

              <div className="absolute top-4 right-4 bg-white rounded-sm shadow-md flex flex-col cursor-pointer z-20">
                <div className="p-2 hover:bg-gray-50 border-b border-gray-100" title="Zoom In">+</div>
                <div className="p-2 hover:bg-gray-50" title="Zoom Out">-</div>
              </div>

              <div className="absolute top-[30%] left-[45%] group cursor-pointer hover:z-50 z-10 transition-transform hover:scale-110"><MapPin className="w-10 h-10 text-[#ea4335] fill-[#ea4335] stroke-white stroke-[2px] drop-shadow-xl origin-bottom" /></div>
              <div className="absolute top-[45%] left-[60%] group cursor-pointer hover:z-50 z-10 transition-transform hover:scale-110"><MapPin className="w-10 h-10 text-[#ea4335] fill-[#ea4335] stroke-white stroke-[2px] drop-shadow-xl origin-bottom" /></div>
              <div className="absolute top-[60%] left-[35%] group cursor-pointer hover:z-50 z-10 transition-transform hover:scale-110"><MapPin className="w-10 h-10 text-[#ea4335] fill-[#ea4335] stroke-white stroke-[2px] drop-shadow-xl origin-bottom" /></div>
              <div className="absolute bottom-[25%] right-[30%] group cursor-pointer hover:z-50 z-10 transition-transform hover:scale-110"><MapPin className="w-10 h-10 text-[#ea4335] fill-[#ea4335] stroke-white stroke-[2px] drop-shadow-xl origin-bottom" /></div>
              <div className="absolute top-[20%] right-[20%] group cursor-pointer hover:z-50 z-10 transition-transform hover:scale-110"><MapPin className="w-10 h-10 text-[#ea4335] fill-[#ea4335] stroke-white stroke-[2px] drop-shadow-xl origin-bottom" /></div>

              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md shadow-sm text-[10px] text-gray-500 font-medium z-20 flex items-center gap-1">
                <span className="font-bold text-blue-500">G</span>
                <span>Google Maps</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;