import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, MapPin, Users, CheckCircle2, Send, Lock, CreditCard, ShieldCheck, Eye, Phone, Mail, Building2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const BrokerRequests = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rfps, setRfps] = useState<any[]>([]);
    const [myProposals, setMyProposals] = useState<any[]>([]);
    const [mySpaces, setMySpaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentStatuses, setPaymentStatuses] = useState<Record<string, { hasPaidRFP: boolean; hasPaidClient: boolean }>>({});
    const [unlockedDetails, setUnlockedDetails] = useState<Record<string, any>>({});

    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedRfp, setSelectedRfp] = useState<any>(null);
    const [paymentType, setPaymentType] = useState<'rfp_details' | 'client_details'>('rfp_details');

    const [proposalData, setProposalData] = useState({
        spaceId: "",
        message: ""
    });

    const fetchData = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const t = Date.now();
            const [res, propRes, spaceRes] = await Promise.all([
                axios.get(`/api/requests/broker-hub?t=${t}`),
                axios.get(`/api/requests/proposals/broker/${user.id}?t=${t}`),
                axios.get(`/api/spaces?t=${t}`)
            ]);

            const allRfps = res.data;
            setRfps(allRfps);
            setMyProposals(propRes.data || []);
            
            setMySpaces(spaceRes.data.filter((s: any) => {
                const ownerId = typeof s.owner === 'object' ? s.owner._id || s.owner.id : s.owner;
                return ownerId === user.id;
            }));

            // Fetch payment statuses for all RFPs
            const statuses: any = {};
            await Promise.all(allRfps.map(async (rfp: any) => {
                try {
                    const payRes = await axios.get(`/api/payments/status/${rfp._id}`);
                    statuses[rfp._id] = payRes.data;
                    
                    // If paid for RFP, fetch the masked details
                    if (payRes.data.hasPaidRFP) {
                        const detailRes = await axios.get(`/api/requests/rfp/${rfp._id}/details`);
                        setUnlockedDetails(prev => ({ ...prev, [rfp._id]: detailRes.data }));
                    }
                } catch (e) { console.error(e); }
            }));
            setPaymentStatuses(statuses);

        } catch (err) {
            console.error("Fetch Data Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.id]);

    const handlePayment = async (requestId: string, type: 'rfp_details' | 'client_details') => {
        const res = await loadRazorpay();
        if (!res) {
            toast.error("Razorpay SDK failed to load. Check your internet connection.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const orderRes = await axios.post("/api/payments/create-order", 
                { requestId, type },
                { headers: { 'x-auth-token': token } }
            );
            const order = orderRes.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "SFT Corporate",
                description: type === 'rfp_details' ? "Unlock RFP Specifications" : "Unlock Client Contact Leads",
                order_id: order.id,
                handler: async (response: any) => {
                    try {
                        const verifyRes = await axios.post("/api/payments/verify-payment", {
                            ...response,
                            requestId,
                            type
                        });

                        if (verifyRes.data.success) {
                            toast.success(type === 'rfp_details' ? "RFP Details Unlocked!" : "Client Details Unlocked!");
                            fetchData(); // Refresh all state
                            setIsPaymentModalOpen(false);
                        }
                    } catch (err) {
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: "#0F766E",
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (err: any) {
            console.error("Payment Init Error:", err);
            const errorMsg = err.response?.data?.msg || "Failed to initialize payment";
            const detail = err.response?.data?.error ? ` (${err.response.data.error})` : "";
            toast.error(`${errorMsg}${detail}`);
        }
    };

    const handleTestUnlock = async (requestId: string, type: 'rfp_details' | 'client_details') => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post("/api/payments/test-unlock", 
                { requestId, type },
                { headers: { 'x-auth-token': token } }
            );
            if (res.data.success) {
                toast.success(`🧪 TEST: ${type === 'rfp_details' ? "RFP" : "Client"} Unlocked!`);
                fetchData();
            }
        } catch (err: any) {
            toast.error("Test unlock failed");
        }
    };

    const submitProposal = async () => {
        if (!proposalData.spaceId) { toast.error("Please select a space"); return; }
        try {
            await axios.post('/api/requests/proposal', {
                rfpId: selectedRfp._id,
                brokerId: user?.id,
                spaceId: proposalData.spaceId,
                message: proposalData.message
            });
            toast.success("Proposal Sent!");
            setIsProposalModalOpen(false);
            setProposalData({ spaceId: "", message: "" });
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to send proposal");
        }
    };

    const downloadRFPPDF = (rfp: any) => {
        const data = unlockedDetails[rfp._id];
        if (!data || !data.hasPaidRFP) {
            setSelectedRfp(rfp);
            setPaymentType('rfp_details');
            setIsPaymentModalOpen(true);
            return;
        }

        const specs = typeof data.details === 'string' ? JSON.parse(data.details) : data.details;
        const doc = new jsPDF();
        const date = new Date(data.createdAt).toLocaleDateString();
        let y = 60;

        const addLine = (label: string, value: any, indent = 0) => {
            const valStr = String(value || "Not Specified");
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(40, 40, 40);
            doc.text(`${label}:`, 25 + indent, y);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(80, 80, 80);
            doc.text(valStr, 75 + indent, y);
            y += 8;
            if (y > 275) { doc.addPage(); y = 20; }
        };

        const addSection = (title: string) => {
            y += 5;
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 118, 110);
            doc.text(title.toUpperCase(), 20, y);
            y += 2;
            doc.setDrawColor(230, 230, 230);
            doc.line(20, y, 190, y);
            y += 10;
        };

        doc.setFillColor(15, 118, 110);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("SFT CORPORATE BRIEF", 20, 25);
        doc.setFontSize(8);
        doc.text(`REF ID: ${String(data._id).toUpperCase()}`, 145, 20);
        doc.text(`ISSUED: ${date}`, 145, 26);

        addSection("Client Profile");
        addLine("Company Name", data.companyName);
        if (data.hasPaidClient) {
            addLine("Contact Name", data.clientName);
            addLine("Contact Email", data.email);
            addLine("Contact Phone", data.phone);
        } else {
            addLine("Contact Info", "[PAID CONTENT - UNLOCK CLIENT DETAILS]");
        }

        addSection("Space Requirements");
        addLine("Location", specs.preferredLocation || data.micromarket);
        addLine("Seats", `${data.seats} Pax`);
        addLine("Solution", Array.isArray(specs.solutionType) ? specs.solutionType.join(", ") : specs.solutionType);
        addLine("Budget", data.budget);
        addLine("Timeline", data.timeline);

        addSection("Technical Layout");
        addLine("Cabins", specs.managerCabins);
        addLine("Pantry", specs.pantryType);
        addLine("Server Room", specs.serverRoomRequired ? "Required" : "Not Required");

        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text("Confidential Document - Generated via SFT Partner Network", 105, 285, { align: 'center' });

        doc.save(`SFT_Brief_${data.companyName?.replace(/\s/g, '_')}.pdf`);
        toast.success("Detailed Brief Downloaded!");
    };

    if (loading && rfps.length === 0) {
        return <div className="space-y-4">{[1, 2].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />)}</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-navy tracking-tight">Requirement <span className="text-teal underline decoration-teal/20 underline-offset-8">Hub</span></h1>
                    <p className="text-gray-400 font-bold mt-2 text-sm uppercase tracking-widest">Premium Corporate Leads Network</p>
                </div>
                <div className="flex gap-4">
                    <Badge variant="secondary" className="bg-navy/5 text-navy font-bold px-4 py-2 border-none rounded-xl">
                        <Users className="w-4 h-4 mr-2 text-teal" /> {rfps.length} Active Leads
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {rfps.map((rfp) => {
                    const status = paymentStatuses[rfp._id] || { hasPaidRFP: false, hasPaidClient: false };
                    const detail = unlockedDetails[rfp._id];
                    const proposal = myProposals.find(p => (p.rfpId?._id || p.rfpId) === rfp._id);

                    return (
                        <Card key={rfp._id} className="group overflow-hidden bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-500">
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center text-white shadow-lg shadow-navy/20">
                                                <Building2 className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-navy leading-none">
                                                    {status.hasPaidClient ? (rfp.companyName || "Client Confirmed") : "Qualified Office Requirement"}
                                                </h3>
                                                <p className="text-teal font-bold text-sm mt-1 uppercase tracking-tighter">REF: {rfp._id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-6 pt-4">
                                            <div className="flex items-center gap-2 group/item">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:text-teal group-hover/item:bg-teal/5 transition-colors">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-600">{rfp.micromarket}</span>
                                            </div>
                                            <div className="flex items-center gap-2 group/item">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:text-teal group-hover/item:bg-teal/5 transition-colors">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-600">{rfp.seats} Seats</span>
                                            </div>
                                            <div className="flex items-center gap-2 group/item">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:text-teal group-hover/item:bg-teal/5 transition-colors">
                                                    <CreditCard className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-600">{rfp.budget}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 min-w-[220px]">
                                        {!status.hasPaidRFP ? (
                                            <div className="flex flex-col gap-3">
                                                <Badge variant="outline" className="border-teal/20 text-teal font-black px-4 py-1.5 rounded-full uppercase text-[10px] w-fit">RFP Found</Badge>
                                                <Button onClick={() => handlePayment(rfp._id, 'rfp_details')} className="w-full h-14 rounded-2xl bg-navy hover:bg-teal text-white font-bold group/btn shadow-lg shadow-navy/10 active:scale-[0.98] transition-all">
                                                    <Lock className="w-4 h-4 mr-2 group-hover/btn:hidden" />
                                                    <CreditCard className="w-4 h-4 mr-2 hidden group-hover/btn:block animate-in slide-in-from-bottom-2" />
                                                    Pay and Get RFP Details (₹1)
                                                </Button>
                                                <Button 
                                                    variant="link" 
                                                    onClick={() => handleTestUnlock(rfp._id, 'rfp_details')} 
                                                    className="text-[10px] text-gray-400 hover:text-teal font-bold p-0 h-auto"
                                                >
                                                    🧪 SKIP PAYMENT (TEST)
                                                </Button>
                                            </div>
                                        ) : proposal ? (
                                            <div className="flex flex-col gap-2">
                                                <Button disabled className="w-full h-14 rounded-2xl bg-green-50 text-green-600 border border-green-100 font-bold opacity-100 mb-1">
                                                    <ShieldCheck className="w-5 h-5 mr-2" /> Proposal Sent
                                                </Button>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase text-center tracking-widest">
                                                    Wait for Client Handshake
                                                </p>
                                            </div>
                                        ) : (
                                            <Button onClick={() => { setSelectedRfp(rfp); setIsProposalModalOpen(true); }} className="w-full h-14 rounded-2xl bg-navy hover:bg-teal text-white font-bold shadow-lg shadow-navy/20 active:scale-[0.98] transition-all">
                                                <Send className="w-4 h-4 mr-2" /> Send Proposal
                                            </Button>
                                        )}
                                        <Button variant="outline" onClick={() => downloadRFPPDF(rfp)} className="w-full h-14 rounded-2xl border-gray-100 text-gray-500 font-bold hover:bg-gray-50 hover:text-navy transition-all">
                                            <FileText className="w-4 h-4 mr-2" /> {status.hasPaidRFP ? "Download Brief" : "Preview Brief"}
                                        </Button>
                                    </div>
                                </div>

                                {status.hasPaidRFP && detail && (
                                    <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4 duration-500">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-navy">
                                                <div className="w-1.5 h-6 bg-teal rounded-full" />
                                                <h4 className="text-lg font-black uppercase tracking-tight">RFP Specifications</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gray-50/50 p-4 rounded-2xl">
                                                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Timeline</p>
                                                    <p className="font-bold text-navy truncate">{detail.timeline}</p>
                                                </div>
                                                <div className="bg-gray-50/50 p-4 rounded-2xl">
                                                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Industry</p>
                                                    <p className="font-bold text-navy truncate">{detail.details?.industry || "TBD"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-navy">
                                                <div className="w-1.5 h-6 bg-navy rounded-full" />
                                                <h4 className="text-lg font-black uppercase tracking-tight">Client Contact</h4>
                                            </div>
                                            <div className="h-[90px] bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200 px-6 text-center">
                                                <div className="space-y-1">
                                                    <Lock className="w-5 h-5 text-gray-300 mx-auto" />
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">
                                                        Unlocked only after<br/>Client Handshake
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Proposal Modal */}
            <Dialog open={isProposalModalOpen} onOpenChange={setIsProposalModalOpen}>
                <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-10 outline-none">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black text-navy leading-none">Submit Corporate Proposal</DialogTitle>
                        <p className="text-gray-400 font-bold text-sm tracking-tight mt-2">Suggest your premium workspace for this requirement</p>
                    </DialogHeader>
                    
                    <div className="space-y-8 py-8">
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] pl-1">Select Property to Pitch</Label>
                            <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {mySpaces.map((space) => (
                                    <div 
                                        key={space._id} 
                                        onClick={() => setProposalData({ ...proposalData, spaceId: space._id })}
                                        className={cn(
                                            "p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer flex items-center justify-between group",
                                            proposalData.spaceId === space._id 
                                                ? 'border-teal bg-teal/5 shadow-inner' 
                                                : 'border-gray-50 bg-gray-50/30 hover:border-gray-200 hover:bg-gray-50 transition-all duration-300'
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm", proposalData.spaceId === space._id ? 'bg-teal text-white' : 'bg-white text-gray-300 group-hover:text-teal')}>
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-navy">{space.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{space.location}, {space.city}</p>
                                            </div>
                                        </div>
                                        {proposalData.spaceId === space._id && (
                                            <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white shadow-lg animate-in zoom-in-50 duration-300">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] pl-1">Pitch Message (Optional)</Label>
                            <Textarea 
                                placeholder="Highlight key features that match the client's specs..." 
                                value={proposalData.message} 
                                onChange={e => setProposalData({ ...proposalData, message: e.target.value })}
                                className="rounded-[1.5rem] min-h-[140px] border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal/20 transition-all text-navy font-medium p-6"
                            />
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-start gap-4">
                        <Button 
                            onClick={submitProposal} 
                            className="flex-1 bg-navy hover:bg-teal text-white h-16 rounded-2xl font-black text-lg shadow-xl shadow-navy/20 active:scale-[0.98] transition-all"
                        >
                            <Send className="w-5 h-5 mr-3" /> Deliver Proposal to Client
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={() => setIsProposalModalOpen(false)}
                            className="h-16 rounded-2xl px-8 font-bold text-gray-400 hover:text-navy hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Explanatory Note for New Workflow */}
            <div className="mt-12 p-8 rounded-[2rem] bg-teal/5 border border-teal/10 text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-teal">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-navy tracking-tight">Enterprise Lead Protection Workflow</h3>
                <p className="text-gray-500 text-sm max-w-2xl mx-auto font-medium">
                    To maintain the highest quality of corporate lead data, we follow a gated acquisition process. 
                    Unlock RFP specifications first to ensure your space is a perfect fit. Once you send a proposal, 
                    wait for the client to initiate a **Handshake**. Contact details will be available for purchase 
                    only after a successful Handshake is established.
                </p>
            </div>
        </div>
    );
};

export default BrokerRequests;

// force re-render
