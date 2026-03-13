import { useState, useEffect } from "react";
import { Building2, Search, Plus, MoreVertical, Edit2, Trash2, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const BrokerSpaces = () => {
    const navigate = useNavigate();
    const [spaces, setSpaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchMySpaces = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/spaces/my-spaces');
            setSpaces(res.data);
        } catch (err) {
            console.error("Failed to fetch spaces:", err);
            toast.error("Could not load your buildings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMySpaces();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        try {
            await axios.delete(`/api/spaces/${id}`);
            toast.success("Space deleted successfully");
            fetchMySpaces();
        } catch (err) {
            toast.error("Failed to delete space");
        }
    };

    const filteredSpaces = spaces.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-navy">My <span className="text-teal">Buildings</span></h1>
                    <p className="text-gray-500">Manage your property portfolio and technical specs.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search properties..."
                            className="pl-10 h-11 bg-white border-gray-100 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => navigate("/broker/submit-property")} className="bg-teal hover:bg-teal/90 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-teal/20">
                        <Plus className="w-5 h-5 mr-1" /> Add Building
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />)}
                </div>
            ) : filteredSpaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSpaces.map((space) => (
                        <Card key={space._id} className="border-none shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden group">
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={space.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"}
                                    alt={space.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm border-none shadow-sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl cursor-pointer">
                                            <DropdownMenuItem onClick={() => navigate(`/broker/edit-space/${space._id}`)} className="cursor-pointer gap-2">
                                                <Edit2 className="w-4 h-4" /> Edit Building
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(space._id)} className="text-red-600 focus:text-red-600 gap-2 cursor-pointer">
                                                <Trash2 className="w-4 h-4" /> Delete Building
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <Badge className="bg-white/90 backdrop-blur-sm text-navy hover:bg-white font-bold rounded-lg border-none">
                                        {space.type?.[0] || 'Office'}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-navy mb-2 line-clamp-1">{space.name}</h3>
                                <div className="flex items-center text-sm text-gray-500 mb-4 gap-1">
                                    <MapPin className="w-4 h-4 text-teal" /> {space.location}, {space.city}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Starting at</span>
                                        <span className="text-lg font-bold text-teal">₹{space.price}<span className="text-xs font-normal text-gray-400">/sqft</span></span>
                                    </div>
                                    <Button variant="ghost" className="h-10 w-10 p-0 text-gray-400 hover:text-teal hover:bg-teal/5" onClick={() => window.open(space.googleMapUrl, '_blank')}>
                                        <ExternalLink className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <Building2 className="w-16 h-16 text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-navy">No buildings yet</h3>
                    <p className="text-gray-400 mb-8">Start by listing your first property on the platform.</p>
                    <Button onClick={() => navigate("/broker/submit-property")} className="bg-teal text-white font-bold rounded-xl px-8 h-12">
                        Get Started
                    </Button>
                </div>
            )}
        </div>
    );
};

export default BrokerSpaces;
