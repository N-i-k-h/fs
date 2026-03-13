import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    User,
    MapPin,
    Users,
    Layout,
    Banknote,
    Clock,
    FileText,
    ChevronRight,
    ChevronLeft,
    CheckCircle,
    Download
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const ClientRFPForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedData, setSubmittedData] = useState<any>(null);

    const [formData, setFormData] = useState({
        // A & B: Company & Contact
        clientName: "",
        companyName: "",
        yearOfRegistration: "",
        companyDescription: "",
        fundingStatus: "",
        decisionMakerName: "",
        decisionMakerEmail: "",
        adminSpocEmail: "",

        // C & D: Space & Team
        solutionType: [],
        preferredLocation: "",
        locationMapLink: "",
        buildingTypePreference: [],
        maxRadiusKM: "",
        currentEmployees: "",
        expectedGrowth: "",
        totalSeats: "",
        seatDensity: "",

        // E: Layout
        managerCabins: "",
        meetingRooms: {
            pax3: "0", pax4: "0", pax6: "0", pax8: "0", pax10: "0", pax12: "0"
        },
        receptionRequired: false,
        collaborationZones: "",

        // F, G & H: Commercials, Timeline & Notes
        budgetRange: "",
        budgetType: "per seat",
        carParking: "",
        twoWheelerParking: "",
        expectedMoveIn: "",
        additionalNotes: "",
        specialRequirements: []
    });

    const handleTextChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleCheckboxChange = (id, value, checked) => {
        setFormData(prev => {
            const current = [...prev[id]];
            if (checked) {
                return { ...prev, [id]: [...current, value] };
            } else {
                return { ...prev, [id]: current.filter(v => v !== value) };
            }
        });
    };

    const handleMeetingRoomChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            meetingRooms: { ...prev.meetingRooms, [key]: value }
        }));
    };

    const { user } = useAuth();

    const steps = [
        { id: 1, title: "Company Info", icon: Building2 },
        { id: 2, title: "Space Detail", icon: MapPin },
        { id: 3, title: "Layout Specs", icon: Layout },
        { id: 4, title: "Commercials", icon: Banknote }
    ];

    const validateStep = (s) => {
        // Steps 1, 2, and 3 are now fully optional
        if (s < 4) return true;

        // Only validate the final step (Commercials & Timeline)
        if (s === 4) {
            return formData.budgetRange && formData.expectedMoveIn;
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(s => Math.min(s + 1, 4));
        } else {
            toast.error("Please fill all required fields in this step.");
        }
    };

    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission if not on final step
        if (step < 4) {
            nextStep();
            return;
        }

        if (!formData.budgetRange || !formData.expectedMoveIn) {
            toast.error("Please provide budget and move-in timeline.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await axios.post('/api/requests/rfp', {
                formData,
                email: user?.email || formData.decisionMakerEmail || "anonymous@flickspace.com",
                user: user?.name || formData.clientName || "Anonymous User"
            });

            if (res.status === 201) {
                toast.success("RFP Created Successfully!");
                setSubmittedData(res.data.request);
                setIsSubmitted(true);
            }
        } catch (err: any) {
            console.error("DEBUG RFP ERROR:", err);
            const serverMsg = err.response?.data?.message || err.response?.data?.error;
            const detail = err.response?.data?.error || err.message;
            const traceId = err.response?.data?.traceId;

            toast.error(`Submission Failed: ${serverMsg || "Server Error"}`, {
                description: `${detail}${traceId ? ` (Trace: ${traceId})` : ""}. Please try one last time.`,
                duration: 5000
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const downloadPDF = () => {
        if (!submittedData) return;
        try {
            const doc = new jsPDF();
            const date = new Date().toLocaleDateString();

            // Header
            doc.setFillColor(15, 118, 110); // Teal
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text("FlickSpace RFP Summary", 20, 25);

            doc.setFontSize(10);
            doc.text(`Reference: ${submittedData._id?.toUpperCase() || "NEW"}`, 140, 20);
            doc.text(`Date: ${date}`, 140, 26);

            // Details
            doc.setTextColor(40, 40, 40);
            doc.setFontSize(14);
            doc.text("Requirement Details", 20, 60);
            doc.line(20, 63, 190, 63);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Company: ${formData.companyName || "N/A"}`, 25, 75);
            doc.text(`Seats: ${formData.totalSeats}`, 25, 82);
            doc.text(`Budget: ${formData.budgetRange}`, 25, 89);
            doc.text(`Preferred Location: ${formData.preferredLocation || "N/A"}`, 25, 96);
            doc.text(`Move-in: ${formData.expectedMoveIn}`, 25, 103);

            doc.save("FlickSpace_RFP.pdf");
            toast.success("PDF Downloaded!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to generate PDF");
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="container mx-auto px-4 py-24 text-center">
                    <div className="max-w-md mx-auto bg-gray-50/50 p-12 rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-8 text-teal">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-navy mb-4 italic uppercase">Requirement <span className="text-teal">Received</span></h1>
                        <p className="text-gray-400 mb-10 font-bold text-sm md:text-base">Your RFP has been sent to our verified workspace partners.</p>

                        <div className="space-y-4">
                            <Button
                                onClick={downloadPDF}
                                className="w-full bg-navy hover:bg-teal text-white rounded-2xl h-14 font-black uppercase tracking-widest flex items-center justify-center gap-3"
                            >
                                <Download className="w-5 h-5" /> Download PDF
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => navigate("/dashboard")}
                                className="w-full border-navy/20 text-navy hover:bg-gray-100 rounded-2xl h-14 font-black uppercase tracking-widest"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Prevent Enter key from submitting the form prematurely
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (step < 4) nextStep();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Progress Header */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-navy">Submit Detailed RFP</h1>
                                <p className="text-gray-500 text-sm">Professional Office Space Requirement Form</p>
                            </div>
                            <div className="text-right">
                                <span className="text-teal font-bold block">Step {step}/4</span>
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Connect Platform</span>
                            </div>
                        </div>

                        {/* Progress Bar Indicators */}
                        <div className="flex gap-2">
                            {steps.map((s) => (
                                <div
                                    key={s.id}
                                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= s.id ? "bg-teal" : "bg-gray-100"}`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-4">
                            {steps.map((s) => (
                                <div key={s.id} className={`flex flex-col items-center gap-1 flex-1 ${step === s.id ? "text-navy" : "text-gray-400"}`}>
                                    <s.icon className={`w-4 h-4 md:w-5 md:h-5 ${step === s.id ? "text-teal" : ""}`} />
                                    <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-tighter text-center whitespace-nowrap">{s.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6 md:p-10">

                            {step === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="clientName">Client Name (Authorized Person)</Label>
                                            <Input id="clientName" value={formData.clientName} onChange={handleTextChange} placeholder="Rahul Sharma" className="h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="companyName">Legal Company Name</Label>
                                            <Input id="companyName" value={formData.companyName} onChange={handleTextChange} placeholder="FinTech Labs Pvt Ltd" className="h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fundingStatus">Funding Status</Label>
                                            <Select onValueChange={(val) => handleSelectChange("fundingStatus", val)} value={formData.fundingStatus}>
                                                <SelectTrigger className="h-12"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                                <SelectContent>
                                                    {['Bootstrapped', 'Seed', 'Series A', 'Series B', 'Profitable', 'Public Listed'].map(s => (
                                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="decisionMakerEmail">Decision Maker Email</Label>
                                            <Input id="decisionMakerEmail" type="email" value={formData.decisionMakerEmail} onChange={handleTextChange} placeholder="rahul@fintechlabs.com" className="h-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="companyDescription">Company Description (One-line summary)</Label>
                                        <Input id="companyDescription" value={formData.companyDescription} onChange={handleTextChange} placeholder="Next-gen digital payments infrastructure provider" className="h-12" />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <Label className="text-navy font-bold">Solution Type Required</Label>
                                            {['Conventional Lease', 'Managed Office', 'Fully Furnished'].map(type => (
                                                <div key={type} className="flex items-center space-x-3 p-3 border rounded-xl hover:bg-gray-50 transition-colors">
                                                    <Checkbox
                                                        id={`type-${type}`}
                                                        checked={formData.solutionType.includes(type)}
                                                        onCheckedChange={(checked) => handleCheckboxChange("solutionType", type, checked)}
                                                    />
                                                    <label htmlFor={`type-${type}`} className="text-sm font-medium leading-none cursor-pointer">{type}</label>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="preferredLocation">Preferred Location (Primary)</Label>
                                                <Input id="preferredLocation" value={formData.preferredLocation} onChange={handleTextChange} placeholder="Outer Ring Road, Bangalore" className="h-12" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="maxRadiusKM">Max Radius from Location (in KM)</Label>
                                                <Input id="maxRadiusKM" type="number" value={formData.maxRadiusKM} onChange={handleTextChange} placeholder="5" className="h-12" />
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="border-gray-100" />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="totalSeats">Total Seats Required</Label>
                                            <Input id="totalSeats" type="number" value={formData.totalSeats} onChange={handleTextChange} placeholder="120" className="h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="currentEmployees">Current Employee Count</Label>
                                            <Input id="currentEmployees" type="number" value={formData.currentEmployees} onChange={handleTextChange} placeholder="80" className="h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="seatDensity">Expected Seat Density</Label>
                                            <Select onValueChange={(val) => handleSelectChange("seatDensity", val)} value={formData.seatDensity}>
                                                <SelectTrigger className="h-12"><SelectValue placeholder="Select Density" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="3/2">3.5 / 2 (Spacious)</SelectItem>
                                                    <SelectItem value="3.5/2">3.5 / 2 (Standard)</SelectItem>
                                                    <SelectItem value="4/2">4 / 2 (Compact)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div>
                                            <Label className="text-navy font-bold block mb-4">Core Layout Requirements</Label>
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium">Number of Manager Cabins</label>
                                                    <Input type="number" className="w-24 h-10" id="managerCabins" value={formData.managerCabins} onChange={handleTextChange} />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium">Collaboration Zones</label>
                                                    <Input type="number" className="w-24 h-10" id="collaborationZones" value={formData.collaborationZones} onChange={handleTextChange} />
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Checkbox id="reception" checked={formData.receptionRequired} onCheckedChange={(c) => setFormData(p => ({ ...p, receptionRequired: !!c }))} />
                                                    <label htmlFor="reception" className="text-sm font-medium">Reception Area Required</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-navy font-bold block mb-4">Meeting Rooms Required</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {['3 Pax', '4 Pax', '6 Pax', '8 Pax', '10 Pax', '12 Pax'].map(pax => (
                                                    <div key={pax} className="flex items-center justify-between gap-2 p-2 border rounded-lg">
                                                        <span className="text-xs font-bold text-gray-400">{pax}</span>
                                                        <Input
                                                            type="number"
                                                            className="w-12 h-8 text-center text-xs p-1"
                                                            value={formData.meetingRooms[`pax${pax.split(' ')[0]}`]}
                                                            onChange={(e) => handleMeetingRoomChange(`pax${pax.split(' ')[0]}`, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="budgetRange">Approximate Budget Range</Label>
                                                <div className="flex gap-2">
                                                    <Input id="budgetRange" value={formData.budgetRange} onChange={handleTextChange} placeholder="e.g. 90" className="h-12 flex-1" />
                                                    <Select onValueChange={(val) => handleSelectChange("budgetType", val)} value={formData.budgetType}>
                                                        <SelectTrigger className="h-12 w-32"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="per seat">₹/seat</SelectItem>
                                                            <SelectItem value="per sqft">₹/sqft</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Car Parking</Label>
                                                    <Input type="number" id="carParking" value={formData.carParking} onChange={handleTextChange} placeholder="Qty" className="h-12" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Two-Wheeler</Label>
                                                    <Input type="number" id="twoWheelerParking" value={formData.twoWheelerParking} onChange={handleTextChange} placeholder="Qty" className="h-12" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="expectedMoveIn">Expected Move-in Timeline</Label>
                                                <Select onValueChange={(val) => handleSelectChange("expectedMoveIn", val)} value={formData.expectedMoveIn}>
                                                    <SelectTrigger className="h-12"><SelectValue placeholder="Select Move-in" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Immediate">Immediate</SelectItem>
                                                        <SelectItem value="1 Month">Within 1 Month</SelectItem>
                                                        <SelectItem value="3 Months">Within 3 Months</SelectItem>
                                                        <SelectItem value="Flexible">Flexible</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="additionalNotes">Special Requirements / Notes</Label>
                                                <Textarea id="additionalNotes" value={formData.additionalNotes} onChange={handleTextChange} placeholder="e.g. IT/SEZ required, large cafeteria needed..." className="h-24 resize-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-teal/5 p-6 rounded-2xl border border-teal/10 flex items-start gap-4">
                                        <div className="p-2 bg-teal/20 rounded-full text-teal mt-1">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-navy">Final Verification</h4>
                                            <p className="text-sm text-gray-500">By submitting this RFP, you agree to allow verified brokers to submit proposals for your requirement. You will receive a maximum of 3 top-tier proposals.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={prevStep}
                                    disabled={step === 1}
                                    className="h-12 px-6 font-bold"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-2" /> Back
                                </Button>

                                {step < 4 ? (
                                    <Button
                                        type="button"
                                        onClick={nextStep}
                                        className="h-12 px-8 bg-navy hover:bg-navy/90 text-white font-bold rounded-xl"
                                    >
                                        Next Step <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="h-14 px-12 bg-teal hover:bg-teal/90 text-white font-bold rounded-xl shadow-xl shadow-teal/20"
                                    >
                                        {isSubmitting ? "Submitting RFP..." : "Submit RFP Now"}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientRFPForm;
