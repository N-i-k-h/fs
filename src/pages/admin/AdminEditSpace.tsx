import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Plus, X, ArrowLeft, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// --- HELPER COMPONENT: List Editor for Key-Value Pairs ---
const ListEditor = ({ title, items, onChange, fields }: { title: string, items: any[], onChange: (items: any[]) => void, fields: { key: string, label: string }[] }) => {
    const handleItemChange = (index: number, key: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        onChange(newItems);
    };

    const deleteItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const addItem = () => {
        const newItem: any = {};
        fields.forEach(f => newItem[f.key] = "");
        onChange([...items, newItem]);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">{title}</Label>
                <Button type="button" size="sm" variant="outline" onClick={addItem}><Plus className="w-3 h-3 mr-1" /> Add Item</Button>
            </div>
            {items.map((item, index) => (
                <div key={index} className="grid gap-2 p-3 bg-gray-50 rounded border relative group">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 bg-white border shadow-sm rounded-full text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteItem(index)}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                    <div className={`grid grid-cols-${fields.length} gap-2`}>
                        {fields.map(field => (
                            <div key={field.key}>
                                <Input
                                    placeholder={field.label}
                                    value={item[field.key] || ""}
                                    onChange={(e) => handleItemChange(index, field.key, e.target.value)}
                                    className="h-8 text-xs"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {items.length === 0 && <p className="text-xs text-gray-400 italic">No {title.toLowerCase()} added.</p>}
        </div>
    );
};

const AdminEditSpace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        type: ["coworking"] as string[], // Changed to array for multiple categories
        description: "",
        address: "",
        city: "bangalore",
        location: "", // Micro market
        price: 0,
        seats: 0,
        availableSeats: 0,
        amenities: [] as string[],
        images: [] as string[],
        snapshot: {
            capacity: "",
            area: "",
            lock_in: ""
        },
        highlights: [] as any[],
        commercials: [] as any[],
        compliance: [] as any[]
    });

    const [newImage, setNewImage] = useState("");
    const [newAmenity, setNewAmenity] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchSpace = async () => {
            try {
                const res = await axios.get(`/api/spaces/${id}`);
                const data = res.data;

                setFormData({
                    name: data.name || "",
                    type: Array.isArray(data.type) ? data.type : [data.type || "coworking"], // Handle both array and string
                    description: data.description || "",
                    address: data.address || "", // Currently not in schema explicitly but might come from location
                    city: data.city || "Bangalore",
                    location: data.location || "",
                    price: data.price || 0,
                    seats: data.seats || 0,
                    availableSeats: data.availableSeats || 0,
                    amenities: data.amenities || [],
                    images: data.images || [],
                    snapshot: data.snapshot || { capacity: "", area: "", lock_in: "" },
                    highlights: data.highlights || [],
                    commercials: data.commercials || [],
                    compliance: data.compliance || []
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load workspace details. Ensure backend is running.");
                setLoading(false);
            }
        };
        if (id) fetchSpace();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        if (id.startsWith("snapshot.")) {
            const field = id.split(".")[1];
            setFormData(prev => ({ ...prev, snapshot: { ...prev.snapshot, [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSelectChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleCategoryToggle = (category: string) => {
        setFormData(prev => {
            const current = prev.type;
            if (current.includes(category)) {
                // Don't allow removing the last category
                if (current.length === 1) {
                    toast.error("At least one category must be selected");
                    return prev;
                }
                return { ...prev, type: current.filter(t => t !== category) };
            } else {
                return { ...prev, type: [...current, category] };
            }
        });
    };

    const handleAmenityToggle = (amenity: string) => {
        setFormData(prev => {
            const current = prev.amenities;
            if (current.includes(amenity)) {
                return { ...prev, amenities: current.filter(a => a !== amenity) };
            } else {
                return { ...prev, amenities: [...current, amenity] };
            }
        });
    };

    const addCustomAmenity = () => {
        if (!newAmenity.trim()) return;
        if (!formData.amenities.includes(newAmenity.trim())) {
            setFormData(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity.trim()] }));
        }
        setNewAmenity("");
    };

    const addImage = () => {
        if (!newImage.trim()) return;
        setFormData(prev => ({ ...prev, images: [...prev.images, newImage] }));
        setNewImage("");
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("image", file);

        try {
            const res = await axios.post("/api/upload", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setFormData(prev => ({ ...prev, images: [...prev.images, res.data.url] }));
            toast.success("Image uploaded successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const moveImageToFront = (index: number) => {
        if (index === 0) return;
        setFormData(prev => {
            const images = [...prev.images];
            const [item] = images.splice(index, 1);
            images.unshift(item);
            return { ...prev, images };
        });
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await axios.put(`/api/spaces/${id}`, formData);
            toast.success("Workspace updated successfully");
            navigate("/admin/spaces");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update workspace");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    const commonAmenities = ['WiFi', 'Coffee', 'Meeting Rooms', 'Reception', 'Power Backup', 'AC', 'Parking', 'Printers', 'Cleaning', 'Security'];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-24">
            <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 sticky top-16 z-10 border-b border-gray-100 mb-6 rounded-xl">
                <div>
                    <Button variant="ghost" onClick={() => navigate("/admin/spaces")} className="pl-0 hover:pl-2 transition-all mb-1 h-auto py-1">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Spaces
                    </Button>
                    <h1 className="text-2xl font-bold text-navy">Edit Workspace</h1>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate("/admin/spaces")}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={saving} className="bg-teal hover:bg-teal/90 text-white shadow-lg shadow-teal/20">
                        {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Space Name</Label>
                                    <Input id="name" value={formData.name} onChange={handleChange} placeholder="e.g. WeWork Galaxy" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Workspace Categories (Select one or more)</Label>
                                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
                                        {[
                                            { value: "private-office", label: "Private Office" },
                                            { value: "hot-desk", label: "Hot Desk" },
                                            { value: "coworking", label: "Coworking" },
                                            { value: "managed", label: "Managed Office" },
                                            { value: "enterprise", label: "Enterprise" }
                                        ].map((category) => (
                                            <div
                                                key={category.value}
                                                onClick={() => handleCategoryToggle(category.value)}
                                                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border transition-all ${formData.type.includes(category.value)
                                                        ? "bg-teal text-white border-teal shadow-md"
                                                        : "bg-white text-gray-600 border-gray-200 hover:border-teal/50 hover:bg-teal/5"
                                                    }`}
                                            >
                                                {category.label}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 italic">
                                        Selected: {formData.type.map(t => t.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={formData.description} onChange={handleChange} className="h-24" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" value={formData.city} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Micro Market (Area)</Label>
                                    <Input id="location" value={formData.location} onChange={handleChange} placeholder="e.g. Koramangala" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Pricing & Snapshot</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (₹/Seat)</Label>
                                    <Input id="price" type="number" value={formData.price} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="seats">Total Seats</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setFormData(prev => ({ ...prev, seats: Math.max(0, Number(prev.seats) - 1) }))}
                                        >
                                            -
                                        </Button>
                                        <Input
                                            id="seats"
                                            type="number"
                                            value={formData.seats}
                                            onChange={handleChange}
                                            className="text-center"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setFormData(prev => ({ ...prev, seats: Number(prev.seats) + 1 }))}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="availableSeats">Available Seats</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setFormData(prev => ({ ...prev, availableSeats: Math.max(0, Number(prev.availableSeats) - 1) }))}
                                        >
                                            -
                                        </Button>
                                        <Input
                                            id="availableSeats"
                                            type="number"
                                            value={formData.availableSeats}
                                            onChange={handleChange}
                                            className="text-center"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setFormData(prev => ({ ...prev, availableSeats: Number(prev.availableSeats) + 1 }))}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">Snapshot: Capacity</Label>
                                    <Input id="snapshot.capacity" value={formData.snapshot.capacity} onChange={handleChange} placeholder="e.g. 50 Seats" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">Snapshot: Area</Label>
                                    <Input id="snapshot.area" value={formData.snapshot.area} onChange={handleChange} placeholder="e.g. 2500 Sq. Ft." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">Snapshot: Lock In</Label>
                                    <Input id="snapshot.lock_in" value={formData.snapshot.lock_in} onChange={handleChange} placeholder="e.g. 12 Months" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Advanced Details</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <ListEditor
                                title="Highlights"
                                items={formData.highlights}
                                onChange={(items) => setFormData(prev => ({ ...prev, highlights: items }))}
                                fields={[
                                    { key: "title", label: "Title (e.g. Location)" },
                                    { key: "desc", label: "Description (e.g. Prime Area)" }
                                ]}
                            />
                            <div className="h-px bg-gray-100" />
                            <ListEditor
                                title="Commercials"
                                items={formData.commercials}
                                onChange={(items) => setFormData(prev => ({ ...prev, commercials: items }))}
                                fields={[
                                    { key: "component", label: "Component (e.g. Rent)" },
                                    { key: "cost", label: "Cost (e.g. ₹10k)" },
                                    { key: "remarks", label: "Remarks" }
                                ]}
                            />
                            <div className="h-px bg-gray-100" />
                            <ListEditor
                                title="Compliance"
                                items={formData.compliance}
                                onChange={(items) => setFormData(prev => ({ ...prev, compliance: items }))}
                                fields={[
                                    { key: "title", label: "Title (e.g. Fire NOC)" },
                                    { key: "status", label: "Status (e.g. Active)" },
                                    { key: "desc", label: "Description" }
                                ]}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Media & Amenities */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Amenities</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {commonAmenities.map((amenity) => (
                                    <div key={amenity} onClick={() => handleAmenityToggle(amenity)} className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium border transition-colors ${formData.amenities.includes(amenity) ? "bg-teal text-white border-teal" : "bg-white text-gray-600 border-gray-200 hover:border-teal/50"}`}>
                                        {amenity}
                                    </div>
                                ))}
                                {formData.amenities.filter(a => !commonAmenities.includes(a)).map(a => (
                                    <div key={a} onClick={() => handleAmenityToggle(a)} className="cursor-pointer px-3 py-1 rounded-full text-xs font-medium border bg-teal text-white border-teal flex items-center gap-1">
                                        {a}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input placeholder="Add custom amenity..." value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} className="h-8 text-xs" />
                                <Button size="sm" onClick={addCustomAmenity} className="h-8"><Plus className="w-4 h-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Images</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col gap-2">
                                <Label className="text-xs font-semibold">Upload Image</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="cursor-pointer file:cursor-pointer file:bg-teal file:text-white file:border-0 file:rounded-md file:px-2 file:text-xs file:mr-2 hover:file:bg-teal/90"
                                />
                                {uploading && <p className="text-xs text-teal animate-pulse font-medium">Uploading image...</p>}
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="group relative flex items-center gap-3 p-2 bg-gray-50 rounded border hover:border-teal transition-colors">
                                        <div className="w-12 h-12 shrink-0 bg-gray-200 rounded overflow-hidden">
                                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 truncate">{img}</p>
                                            {index === 0 && <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full">THUMBNAIL</span>}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {index !== 0 && (
                                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveImageToFront(index)} title="Set as Thumbnail">
                                                    <ArrowLeft className="w-3 h-3 rotate-90" />
                                                </Button>
                                            )}
                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-700" onClick={() => removeImage(index)}>
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminEditSpace;
