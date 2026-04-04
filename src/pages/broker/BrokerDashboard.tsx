import { useState, useEffect } from "react";
import { Building2, Users, FileText, CheckCircle, TrendingUp, Handshake, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import ContactModal from "@/components/ContactModal";

import { motion } from "framer-motion";

const BrokerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [proposals, setProposals] = useState<any[]>([]);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [stats, setStats] = useState({
        totalSpaces: 0,
        totalBookings: 0,
        activeRFPs: 0,
        handshakes: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await axios.get('/api/broker/stats', {
                    headers: { 'x-auth-token': token }
                });

                setStats({
                    totalSpaces: res.data.totalSpaces,
                    totalBookings: res.data.totalBookings,
                    activeRFPs: res.data.activeProposals,
                    handshakes: res.data.handshakes
                });

                // Fetch real proposals
                const propRes = await axios.get(`/api/requests/proposals/broker/${user?.id}`);
                setProposals(propRes.data);
            } catch (err) {
                console.error("Error fetching broker stats:", err);
            }
        };
        if (user) fetchStats();
    }, [user]);

    const statCards = [
        { title: "My Buildings", value: stats.totalSpaces, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Members Booked", value: stats.totalBookings, icon: Users, color: "text-navy", bg: "bg-navy/5" },
        { title: "Open RFPs", value: stats.activeRFPs, icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
        { title: "Handshakes", value: stats.handshakes, icon: Handshake, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-8"
        >
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-teal">Partner <span className="text-navy">Dashboard</span></h1>
                    <p className="text-gray-500 text-sm">Welcome back! Here's an overview of your workspace portfolio.</p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={() => navigate("/broker/submit-property")} className="w-full md:w-auto bg-navy hover:bg-navy/90 text-white font-bold rounded-xl h-12 px-6 shadow-lg shadow-navy/20 transition-all">
                        <Building2 className="w-5 h-5 mr-2" /> Add New Building
                    </Button>
                </motion.div>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div key={i} variants={itemVariants}>
                        <Card 
                            onClick={() => stat.title === "Open RFPs" && navigate("/broker/requests")}
                            className={cn(
                                "border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group hover:-translate-y-1",
                                stat.title === "Open RFPs" && "cursor-pointer"
                            )}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-[10px] font-bold text-navy flex items-center gap-1 uppercase tracking-tighter">
                                        <TrendingUp className="w-3 h-3 animate-pulse" /> Live data
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-teal">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-500 mt-1">{stat.title}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Messaging & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col min-h-[400px]"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-teal">Recent Proposal Status</h2>
                            <p className="text-gray-400 text-xs">Track your workspace biddings for client RFPs.</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                            <Send className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {proposals.length > 0 ? (
                            proposals.map((prop, i) => (
                                <motion.div
                                    key={prop._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (i * 0.1) }}
                                    className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-teal/20 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-navy font-bold">
                                                {prop.rfpId?.companyName?.[0] || 'C'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-navy group-hover:text-teal transition-colors">{prop.rfpId?.companyName || "Confidential Client"}</h4>
                                                <p className="text-[10px] text-gray-500 font-medium">Proposed: {prop.spaceId?.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-none mb-1",
                                                prop.status === 'Handshake' ? "bg-green-100 text-green-700" :
                                                prop.status === 'rejected' ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                                            )}>
                                                {prop.status}
                                            </Badge>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(prop.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {prop.status === 'Handshake' && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-[10px] text-green-600 font-bold">
                                            <CheckCircle className="w-3 h-3" /> Client accepted! Please visit "Handshake Responses" to unlock their details.
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <FileText className="w-12 h-12 mb-4" />
                                <p className="text-sm font-bold">No proposals submitted yet</p>
                                <p className="text-[10px]">Your bids for RFPs will appear here.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-6 flex flex-col">
                    <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center bg-teal text-white group hover:-translate-y-1 flex-1 relative overflow-hidden">
                        <div className="relative z-10 w-full">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6 mx-auto">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Grow Portfolio</h3>
                            <p className="text-white/60 text-sm mb-8">Add more properties to increase your visibility to enterprise clients.</p>
                            <Button onClick={() => navigate("/broker/submit-property")} className="w-full bg-navy hover:bg-white hover:text-navy text-white h-12 rounded-xl font-bold transition-all shadow-lg">
                                Add Workspace
                            </Button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 opacity-10">
                            <Building2 className="w-64 h-64" />
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] p-6 flex flex-col bg-navy text-white group hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                                <Handshake className="w-4 h-4" />
                            </div>
                            <h4 className="font-bold text-sm">Need Help?</h4>
                        </div>
                        <p className="text-[10px] text-white/50 mb-4">Questions about matching or RFPs? Our partnership team is here to assist you.</p>
                        <Button 
                            onClick={() => setIsContactOpen(true)}
                            variant="outline" 
                            className="w-full border-white/20 hover:bg-white hover:text-navy text-white text-xs h-10 rounded-lg transition-all"
                        >
                            Contact Admin
                        </Button>
                    </Card>
                </motion.div>
            </div>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />


            {/* Dashboard Footer */}
            <motion.div
                variants={itemVariants}
                className="pt-8 text-center text-gray-400 text-xs"
            >
                &copy; 2026 Xplore SFT Partner Portal. All workspace listings are verified.
            </motion.div>
        </motion.div>
    );
};

export default BrokerDashboard;
