import { Search, MapPin, Users, Building, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MICRO_MARKETS = {
    bangalore: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "MG Road"],
    mumbai: ["Bandra", "Andheri", "Powai", "Lower Parel", "BKC"],
    delhi: ["Connaught Place", "Saket", "Nehru Place", "Hauz Khas", "Dwarka"],
    hyderabad: ["Hitech City", "Gachibowli", "Jubilee Hills", "Banjara Hills", "Madhapur"],
};

const SearchDirectly = () => {
    const navigate = useNavigate();
    const [city, setCity] = useState("");
    const [area, setArea] = useState("");
    const [seats, setSeats] = useState("");
    const [budget, setBudget] = useState("");
    const [building, setBuilding] = useState("");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (city) params.append("location", city);
        if (area && area !== "all-areas") params.append("market", area);
        if (seats) params.append("seats", seats);
        if (budget) params.append("price", budget);
        navigate(`/search?${params.toString()}`);
    };

    return (
        <section className="relative py-8 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-8 border border-gray-100">

                    <div className="flex items-center gap-2 mb-6 text-navy">
                        <Search className="w-6 h-6 text-teal" strokeWidth={3} />
                        <h3 className="text-2xl font-bold">Search Directly</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-[1.5fr_1.5fr_1fr_1fr_auto] gap-4 items-end">

                        {/* City Dropdown */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> City
                            </label>
                            <Select onValueChange={(val) => { setCity(val); setArea(""); }} value={city}>
                                <SelectTrigger className="h-12 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white transition-all font-semibold text-navy">
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bangalore">Bangalore</SelectItem>
                                    <SelectItem value="mumbai">Mumbai</SelectItem>
                                    <SelectItem value="delhi">Delhi</SelectItem>
                                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
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
                                    {city && MICRO_MARKETS[city]?.map((m) => (
                                        <SelectItem key={m} value={m.toLowerCase().replace(/\s+/g, '-')}>{m}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Seats */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Users className="w-3 h-3" /> Seats
                            </label>
                            <Input
                                placeholder="e.g. 10"
                                type="number"
                                value={seats}
                                onChange={(e) => setSeats(e.target.value)}
                                className="h-12 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white transition-all font-semibold text-navy placeholder:font-normal"
                            />
                        </div>

                        {/* Budget */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <Coins className="w-3 h-3" /> Budget
                            </label>
                            <Select onValueChange={setBudget} value={budget}>
                                <SelectTrigger className="h-12 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white transition-all font-semibold text-navy">
                                    <SelectValue placeholder="Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="below-10k">&lt; ₹10k</SelectItem>
                                    <SelectItem value="10k-20k">₹10k - ₹20k</SelectItem>
                                    <SelectItem value="20k-50k">₹20k - ₹50k</SelectItem>
                                    <SelectItem value="50k-plus">₹50k+</SelectItem>
                                </SelectContent>
                            </Select>
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
