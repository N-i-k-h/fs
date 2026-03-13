import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Plus,
    X,
    ArrowLeft,
    Save,
    HardHat,
    Banknote,
    Info,
    ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import MultiImageUpload from "@/components/MultiImageUpload";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

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
                                    className="h-8 text-xs font-semibold"
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

const BrokerEditSpace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        type: ["coworking"] as string[],
        description: "",
        city: "Bangalore",
        location: "", // Micro Market
        googleMapUrl: "",
        price: 0,
        seats: 0,
        availableSeats: 0,
        amenities: [] as string[],
        images: [] as string[],

        // --- Technical Specifications ---
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

        // --- Detailed Commercials ---
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

    useEffect(() => {
        const fetchSpace = async () => {
            try {
                const res = await axios.get(`/api/spaces/${id}`);
                const data = res.data;

                // Ensure array structures and nested objects are preserved or defaulted
                setFormData({
                    ...data,
                    type: Array.isArray(data.type) ? data.type : [data.type || 'coworking'],
                    technicalSpecs: { ...formData.technicalSpecs, ...(data.technicalSpecs || {}) },
                    commercialDetails: { ...formData.commercialDetails, ...(data.commercialDetails || {}) },
                    snapshot: { ...formData.snapshot, ...(data.snapshot || {}) },
                    amenities: Array.isArray(data.amenities) ? data.amenities : [],
                    images: Array.isArray(data.images) ? data.images : [],
                    highlights: Array.isArray(data.highlights) ? data.highlights : [],
                    commercials: Array.isArray(data.commercials) ? data.commercials : [],
                    compliance: Array.isArray(data.compliance) ? data.compliance : []
                });
            } catch (err) {
                toast.error("Failed to load property details");
                navigate("/broker/spaces");
            } finally {
                setLoading(false);
            }
        };
        fetchSpace();
    }, [id]);

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

    const handleCategoryToggle = (category: string) => {
        setFormData(prev => {
            const current = prev.type;
            if (current.includes(category)) {
                if (current.length === 1) return prev;
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

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setSubmitting(true);
        try {
            const config = {
                headers: { 'x-auth-token': token }
            };

            await axios.put(`/api/spaces/${id}`, formData, config);

            toast.success("Workspace updated successfully!");
            navigate("/broker/spaces");
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Failed to update workspace");
        } finally {
            setSubmitting(false);
        }
    };

    const commonAmenities = ['WiFi', 'Coffee', 'Meeting Rooms', 'Reception', 'Power Backup', 'AC', 'Parking', 'Printers', 'Cleaning', 'Security'];

    if (loading) return <div className="p-12 text-center text-navy font-bold animate-pulse">Loading Workspace Details...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto pb-24 px-4 text-navy">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 sticky top-20 z-10 border-b border-gray-100 mb-6 rounded-2xl shadow-sm">
                <div>
                    <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:pl-2 transition-all mb-1 h-auto py-1 text-gray-500">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-3xl font-extrabold text-navy tracking-tight">Edit <span className="text-teal">Workspace</span></h1>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl px-8">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={submitting} className="bg-teal hover:bg-teal/90 text-white shadow-xl shadow-teal/20 rounded-xl px-10 font-bold h-12">
                        {submitting ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Basic Information */}
                    <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2"><Info className="w-5 h-5 text-teal" /> Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-navy font-semibold">Space Name</Label>
                                <Input id="name" value={formData.name} onChange={handleChange} className="h-12 bg-gray-50 border-none rounded-xl" />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-navy font-semibold">Workspace Categories</Label>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { value: "private-office", label: "Private Office" },
                                        { value: "hot-desk", label: "Hot Desk" },
                                        { value: "coworking", label: "Coworking" },
                                        { value: "managed-office", label: "Managed Office" },
                                        { value: "enterprise", label: "Enterprise" }
                                    ].map((cat) => (
                                        <div
                                            key={cat.value}
                                            onClick={() => handleCategoryToggle(cat.value)}
                                            className={cn(
                                                "cursor-pointer px-5 py-3 rounded-xl text-sm font-bold border transition-all duration-200",
                                                formData.type.includes(cat.value)
                                                    ? "bg-teal text-white border-teal shadow-lg shadow-teal/20"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-teal/50 hover:bg-teal/5"
                                            )}
                                        >
                                            {cat.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-navy font-semibold">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="h-32 bg-gray-50 border-none rounded-xl resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-navy font-semibold">City</Label>
                                    <Select onValueChange={(v) => setFormData(p => ({ ...p, city: v }))} value={formData.city}>
                                        <SelectTrigger className="h-12 bg-gray-50 border-none rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['Bangalore', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-navy font-semibold">Micro Market (Area)</Label>
                                    <Input id="location" value={formData.location} onChange={handleChange} className="h-12 bg-gray-50 border-none rounded-xl" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="googleMapUrl" className="text-navy font-semibold">Google Map Link</Label>
                                <Input
                                    id="googleMapUrl"
                                    value={formData.googleMapUrl}
                                    onChange={handleChange}
                                    className="h-12 bg-gray-50 border-none rounded-xl"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing & Snapshot */}
                    <Card className="rounded-3xl border-none shadow-sm overflow-hidden text-navy">
                        <CardHeader className="bg-gray-50/50 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2"><Banknote className="w-5 h-5 text-teal" /> Pricing & Snapshot</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-navy font-semibold">Price (₹/Seat)</Label>
                                    <Input id="price" type="number" value={formData.price} onChange={handleChange} className="h-12 bg-gray-50 border-none rounded-xl" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="seats" className="text-navy font-semibold">Total Seats</Label>
                                    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 hover:bg-white hover:shadow-sm rounded-lg"
                                            onClick={() => setFormData(prev => ({ ...prev, seats: Math.max(0, Number(prev.seats) - 1) }))}
                                        >
                                            -
                                        </Button>
                                        <Input
                                            id="seats"
                                            type="number"
                                            value={formData.seats}
                                            onChange={handleChange}
                                            className="h-10 border-none bg-transparent text-center font-bold text-navy"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 hover:bg-white hover:shadow-sm rounded-lg"
                                            onClick={() => setFormData(prev => ({ ...prev, seats: Number(prev.seats) + 1 }))}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="availableSeats" className="text-navy font-semibold">Available Seats</Label>
                                    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 hover:bg-white hover:shadow-sm rounded-lg"
                                            onClick={() => setFormData(prev => ({ ...prev, availableSeats: Math.max(0, Number(prev.availableSeats) - 1) }))}
                                        >
                                            -
                                        </Button>
                                        <Input
                                            id="availableSeats"
                                            type="number"
                                            value={formData.availableSeats}
                                            onChange={handleChange}
                                            className="h-10 border-none bg-transparent text-center font-bold text-navy"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 hover:bg-white hover:shadow-sm rounded-lg"
                                            onClick={() => setFormData(prev => ({ ...prev, availableSeats: Number(prev.availableSeats) + 1 }))}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-navy/5 p-6 rounded-2xl border border-navy/10">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">Snapshot: Capacity</Label>
                                    <Input id="snapshot.capacity" value={formData.snapshot.capacity} onChange={handleChange} className="h-11 bg-white border-navy/10 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">Snapshot: Area</Label>
                                    <Input id="snapshot.area" value={formData.snapshot.area} onChange={handleChange} className="h-11 bg-white border-navy/10 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">Snapshot: Lock In</Label>
                                    <Input id="snapshot.lock_in" value={formData.snapshot.lock_in} onChange={handleChange} className="h-11 bg-white border-navy/10 rounded-xl" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical Specifications */}
                    <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2"><HardHat className="w-5 h-5 text-teal" /> Technical Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">Floor to Ceiling</Label>
                                    <Input id="tech.floorToCeiling" value={formData.technicalSpecs.floorToCeiling} onChange={handleChange} className="h-11 bg-gray-50 border-none rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">Passenger Lifts</Label>
                                    <Input id="tech.passengerLifts" type="number" value={formData.technicalSpecs.passengerLifts} onChange={handleChange} className="h-11 bg-gray-50 border-none rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">Service Lifts</Label>
                                    <Input id="tech.serviceLifts" type="number" value={formData.technicalSpecs.serviceLifts} onChange={handleChange} className="h-11 bg-gray-50 border-none rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">HVAC Type</Label>
                                    <Select
                                        onValueChange={(v) => setFormData(p => ({ ...p, technicalSpecs: { ...p.technicalSpecs, hvacType: v } }))}
                                        value={formData.technicalSpecs.hvacType}
                                    >
                                        <SelectTrigger className="h-11 bg-gray-50 border-none rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Centralized">Centralized</SelectItem>
                                            <SelectItem value="VRV">VRV</SelectItem>
                                            <SelectItem value="Chiller">Chiller</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">IT / ERT Status</Label>
                                    <Select
                                        onValueChange={(v) => setFormData(p => ({ ...p, technicalSpecs: { ...p.technicalSpecs, itSezStatus: v } }))}
                                        value={formData.technicalSpecs.itSezStatus}
                                    >
                                        <SelectTrigger className="h-11 bg-gray-50 border-none rounded-xl"><SelectValue /></SelectTrigger>
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

                    {/* Detailed Commercials */}
                    <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2"><Banknote className="w-5 h-5 text-teal" /> Detailed Commercials</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">Rent (₹/SqFt)</Label>
                                    <Input id="comm.rentPSFT" value={formData.commercialDetails.rentPSFT} onChange={handleChange} className="h-11 bg-gray-50 border-none rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">CAM Charges (₹/SqFt)</Label>
                                    <Input id="comm.camCharges" value={formData.commercialDetails.camCharges} onChange={handleChange} className="h-11 bg-gray-50 border-none rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">Lock-in Period</Label>
                                    <Input id="comm.lockInPeriod" value={formData.commercialDetails.lockInPeriod} onChange={handleChange} className="h-11 bg-gray-50 border-none rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-navy/60 font-black">Rent Escalation (%)</Label>
                                    <Input id="comm.escalation" value={formData.commercialDetails.escalation} onChange={handleChange} className="h-11 bg-gray-50 border-none rounded-xl" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Advanced Details */}
                    <Card className="rounded-3xl border-none shadow-sm overflow-hidden text-navy">
                        <CardHeader className="bg-gray-50/50 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5 text-teal" /> Advanced Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-10">
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
                                    { key: "component", label: "Component" },
                                    { key: "cost", label: "Cost" },
                                    { key: "remarks", label: "Remarks" }
                                ]}
                            />
                            <div className="h-px bg-gray-100" />
                            <ListEditor
                                title="Compliance"
                                items={formData.compliance}
                                onChange={(items) => setFormData(prev => ({ ...prev, compliance: items }))}
                                fields={[
                                    { key: "title", label: "Title" },
                                    { key: "status", label: "Status" },
                                    { key: "desc", label: "Description" }
                                ]}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    {/* Amenities */}
                    <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50">
                            <CardTitle className="text-xl font-bold">Amenities</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {commonAmenities.map((amenity) => (
                                    <div
                                        key={amenity}
                                        onClick={() => handleAmenityToggle(amenity)}
                                        className={cn(
                                            "cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold border transition-colors duration-200",
                                            formData.amenities.includes(amenity)
                                                ? "bg-teal text-white border-teal shadow-md shadow-teal/10"
                                                : "bg-white text-gray-500 border-gray-100 hover:border-teal/30 hover:bg-teal/5"
                                        )}
                                    >
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add custom..."
                                    value={newAmenity}
                                    onChange={(e) => setNewAmenity(e.target.value)}
                                    className="h-10 text-xs bg-gray-50 border-none rounded-lg"
                                />
                                <Button size="icon" onClick={addCustomAmenity} className="h-10 w-10 bg-navy hover:bg-navy/90 text-white rounded-lg"><Plus className="w-4 h-4" /></Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image Upload */}
                    <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50">
                            <CardTitle className="text-xl font-bold flex items-center gap-2"><ImageIcon className="w-5 h-5 text-teal" /> Images</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <MultiImageUpload
                                currentImages={formData.images}
                                onUploadComplete={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
                                maxImages={10}
                                label="Update workspace photos"
                            />
                        </CardContent>
                    </Card>

                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-navy hover:bg-navy/90 text-white shadow-xl rounded-2xl h-16 text-lg font-bold"
                    >
                        {submitting ? "Saving..." : "Save All Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BrokerEditSpace;
