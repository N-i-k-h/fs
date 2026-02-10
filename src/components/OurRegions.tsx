import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Fallback regions with placeholder images
const fallbackRegions = [
    { name: "Koramangala", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
    { name: "Indiranagar", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80" },
    { name: "HSR Layout", image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80" },
    { name: "Whitefield", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80" },
    { name: "Electronic City", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
    { name: "Marathahalli", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80" },
    { name: "Jayanagar", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
    { name: "BTM Layout", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
    { name: "MG Road", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80" },
    { name: "Bannerghatta Road", image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80" },
    { name: "Bellandur", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80" },
    { name: "Sarjapur Road", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
];

// Office/workspace themed images
const workspaceImages = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
];

const OurRegions = () => {
    const navigate = useNavigate();
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [regions, setRegions] = useState<Array<{ name: string; image: string }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const res = await axios.get('/api/spaces');
                const spaces = res.data;

                // Extract unique locations/areas
                const uniqueAreas = new Set<string>();
                spaces.forEach((space: any) => {
                    if (space.location) {
                        uniqueAreas.add(space.location);
                    }
                });

                // Convert to array and assign images
                const areasArray = Array.from(uniqueAreas).map((area, index) => ({
                    name: area,
                    image: workspaceImages[index % workspaceImages.length]
                }));

                // If we have areas, use them; otherwise use fallback
                if (areasArray.length > 0) {
                    setRegions(areasArray);
                } else {
                    setRegions(fallbackRegions);
                }
            } catch (err) {
                console.error("Failed to fetch regions", err);
                setRegions(fallbackRegions);
            } finally {
                setLoading(false);
            }
        };

        fetchRegions();
    }, []);

    const handleRegionClick = (regionName: string) => {
        navigate(`/search?market=${encodeURIComponent(regionName)}`);
    };

    if (loading) {
        return (
            <section className="hidden lg:block py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-navy mb-3">
                            Our Regions
                        </h2>
                        <p className="text-lg text-gray-600">
                            Discover the home you've been waiting for.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="hidden lg:block relative py-16 px-4 bg-white overflow-hidden">

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-navy mb-2">
                        Our Regions
                    </h2>
                    <p className="text-base text-gray-600">
                        Discover the workspace you've been waiting for.
                    </p>
                </div>

                {/* Regions Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {regions.map((region) => (
                        <div
                            key={region.name}
                            className="relative cursor-pointer overflow-hidden rounded-lg bg-white border border-gray-200 hover:border-navy transition-all duration-300 hover:shadow-lg group"
                            onClick={() => handleRegionClick(region.name)}
                            onMouseEnter={() => setHoveredRegion(region.name)}
                            onMouseLeave={() => setHoveredRegion(null)}
                        >
                            {/* Background Image - Shows on Hover inside the card */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <img
                                    src={region.image}
                                    alt={region.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-navy/70" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 px-3 py-3 flex items-center justify-between min-h-[60px]">
                                <span className="text-xs font-semibold text-navy group-hover:text-white transition-colors duration-300 leading-tight">
                                    {region.name}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0 ml-1.5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurRegions;
