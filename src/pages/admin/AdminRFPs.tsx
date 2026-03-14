import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, User, Building2, Mail, Phone, ArrowRight, ExternalLink } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const AdminRFPs = () => {
    const [proposals, setProposals] = useState<any[]>([]);
    const [rfps, setRfps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // 1. Fetch Proposals (Broker Bids)
            const propRes = await axios.get('/api/requests/proposals/admin');
            setProposals(propRes.data);

            // 2. Fetch Raw RFPs (to show unmatched ones)
            const reqRes = await axios.get('/api/requests');
            const unmatched = reqRes.data.filter((r: any) =>
                r.type === 'Detailed RFP' &&
                !propRes.data.some((p: any) => p.rfpId?._id === r._id)
            );
            setRfps(unmatched);

        } catch (err) {
            console.error(err);
            toast.error("Failed to load RFP data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const approveProposal = async (id: string) => {
        try {
            await axios.put(`/api/requests/proposal/${id}/approve`);
            toast.success("Proposal Approved!", {
                description: "Emails with RFP PDF have been sent to both Client and Partner."
            });
            fetchData();
        } catch (err) {
            toast.error("Failed to approve proposal");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-teal">Corporate <span className="text-navy">RFPs & Proposals</span></h1>
                    <p className="text-gray-500">Manage detailed requirements and partner matches.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">

                {/* 1. ACTIVE PROPOSALS (BROKER BIDS) */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <CheckCircle className="w-5 h-5 text-navy" />
                        <h2 className="text-xl font-bold text-teal">Partner Proposals</h2>
                        <Badge variant="secondary" className="ml-2 bg-navy/10 text-navy">{proposals.length}</Badge>
                    </div>

                    {loading ? (
                        <div className="h-48 bg-gray-50 animate-pulse rounded-3xl" />
                    ) : proposals.length > 0 ? (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            {proposals.map((prop, idx) => (
                                <motion.div
                                    key={prop._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className={`border-none shadow-sm rounded-3xl overflow-hidden border ${prop.status === 'approved' ? 'ring-2 ring-navy/20' : 'border-gray-100'}`}>
                                        <CardContent className="p-0">
                                            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                                                {/* Client Side (The RFP) */}
                                                <div className="flex-1 p-6 bg-white">
                                                    <div className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-3">Client Requirement</div>
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                                            {prop.rfpId?.companyName?.[0] || 'C'}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-bold text-teal text-lg">{prop.rfpId?.companyName || "N/A"}</h3>
                                                                {prop.rfpId?.details?.industry && <Badge variant="outline" className="text-[9px] h-4 border-teal/20 text-teal">{prop.rfpId.details.industry}</Badge>}
                                                            </div>
                                                            <p className="text-xs text-gray-500">{prop.rfpId?.micromarket} • {prop.rfpId?.seats} Seats {prop.rfpId?.details?.fundingStatus ? `• ${prop.rfpId.details.fundingStatus}` : ''}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-y-2 text-xs">
                                                        <div className="text-gray-400">Timeline:</div>
                                                        <div className="text-teal font-medium">{prop.rfpId?.timeline}</div>
                                                        <div className="text-gray-400">Budget:</div>
                                                        <div className="text-teal font-medium">{prop.rfpId?.budget}</div>
                                                    </div>
                                                </div>

                                                {/* Matches Arrow */}
                                                <div className="bg-gray-50 lg:w-16 flex items-center justify-center py-4 lg:py-0">
                                                    <ArrowRight className="w-6 h-6 text-gray-300" />
                                                </div>

                                                {/* Partner Side (The Proposal) */}
                                                <div className="flex-1 p-6 bg-white">
                                                    <div className="text-[10px] uppercase tracking-widest text-navy font-black mb-3">Partner Proposal</div>
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy font-bold shrink-0">
                                                            <Building2 className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-teal text-lg">{prop.spaceId?.name || "N/A"}</h3>
                                                            <p className="text-xs text-gray-500">{prop.spaceId?.location}, {prop.spaceId?.city}</p>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100 italic text-xs text-gray-600">
                                                        "{prop.message || "No message provided."}"
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <User className="w-3 h-3" /> Proposed by {prop.brokerId?.name}
                                                    </div>
                                                </div>

                                                {/* Action Column */}
                                                <div className="p-6 bg-gray-50/50 flex flex-col justify-center items-center min-w-[160px] gap-3">
                                                    {prop.status === 'pending' ? (
                                                        <Button
                                                            onClick={() => approveProposal(prop._id)}
                                                            className="bg-teal hover:bg-teal/90 text-white w-full rounded-xl"
                                                        >
                                                            Approve Match
                                                        </Button>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <Badge className="bg-green-100 text-green-700 border-none px-4 py-1.5 rounded-full mb-1">
                                                                <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Approved
                                                            </Badge>
                                                            <span className="text-[10px] text-gray-400 uppercase font-black">Email Sent</span>
                                                        </div>
                                                    )}
                                                    <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-teal">
                                                        <ExternalLink className="w-3 h-3 mr-1.5" /> View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                            <p className="text-gray-400">No partner proposals submitted yet.</p>
                        </div>
                    )}
                </section>

                {/* 2. UNMATCHED RFPs */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <h2 className="text-xl font-bold text-teal">Pending Client RFPs</h2>
                        <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-500">{rfps.length}</Badge>
                    </div>

                    {rfps.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {rfps.map((rfp) => (
                                <motion.div
                                    key={rfp._id}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.95 },
                                        visible: { opacity: 1, scale: 1 }
                                    }}
                                >
                                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                                                    {rfp.companyName?.[0] || 'C'}
                                                </div>
                                                <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-none">Pending Bid</Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-teal truncate">{rfp.companyName || "Confidential"}</h3>
                                                {rfp.details?.industry && <Badge variant="outline" className="text-[8px] h-4 border-teal/20 text-teal whitespace-nowrap">{rfp.details.industry}</Badge>}
                                            </div>
                                            <p className="text-xs text-gray-400 mb-4">{rfp.micromarket} {rfp.details?.fundingStatus ? `• ${rfp.details.fundingStatus}` : ''}</p>

                                            <div className="space-y-2 mb-6">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400">Requirement:</span>
                                                    <span className="text-teal font-semibold">{rfp.seats} Seats</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400">Timeline:</span>
                                                    <span className="text-teal font-semibold">{rfp.timeline}</span>
                                                </div>
                                            </div>

                                            <Button variant="outline" className="w-full rounded-xl text-navy border-navy/20 hover:bg-navy/5">
                                                View Full Brief
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                            <p className="text-gray-400">All RFPs have active proposals or are processed.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminRFPs;
