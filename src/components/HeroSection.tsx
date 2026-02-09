import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


import heroVideo from "@/assets/flickspacehero.mp4";

const HeroSection = () => {
  const navigate = useNavigate();
  const [workspaceType, setWorkspaceType] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState("");

  const handleSearch = () => {
    if (location.trim()) {
      navigate(`/search?query=${encodeURIComponent(location)}`);
    }
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden font-sans">

      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Subtle white overlay with hover effect */}
        <div className="absolute inset-0 bg-white/10 transition-all duration-1000 hover:bg-white/20 pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center text-center mt-[-5rem]">

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-navy leading-[1.1] tracking-tight mb-6 animate-in slide-in-from-bottom-6 duration-700 delay-100 fade-in">
          Find Your Ideal <span className="text-teal">Workspace</span>
        </h1>

        <p className="text-lg text-black max-w-2xl mb-12 animate-in slide-in-from-bottom-6 duration-700 delay-200 fade-in font-medium">
          Explore our curated list of premium coworking spaces, private offices, and meeting rooms tailored for your team.
        </p>

        {/* Natural Language Search Input - Clean Design */}
        <div className="w-full max-w-3xl animate-in slide-in-from-bottom-8 duration-700 delay-300 fade-in">
          <div className="flex items-center w-full bg-white rounded-full border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 px-2 py-2 md:bg-white/80 md:backdrop-blur-sm">
            <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0" />
            <input
              type="text"
              name="hero-search-query"
              autoComplete="off"
              spellCheck="false"
              placeholder="Try 'Private cabin in Koramangala for 10 people with wifi'"
              className="flex-1 min-w-0 border-0 focus:ring-0 text-base md:text-lg font-medium text-navy placeholder:text-gray-400 h-10 md:h-12 px-2 bg-transparent focus:outline-none placeholder:text-xs md:placeholder:text-lg overflow-ellipsis"
              value={location} // Reusing location state for the query text
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              className="bg-teal hover:bg-teal/90 text-white rounded-full w-10 h-10 md:w-auto md:h-12 md:px-8 p-0 flex items-center justify-center text-base font-bold shadow-md transform hover:scale-105 transition-all shrink-0 z-20 aspect-square md:aspect-auto"
            >
              <span className="md:hidden flex items-center justify-center"><MoveRight className="w-5 h-5" /></span>
              <span className="hidden md:inline">Search</span>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;