import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Trash2, Star, Edit, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Space {
    _id: string;
    id: number;
    name: string;
    city: string;
    location: string;
    price: number;
    isFeatured: boolean;
    type: string;
}

const AdminSpaces = () => {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Spaces
    const fetchSpaces = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/spaces');
            setSpaces(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load spaces");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpaces();
    }, []);

    // Toggle Featured
    const toggleFeatured = async (id: string, currentStatus: boolean) => {
        try {
            await axios.put(`http://localhost:5000/api/spaces/${id}`, { isFeatured: !currentStatus });
            setSpaces(spaces.map(s => s._id === id ? { ...s, isFeatured: !currentStatus } : s));
            toast.success(currentStatus ? "Removed from featured" : "Marked as featured");
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    // Delete Space
    const deleteSpace = async (id: string) => {
        if (!confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) return;

        try {
            await axios.delete(`http://localhost:5000/api/spaces/${id}`);
            setSpaces(spaces.filter(s => s._id !== id));
            toast.success("Workspace deleted successfully");
        } catch (err) {
            toast.error("Failed to delete workspace");
        }
    };

    const filteredSpaces = spaces.filter(space =>
        space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        space.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-navy">Manage Workspaces</h1>
                    <p className="text-muted-foreground mt-1">View, edit, or delete existing workspaces.</p>
                </div>
                <Link to="/admin/add-space">
                    <Button className="bg-teal hover:bg-teal/90"><Plus className="w-4 h-4 mr-2" /> Add New Space</Button>
                </Link>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>All Listings</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search spaces..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center py-8">Loading spaces...</p>
                    ) : (
                        <div className="overflow-x-auto rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Name</th>
                                        <th className="px-6 py-3 font-medium">Location</th>
                                        <th className="px-6 py-3 font-medium">Type</th>
                                        <th className="px-6 py-3 font-medium">Price</th>
                                        <th className="px-6 py-3 font-medium text-center">Featured</th>
                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {filteredSpaces.map((space) => (
                                        <tr key={space._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{space.name}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-teal" />
                                                    {space.location}, {space.city}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 capitalize">{space.type.replace('-', ' ')}</td>
                                            <td className="px-6 py-4 font-semibold">₹{space.price.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => toggleFeatured(space._id, space.isFeatured)}
                                                    className={`p-1 rounded-full transition-colors ${space.isFeatured ? 'bg-yellow-100 text-yellow-600' : 'text-gray-300 hover:text-yellow-400'}`}
                                                    title="Toggle Featured"
                                                >
                                                    <Star className={`w-5 h-5 ${space.isFeatured ? 'fill-current' : ''}`} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => deleteSpace(space._id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredSpaces.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-muted-foreground">No workspaces found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminSpaces;
