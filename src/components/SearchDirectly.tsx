import { Search, MapPin, Users, Building, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BANGALORE_REGIONS } from "@/data/regions";

const SearchDirectly = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState("");
    const [area, setArea] = useState("");
    const [seats, setSeats] = useState("");

    // State for dynamic data
    const [locations, setLocations] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get('/api/spaces');
                const spaces = res.data;

                // Process spaces to extract cities and their areas
                const locMap: Record<string, Set<string>> = {};

                spaces.forEach((space: any) => {
                    const c = space.city || "Bangalore"; // Default if missing
                    const a = space.location || "";

                    if (!locMap[c]) {
                        locMap[c] = new Set();
                    }
                    if (a) {
                        locMap[c].add(a.trim());
                    }
                });

                // Convert Sets to Arrays
                const finalLocs: Record<string, string[]> = {};
                Object.keys(locMap).forEach(key => {
                    finalLocs[key] = Array.from(locMap[key]).sort();
                });

                setLocations(finalLocs);

                // If only one city exists, auto-select it
                const cities = Object.keys(finalLocs);
                if (cities.length === 1) {
                    setCity(cities[0]);
                }
            } catch (err) {
                console.error("Failed to fetch locations", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (city) params.append("location", city);

        // Check if the selected area is a region or a micro-location
        const isRegion = BANGALORE_REGIONS.some(r => r.name === area);
        if (area && area !== "all-areas") {
            if (isRegion) {
                params.append("region", area);
            } else {
                params.append("market", area);
            }
        }

        if (seats) params.append("seats", seats);
        navigate(`/search?${params.toString()}`);
    };

    const availableCities = Object.keys(locations);
    const availableAreas = city ? locations[city] : [];

    // Group areas by region if city is Bangalore
    const groupedAreas = city.toLowerCase() === "bangalore" ? BANGALORE_REGIONS.map(region => ({
        ...region,
        items: availableAreas.filter(a => region.microLocations.some(ml => a.toLowerCase().includes(ml.toLowerCase())))
    })).filter(group => group.items.length > 0) : [];

    // Areas that don't fit into any region
    const otherAreas = city.toLowerCase() === "bangalore" ? availableAreas.filter(a =>
        !BANGALORE_REGIONS.some(region => region.microLocations.some(ml => a.toLowerCase().includes(ml.toLowerCase())))
    ) : availableAreas;

    return (
        <section className="relative py-8 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

                        {/* City Dropdown */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> City
                            </label>
                            <Select onValueChange={(val) => { setCity(val); setArea(""); }} value={city}>
                                <SelectTrigger className="h-12 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white transition-all font-semibold text-navy">
                                    <SelectValue placeholder={loading ? "Loading..." : "Select City"} />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {availableCities.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Area Dropdown (2-Level Hierarchy) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Building className="w-3 h-3" /> Area
                            </label>
                            <Select onValueChange={setArea} value={area} disabled={!city}>
                                <SelectTrigger className="h-12 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white transition-all font-semibold text-navy disabled:opacity-50">
                                    <SelectValue placeholder={city ? "Select Area" : "Select City First"} />
                                </SelectTrigger>
                                <SelectContent className="max-h-[400px]">
                                    <SelectItem value="all-areas">All Areas</SelectItem>

                                    {city.toLowerCase() === "bangalore" ? (
                                        <>
                                            {groupedAreas.map(group => (
                                                <SelectGroup key={group.id}>
                                                    <SelectLabel className="text-teal font-bold bg-teal/5 py-2 px-4 mt-2 mb-1 rounded-sm">{group.name}</SelectLabel>
                                                    {/* Option to select the whole region */}
                                                    <SelectItem value={group.name} className="font-semibold text-navy bg-navy/5">All {group.name}</SelectItem>
                                                    {group.items.map(a => (
                                                        <SelectItem key={a} value={a} className="pl-8">{a}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            ))}
                                            {otherAreas.length > 0 && (
                                                <SelectGroup>
                                                    <SelectLabel className="text-gray-400 font-bold py-2 px-4 mt-2">Other Areas</SelectLabel>
                                                    {otherAreas.map(a => (
                                                        <SelectItem key={a} value={a}>{a}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            )}
                                        </>
                                    ) : (
                                        availableAreas.map((a) => (
                                            <SelectItem key={a} value={a}>{a}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Number of Employees */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Users className="w-3 h-3" /> Number of Employees
                            </label>
                            <Input
                                placeholder="e.g. 10"
                                type="number"
                                value={seats}
                                onChange={(e) => setSeats(e.target.value)}
                                className="h-12 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white transition-all font-semibold text-navy placeholder:font-normal"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchDirectly;

