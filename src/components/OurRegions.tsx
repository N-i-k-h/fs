import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BANGALORE_REGIONS } from "@/data/regions";

const OurRegions = () => {
    const navigate = useNavigate();
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

    const handleRegionClick = (regionName: string) => {
        navigate(`/search?region=${encodeURIComponent(regionName)}`);
    };

    // Find the current active image based on hover
    const activeRegionData = BANGALORE_REGIONS.find(r => r.name === hoveredRegion);
    // Show image only when hovering
    const bgImage = activeRegionData?.image || null;

    return (
        <section className="relative min-h-[550px] flex items-center py-12 md:py-20 px-6 md:px-16 overflow-hidden transition-all duration-700 ease-in-out bg-white">
            {/* Dynamic Background Image */}
            <div className={`absolute inset-0 z-0 transition-colors duration-700 ${bgImage ? 'bg-transparent' : 'bg-white'}`}>
                {bgImage && (
                    <img
                        src={bgImage}
                        alt="Current Region"
                        className="w-full h-full object-cover transition-all duration-1000 transform scale-100 opacity-100 animate-in fade-in duration-700"
                    />
                )}
                {/* Refined Gradient Overlay - Stronger on mobile for readability */}
                <div className={`absolute inset-0 transition-opacity duration-700 ${bgImage ? 'opacity-100 bg-white/90 md:bg-gradient-to-r md:from-white md:via-white/80 md:to-transparent' : 'opacity-0'}`} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-24">

                {/* Left Side: Header */}
                <div className="md:w-1/3 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-black text-navy mb-3 md:mb-4 tracking-tighter">
                        Our Regions
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 font-semibold">
                        Discover the workspace you've been waiting for.
                    </p>
                </div>

                {/* Right Side: Region List/Grid */}
                <div className="md:w-2/3 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {BANGALORE_REGIONS.map((region) => (
                            <div
                                key={region.id}
                                className={`
                                    flex items-center justify-between p-6 rounded-lg cursor-pointer transition-all duration-300 border-2
                                    ${hoveredRegion === region.name
                                        ? "bg-sky-500 border-sky-500 text-white shadow-2xl translate-x-2"
                                        : "bg-white border-transparent text-navy hover:bg-gray-50 hover:border-sky-100 shadow-md"}
                                `}
                                onClick={() => handleRegionClick(region.name)}
                                onMouseEnter={() => setHoveredRegion(region.name)}
                                onMouseLeave={() => setHoveredRegion(null)}
                            >
                                <span className="text-xl font-extrabold tracking-tight">
                                    {region.name}
                                </span>
                                <ChevronRight className={`
                                    w-6 h-6 transition-transform duration-300
                                    ${hoveredRegion === region.name ? "translate-x-1 text-white" : "text-gray-400"}
                                `} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurRegions;

