import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, User, Building2, Calendar, CreditCard, ExternalLink, Mail } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

const AdminPayments = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await axios.get('/api/payments/admin-payments');
                setPayments(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load payment history");
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-extrabold text-navy tracking-tight">Lead <span className="text-teal">Revenue & Payments</span></h1>
                <p className="text-muted-foreground mt-2">Track all payments made by partners to unlock corporate leads.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-emerald-500 shadow-md">
                    <CardHeader className="pb-2">
                        <CardDescription className="uppercase text-[10px] font-black tracking-widest">Total Corp Revenue</CardDescription>
                        <CardTitle className="text-3xl text-navy">₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-l-4 border-l-blue-500 shadow-md">
                    <CardHeader className="pb-2">
                        <CardDescription className="uppercase text-[10px] font-black tracking-widest">Successful Unlocks</CardDescription>
                        <CardTitle className="text-3xl text-navy">{payments.length}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card className="shadow-lg border-none rounded-3xl overflow-hidden">
                <CardHeader className="bg-navy p-8 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">Payment Transaction Log</CardTitle>
                            <CardDescription className="text-navy-foreground/60 text-teal">Real-time revenue updates from Razorpay</CardDescription>
                        </div>
                        <CreditCard className="w-10 h-10 opacity-20" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest border-b">
                                <tr>
                                    <th className="px-8 py-5">Partner (Payer)</th>
                                    <th className="px-8 py-5">RFP (Asset)</th>
                                    <th className="px-8 py-5">Unlock Type</th>
                                    <th className="px-8 py-5">Amount</th>
                                    <th className="px-8 py-5">TXN Date</th>
                                    <th className="px-8 py-5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-20 text-gray-400">Fetching transaction logs...</td></tr>
                                ) : payments.length > 0 ? (
                                    payments.map((p) => (
                                        <tr key={p._id} className="hover:bg-teal/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-navy text-base leading-tight">{p.broker?.name || 'Unknown'}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-1">
                                                        <Mail className="w-2.5 h-2.5" /> {p.broker?.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-teal line-clamp-1">{p.request?.companyName || "N/A"}</span>
                                                    <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                                                        <Building2 className="w-2.5 h-2.5" /> {p.request?.type || 'Detailed RFP'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge variant="secondary" className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${p.type === 'client_details' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {p.type === 'client_details' ? 'CONTACT INFO' : 'RFP SPECS'}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-black text-navy">₹{p.amount || 0}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(p.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black uppercase tracking-tighter sm:px-3">
                                                    CAPTURED
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={6} className="text-center py-20 text-gray-400">No payment transactions found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminPayments;
