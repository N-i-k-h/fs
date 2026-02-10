import { Search, MapPin, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
                        locMap[c].add(a);
                    }
                });

                // Convert Sets to Arrays
                const finalLocs: Record<string, string[]> = {};
                Object.keys(locMap).forEach(key => {
                    finalLocs[key] = Array.from(locMap[key]);
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
        if (area && area !== "all-areas") params.append("market", area);
        if (seats) params.append("seats", seats);
        navigate(`/search?${params.toString()}`);
    };

    const availableCities = Object.keys(locations);
    const availableAreas = city ? locations[city] : [];

    return (
        <section className="relative py-8 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100">

                    <div className="flex items-center gap-2 mb-6 text-navy">
                        <Search className="w-6 h-6 text-teal" strokeWidth={3} />
                        <h3 className="text-2xl font-bold">Search Directly</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[1.5fr_1.5fr_1fr_auto] gap-4 items-end">

                        {/* City Dropdown */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> City
                            </label>
                            <Select onValueChange={(val) => { setCity(val); setArea(""); }} value={city}>
                                <SelectTrigger className="h-12 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white transition-all font-semibold text-navy">
                                    <SelectValue placeholder={loading ? "Loading..." : "Select City"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableCities.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Area Dropdown */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Building className="w-3 h-3" /> Area
                            </label>
                            <Select onValueChange={setArea} value={area} disabled={!city}>
                                <SelectTrigger className="h-12 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white transition-all font-semibold text-navy disabled:opacity-50">
                                    <SelectValue placeholder={city ? "Select Area" : "Select City First"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-areas">All Areas</SelectItem>
                                    {availableAreas.map((a) => (
                                        <SelectItem key={a} value={a}>{a}</SelectItem>
                                    ))}
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



                        {/* Search Button */}
                        <div className="">
                            <Button
                                onClick={handleSearch}
                                className="w-full h-12 bg-teal hover:bg-teal/90 text-white font-bold rounded-lg shadow-lg hover:shadow-teal/20 transition-all text-base"
                            >
                                <Search className="w-5 h-5 mr-2" /> Search
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchDirectly;
