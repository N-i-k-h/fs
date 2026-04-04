import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveRight, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import BangaloreMap from "./BangaloreMap";

const markets = [
    { id: "byatarayanapura", name: "Byatarayanapura", description: "Strategic North Bangalore hub" },
    { id: "dasarahalli", name: "Dasarahalli", description: "Rapidly growing North-West zone" },
    { id: "west", name: "West Bangalore", description: "Logistics & industrial corridor" },
    { id: "rr_nagar", name: "RR Nagar", description: "Premier South-West micro-market" },
    { id: "south", name: "South Bangalore", description: "Established corporate node" },
    { id: "bommanahalli", name: "Bommanahalli", description: "Strategic South-East connectivity" },
    { id: "east", name: "East Bangalore", description: "Premium tech corridors" },
    { id: "mahadevapura", name: "Mahadevapura", description: "The global IT heartland" }
];

const OurRegions = () => {
    const navigate = useNavigate();
    const [hoveredMarket, setHoveredMarket] = useState<string | null>(null);
    const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

    const handleMarketClick = (marketId: string) => {
        setSelectedMarket(marketId);
        const market = markets.find(m => m.id === marketId);
        if (market) {
            navigate(`/search?market=${encodeURIComponent(market.name)}`);
        }
    };

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                
                {/* Header */}
                <div className="mb-10 md:mb-16 animate-in slide-in-from-left-4 duration-700">
                    <span className="inline-block px-3 py-1 bg-teal/10 text-teal rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">
                        Market Intelligence
                    </span>
                    <h2 className="text-3xl md:text-6xl font-black text-navy tracking-tight leading-none mb-4">
                        Micro-Markets
                    </h2>
                    <p className="text-base md:text-lg text-gray-500 max-w-xl font-medium px-1">
                        Explore Bangalore's strategic business corridors with precision spatial mapping.
                    </p>
                </div>

                {/* Main Split Layout */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                    
                    {/* Left Panel: Market List */}
                    <div className="w-full lg:w-[35%] order-2 lg:order-1 space-y-3">
                        {markets.map((market) => (
                            <motion.div
                                key={market.id}
                                onMouseEnter={() => setHoveredMarket(market.id)}
                                onMouseLeave={() => setHoveredMarket(null)}
                                onClick={() => handleMarketClick(market.id)}
                                className={cn(
                                    "p-5 rounded-[1.5rem] cursor-pointer transition-all duration-500 border-2 flex flex-col gap-0.5 relative overflow-hidden group/item",
                                    hoveredMarket === market.id || selectedMarket === market.id
                                        ? "bg-teal/5 border-teal/20 shadow-xl shadow-teal/5 translate-x-2"
                                        : "bg-white border-transparent hover:border-gray-100 hover:bg-gray-50 shadow-sm"
                                )}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <h3 className={cn(
                                        "text-lg font-black transition-colors duration-300",
                                        hoveredMarket === market.id || selectedMarket === market.id ? "text-teal" : "text-navy"
                                    )}>
                                        {market.name}
                                    </h3>
                                    <div className={cn(
                                        "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500",
                                        hoveredMarket === market.id || selectedMarket === market.id ? "bg-teal text-white rotate-0" : "bg-gray-50 text-gray-300 -rotate-45"
                                    )}>
                                        <MoveRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <p className={cn(
                                    "text-[13px] font-medium transition-colors duration-300 relative z-10",
                                    hoveredMarket === market.id || selectedMarket === market.id ? "text-navy/70" : "text-gray-400"
                                )}>
                                    {market.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Panel: Interactive SVG Map Component */}
                    <div className="w-full lg:w-[65%] order-1 lg:order-2 flex flex-col items-center justify-center relative min-h-[350px] md:min-h-[400px] lg:min-h-[600px] bg-gray-50/30 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 p-4 md:p-8 shadow-inner overflow-hidden">
                        
                        <BangaloreMap 
                            hoveredMarket={hoveredMarket}
                            selectedMarket={selectedMarket}
                            onHover={setHoveredMarket}
                            onClick={handleMarketClick}
                        />

                        {/* Interactive UI Overlay / Legend */}
                        <div className="absolute top-8 left-8 hidden md:block">
                            <AnimatePresence>
                                {hoveredMarket && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="p-5 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-teal/10 max-w-[220px]"
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className="w-1.5 h-1.5 bg-teal rounded-full animate-ping" />
                                            <h4 className="text-navy font-black leading-none text-[10px] uppercase tracking-widest">
                                                Active Zone
                                            </h4>
                                        </div>
                                        <p className="text-sm font-black text-navy mb-1 capitalize">
                                            {hoveredMarket.replace('_', ' ')}
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                                            Click to explore local inventory and workspace stats.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Floating Navigation Instructions */}
                        <div className="absolute bottom-8 right-8 flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full shadow-sm">
                            <Search className="w-3 h-3 text-teal" />
                            <span className="text-[10px] font-black text-navy/40 uppercase tracking-tighter italic">
                                Interactive Intelligence Map
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default OurRegions;

