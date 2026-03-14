import { useState, useEffect } from "react";
import { Building2, Users, FileText, CheckCircle, TrendingUp, Handshake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

import { motion } from "framer-motion";

const BrokerDashboard = () => {
    const navigate = useNavigate();
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
            } catch (err) {
                console.error("Error fetching broker stats:", err);
            }
        };
        fetchStats();
    }, []);

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
                        <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group hover:-translate-y-1">
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
                    className="lg:col-span-2 bg-teal p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl flex flex-col justify-center min-h-[300px]"
                >
                    <div className="relative z-10">
                        <Badge className="bg-navy text-white border-none mb-6 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Partner Perspective</Badge>
                        <h2 className="text-3xl font-bold mb-4 leading-tight">Your workspaces are <span className="text-navy">live & active</span></h2>
                        <p className="text-white/60 leading-relaxed max-w-xl text-lg">
                            We've started distributing your portfolio to our network of corporate procurement managers and space seekers. Monitor your inquiries in real-time.
                        </p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                        animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute -bottom-10 -right-10"
                    >
                        <Handshake className="w-64 h-64" />
                    </motion.div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2.5rem] p-8 h-full flex flex-col items-center justify-center text-center bg-white group hover:-translate-y-1">
                        <div className="w-16 h-16 rounded-2xl bg-navy/10 flex items-center justify-center text-navy mb-6 group-hover:bg-navy/20 transition-colors">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-teal mb-2">Grow Portfolio</h3>
                        <p className="text-gray-400 text-sm mb-8">Add more properties to increase your visibility to enterprise clients.</p>
                        <motion.div whileHover={{ scale: 1.05 }} className="w-full mt-auto">
                            <Button onClick={() => navigate("/broker/submit-property")} className="w-full bg-teal hover:bg-navy text-white h-12 rounded-xl font-bold transition-all shadow-lg hover:shadow-navy/20">
                                Add Workspace
                            </Button>
                        </motion.div>
                    </Card>
                </motion.div>
            </div>

            {/* Dashboard Footer */}
            <motion.div
                variants={itemVariants}
                className="pt-8 text-center text-gray-400 text-xs"
            >
                &copy; 2026 SFT Partner Portal. All workspace listings are verified.
            </motion.div>
        </motion.div>
    );
};

export default BrokerDashboard;
