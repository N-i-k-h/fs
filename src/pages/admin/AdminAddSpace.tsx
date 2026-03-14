import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Plus, X, ArrowLeft, Trash2, HardHat, Banknote } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import MultiImageUpload from "@/components/MultiImageUpload";

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

const AdminAddSpace = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        type: ["coworking"] as string[],
        description: "",
        address: "",
        city: "bangalore",
        location: "", // Micro market
        price: 0,
        seats: 0,
        availableSeats: 0,
        amenities: [] as string[],
        images: [] as string[],

        // --- Technical Specifications (Connect Platform) ---
        technicalSpecs: {
            floorToCeiling: "",
            passengerLifts: "",
            serviceLifts: "",
            hvacType: "Centralized",
            powerBackup: "100%",
            fireCompliance: "Active",
            itSezStatus: "Non-SEZ"
        },

        // --- Snapshot / Quick View ---
        snapshot: {
            capacity: "",
            area: "",
            lock_in: ""
        },

        // --- Detailed Commercials (Connect Platform) ---
        commercialDetails: {
            rentPSFT: "",
            camCharges: "",
            securityDeposit: "",
            lockInPeriod: "",
            leaseTenure: "",
            escalation: ""
        },

        highlights: [] as any[],
        commercials: [] as any[],
        compliance: [] as any[]
    });

    const [newAmenity, setNewAmenity] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        if (id.startsWith("snapshot.")) {
            const field = id.split(".")[1];
            setFormData(prev => ({ ...prev, snapshot: { ...prev.snapshot, [field]: value } }));
        } else if (id.startsWith("tech.")) {
            const field = id.split(".")[1];
            setFormData(prev => ({ ...prev, technicalSpecs: { ...prev.technicalSpecs, [field]: value } }));
        } else if (id.startsWith("comm.")) {
            const field = id.split(".")[1];
            setFormData(prev => ({ ...prev, commercialDetails: { ...prev.commercialDetails, [field]: value } }));
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



    const handleSubmit = async () => {
        if (!formData.name || !formData.price) {
            toast.error("Name and Price are required!");
            return;
        }

        setSaving(true);
        try {
            // Generate a random numeric ID for compatibility with existing schema/frontend
            // Using timestamp + discrete random to ensure Uniqueness
            const numericId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);

            console.log("Submitting workspace data:", { ...formData, id: numericId });
            const response = await axios.post(`/api/spaces`, { ...formData, id: numericId });
            console.log("Workspace created successfully:", response.data);
            toast.success("Workspace created successfully");
            navigate("/admin/spaces");
        } catch (err: any) {
            console.error("Full error:", err);
            console.error("Error response:", err.response?.data);
            console.error("Error message:", err.message);
            const errorMsg = err.response?.data?.message || err.message || "Failed to create workspace";
            toast.error(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const commonAmenities = ['WiFi', 'Coffee', 'Meeting Rooms', 'Reception', 'Power Backup', 'AC', 'Parking', 'Printers', 'Cleaning', 'Security'];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-24">
            <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-4 sticky top-16 z-10 border-b border-gray-100 mb-6 rounded-xl">
                <div>
                    <Button variant="ghost" onClick={() => navigate("/admin/spaces")} className="pl-0 hover:pl-2 transition-all mb-1 h-auto py-1">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Spaces
                    </Button>
                    <h1 className="text-2xl font-bold text-teal">Add New Workspace</h1>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate("/admin/spaces")}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={saving} className="bg-navy hover:bg-navy/90 text-white shadow-lg shadow-navy/20">
                        {saving ? "Publishing..." : <><Save className="w-4 h-4 mr-2" /> Publish Space</>}
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
                                                    ? "bg-navy text-white border-navy shadow-md"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-navy/50 hover:bg-navy/5"
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
                        <CardHeader><CardTitle className="flex items-center gap-2"><HardHat className="w-5 h-5 text-navy" /> Technical Specifications</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">Floor to Ceiling</Label>
                                    <Input id="tech.floorToCeiling" value={formData.technicalSpecs.floorToCeiling} onChange={handleChange} placeholder="e.g. 3.2 Meters" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">Passenger Lifts</Label>
                                    <Input id="tech.passengerLifts" type="number" value={formData.technicalSpecs.passengerLifts} onChange={handleChange} placeholder="0" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">Service Lifts</Label>
                                    <Input id="tech.serviceLifts" type="number" value={formData.technicalSpecs.serviceLifts} onChange={handleChange} placeholder="0" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">HVAC Type</Label>
                                    <Select
                                        onValueChange={(v) => setFormData(p => ({ ...p, technicalSpecs: { ...p.technicalSpecs, hvacType: v } }))}
                                        defaultValue={formData.technicalSpecs.hvacType}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Centralized">Centralized</SelectItem>
                                            <SelectItem value="VRV">VRV</SelectItem>
                                            <SelectItem value="Chiller">Chiller</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">IT / SEZ Status</Label>
                                    <Select
                                        onValueChange={(v) => setFormData(p => ({ ...p, technicalSpecs: { ...p.technicalSpecs, itSezStatus: v } }))}
                                        defaultValue={formData.technicalSpecs.itSezStatus}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SEZ">SEZ</SelectItem>
                                            <SelectItem value="Non-SEZ">Non-SEZ</SelectItem>
                                            <SelectItem value="STPI">STPI</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Banknote className="w-5 h-5 text-navy" /> Detailed Commercials</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">Base Rent (₹ PSFT)</Label>
                                    <Input id="comm.rentPSFT" value={formData.commercialDetails.rentPSFT} onChange={handleChange} placeholder="95" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">CAM Charges (₹ PSFT)</Label>
                                    <Input id="comm.camCharges" value={formData.commercialDetails.camCharges} onChange={handleChange} placeholder="12" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">Lock-in Period</Label>
                                    <Input id="comm.lockInPeriod" value={formData.commercialDetails.lockInPeriod} onChange={handleChange} placeholder="36 Months" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-gray-500 font-bold">Rent Escalation (%)</Label>
                                    <Input id="comm.escalation" value={formData.commercialDetails.escalation} onChange={handleChange} placeholder="5% Bi-Annual" />
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
                </div >

                {/* Right Column - Media & Amenities */}
                < div className="space-y-6" >
                    <Card>
                        <CardHeader><CardTitle>Amenities</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {commonAmenities.map((amenity) => (
                                    <div key={amenity} onClick={() => handleAmenityToggle(amenity)} className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium border transition-colors ${formData.amenities.includes(amenity) ? "bg-navy text-white border-navy" : "bg-white text-gray-600 border-gray-200 hover:border-navy/50"}`}>
                                        {amenity}
                                    </div>
                                ))}
                                {formData.amenities.filter(a => !commonAmenities.includes(a)).map(a => (
                                    <div key={a} onClick={() => handleAmenityToggle(a)} className="cursor-pointer px-3 py-1 rounded-full text-xs font-medium border bg-navy text-white border-navy flex items-center gap-1">
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
                            <MultiImageUpload
                                currentImages={formData.images}
                                onUploadComplete={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
                                maxImages={10}
                                maxSizeMB={5}
                                label="Upload Workspace Images (First one is the thumbnail)"
                            />
                        </CardContent>
                    </Card>
                </div >
            </div >
        </div >
    );
};

export default AdminAddSpace;
