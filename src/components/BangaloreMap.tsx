import { cn } from "@/lib/utils";
import mapImage from "@/assets/bangalore-map.png";

interface MapProps {
    hoveredMarket: string | null;
    selectedMarket: string | null;
    onHover: (id: string | null) => void;
    onClick: (id: string) => void;
}

const BangaloreMap = ({ hoveredMarket, selectedMarket, onHover, onClick }: MapProps) => {
    
    // Region hotspots defined as relative percentages (x, y coordinate pairs for polygon)
    const regions = [
        { 
            id: "byatarayanapura", 
            name: "North", 
            points: "35,10 65,10 70,35 40,40 25,25" 
        },
        { 
            id: "mahadevapura", 
            name: "East", 
            points: "70,45 95,50 95,75 75,85 65,65" 
        },
        { 
            id: "bommanahalli", 
            name: "South East", 
            points: "45,75 75,70 85,95 40,95 30,85" 
        },
        { 
            id: "dasarahalli", 
            name: "North West", 
            points: "15,25 35,25 35,50 15,50" 
        },
        { 
            id: "rr_nagar", 
            name: "South West", 
            points: "15,65 35,65 35,90 15,90" 
        },
        { 
            id: "east", 
            name: "Mid East", 
            points: "55,40 75,40 75,65 55,65" 
        },
        { 
            id: "south", 
            name: "South", 
            points: "35,65 55,65 55,85 35,85" 
        },
        { 
            id: "west", 
            name: "West", 
            points: "10,50 30,50 30,70 10,70" 
        }
    ];

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-[600px] aspect-square group/map">
                {/* The exact Photo as background */}
                <img 
                    src={mapImage} 
                    alt="Bangalore Micro-Markets Map"
                    className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
                />

                {/* Interactive SVG Overlay (Invisible/Transparent) */}
                <svg 
                    viewBox="0 0 100 100" 
                    className="absolute inset-0 w-full h-full cursor-default"
                >
                    {regions.map((region) => (
                        <polygon
                            key={region.id}
                            points={region.points}
                            onMouseEnter={() => onHover(region.id)}
                            onMouseLeave={() => onHover(null)}
                            onClick={() => onClick(region.id)}
                            className={cn(
                                "transition-all duration-300 cursor-pointer outline-none",
                                hoveredMarket === region.id || selectedMarket === region.id
                                    ? "fill-teal/30 stroke-teal stroke-[0.5] drop-shadow-lg"
                                    : "fill-transparent"
                            )}
                        />
                    ))}
                </svg>

                {/* Floating Labels (Responsive) */}
                {regions.map((region) => {
                    const coords = region.points.split(' ')[0].split(',');
                    const x = coords[0];
                    const y = coords[1];
                    
                    return (
                        <div 
                            key={`label-${region.id}`}
                            className={cn(
                                "absolute pointer-events-none transition-all duration-500",
                                hoveredMarket === region.id ? "opacity-100 scale-110" : "opacity-0 scale-90"
                            )}
                            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            <div className="bg-navy px-3 py-1.5 rounded-full shadow-2xl border border-white/20">
                                <p className="text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                    {region.id.replace('_', ' ')}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BangaloreMap;
