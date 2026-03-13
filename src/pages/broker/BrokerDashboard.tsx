import { useState, useEffect } from "react";
import { Building2, Users, FileText, CheckCircle, TrendingUp, Handshake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

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
        { title: "Members Booked", value: stats.totalBookings, icon: Users, color: "text-teal", bg: "bg-teal/5" },
        { title: "Open RFPs", value: stats.activeRFPs, icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
        { title: "Handshakes", value: stats.handshakes, icon: Handshake, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-navy">Partner <span className="text-teal">Dashboard</span></h1>
                    <p className="text-gray-500 text-sm">Welcome back! Here's an overview of your workspace portfolio.</p>
                </div>
                <Button onClick={() => navigate("/broker/submit-property")} className="w-full md:w-auto bg-teal hover:bg-teal/90 text-white font-bold rounded-xl h-12 px-6">
                    <Building2 className="w-5 h-5 mr-2" /> Add New Building
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-[10px] font-bold text-teal flex items-center gap-1 uppercase tracking-tighter">
                                    <TrendingUp className="w-3 h-3" /> Live data
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-navy">{stat.value}</div>
                            <div className="text-sm font-medium text-gray-500 mt-1">{stat.title}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Messaging & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-navy p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl flex flex-col justify-center min-h-[300px]">
                    <div className="relative z-10">
                        <Badge className="bg-teal text-white border-none mb-6 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Partner Perspective</Badge>
                        <h2 className="text-3xl font-bold mb-4 leading-tight">Your workspaces are <span className="text-teal">live & active</span></h2>
                        <p className="text-white/60 leading-relaxed max-w-xl text-lg">
                            We've started distributing your portfolio to our network of corporate procurement managers and space seekers. Monitor your inquiries in real-time.
                        </p>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-10">
                        <Handshake className="w-64 h-64" />
                    </div>
                </div>

                <Card className="border-none shadow-sm rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center bg-white">
                    <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center text-teal mb-6">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-2">Grow Portfolio</h3>
                    <p className="text-gray-400 text-sm mb-8">Add more properties to increase your visibility to enterprise clients.</p>
                    <Button onClick={() => navigate("/broker/submit-property")} className="w-full bg-navy hover:bg-teal text-white h-12 rounded-xl font-bold transition-all">
                        Add Workspace
                    </Button>
                </Card>
            </div>

            {/* Dashboard Footer */}
            <div className="pt-8 text-center text-gray-400 text-xs">
                &copy; 2026 FlickSpace Partner Portal. All workspace listings are verified.
            </div>
        </div>
    );
};

export default BrokerDashboard;
