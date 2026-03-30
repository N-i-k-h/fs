// Version: 2026-03-20_2311
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
    User,
    Calendar,
    Heart,
    LogOut,
    MapPin,
    Clock,
    ArrowRight,
    Handshake,
    FileText,
    Download,
    Send,
    Mail,
    Building2,
    Phone,
    CheckCircle2
} from "lucide-react";
import { jsPDF } from "jspdf";
import { cn } from "@/lib/utils";
import { workspaces } from "@/data/workspaces";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("appointments");
    const [savedSpaces, setSavedSpaces] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [proposals, setProposals] = useState<any[]>([]);

    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        company: user?.company || ""
    });

    useEffect(() => {
        console.log("✅ Dashboard v2.311 Loaded");
    }, []);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                phone: user.phone || "",
                company: user.company || ""
            });
        }
    }, [user]);

    useEffect(() => {
        const loadSaved = () => {
            try {
                const savedIds = JSON.parse(localStorage.getItem("savedSpaces") || "[]");
                const filtered = workspaces.filter(w =>
                    savedIds.some((sid: any) => String(sid) === String(w.id))
                );
                setSavedSpaces(filtered);
            } catch (error) {
                console.error("Failed to load saved spaces:", error);
                setSavedSpaces([]);
            }
        };
        loadSaved();
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            if (user?.email) {
                setLoading(true);
                try {
                    const res = await axios.get(`/api/requests/user/${encodeURIComponent(user.email)}`);
                    setAppointments(Array.isArray(res.data) ? res.data : []);
                } catch (err) {
                    console.error("Failed to fetch bookings", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBookings();
    }, [user, activeTab, location.key]);

    useEffect(() => {
        const fetchProposals = async () => {
            if (user?.email) {
                try {
                    const res = await axios.get(`/api/requests/proposals/client/${encodeURIComponent(user.email)}`);
                    setProposals(Array.isArray(res.data) ? res.data : []);
                } catch (err) {
                    console.error("Failed to fetch proposals", err);
                }
            }
        };
        fetchProposals();
    }, [user, activeTab, location.key]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('/api/users/profile', profileData, {
                headers: { 'x-auth-token': token }
            });
            toast.success("Profile updated successfully!");
            if (login && res.data) {
                login(token!, res.data);
            }
        } catch (err) {
            toast.error("Failed to update profile");
        }
    };

    const handleProposalStatus = async (id: string, status: string) => {
        try {
            await axios.put(`/api/requests/proposal/${id}/status`, { status });
            toast.success(`Proposal ${status === 'Handshake' ? 'Handshake Successful' : 'Declined'}`);
            const res = await axios.get(`/api/requests/proposals/client/${encodeURIComponent(user!.email)}`);
            setProposals(res.data);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const downloadRFPPDF = (rfp: any) => {
        try {
            const data = typeof rfp.details === 'string' ? JSON.parse(rfp.details) : rfp.details;
            if (!data) {
                toast.error("No detailed brief available for this RFP.");
                return;
            }

            const doc = new jsPDF();
            const date = new Date(rfp.createdAt).toLocaleDateString();
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

            // Branding Header
            doc.setFillColor(15, 118, 110);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("SFT CORPORATE BRIEF", 20, 25);
            doc.setFontSize(8);
            const refId = rfp._id ? String(rfp._id).toUpperCase() : "RFP-OFFLINE";
            doc.text(`REFERENCE ID: ${refId}`, 145, 20);
            doc.text(`ISSUED ON: ${date}`, 145, 26);

            // 1. Client Profile
            addSection("Client Profile");
            addLine("Company Name", data.companyName || rfp.companyName);
            addLine("Industry", data.industry);
            addLine("Authorized Person", data.clientName || rfp.user);
            addLine("Contact Email", rfp.email);
            addLine("Phone Number", data.phone || rfp.phone);
            addLine("Company Desc", data.companyDescription);

            // 2. Space Requirements
            addSection("Space Requirements");
            addLine("Preferred Location", data.preferredLocation || rfp.micromarket);
            addLine("Solution Types", Array.isArray(data.solutionType) ? data.solutionType.join(", ") : data.solutionType);
            addLine("Immediate Seats", `${rfp.seats} Pax`);
            addLine("Expansion Plan", data.expansionSeats ? `${data.expansionSeats} Seats` : null);
            addLine("Lease Tenure", data.leasePeriod);
            addLine("Lock-in Period", data.lockInPeriod);
            addLine("Working Hours", data.workingHours);

            // 3. Layout & Amenities
            addSection("Layout & Infrastructure");
            addLine("Manager Cabins", data.managerCabins);
            if (data.meetingRooms) {
                const mrs = Object.entries(data.meetingRooms)
                    .filter(([_, v]) => Number(v) > 0)
                    .map(([k, v]) => `${k.replace('pax', '')} Pax: ${v}`)
                    .join(" | ");
                addLine("Meeting Rooms", mrs || "Standard Requirement");
            }
            addLine("Pantry Type", data.pantryType);
            addLine("Server Room", data.serverRoomRequired ? "Required" : "Not Required");
            addLine("Essential Amenities", Array.isArray(data.amenities) ? data.amenities.join(", ") : data.amenities);

            // 4. Commercials & Timeline
            addSection("Commercials & Timeline");
            addLine("Target Budget", `${data.budgetRange || rfp.budget} ${data.budgetType || ''}`);
            addLine("Move-in Timeline", data.expectedMoveIn || rfp.timeline);
            addLine("Parking (Car/2W)", `${data.carParking || 0} / ${data.twoWheelerParking || 0}`);
            addLine("Additional Notes", data.additionalNotes);

            // Footer
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            doc.text("© 2026 SFT Connect. Confidential Document - Generated via Corporate Dashboard", 105, 285, { align: 'center' });

            doc.save(`SFT_RFP_${refId.slice(-6)}.pdf`);
            toast.success("Detailed Summary Downloaded!");
        } catch (error) {
            console.error("PDF Generate Error:", error);
            toast.error("Failed to generate detailed brief");
        }
    };


    const tourBookings = appointments.filter(a => a.type === 'Tour Request');
    const handshakeRequests = appointments.filter(a => a.type === 'Handshake');
    const detailedRFPs = appointments.filter(a => (a.type === 'Detailed RFP' || a.type === 'RFP'));

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 text-foreground">
            <Header />
            <div className="container mx-auto px-4 md:px-6 pt-24 pb-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-navy text-center md:text-left">Welcome back, <span className="text-teal">{user?.name}</span></h1>
                    <p className="text-muted-foreground text-center md:text-left">Manage your workspace search and active requirements.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 sticky top-24">
                            <nav className="space-y-2">
                                <button key="appointments" onClick={() => setActiveTab("appointments")} className={cn("w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-sm font-black", activeTab === "appointments" ? "bg-navy text-white shadow-xl shadow-navy/20" : "text-gray-500 hover:bg-gray-50")}>
                                    <Calendar className="w-4 h-4" /> Tours
                                </button>
                                <button key="rfps" onClick={() => setActiveTab("rfps")} className={cn("w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-sm font-black", activeTab === "rfps" ? "bg-navy text-white shadow-xl shadow-navy/20" : "text-gray-500 hover:bg-gray-50")}>
                                    <FileText className="w-4 h-4" /> RFPs
                                </button>
                                <button key="proposals" onClick={() => setActiveTab("proposals")} className={cn("w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-sm font-black", activeTab === "proposals" ? "bg-navy text-white shadow-xl shadow-navy/20" : "text-gray-500 hover:bg-gray-50")}>
                                    <Send className="w-4 h-4" /> Bids
                                </button>
                                <button key="handshakes" onClick={() => setActiveTab("handshakes")} className={cn("w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-sm font-black", activeTab === "handshakes" ? "bg-navy text-white shadow-xl shadow-navy/20" : "text-gray-500 hover:bg-gray-50")}>
                                    <Handshake className="w-4 h-4" /> Direct
                                </button>
                                <div className="pt-6 mt-6 border-t border-gray-100">
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 text-sm font-black transition-colors">
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    <main className="flex-1">
                        {activeTab === "appointments" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-navy">Site <span className="text-teal">Tours</span></h2>
                                {tourBookings.map((appt: any) => (
                                    <div key={appt._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold">{appt.space}</h3>
                                                <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {appt.date}</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.time}</span>
                                                </div>
                                            </div>
                                            <Badge className={cn("uppercase text-[10px] font-black", appt.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600')}>{appt.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "proposals" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-navy">Office <span className="text-teal">Proposals</span></h2>
                                {proposals.length > 0 ? (
                                    proposals.map((p) => (
                                        <div key={p._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                                <div className="md:w-1/3 relative group">
                                                    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                                        <img 
                                                            src={p.spaceId?.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"} 
                                                            alt={p.spaceId?.name}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    </div>
                                                    <div className="absolute top-4 left-4">
                                                        <Badge className="bg-white/90 backdrop-blur-md text-teal border-none shadow-sm uppercase text-[9px] font-black tracking-widest px-3 py-1">
                                                            {p.spaceId?.city}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex-1 p-8 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h3 className="text-2xl font-black text-navy group-hover:text-teal transition-colors font-outfit">{p.spaceId?.name || "Workspace Option"}</h3>
                                                                <p className="text-sm text-gray-400 font-medium flex items-center mt-1">
                                                                    <MapPin className="w-4 h-4 mr-1 text-teal" /> {p.spaceId?.location}
                                                                </p>
                                                            </div>
                                                            <Badge className={cn(
                                                                "uppercase text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full border-none",
                                                                p.status === 'Handshake' ? 'bg-green-100 text-green-700' : 
                                                                p.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                            )}>
                                                                {p.status === 'Handshake' ? 'Handshake' : p.status}
                                                            </Badge>
                                                        </div>

                                                        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-50 mb-6">
                                                            <p className="text-[10px] uppercase font-black text-teal tracking-widest mb-2">Partner's Proposal</p>
                                                            <p className="text-sm text-gray-600 italic leading-relaxed">"{p.message}"</p>
                                                        </div>

                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
                                                            <div><p className="text-[8px] uppercase font-bold text-gray-400 mb-1">Price</p><p className="text-teal font-black text-lg">₹{p.spaceId?.price}/-</p></div>
                                                            <div><p className="text-[8px] uppercase font-bold text-gray-400 mb-1">Requirement</p><p className="text-navy font-black text-lg">{p.rfpId?.seats} Seats</p></div>
                                                            <div><p className="text-[8px] uppercase font-bold text-gray-400 mb-1">Managed By</p><p className="text-navy font-black text-sm">{p.brokerId?.name || 'Partner'}</p></div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                                                        {p.status === 'pending' && (
                                                            <>
                                                                <Button onClick={() => handleProposalStatus(p._id, 'Handshake')} className="bg-teal hover:bg-navy text-white rounded-xl font-bold h-11 px-8 shadow-lg shadow-teal/10 active:scale-95 transition-all">Handshake</Button>
                                                                <Button onClick={() => handleProposalStatus(p._id, 'rejected')} variant="outline" className="rounded-xl font-bold h-11 px-8">Not Fit</Button>
                                                            </>
                                                        )}
                                                        <Button onClick={() => navigate(`/space/${p.spaceId?._id || p.spaceId}`)} variant="ghost" className="text-navy font-bold gap-2 hover:bg-gray-100 rounded-xl h-11 px-6 ml-auto">
                                                            View Office <ArrowRight className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center bg-white rounded-[2.5rem] border border-gray-100 border-dashed">
                                        <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-navy">No Proposals Yet</h3>
                                        <p className="text-gray-400 text-sm">Bids from our partners will appear here.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "rfps" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-navy">My <span className="text-teal">Requirements</span></h2>
                                {detailedRFPs.map((rfp: any) => (
                                    <div key={rfp._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-navy">{rfp.seats} Pax Workspace</h3>
                                                <p className="text-xs text-gray-400 font-medium tracking-tight"><MapPin className="w-3 h-3 inline mr-1" /> {rfp.micromarket}</p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => downloadRFPPDF(rfp)} className="rounded-xl border-teal/10 text-teal font-bold gap-2"><Download className="w-4 h-4" /> PDF Summary</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "handshakes" && (
                             <div className="space-y-6">
                                <h2 className="text-xl font-bold text-navy">Direct <span className="text-teal">Handshakes</span></h2>
                                {handshakeRequests.map((h: any) => (
                                    <div key={h._id} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
                                        <h3 className="font-bold">{h.space}</h3>
                                        <Badge variant="outline" className="border-teal/20 text-teal font-bold">{h.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
