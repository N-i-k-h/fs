import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Plus,
    X,
    ArrowLeft,
    Save,
    HardHat,
    Banknote,
    Info,
    ImageIcon,
    Building2,
    MapPin,
    Layout,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Search,
    PieChart as PieIcon
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
import { motion, AnimatePresence } from "framer-motion";

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
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/40">{title}</Label>
                <Button type="button" size="sm" variant="outline" onClick={addItem} className="h-8 rounded-lg text-[10px] font-black uppercase"><Plus className="w-3 h-3 mr-1" /> Add</Button>
            </div>
            {items.map((item, index) => (
                <div key={index} className="grid gap-2 p-2 bg-gray-50/50 rounded-xl border border-gray-100 relative group transition-all">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 bg-white border shadow-sm rounded-full text-red-500 hover:text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-all z-10"
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
                                    className="h-9 text-xs bg-white border-none rounded-lg focus:ring-1 focus:ring-navy/10 placeholder:text-gray-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {items.length === 0 && <p className="text-[10px] text-gray-300 italic text-center font-bold">No {title.toLowerCase()} configured.</p>}
        </div>
    );
};

const BrokerPropertyForm = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);

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
        technicalSpecs: {
            floorToCeiling: "",
            passengerLifts: "",
            serviceLifts: "",
            hvacType: "Centralized",
            powerBackup: "100%",
            fireCompliance: "Active",
            itSezStatus: "Non-SEZ"
        },
        snapshot: {
            capacity: "",
            area: "",
            lock_in: ""
        },
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

    const steps = [
        { id: 1, title: "Identity", icon: Building2 },
        { id: 2, title: "Supply", icon: MapPin },
        { id: 3, title: "Technical", icon: HardHat },
        { id: 4, title: "Commercials", icon: Banknote },
        { id: 5, title: "Assets", icon: ImageIcon }
    ];

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
        if (!formData.name || !formData.price) {
            toast.error("Space Name and Price are required!");
            return;
        }

        setSubmitting(true);
        try {
            const numericId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
            const config = { headers: { 'x-auth-token': token } };
            await axios.post('/api/spaces', { ...formData, id: numericId }, config);
            toast.success("Workspace published successfully!");
            navigate("/broker/spaces");
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || err.message || "Failed to publish workspace");
        } finally {
            setSubmitting(false);
        }
    };

    const commonAmenities = ['WiFi', 'Coffee', 'Meeting Rooms', 'Reception', 'Power Backup', 'AC', 'Parking', 'Printers', 'Cleaning', 'Security'];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2 h-10 w-10 rounded-xl hover:bg-gray-100 group transition-all">
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-navy group-hover:-translate-x-1 transition-all" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-black text-navy uppercase tracking-tight italic">Provision <span className="text-teal">Workspace</span></h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">New Inventory Entry</p>
                        </div>
                    </div>
                    {step === 5 ? (
                        <Button onClick={() => handleSubmit()} disabled={submitting} className="h-12 px-8 bg-teal hover:bg-navy text-white font-black rounded-2xl shadow-xl shadow-teal/20 transition-all border-none italic">
                            {submitting ? "PUBLISHING..." : "PUBLISH NOW"}
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                             <div className="text-right mr-4 hidden md:block">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Progress</p>
                                <p className="text-xs font-black text-navy italic">{Math.round((step / 5) * 100)}% COMPLETE</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Progress Indicators */}
                <div className="max-w-4xl mx-auto px-6 pb-4">
                    <div className="flex justify-between items-center relative gap-2">
                        {steps.map((s, i) => (
                            <div key={s.id} className="flex-1 relative">
                                <div className="flex flex-col items-center group cursor-pointer" onClick={() => (step > s.id) && setStep(s.id)}>
                                    <div className={cn(
                                        "w-10 h-10 rounded-[14px] flex items-center justify-center transition-all duration-500 z-10 border-4 border-[#F8FAFC]",
                                        step >= s.id ? "bg-navy text-white shadow-lg" : "bg-gray-200 text-gray-400"
                                    )}>
                                        <s.icon className="w-5 h-5" />
                                    </div>
                                    <span className={cn(
                                        "text-[9px] mt-2 font-black uppercase tracking-widest transition-all duration-300",
                                        step === s.id ? "text-navy" : "text-gray-300"
                                    )}>{s.title}</span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="absolute top-5 left-1/2 w-full h-[2px] bg-gray-100 -z-0">
                                        <div 
                                            className="h-full bg-teal transition-all duration-700" 
                                            style={{ width: step > s.id ? "100%" : "0%" }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {step === 1 && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-navy uppercase tracking-tight italic">01. Identity & Type</h2>
                                    <p className="text-gray-400 font-medium font-outfit">Core branding and workspace classification.</p>
                                </div>
                                <Card className="rounded-[32px] border-none shadow-sm bg-white p-10 space-y-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Space Primary Name</Label>
                                        <Input id="name" value={formData.name} onChange={handleChange} placeholder="e.g. WeWork Galaxy" className="h-16 bg-gray-50/50 border-gray-100 rounded-2xl text-lg font-bold text-navy px-6 focus:ring-teal" />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Select Categories</Label>
                                        <div className="flex flex-wrap gap-2">
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
                                                        "cursor-pointer px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300",
                                                        formData.type.includes(cat.value)
                                                            ? "bg-navy text-white border-navy shadow-xl shadow-navy/20 active:scale-95"
                                                            : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                                                    )}
                                                >
                                                    {cat.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Description Brief</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="The high-level vibe and business environment of the space..."
                                            className="h-40 bg-gray-50/50 border-gray-100 rounded-2xl resize-none p-6 text-navy placeholder:text-gray-300 font-medium"
                                        />
                                    </div>
                                </Card>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-navy uppercase tracking-tight italic">02. Supply & Location</h2>
                                    <p className="text-gray-400 font-medium font-outfit">Micro-market intelligence and inventory counts.</p>
                                </div>
                                <Card className="rounded-[32px] border-none shadow-sm bg-white p-10 space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">City Hub</Label>
                                            <Select onValueChange={(v) => setFormData(p => ({ ...p, city: v }))} defaultValue={formData.city}>
                                                <SelectTrigger className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold text-navy px-6">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white rounded-xl border-gray-100 shadow-xl">
                                                    {['Bangalore', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai'].map(c => <SelectItem key={c} value={c} className="font-bold">{c}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Micro Market Area</Label>
                                            <Input id="location" value={formData.location} onChange={handleChange} placeholder="e.g. Koramangala / BKC" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold px-6 text-navy" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Google Maps Intelligence</Label>
                                        <Input
                                            id="googleMapUrl"
                                            value={formData.googleMapUrl}
                                            onChange={handleChange}
                                            placeholder="Paste sharing link..."
                                            className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl px-6 text-navy text-sm"
                                        />
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Base Price / Seat</Label>
                                            <Input id="price" type="number" value={formData.price} onChange={handleChange} className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-black text-teal text-xl px-6" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Total Capacity</Label>
                                            <Input id="seats" type="number" value={formData.seats} onChange={handleChange} className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-black text-navy text-xl px-6" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Live Occupancy</Label>
                                            <Input id="availableSeats" type="number" value={formData.availableSeats} onChange={handleChange} className="h-14 bg-teal/5 border-teal/10 rounded-2xl font-black text-teal text-xl px-6" />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-navy uppercase tracking-tight italic">03. Technical Core</h2>
                                    <p className="text-gray-400 font-medium font-outfit">Structural specifications and building compliance.</p>
                                </div>
                                <Card className="rounded-[32px] border-none shadow-sm bg-white p-10 space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Floor to Ceiling</Label>
                                            <Input id="tech.floorToCeiling" value={formData.technicalSpecs.floorToCeiling} onChange={handleChange} placeholder="e.g. 3.2M" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold px-6" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Passenger Lifts</Label>
                                            <Input id="tech.passengerLifts" type="number" value={formData.technicalSpecs.passengerLifts} onChange={handleChange} className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold px-6" />
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">HVAC Standard</Label>
                                            <Select
                                                onValueChange={(v) => setFormData(p => ({ ...p, technicalSpecs: { ...p.technicalSpecs, hvacType: v } }))}
                                                defaultValue={formData.technicalSpecs.hvacType}
                                            >
                                                <SelectTrigger className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold px-6"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-white rounded-xl shadow-xl border-gray-100">
                                                    <SelectItem value="Centralized" className="font-bold">Centralized</SelectItem>
                                                    <SelectItem value="VRV" className="font-bold">VRV</SelectItem>
                                                    <SelectItem value="Chiller" className="font-bold">Chiller</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Snapshot Area</Label>
                                            <Input id="snapshot.area" value={formData.snapshot.area} onChange={handleChange} placeholder="2500 Sq Ft" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold px-6" />
                                        </div>
                                         <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">IT / RT Status</Label>
                                            <Select
                                                onValueChange={(v) => setFormData(p => ({ ...p, technicalSpecs: { ...p.technicalSpecs, itSezStatus: v } }))}
                                                defaultValue={formData.technicalSpecs.itSezStatus}
                                            >
                                                <SelectTrigger className="h-14 bg-teal/5 border-teal/10 rounded-2xl font-bold px-6"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-white rounded-xl shadow-xl border-gray-100">
                                                    <SelectItem value="SEZ" className="font-bold">SEZ</SelectItem>
                                                    <SelectItem value="Non-SEZ" className="font-bold">Non-SEZ</SelectItem>
                                                    <SelectItem value="STPI" className="font-bold">STPI</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-navy uppercase tracking-tight italic">04. Commercial Brief</h2>
                                    <p className="text-gray-400 font-medium font-outfit">Lease terms, escalations, and compliance highlights.</p>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <Card className="rounded-[32px] border-none shadow-sm bg-white p-10 space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Rent / SqFt (Basement)</Label>
                                                <Input id="comm.rentPSFT" value={formData.commercialDetails.rentPSFT} onChange={handleChange} placeholder="95" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold px-6" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">CAM Maintenance</Label>
                                                <Input id="comm.camCharges" value={formData.commercialDetails.camCharges} onChange={handleChange} placeholder="12" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold px-6" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Rent Escalation</Label>
                                                <Input id="comm.escalation" value={formData.commercialDetails.escalation} onChange={handleChange} placeholder="5% Bi-Annual" className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl font-bold px-6" />
                                            </div>
                                        </div>
                                    </Card>
                                    <Card className="rounded-[32px] border-none shadow-sm bg-white p-10 space-y-10">
                                        <ListEditor
                                            title="Market Highlights"
                                            items={formData.highlights}
                                            onChange={(items) => setFormData(prev => ({ ...prev, highlights: items }))}
                                            fields={[
                                                { key: "title", label: "Title" },
                                                { key: "desc", label: "Value" }
                                            ]}
                                        />
                                        <div className="h-px bg-gray-100" />
                                        <ListEditor
                                            title="Governance & Compliance"
                                            items={formData.compliance}
                                            onChange={(items) => setFormData(prev => ({ ...prev, compliance: items }))}
                                            fields={[
                                                { key: "title", label: "Standard" },
                                                { key: "status", label: "Status" }
                                            ]}
                                        />
                                    </Card>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-navy uppercase tracking-tight italic">05. Amenities & Visuals</h2>
                                    <p className="text-gray-400 font-medium font-outfit">Final checklist and high-fidelity media upload.</p>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <Card className="rounded-[32px] border-none shadow-sm bg-white p-10 space-y-8">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Amenity Selection</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {commonAmenities.map((amenity) => (
                                                    <div
                                                        key={amenity}
                                                        onClick={() => handleAmenityToggle(amenity)}
                                                        className={cn(
                                                            "cursor-pointer px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-300",
                                                            formData.amenities.includes(amenity)
                                                                ? "bg-teal text-white border-teal shadow-lg shadow-teal/10"
                                                                : "bg-white text-gray-400 border-gray-100"
                                                        )}
                                                    >
                                                        {amenity}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2 pt-4">
                                                <Input
                                                    placeholder="Custom..."
                                                    value={newAmenity}
                                                    onChange={(e) => setNewAmenity(e.target.value)}
                                                    className="h-10 text-xs bg-gray-50 border-none rounded-xl"
                                                />
                                                <Button size="icon" onClick={addCustomAmenity} className="h-10 w-10 bg-navy hover:bg-teal text-white rounded-xl shrink-0"><Plus className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    </Card>
                                    <Card className="rounded-[32px] border-none shadow-sm bg-white p-10">
                                        <MultiImageUpload
                                            currentImages={formData.images}
                                            onUploadComplete={(urls) => setFormData((prev) => ({ ...prev, images: urls }))}
                                            maxImages={10}
                                            maxSizeMB={10}
                                            label="WORKSPACE FEED MEDIA"
                                        />
                                        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-6 text-center">
                                            High quality photos increase lead conversion by 40%
                                        </p>
                                    </Card>
                                </div>
                            </div>
                        )}

                        <div className="mt-12 flex justify-between items-center bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                            <Button
                                variant="ghost"
                                onClick={() => step > 1 && setStep(step - 1)}
                                disabled={step === 1}
                                className="h-14 px-8 rounded-2xl font-black text-navy uppercase tracking-widest gap-2 hover:bg-gray-50"
                            >
                                <ChevronLeft className="w-5 h-5" /> Previous
                            </Button>
                            
                            {step < 5 ? (
                                <Button
                                    onClick={() => setStep(step + 1)}
                                    className="h-14 px-12 rounded-2xl bg-navy hover:bg-teal text-white font-black uppercase tracking-widest gap-2 shadow-xl shadow-navy/10 active:scale-95 transition-all italic"
                                >
                                    Next Phase <ChevronRight className="w-5 h-5" />
                                </Button>
                            ) : (
                                <div className="flex gap-4">
                                     <Button
                                        onClick={() => handleSubmit()}
                                        disabled={submitting}
                                        className="h-14 px-12 rounded-2xl bg-teal hover:bg-navy text-white font-black uppercase tracking-widest gap-2 shadow-xl shadow-teal/20 active:scale-95 transition-all italic"
                                    >
                                        <CheckCircle className="w-5 h-5" /> {submitting ? "PUBLISHING..." : "PUBLISH LISTING"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BrokerPropertyForm;
