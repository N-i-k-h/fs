import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, XCircle, User, Building2, Phone, Mail, ArrowRight, ExternalLink } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const AdminBrokerProposals = () => {
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProposals = async () => {
        try {
            const res = await axios.get('/api/requests/proposals/admin');
            setProposals(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load proposals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await axios.put(`/api/requests/proposal/${id}/status`, { status });
            toast.success(`Proposal ${status} successfully!`);
            fetchProposals();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-teal">Broker <span className="text-navy">Proposals</span></h1>
                <p className="text-gray-500">Monitor all workspace biddings between partners and clients.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-50 animate-pulse rounded-3xl" />)}
                </div>
            ) : proposals.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {proposals.map((prop, idx) => (
                        <motion.div
                            key={prop._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="border-none shadow-sm rounded-3xl overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                                <CardContent className="p-0">
                                    <div className="flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
                                        
                                        {/* 1. CLIENT SIDE */}
                                        <div className="flex-1 p-8 bg-white">
                                            <div className="flex items-center justify-between mb-6">
                                                <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    Client Side
                                                </Badge>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase">{new Date(prop.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            
                                            <div className="flex items-start gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 font-bold shrink-0 text-xl">
                                                    {prop.rfpId?.companyName?.[0] || 'C'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-teal text-xl">{prop.rfpId?.companyName || "Confidential Client"}</h3>
                                                    <p className="text-sm text-gray-500 font-medium">Req for {prop.rfpId?.seats} Seats in {prop.rfpId?.micromarket}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <div className="text-xs">
                                                        <p className="text-gray-400 font-bold uppercase text-[8px]">Client Name</p>
                                                        <p className="font-bold text-navy">{prop.rfpId?.clientName || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <div className="text-xs">
                                                        <p className="text-gray-400 font-bold uppercase text-[8px]">Client Phone</p>
                                                        <p className="font-bold text-navy">{prop.rfpId?.phone || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 col-span-full">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <div className="text-xs">
                                                        <p className="text-gray-400 font-bold uppercase text-[8px]">Client Email</p>
                                                        <p className="font-bold text-navy">{prop.rfpId?.email || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* MATCH ICON */}
                                        <div className="bg-gray-50 flex items-center justify-center py-4 xl:py-0 xl:w-20 shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-teal">
                                                <ArrowRight className="w-5 h-5 xl:rotate-0 rotate-90" />
                                            </div>
                                        </div>

                                        {/* 2. BROKER SIDE */}
                                        <div className="flex-1 p-8 bg-white">
                                            <div className="flex items-center justify-between mb-6">
                                                <Badge className="bg-navy/10 text-navy border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    Broker Side
                                                </Badge>
                                                <div className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                                                    prop.status === 'approved' ? "bg-green-50 text-green-600" :
                                                    prop.status === 'rejected' ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-600"
                                                )}>
                                                    {prop.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : prop.status === 'rejected' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {prop.status}
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy font-bold shrink-0">
                                                    <Building2 className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-teal text-xl">{prop.spaceId?.name || "Workspace Offer"}</h3>
                                                    <p className="text-sm text-gray-500 font-medium">{prop.spaceId?.location}, {prop.spaceId?.city}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <div className="text-xs">
                                                        <p className="text-gray-400 font-bold uppercase text-[8px]">Broker Name</p>
                                                        <p className="font-bold text-navy">{prop.brokerId?.name || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <div className="text-xs">
                                                        <p className="text-gray-400 font-bold uppercase text-[8px]">Broker Phone</p>
                                                        <p className="font-bold text-navy">{prop.brokerId?.phone || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 col-span-full">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <div className="text-xs">
                                                        <p className="text-gray-400 font-bold uppercase text-[8px]">Broker Email</p>
                                                        <p className="font-bold text-navy">{prop.brokerId?.email || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. ACTION PANEL */}
                                        <div className="p-8 bg-gray-50 flex flex-col justify-center gap-4 xl:w-56 shrink-0">
                                            <div className="text-center mb-2">
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Match Proposal</p>
                                                <div className="h-1 w-full bg-teal/20 rounded-full" />
                                            </div>
                                            
                                            {prop.status === 'pending' ? (
                                                <>
                                                    <Button 
                                                        onClick={() => updateStatus(prop._id, 'approved')}
                                                        className="w-full bg-teal hover:bg-teal/90 text-white rounded-xl h-11 font-bold shadow-lg shadow-teal/10"
                                                    >
                                                        Approve Match
                                                    </Button>
                                                    <Button 
                                                        variant="outline"
                                                        onClick={() => updateStatus(prop._id, 'rejected')}
                                                        className="w-full rounded-xl h-11 border-gray-200 text-gray-500"
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            ) : prop.status === 'approved' ? (
                                                <div className="p-4 rounded-2xl bg-green-50 text-green-700 text-center border border-green-100">
                                                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                                    <p className="text-sm font-bold">Successfully Matched</p>
                                                    <p className="text-[10px] opacity-70">Admin intervention required next.</p>
                                                </div>
                                            ) : (
                                                <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-center border border-red-100">
                                                    <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                                                    <p className="text-sm font-bold">Proposal Rejected</p>
                                                </div>
                                            )}
                                            
                                            <Button variant="ghost" className="text-teal font-bold text-xs gap-2">
                                                <ExternalLink className="w-3.5 h-3.5" /> View Property
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center bg-white rounded-3xl border border-gray-100">
                    <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-teal">No Broker Proposals</h3>
                    <p className="text-gray-400">Broker submissions for client RFPs will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default AdminBrokerProposals;
