import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MoveRight, Monitor, DoorOpen, Users, ShieldCheck, TrendingUp, BarChart3, ArrowRight, Compass, Layout, Send, Activity, LayoutGrid, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroVideo from "@/assets/flickspacehero.mp4";
import heroImage from "@/assets/hero-office.png";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const HeroSection = ({ mode, setMode }: { mode: "client" | "broker", setMode: (mode: "client" | "broker") => void }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [location, setLocation] = useState("");
  const [mobileTab, setMobileTab] = useState<"client" | "broker">("client");

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
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center overflow-hidden bg-white font-sans py-24">
      {/* Background Image with Clearer White Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Office Background" 
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {!user ? (
          <>
            {/* Full Hero - No Card */}
            <div className="w-full flex flex-col items-center px-6 md:px-4 text-center" key={mobileTab}>
              {/* Toggle Button */}
              <div className="inline-flex bg-gray-100 backdrop-blur-sm p-1 rounded-2xl border border-gray-200 mb-10 md:mb-14 w-full max-w-[400px] shadow-inner">
                <button 
                  onClick={() => setMobileTab("client")}
                  className={cn(
                    "flex-1 py-3 md:py-4 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                    mobileTab === "client" ? "bg-white text-navy shadow-md" : "text-gray-400 hover:text-navy/60"
                  )}
                >
                  Client
                </button>
                <button 
                  onClick={() => setMobileTab("broker")}
                  className={cn(
                    "flex-1 py-3 md:py-4 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                    mobileTab === "broker" ? "bg-white text-navy shadow-md" : "text-gray-400 hover:text-navy/60"
                  )}
                >
                  Partner
                </button>
              </div>

              {/* Hero Content */}
              <div className="animate-in fade-in duration-500 max-w-4xl">
                {mobileTab === "client" ? (
                  <>
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-navy uppercase italic tracking-tighter leading-[0.9] mb-6">
                      Your Next<br />Workspace, <span className="text-teal">Discovered.</span>
                    </h1>
                    <p className="text-navy/60 text-base md:text-xl font-medium leading-relaxed mb-10 max-w-3xl mx-auto">
                      Discover premium private cabins, dedicated desks, and meeting rooms with direct landlord access.
                    </p>
                    <Button 
                      onClick={() => { setMode("client"); navigate("/login"); }}
                      className="h-14 md:h-16 px-10 md:px-14 bg-[#38bdf8] hover:bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      Get Started <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-navy uppercase italic tracking-tighter leading-[0.9] mb-6">
                      Fill Every Seat.<br />Maximize <span className="text-teal">Revenue.</span>
                    </h1>
                    <p className="text-navy/60 text-base md:text-xl font-medium leading-relaxed mb-10 max-w-3xl mx-auto">
                      List your workspace, automate your leasing pipeline, and connect directly with verified enterprise clients.
                    </p>
                    <Button 
                      onClick={() => { setMode("broker"); navigate("/broker/login"); }}
                      className="h-14 md:h-16 px-10 md:px-14 bg-[#38bdf8] hover:bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm shadow-xl shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      Partner Login <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Authenticated View - Professional White Workspace */
          <div className="w-full max-w-7xl px-4 flex flex-col items-center text-center py-20 animate-in fade-in duration-1000">
            <h1 className="text-5xl md:text-8xl font-black text-navy leading-[1] tracking-tighter uppercase italic mb-8">
              {mode === "client" ? (
                <>Find Your <span className="text-teal">Space</span></>
              ) : (
                <>Maximize <span className="text-teal">Occupancy</span></>
              )}
            </h1>
            
            <div className="w-full max-w-4xl mt-4">
              {mode === "client" ? (
                <div className="space-y-12">
                  {/* Simplified Search Bar */}
                  <div className="flex items-center w-full bg-white rounded-3xl border-2 border-gray-100 shadow-2xl px-2 py-2 group mx-auto max-w-2xl focus-within:border-teal/30 transition-all">
                    <Search className="w-5 h-5 text-gray-400 ml-4 shrink-0 group-focus-within:text-teal" />
                    <input
                      type="text"
                      placeholder="Try 'Private cabin in Koramangala'"
                      className="flex-1 min-w-0 border-0 focus:ring-0 text-lg font-bold text-navy placeholder:text-gray-300 h-14 px-4 bg-transparent focus:outline-none"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button
                      onClick={handleSearch}
                      className="bg-teal hover:bg-navy text-white rounded-2xl h-14 w-14 sm:w-auto sm:px-10 flex items-center justify-center text-lg font-black uppercase tracking-widest shadow-lg transition-all shrink-0"
                    >
                      <Search className="w-5 h-5 sm:hidden" />
                      <span className="hidden sm:inline text-sm">Search</span>
                    </Button>
                  </div>
                  
                  {/* Toggle Style Buttons */}
                  <div className="inline-flex bg-gray-50 p-1.5 rounded-[2rem] border border-gray-100 shadow-inner">
                    <button 
                      onClick={() => navigate("/rfp-form")}
                      className="h-12 px-6 sm:px-10 bg-[#38bdf8] text-white font-black uppercase tracking-widest text-[10px] rounded-[1.5rem] shadow-lg transition-all active:scale-95 whitespace-nowrap"
                    >
                      Fill RFP Form
                    </button>
                    <button 
                      onClick={() => navigate("/sft-bot")}
                      className="h-12 px-6 sm:px-10 bg-transparent text-gray-400 hover:text-navy font-black uppercase tracking-widest text-[10px] rounded-[1.5rem] transition-all active:scale-95 whitespace-nowrap"
                    >
                      Talk to Bot
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                   <div className="inline-flex bg-gray-50 p-1.5 rounded-[2rem] border border-gray-100 shadow-inner mx-auto">
                    <Button 
                      variant="ghost"
                      onClick={() => navigate("/broker/submit-property")}
                      className="h-12 px-6 sm:px-10 bg-[#38bdf8] text-white font-black uppercase tracking-widest text-[10px] rounded-[1.5rem] shadow-lg hover:bg-[#38bdf8] transition-all active:scale-95 whitespace-nowrap"
                    >
                      List Space
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => navigate("/broker/add-space-bot")}
                      className="h-12 px-6 sm:px-10 bg-transparent text-gray-400 hover:text-navy font-black uppercase tracking-widest text-[10px] rounded-[1.5rem] transition-all active:scale-95 whitespace-nowrap hover:bg-white/50"
                    >
                      Talk to Bot
                    </Button>

                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>

  );
};

export default HeroSection;