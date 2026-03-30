import { useState, useEffect } from "react";
import { Handshake, MapPin, Users, Calendar, Mail, Phone, Lock, CreditCard, Building2, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const BrokerHandshakes = () => {
    const { user } = useAuth();
    const [handshakes, setHandshakes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHandshakes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/broker/handshakes', {
                headers: { 'x-auth-token': token }
            });
            setHandshakes(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load handshakes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHandshakes();
    }, []);

    const handlePayment = async (requestId: string, type: 'client_details') => {
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
                description: "Unlock Client Contact Leads",
                order_id: order.id,
                handler: async (response: any) => {
                    try {
                        const verifyRes = await axios.post("/api/payments/verify-payment", {
                            ...response,
                            requestId,
                            type
                        });

                        if (verifyRes.data.success) {
                            toast.success("Client Details Unlocked!");
                            fetchHandshakes();
                        }
                    } catch (err) {
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: { color: "#0F766E" },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (err: any) {
            console.error("Payment Init Error:", err);
            toast.error("Failed to initialize payment");
        }
    };

    const handleTestUnlock = async (requestId: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post("/api/payments/test-unlock", 
                { requestId, type: 'client_details' },
                { headers: { 'x-auth-token': token } }
            );
            if (res.data.success) {
                toast.success("🧪 TEST: Client Unlocked!");
                fetchHandshakes();
            }
        } catch (err: any) {
            toast.error("Test unlock failed");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-navy tracking-tight">Handshake <span className="text-teal underline decoration-teal/20 underline-offset-8">Network</span></h1>
                    <p className="text-gray-400 font-bold mt-2 text-sm uppercase tracking-widest">Active Corporate Connections</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-3xl" />
                    ))}
                </div>
            ) : handshakes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {handshakes.map((h) => (
                        <Card key={h._id} className="border-none shadow-xl shadow-gray-200/50 bg-white rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-gray-50">
                            <CardContent className="p-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center text-teal shadow-inner">
                                            <Handshake className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-navy leading-tight">{h.user}</h3>
                                            <Badge variant="outline" className={cn(
                                                "mt-1 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full",
                                                h.type === 'Direct Handshake' ? 'border-navy/20 text-navy' : 'border-teal/20 text-teal bg-teal/5'
                                            )}>
                                                {h.type}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-1">Budget</span>
                                        <span className="text-sm font-bold text-teal">{h.budget || 'TBD'}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
                                        <Building2 className="w-5 h-5 text-navy opacity-50" />
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black leading-none mb-1">Target Office</p>
                                            <p className="text-md font-bold text-navy">{h.space}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pl-4">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-bold text-gray-600">{h.seats} Seats</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-bold text-gray-600">{h.timeline}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100">
                                    {h.needsPayment ? (
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-3">
                                                <Button onClick={() => handlePayment(h.rfpId, 'client_details')} className="w-full h-14 rounded-2xl bg-navy hover:bg-teal text-white font-bold group/btn shadow-lg shadow-navy/20 active:scale-[0.98] transition-all">
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    Pay ₹1 to Unlock Client Contact
                                                </Button>
                                                <Button 
                                                    variant="link" 
                                                    onClick={() => handleTestUnlock(h.rfpId)} 
                                                    className="text-[10px] text-gray-400 hover:text-teal font-bold p-0 h-auto"
                                                >
                                                    🧪 SKIP PAYMENT (TEST)
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <a href={`mailto:${h.email}`} className="flex items-center justify-center gap-3 h-14 bg-teal text-white rounded-2xl text-sm font-black shadow-lg shadow-teal/20 hover:bg-navy transition-all">
                                                <Mail className="w-5 h-5" /> Email Client
                                            </a>
                                            <a href={`tel:${h.phone}`} className="flex items-center justify-center gap-3 h-14 border-2 border-teal text-teal rounded-2xl text-sm font-black hover:bg-teal/5 transition-all">
                                                <Phone className="w-5 h-5" /> {h.phone || "Call Now"}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center bg-white rounded-[4rem] border border-dashed border-gray-200">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Handshake className="w-12 h-12 text-gray-200" />
                    </div>
                    <h3 className="text-2xl font-black text-navy mb-2">No Active Handshakes</h3>
                    <p className="text-gray-400 max-w-sm mx-auto font-medium">When clients accept your proposals or initiate direct inquiries, the connections will appear here.</p>
                </div>
            )}
        </div>
    );
};

// Helper component for missing icon
import { cn } from "@/lib/utils";

export default BrokerHandshakes;
