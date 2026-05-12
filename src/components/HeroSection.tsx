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
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Office Background" 
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {!user ? (
          <>
            {/* Desktop View - Unchanged */}
            <div className="hidden md:flex w-full max-w-7xl px-4 gap-6 items-start">
              {/* Left Card - Client */}
              <div className="flex-1 backdrop-blur-md bg-white/80 rounded-[2rem] border border-white/40 shadow-xl p-8 md:p-10 flex flex-col group transition-all duration-500 hover:-translate-y-1">
                <div>
                  <p className="text-navy/50 font-bold uppercase tracking-widest text-[10px] mb-2">The Modern Enterprise</p>
                  <h2 className="text-3xl md:text-5xl font-black text-navy uppercase italic tracking-tighter leading-none mb-6">
                    FOR <span className="text-teal">CLIENTS</span>
                  </h2>
                  <p className="text-navy/70 text-base md:text-lg font-medium leading-relaxed mb-8 max-w-lg">
                    Discover curated private cabins, dedicated desks, and meeting rooms. Get direct landlord access, data-backed cost comparisons, and flexible booking options.
                  </p>
                  <Button 
                    onClick={() => { setMode("client"); navigate("/login"); }}
                    className="h-16 px-12 bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    Client Login <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                <div className="mt-4 flex items-center border-t border-navy/5 pt-3">
                  <div className="flex flex-1 justify-between items-center px-2">
                    <div className="flex flex-col items-center gap-1">
                      <Compass className="w-5 h-5 text-[#38bdf8]" />
                      <span className="text-[7px] font-bold text-navy/50 uppercase text-center leading-none">Explore SFT</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Layout className="w-5 h-5 text-[#38bdf8]" />
                      <span className="text-[7px] font-bold text-navy/50 uppercase text-center leading-none">Studio SFT</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Send className="w-5 h-5 text-[#38bdf8]" />
                      <span className="text-[7px] font-bold text-navy/50 uppercase text-center leading-none">RFP Platform</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Activity className="w-5 h-5 text-[#38bdf8]" />
                      <span className="text-[7px] font-bold text-navy/50 uppercase text-center leading-none">Market Intel</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Card - Partner */}
              <div className="flex-1 backdrop-blur-md bg-white/80 rounded-[2rem] border border-white/40 shadow-xl p-8 md:p-10 flex flex-col group transition-all duration-500 hover:-translate-y-1">
                <div>
                  <p className="text-navy/50 font-bold uppercase tracking-widest text-[10px] mb-2">Landlords & Operators</p>
                  <h2 className="text-3xl md:text-5xl font-black text-navy uppercase italic tracking-tighter leading-none mb-6">
                    FOR <span className="text-teal">PARTNERS</span>
                  </h2>
                  <p className="text-navy/70 text-base md:text-lg font-medium leading-relaxed mb-8 max-w-lg">
                    Reach pre-qualified clients, manage availability, and leverage market intelligence. Streamline your leasing operations with automated leads.
                  </p>
                  <Button 
                    onClick={() => { setMode("broker"); navigate("/broker/login"); }}
                    className="h-16 px-12 bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    Partner Login <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                <div className="mt-4 flex items-center border-t border-navy/5 pt-3">
                  <div className="flex flex-1 justify-between items-center px-2">
                    <div className="flex flex-col items-center gap-1">
                      <LayoutGrid className="w-5 h-5 text-[#38bdf8]" />
                      <span className="text-[7px] font-bold text-navy/50 uppercase text-center leading-none">Broker CRM</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Layout className="w-5 h-5 text-[#38bdf8]" />
                      <span className="text-[7px] font-bold text-navy/50 uppercase text-center leading-none">Studio SFT</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Target className="w-5 h-5 text-[#38bdf8]" />
                      <span className="text-[7px] font-bold text-navy/50 uppercase text-center leading-none">Lead Gen</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <BarChart3 className="w-5 h-5 text-[#38bdf8]" />
                      <span className="text-[7px] font-bold text-navy/50 uppercase text-center leading-none">Market Intel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile View - New Layout */}
            <div className="flex md:hidden w-full flex-col items-center px-6">
              {/* Mobile Toggle Button */}
              <div className="inline-flex bg-gray-100/80 backdrop-blur-sm p-1 rounded-2xl border border-gray-200 mb-10 w-full max-w-[320px] shadow-inner">
                <button 
                  onClick={() => setMobileTab("client")}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                    mobileTab === "client" ? "bg-white text-navy shadow-md" : "text-gray-400 hover:text-navy/60"
                  )}
                >
                  Client Login
                </button>
                <button 
                  onClick={() => setMobileTab("broker")}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                    mobileTab === "broker" ? "bg-white text-navy shadow-md" : "text-gray-400 hover:text-navy/60"
                  )}
                >
                  Partner Login
                </button>
              </div>

              {/* Active Card for Mobile */}
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                {mobileTab === "client" ? (
                  <div className="backdrop-blur-md bg-white/80 rounded-[2.5rem] border border-white/40 shadow-xl p-8 flex flex-col items-center text-center">
                    <p className="text-navy/50 font-bold uppercase tracking-widest text-[9px] mb-2">The Modern Enterprise</p>
                    <h2 className="text-4xl font-black text-navy uppercase italic tracking-tighter leading-none mb-6">
                      FOR <span className="text-teal">CLIENTS</span>
                    </h2>
                    <p className="text-navy/70 text-base font-medium leading-relaxed mb-8">
                      Discover curated private cabins, dedicated desks, and meeting rooms with direct landlord access.
                    </p>
                    <Button 
                      onClick={() => { setMode("client"); navigate("/login"); }}
                      className="w-full h-16 bg-[#38bdf8] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
                    >
                      Client Login <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    
                    <div className="mt-8 grid grid-cols-4 gap-4 w-full border-t border-navy/5 pt-6">
                      <div className="flex flex-col items-center gap-1">
                        <Compass className="w-6 h-6 text-[#38bdf8]" />
                        <span className="text-[7px] font-bold text-navy/50 uppercase">Explore</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Layout className="w-6 h-6 text-[#38bdf8]" />
                        <span className="text-[7px] font-bold text-navy/50 uppercase">Studio</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Send className="w-6 h-6 text-[#38bdf8]" />
                        <span className="text-[7px] font-bold text-navy/50 uppercase">RFP</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Activity className="w-6 h-6 text-[#38bdf8]" />
                        <span className="text-[7px] font-bold text-navy/50 uppercase">Intel</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="backdrop-blur-md bg-white/80 rounded-[2.5rem] border border-white/40 shadow-xl p-8 flex flex-col items-center text-center">
                    <p className="text-navy/50 font-bold uppercase tracking-widest text-[9px] mb-2">Landlords & Operators</p>
                    <h2 className="text-4xl font-black text-navy uppercase italic tracking-tighter leading-none mb-6">
                      FOR <span className="text-teal">PARTNERS</span>
                    </h2>
                    <p className="text-navy/70 text-base font-medium leading-relaxed mb-8">
                      Reach pre-qualified clients, manage availability, and leverage real-time market intelligence.
                    </p>
                    <Button 
                      onClick={() => { setMode("broker"); navigate("/broker/login"); }}
                      className="w-full h-16 bg-[#38bdf8] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
                    >
                      Partner Login <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    
                    <div className="mt-8 grid grid-cols-4 gap-4 w-full border-t border-navy/5 pt-6">
                      <div className="flex flex-col items-center gap-1">
                        <LayoutGrid className="w-6 h-6 text-[#38bdf8]" />
                        <span className="text-[7px] font-bold text-navy/50 uppercase">CRM</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Layout className="w-6 h-6 text-[#38bdf8]" />
                        <span className="text-[7px] font-bold text-navy/50 uppercase">Studio</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Target className="w-6 h-6 text-[#38bdf8]" />
                        <span className="text-[7px] font-bold text-navy/50 uppercase">Leads</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <BarChart3 className="w-6 h-6 text-[#38bdf8]" />
                        <span className="text-[7px] font-bold text-navy/50 uppercase">Intel</span>
                      </div>
                    </div>
                  </div>
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