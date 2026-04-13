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
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-white font-sans">
      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {!user ? (
          /* Split Screen for Unauthenticated Users */
          <div className="flex flex-col md:flex-row w-full min-h-[90vh]">
            {/* Left Part - Client */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-20 border-b md:border-b-0 md:border-r border-gray-100 group transition-all duration-700 hover:bg-teal/5">
              <div className="animate-in slide-in-from-left-12 duration-1000 ease-out flex flex-col items-center">
                <h2 className="hidden md:block text-5xl md:text-7xl font-black text-navy mb-12 uppercase italic tracking-tighter leading-none">
                  For <br /><span className="text-teal">Clients</span>
                </h2>
                <Button 
                  onClick={() => { setMode("client"); navigate("/login"); }}
                  className="h-20 px-16 bg-navy hover:bg-teal text-white rounded-3xl font-black uppercase tracking-widest text-base shadow-2xl hover:scale-105 active:scale-95 transition-all group-hover:shadow-teal/20"
                >
                  Client Login <MoveRight className="ml-4 w-6 h-6" />
                </Button>
              </div>
            </div>
            
            {/* Right Part - Partner */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-20 group transition-all duration-700 hover:bg-navy/5">
              <div className="animate-in slide-in-from-right-12 duration-1000 ease-out text-center md:text-right flex flex-col items-center md:items-end">
                <h2 className="hidden md:block text-5xl md:text-7xl font-black text-navy mb-12 uppercase italic tracking-tighter leading-none">
                  For <br /><span className="text-teal">Partners</span>
                </h2>
                <Button 
                  onClick={() => { setMode("broker"); navigate("/broker/login"); }}
                  className="h-20 px-16 bg-teal hover:bg-navy text-white rounded-3xl font-black uppercase tracking-widest text-base shadow-2xl hover:scale-105 active:scale-95 transition-all group-hover:shadow-navy/20"
                >
                  Partner Login <MoveRight className="ml-4 w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
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
            
            <p className="text-xl text-gray-500 max-w-2xl mb-12 font-medium">
              {mode === "client" 
                ? "Search from thousands of verified listings or submit a custom RFP."
                : "Manage your listings and connect with high-fidelity corporate requirements."
              }
            </p>

            <div className="w-full max-w-4xl">
              {mode === "client" ? (
                <div className="space-y-8">
                  <div className="flex items-center w-full bg-white rounded-3xl border-2 border-gray-100 shadow-2xl px-3 py-3 group mx-auto max-w-3xl focus-within:border-teal/50 transition-all">
                    <Search className="w-6 h-6 text-gray-400 ml-4 shrink-0 group-focus-within:text-teal" />
                    <input
                      type="text"
                      placeholder="Try 'Private cabin in Koramangala for 10 people'"
                      className="flex-1 min-w-0 border-0 focus:ring-0 text-xl font-bold text-navy placeholder:text-gray-300 h-14 px-4 bg-transparent focus:outline-none"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button
                      onClick={handleSearch}
                      className="bg-teal hover:bg-navy text-white rounded-2xl h-14 px-10 flex items-center justify-center text-lg font-black uppercase tracking-widest shadow-lg transform hover:scale-105 transition-all"
                    >
                      Search
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={() => navigate("/rfp-form")}
                    className="h-16 px-12 bg-navy hover:bg-teal text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 group"
                  >
                    Custom Requirement? <span className="text-teal">Fill RFP Form</span> 
                    <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                      <MoveRight className="w-4 h-4" />
                    </div>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <Button
                    onClick={handleListProperty}
                    className="bg-teal hover:bg-navy text-white rounded-3xl h-20 px-16 text-2xl font-black uppercase tracking-widest shadow-2xl transform hover:scale-105 transition-all flex items-center gap-4"
                  >
                    List My Property <MoveRight className="w-8 h-8" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/broker/login")}
                    className="bg-white border-2 border-navy/10 text-navy rounded-3xl h-20 px-12 text-xl font-black uppercase tracking-widest shadow-lg hover:border-teal transition-all"
                  >
                    Dashboard
                  </Button>
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