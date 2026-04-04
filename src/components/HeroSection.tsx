import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroVideo from "@/assets/flickspacehero.mp4";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const HeroSection = ({ mode, setMode }: { mode: "client" | "broker", setMode: (mode: "client" | "broker") => void }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    if (location.trim()) {
      navigate(`/search?query=${encodeURIComponent(location)}`);
    } else {
      navigate('/search');
    }
  };

  const handleListProperty = () => {
    if (!user || user.role !== 'broker') {
      toast.info("Please login to register the office.", {
        description: "A partner account is required to list properties."
      });
      navigate("/broker/login");
    } else {
      navigate("/broker/submit-property");
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
        {/* Subtle white overlay */}
        <div className="absolute inset-0 bg-white/10 transition-all duration-1000 hover:bg-white/20 pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center text-center mt-8">

        {/* Mode Toggle */}
        <div className="mb-12 mt-8 flex p-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-2xl animate-in fade-in zoom-in duration-700">
          <button
            onClick={() => setMode("client")}
            className={cn(
              "px-4 md:px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2",
              mode === "client" ? "bg-teal text-white shadow-lg" : "text-navy/80 hover:text-navy hover:bg-white/10"
            )}
          >
            Client Login
          </button>
          <button
            onClick={() => setMode("broker")}
            className={cn(
              "px-4 md:px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2",
              mode === "broker" ? "bg-teal text-white shadow-lg" : "text-navy/80 hover:text-navy hover:bg-white/10"
            )}
          >
            Partner Login
          </button>
        </div>

        {/* Heading */}
        <h1 className={cn(
          "text-4xl md:text-7xl font-bold text-navy leading-[1.1] tracking-tight animate-in slide-in-from-bottom-6 duration-700 delay-100 fade-in px-2",
          mode === "client" ? "mb-0" : "mb-6"
        )}>
          {mode === "client" ? null : (
            <>Maximize Your <span className="text-teal">Occupancy</span></>
          )}
        </h1>

        <p className={cn(
          "text-lg text-black max-w-2xl animate-in slide-in-from-bottom-6 duration-700 delay-200 fade-in font-medium",
          mode === "client" ? "mb-6" : "mb-12"
        )}>
          {mode === "client"
            ? ""
            : "Connect with high-intent clients (RFP Platform) and list your property details to get verified leads."
          }
        </p>

        {/* Dynamic Input based on Mode */}
        <div className="w-full max-w-4xl animate-in slide-in-from-bottom-8 duration-700 delay-300 fade-in">
          {mode === "client" ? (
            <div className="space-y-6">
              <div className="flex items-center w-full bg-white rounded-full border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 px-2 py-2 md:bg-white/80 md:backdrop-blur-sm group mx-auto max-w-3xl">
                <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0 group-focus-within:text-teal transition-colors" />
                <input
                  type="text"
                  name="hero-search-query"
                  autoComplete="off"
                  spellCheck="false"
                  placeholder="Try 'Private cabin in Koramangala for 10 people'"
                  className="flex-1 min-w-0 border-0 focus:ring-0 text-base md:text-lg font-medium text-navy placeholder:text-gray-400 h-10 md:h-12 px-2 bg-transparent focus:outline-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  className="bg-teal hover:bg-teal/90 text-white rounded-full w-10 h-10 md:w-auto md:h-12 md:px-8 p-0 flex items-center justify-center text-base font-bold shadow-md transform hover:scale-105 transition-all shrink-0 z-20"
                >
                  <span className="md:hidden flex items-center justify-center"><MoveRight className="w-5 h-5" /></span>
                  <span className="hidden md:inline">Search Spaces</span>
                </Button>
              </div>

              {/* RFP CTA below the bar */}
              <div className="flex justify-center mt-8 animate-in slide-in-from-top-4 duration-700 delay-500 fade-in">
                <Button 
                  onClick={() => navigate("/rfp-form")}
                  className="h-14 px-10 bg-white hover:bg-gray-50 text-navy font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center gap-3 group border border-gray-100"
                >
                  Custom Requirement? <span className="text-teal">Fill RFP Form</span> 
                  <div className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <MoveRight className="w-3.5 h-3.5" />
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                onClick={handleListProperty}
                className="bg-teal hover:bg-teal/90 text-white rounded-full h-15 px-12 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3"
              >
                List My Property <MoveRight className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/broker/login")}
                className="bg-white/50 backdrop-blur-md border-white/40 text-navy rounded-full h-15 px-10 text-lg font-bold shadow-lg hover:bg-white transition-all"
              >
                Broker Login
              </Button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default HeroSection;