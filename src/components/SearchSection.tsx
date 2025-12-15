import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchSection = () => {
  const navigate = useNavigate();

  // State to capture user input
  const [city, setCity] = useState("");
  const [market, setMarket] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState(""); // Changed from Building to Type to match SearchPage logic
  const [seats, setSeats] = useState("");

  const handleSearch = () => {
    // 1. Validation: Main Location (City) is required
    if (!city) {
      alert("Please select a location to search.");
      return;
    }

    // 2. Construct Query Params (Only add if selected)
    const params = new URLSearchParams();
    params.append("location", city);
    
    if (market) params.append("market", market);
    if (price) params.append("price", price);
    if (type) params.append("type", type);
    if (seats) params.append("seats", seats);

    // 3. Navigate
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
           Search  <span className="text-teal">directly</span>
        </h2>

        <div className="bg-card rounded-2xl shadow-card p-8 md:p-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Location (City) - REQUIRED */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location <span className="text-teal">*</span>
              </label>
              <Select onValueChange={(val) => { setCity(val); setMarket(""); }} value={city}>
                <SelectTrigger className="w-full h-12 bg-background border-border">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Micromarket - OPTIONAL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Micromarket
              </label>
              <Select 
                disabled={!city} 
                onValueChange={setMarket} 
                value={market}
              >
                <SelectTrigger className="w-full h-12 bg-background border-border">
                  <SelectValue placeholder={city ? "Select area" : "Select city first"} />
                </SelectTrigger>
                <SelectContent>
                  {/* Ideally fetch these dynamically based on city, keeping static for now based on snippet */}
                  <SelectItem value="hsr-layout">HSR Layout</SelectItem>
                  <SelectItem value="indiranagar">Indiranagar</SelectItem>
                  <SelectItem value="whitefield">Whitefield</SelectItem>
                  <SelectItem value="koramangala">Koramangala</SelectItem>
                  <SelectItem value="bandra">Bandra</SelectItem>
                  <SelectItem value="hitech-city">Hitech City</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range - OPTIONAL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price Range
              </label>
              <Select onValueChange={setPrice} value={price}>
                <SelectTrigger className="w-full h-12 bg-background border-border">
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="below-10k">&lt; ₹10,000</SelectItem>
                  <SelectItem value="10k-20k">₹10,000 - ₹20,000</SelectItem>
                  <SelectItem value="20k-50k">₹20,000 - ₹50,000</SelectItem>
                  <SelectItem value="50k-plus">₹50,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Type - OPTIONAL (Mapped to 'type' filter) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Workspace Type
              </label>
              <Select onValueChange={setType} value={type}>
                <SelectTrigger className="w-full h-12 bg-background border-border">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private-office">Private Office</SelectItem>
                  <SelectItem value="dedicated-desk">Dedicated Desk</SelectItem>
                  <SelectItem value="hot-desk">Hot Desk</SelectItem>
                  <SelectItem value="meeting-room">Meeting Room</SelectItem>
                  <SelectItem value="virtual-office">Virtual Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* No. of Seats - OPTIONAL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                No. of Seats
              </label>
              <Select onValueChange={setSeats} value={seats}>
                <SelectTrigger className="w-full h-12 bg-background border-border">
                  <SelectValue placeholder="Any Capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1 - 5</SelectItem>
                  <SelectItem value="6-10">6 - 10</SelectItem>
                  <SelectItem value="11-20">11 - 20</SelectItem>
                  <SelectItem value="20-plus">20+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button 
              onClick={handleSearch}
              variant="default" // Changed to default assuming 'teal' isn't in default shadcn config, otherwise keep "teal"
              size="lg" 
              className="h-12 w-full rounded-xl font-semibold bg-teal hover:bg-teal/90 text-white"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Workspaces
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;