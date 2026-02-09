import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Zap, Calendar, Shield, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { toast } from "sonner";
import Header from "@/components/Header";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BrochureTemplate } from "@/components/BrochureTemplate";
import axios from "axios";

const GetQuotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [space, setSpace] = useState<any>(null);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const brochureRef = useRef<HTMLDivElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        seats: "",
        budget: "",
        timeline: "Immediate",
        micromarket: ""
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const res = await axios.get(`/api/spaces/${id}`);
                setSpace(res.data);
            } catch (err) {
                navigate("/search");
            }
        };
        if (id) fetchData();
    }, [id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const generatePDF = async () => {
        if (!brochureRef.current) return;

        try {
            toast.info("Generating customized brochure...");

            // Wait a moment for rendering
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(brochureRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: 850 // Fixed width to ensure layout stability
            });

            const imgData = canvas.toDataURL("image/png");

            // Metric sizing: A4 is 210mm x 297mm
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${space.name.replace(/\s+/g, '_')}_Brochure.pdf`);

            toast.success("Brochure downloaded successfully!");
        } catch (error) {
            console.error("PDF Generation Error", error);
            toast.error("Failed to generate brochure.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Send data to backend
            await axios.post('/api/requests/quote', {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                seats: formData.seats,
                budget: formData.budget,
                timeline: formData.timeline,
                micromarket: formData.micromarket,
                spaceName: space.name,
                spaceId: space.id
            });

            // Generate PDF
            await generatePDF();

            toast.success("Quote Requested Successfully!");

            // Redirect back to detail after a delay
            setTimeout(() => navigate(`/space/${id}`), 3000);
        } catch (error) {
            console.error("Quote Submission Error", error);
            toast.error("Failed to submit quote request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!space) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            {/* HIDDEN BROCHURE TEMPLATE */}
            <div style={{ position: "absolute", top: -10000, left: -10000 }}>
                <BrochureTemplate ref={brochureRef} space={space} />
            </div>

            <main className="flex-1 flex items-center justify-center p-4 pt-24 pb-12">
                <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                    {/* LEFT PANEL: Space Summary */}
                    <div className="md:w-5/12 bg-gray-50/80 p-8 flex flex-col border-r border-gray-100">
                        <div className="mb-6">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Selected Workspace</p>
                            <h1 className="text-2xl font-bold text-navy mb-1">{space.name}</h1>
                            <div className="flex items-center text-gray-500 text-sm">
                                <div className="bg-gray-200 rounded-full w-1 h-1 mr-2"></div>
                                {space.city}, {space.location}
                            </div>
                        </div>

                        <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-6 h-48">
                            <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between items-center mb-8">
                            <span className="text-gray-500 font-medium">Starting Price</span>
                            <span className="text-blue-700 font-bold text-lg">₹{space.price.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/mo</span></span>
                        </div>

                        <div className="space-y-4 mt-auto">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Zap className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                                <span>AI-Powered Pricing Match</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Calendar className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                                <span>Flexible Lease Terms</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Shield className="w-5 h-5 text-blue-500 fill-blue-500/10" />
                                <span>Verified Workspace Provider</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Form Stepper */}
                    <div className="md:w-7/12 p-8 md:p-12 bg-white">

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-navy mb-2">Get Your Instant Quote</h2>
                            <p className="text-gray-500">Fill in a few details to see your customized pricing.</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-blue-600">
                                    {step === 1 ? "Step 1 of 2: Contact Details" : "Step 2 of 2: Your Requirements"}
                                </span>
                                <span className="text-xs font-bold text-gray-400 tracking-widest">{step === 1 ? "50%" : "100%"} COMPLETE</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
                                    style={{ width: step === 1 ? "50%" : "100%" }}
                                ></div>
                            </div>
                        </div>

                        {step === 1 ? (
                            /* STEP 1 FORM */
                            <form onSubmit={handleNext} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-navy font-bold">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Alex Rivera"
                                        className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-navy font-bold">Work Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="alex@company.com"
                                            className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-navy font-bold">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Broker calls in 24h
                                        </span>
                                        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">
                                            No obligations
                                        </span>
                                    </div>

                                    <Button type="submit" className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01]">
                                        Next: Requirements <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            /* STEP 2 FORM */
                            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="seats" className="text-navy font-bold">Number of Seats</Label>
                                        <Input
                                            id="seats"
                                            name="seats"
                                            type="number"
                                            placeholder="e.g. 10"
                                            className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                            value={formData.seats}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="budget" className="text-navy font-bold">Budget per Seat</Label>
                                        <Input
                                            id="budget"
                                            name="budget"
                                            placeholder="Max monthly"
                                            className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                            value={formData.budget}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-navy font-bold">Timeline for Occupancy</Label>
                                        <Select onValueChange={(val) => handleSelectChange("timeline", val)} defaultValue={formData.timeline}>
                                            <SelectTrigger className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                                                <SelectValue placeholder="Select timeline" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Immediate">Immediate</SelectItem>
                                                <SelectItem value="1 Month">Within 1 Month</SelectItem>
                                                <SelectItem value="3 Months">Within 3 Months</SelectItem>
                                                <SelectItem value="Later">Later</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="micromarket" className="text-navy font-bold">Preferred Micromarket</Label>
                                        <Input
                                            id="micromarket"
                                            name="micromarket"
                                            placeholder="e.g. Chelsea, SoHo"
                                            className="h-12 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                            value={formData.micromarket}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Broker calls in 24h
                                        </span>
                                        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full">
                                            No obligations
                                        </span>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            className="h-14 px-6 rounded-xl border-gray-200 hover:bg-gray-50"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01]"
                                        >
                                            {isSubmitting ? "Generating Brochure..." : (
                                                <>Get My Instant Quote <FileText className="w-5 h-5 ml-2" /></>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default GetQuotePage;
