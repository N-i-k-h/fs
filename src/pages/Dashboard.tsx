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
    Download
} from "lucide-react";
import { jsPDF } from "jspdf";
import { cn } from "@/lib/utils";
import { workspaces } from "@/data/workspaces";
import OfficeCard from "@/components/OfficeCard";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Mail, Building2, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock Appointments Data
const MOCK_APPOINTMENTS = [
    {
        id: 1,
        workspaceId: 1,
        name: "Startup Den Koramangala",
        location: "Koramangala",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
        date: "Dec 01, Monday",
        time: "10:00 AM"
    },
    {
        id: 2,
        workspaceId: 3,
        name: "WeWork Prestige",
        location: "MG Road",
        image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800",
        date: "Dec 10, Wednesday",
        time: "02:00 PM"
    }
];

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login, logout } = useAuth(); // Assuming login or updateUser exists, but I'll use logout/login refresh or just local state update
    const [activeTab, setActiveTab] = useState("appointments");
    const [savedSpaces, setSavedSpaces] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Profile Form State
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        company: user?.company || ""
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                phone: user.phone || "",
                company: user.company || ""
            });
        }
    }, [user]);

    // Load Saved Spaces from LocalStorage
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
        window.addEventListener('storage', loadSaved);
        window.addEventListener('savedSpacesUpdated', loadSaved);

        return () => {
            window.removeEventListener('storage', loadSaved);
            window.removeEventListener('savedSpacesUpdated', loadSaved);
        };
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            if (user?.email) {
                setLoading(true);
                try {
                    console.log("Dashboard: Fetching bookings for", user.email);
                    const res = await axios.get(`/api/requests/user/${encodeURIComponent(user.email)}`);
                    console.log("Dashboard: Data received", res.data.length, "items");
                    setAppointments(Array.isArray(res.data) ? res.data : []);
                } catch (err) {
                    console.error("Failed to fetch bookings", err);
                    toast.error("Failed to load your latest requests.");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBookings();
    }, [user, activeTab, location.key]); // Added location.key to force refresh on navigation

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

    const downloadRFPPDF = (rfp: any) => {
        try {
            const doc = new jsPDF();
            const date = new Date(rfp.createdAt).toLocaleDateString();

            // Header
            doc.setFillColor(15, 118, 110); // Teal color
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text("FlickSpace RFP Summary", 20, 25);

            doc.setFontSize(10);
            const refId = rfp._id ? rfp._id.toUpperCase() : "REQ-" + Math.random().toString(36).substr(2, 9).toUpperCase();
            doc.text(`Reference: ${refId}`, 140, 20);
            doc.text(`Date: ${date}`, 140, 26);

            // Client Info Section
            doc.setTextColor(40, 40, 40);
            doc.setFontSize(14);
            doc.text("Company Details", 20, 55);
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 58, 190, 58);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Company Name: ${rfp.companyName || "N/A"}`, 25, 68);
            doc.text(`Authorized Person: ${rfp.clientName || "N/A"}`, 25, 75);
            doc.text(`Email: ${rfp.email || "N/A"}`, 25, 82);

            // Requirement Section
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Workspace Requirements", 20, 100);
            doc.line(20, 103, 190, 103);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Required Seats: ${rfp.seats}`, 25, 113);
            doc.text(`Preferred Location: ${rfp.micromarket || "Not Specified"}`, 25, 120);
            doc.text(`Budget: ${rfp.budget || "TBD"}`, 25, 127);
            doc.text(`Move-in Timeline: ${rfp.timeline || "Flexible"}`, 25, 134);

            // Details
            if (rfp.details) {
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Additional Details", 20, 155);
                doc.line(20, 158, 190, 158);

                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                const details = [
                    `Solution Type: ${Array.isArray(rfp.details.solutionType) ? rfp.details.solutionType.join(", ") : "N/A"}`,
                    `Current Employees: ${rfp.details.currentEmployees || "N/A"}`,
                    `Meeting Rooms Required: ${JSON.stringify(rfp.details.meetingRooms || {})}`,
                    `Notes: ${rfp.details.additionalNotes || "None"}`
                ];

                let y = 168;
                details.forEach(detail => {
                    const splitText = doc.splitTextToSize(detail, 160);
                    doc.text(splitText, 25, y);
                    y += (splitText.length * 7);
                });
            }

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("Generated by FlickSpace - India's Premium Office Discovery Platform", 105, 285, { align: "center" });

            doc.save(`FlickSpace_RFP_${refId.slice(-6)}.pdf`);
            toast.success("RFP PDF Downloaded!");
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast.error("Failed to generate PDF");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Filter Requests
    const tourBookings = appointments.filter(a => a.type === 'Tour Request');
    const handshakeRequests = appointments.filter(a => a.type === 'Handshake');
    const detailedRFPs = appointments.filter(a => a.type === 'Detailed RFP');

    return (
        <div className="min-h-screen bg-gray-50 text-foreground">
            <Header />

            <div className="container mx-auto px-4 md:px-6 pt-24 pb-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
                        Welcome back, <span className="text-teal">{user?.name}</span>
                    </h1>
                    <p className="text-muted-foreground">Manage your workspace search and active requirements.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center border border-teal/20 text-teal text-xl font-bold">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                                    ) : (
                                        <span>{user?.name?.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-navy truncate">{user?.name}</h3>
                                    <p className="text-xs text-gray-400 truncate tracking-tight">{user?.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab("appointments")}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold",
                                        activeTab === "appointments" ? "bg-navy text-white shadow-lg shadow-navy/20" : "text-gray-500 hover:bg-gray-50"
                                    )}
                                >
                                    <Calendar className="w-4 h-4" /> Tour Requests
                                </button>

                                <button
                                    onClick={() => setActiveTab("rfps")}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold",
                                        activeTab === "rfps" ? "bg-navy text-white shadow-lg shadow-navy/20" : "text-gray-500 hover:bg-gray-50"
                                    )}
                                >
                                    <FileText className="w-4 h-4" /> Detailed RFPs
                                </button>

                                <button
                                    onClick={() => setActiveTab("handshakes")}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold",
                                        activeTab === "handshakes" ? "bg-navy text-white shadow-lg shadow-navy/20" : "text-gray-500 hover:bg-gray-50"
                                    )}
                                >
                                    <Handshake className="w-4 h-4" /> Direct Handshakes
                                </button>

                                <button
                                    onClick={() => setActiveTab("saved")}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold",
                                        activeTab === "saved" ? "bg-navy text-white shadow-lg shadow-navy/20" : "text-gray-500 hover:bg-gray-50"
                                    )}
                                >
                                    <Heart className="w-4 h-4" /> Saved Flicks
                                </button>

                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold",
                                        activeTab === "profile" ? "bg-navy text-white shadow-lg shadow-navy/20" : "text-gray-500 hover:bg-gray-50"
                                    )}
                                >
                                    <User className="w-4 h-4" /> My Profile
                                </button>

                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-bold"
                                    >
                                        <LogOut className="w-4 h-4" /> Log out
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* CONTENT AREA */}
                    <main className="flex-1">

                        {/* TOUR REQUESTS */}
                        {activeTab === "appointments" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                    <h2 className="text-xl font-bold text-navy">Planned <span className="text-teal">Site Tours</span></h2>
                                    <Badge variant="outline" className="bg-teal/5 text-teal border-teal/10 font-bold px-4 py-1">
                                        {tourBookings.length} Active
                                    </Badge>
                                </div>

                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-3xl" />)}
                                    </div>
                                ) : tourBookings.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {tourBookings.map((appt: any) => (
                                            <div key={appt._id} className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-teal/20 transition-all duration-300">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-white transition-colors">
                                                            <MapPin className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-navy">{appt.space || 'Office Visit'}</h3>
                                                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                                                <span className="flex items-center gap-1 font-medium"><Calendar className="w-3 h-3" /> {appt.date || 'TBD'}</span>
                                                                <span className="flex items-center gap-1 font-medium"><Clock className="w-3 h-3" /> {appt.time || 'TBD'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${appt.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                            appt.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                                'bg-yellow-50 text-yellow-600 border border-yellow-100'
                                                            }`}>
                                                            {appt.status}
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100">
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-100">
                                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                                        <p className="font-bold text-navy">No tours scheduled</p>
                                        <p className="text-sm text-gray-400 mt-1">Start browsing spaces and schedule your first visit.</p>
                                        <Button
                                            onClick={() => navigate('/search')}
                                            className="mt-6 bg-teal hover:bg-navy text-white rounded-xl font-bold px-8"
                                        >
                                            Explore Workspaces
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* DETAILED RFPs */}
                        {activeTab === "rfps" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                    <h2 className="text-xl font-bold text-navy">Active <span className="text-teal">RFP Requirements</span></h2>
                                    <Link to="/rfp-form">
                                        <Button className="bg-navy hover:bg-teal text-white rounded-xl font-bold text-xs h-10 px-6">
                                            + Submit New RFP
                                        </Button>
                                    </Link>
                                </div>

                                {loading ? (
                                    <div className="space-y-4">
                                        {[1].map(i => <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-3xl" />)}
                                    </div>
                                ) : detailedRFPs.length > 0 ? (
                                    <div className="space-y-4">
                                        {detailedRFPs.map((rfp: any) => (
                                            <div key={rfp._id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-navy">Requirement for {rfp.seats} Seats</h3>
                                                        <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wider">Ref: {rfp._id.slice(-6).toUpperCase()}</p>
                                                    </div>
                                                    <div className="bg-teal text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">
                                                        Active RFP
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                    <div>
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Company</span>
                                                        <span className="text-sm font-bold text-navy">{rfp.companyName || 'Not Provided'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Budget</span>
                                                        <span className="text-sm font-bold text-navy">₹{rfp.budget || 'TBD'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Location</span>
                                                        <span className="text-sm font-bold text-navy truncate block">{rfp.micromarket || 'Multicities'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Move-in</span>
                                                        <span className="text-sm font-bold text-navy">{rfp.timeline || 'Flexible'}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-8 pt-6 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                                                    <span className="text-xs text-gray-400 order-2 sm:order-1">Submitted on {new Date(rfp.createdAt).toLocaleDateString()}</span>
                                                    <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => downloadRFPPDF(rfp)}
                                                            className="rounded-xl font-bold text-xs border-teal text-teal hover:bg-teal/5 gap-2 w-full sm:w-auto h-10 px-4"
                                                        >
                                                            <Download className="w-3.5 h-3.5" /> Download PDF
                                                        </Button>
                                                        <Button variant="outline" className="rounded-xl font-bold text-xs w-full sm:w-auto h-10 px-4">View Full Specs</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-100">
                                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                                        <p className="font-bold text-navy">No Detailed RFPs yet</p>
                                        <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">Get competitive proposals from verified workspace partners by submitting a professional RFP.</p>
                                        <Link to="/rfp-form">
                                            <Button className="mt-6 bg-navy hover:bg-teal text-white rounded-xl font-bold px-8">
                                                Start RFP Process
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* HANDSHAKES TAB */}
                        {activeTab === "handshakes" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                    <h2 className="text-xl font-bold text-navy">Direct <span className="text-teal">Partner Connections</span></h2>
                                    <Badge variant="outline" className="bg-teal/5 text-teal border-teal/10 font-bold px-4 py-1">
                                        {handshakeRequests.length} Handshakes
                                    </Badge>
                                </div>

                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2].map(i => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-3xl" />)}
                                    </div>
                                ) : handshakeRequests.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {handshakeRequests.map((h: any) => (
                                            <div key={h._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center text-teal">
                                                            <Handshake className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-navy">{h.space}</h3>
                                                            <p className="text-xs text-gray-400 mt-1">Direct partnership request initiated on {new Date(h.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right hidden md:block">
                                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">Budget Preference</p>
                                                            <p className="text-sm font-bold text-navy">{h.budget}</p>
                                                        </div>
                                                        <div className="px-4 py-1.5 rounded-full bg-teal/5 text-teal text-[10px] font-black uppercase tracking-widest border border-teal/10">
                                                            {h.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-100">
                                        <Handshake className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                                        <p className="font-bold text-navy text-xl">No active handshakes</p>
                                        <p className="text-gray-400 mt-2">Connect directly with space owners for faster deal closure.</p>
                                        <Button onClick={() => navigate('/search')} className="mt-8 bg-teal text-white px-10 rounded-2xl font-bold h-12">
                                            Find Workspaces
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SAVED TAB */}
                        {activeTab === "saved" && (
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm mb-6">
                                    <h2 className="text-xl font-bold text-navy">Saved <span className="text-red-500">Flicks</span></h2>
                                </div>

                                {savedSpaces.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {savedSpaces.map((workspace) => (
                                            <OfficeCard
                                                key={workspace.id}
                                                id={String(workspace.id)}
                                                image={workspace.images[0]}
                                                name={workspace.name}
                                                location={workspace.location}
                                                price={workspace.price}
                                                seats={workspace.seats}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-100">
                                        <Heart className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                                        <p className="font-bold text-navy text-xl">Love anything yet?</p>
                                        <p className="text-gray-400 mt-2">Start exploring workspaces and save them to your shortlist!</p>
                                        <Button onClick={() => navigate('/search')} className="mt-8 bg-black text-white px-10 rounded-2xl font-bold h-12">
                                            Browse Spaces
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PROFILE TAB */}
                        {activeTab === "profile" && (
                            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-8 border-b border-gray-50">
                                    <h2 className="text-2xl font-bold text-navy">Profile <span className="text-teal">Settings</span></h2>
                                    <p className="text-gray-500 text-sm">Update your personal and professional identity.</p>
                                </div>
                                <form onSubmit={handleProfileUpdate} className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Full Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="h-14 pl-12 rounded-2xl border-gray-200 focus:border-teal transition-all"
                                                    placeholder="e.g. Rahul Sharma"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    className="h-14 pl-12 rounded-2xl border-gray-200 focus:border-teal transition-all"
                                                    placeholder="+91 9876543210"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Company Name</Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <Input
                                                    value={profileData.company}
                                                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                                    className="h-14 pl-12 rounded-2xl border-gray-200 focus:border-teal transition-all"
                                                    placeholder="StartUp Labs Pvt Ltd"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Email (Primary)</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                <Input
                                                    value={user?.email}
                                                    disabled
                                                    className="h-14 pl-12 rounded-2xl border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-gray-50">
                                        <Button type="submit" className="bg-teal hover:bg-navy text-white px-10 h-14 rounded-2xl font-bold shadow-lg shadow-teal/10">
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
