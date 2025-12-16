import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
    User,
    Calendar,
    Heart,
    LogOut,
    MapPin,
    Clock,
    ArrowRight
} from "lucide-react";
import { workspaces } from "@/data/workspaces";
import OfficeCard from "@/components/OfficeCard";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

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
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("appointments");
    const [savedSpaces, setSavedSpaces] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);

    // Load Saved Spaces from LocalStorage
    useEffect(() => {
        const loadSaved = () => {
            try {
                // Get array of saved IDs from localStorage
                const savedIds = JSON.parse(localStorage.getItem("savedSpaces") || "[]");

                // Filter detailed workspace objects
                // Ensure type safety when comparing IDs
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

        // Listen for storage events (in case of updates from other tabs)
        window.addEventListener('storage', loadSaved);
        // Custom event for same-tab updates
        window.addEventListener('savedSpacesUpdated', loadSaved);

        return () => {
            window.removeEventListener('storage', loadSaved);
            window.removeEventListener('savedSpacesUpdated', loadSaved);
        };
    }, [activeTab]); // Reload when tab changes just in case

    useEffect(() => {
        const fetchBookings = async () => {
            if (user?.email) {
                try {
                    const res = await axios.get(`/api/requests/user/${user.email}`);
                    setAppointments(res.data);
                } catch (err) {
                    console.error("Failed to fetch bookings", err);
                }
            }
        };
        fetchBookings();
    }, [user, activeTab]);

    const handleLogout = () => {
        // Clear any auth tokens if we had them
        logout(); // Use the logout function from context
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-foreground">
            <Header />

            <div className="container mx-auto px-4 md:px-6 pt-24 pb-12">
                <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
                <p className="text-muted-foreground mb-8">
                    Quick access to your FlickSpace's, Appointments, & Account details.
                </p>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* SIDEBAR */}
                    <aside className="w-full md:w-64 flex-shrink-0 space-y-6">

                        {/* User Profile Summary */}
                        <div className="flex items-center gap-3 pb-6 border-b border-border">
                            <div className="w-12 h-12 rounded-full bg-teal/20 flex items-center justify-center overflow-hidden border border-teal/50 text-teal text-xl font-bold">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{user?.name?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{user?.name}</h3>
                                <p className="text-sm text-muted-foreground truncate w-40">{user?.email}</p>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <nav className="space-y-1">
                            {/* ... existing navigation buttons ... */}
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${activeTab === "profile"
                                    ? "text-teal font-medium"
                                    : "text-muted-foreground hover:bg-secondary/50"
                                    }`}
                            >
                                <User className="w-5 h-5" />
                                Edit profile
                            </button>

                            <button
                                onClick={() => setActiveTab("appointments")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left border-l-4 ${activeTab === "appointments"
                                    ? "border-teal bg-teal/5 text-teal font-medium"
                                    : "border-transparent text-muted-foreground hover:bg-secondary/50"
                                    }`}
                            >
                                <Calendar className="w-5 h-5" />
                                Your bookings
                            </button>

                            <button
                                onClick={() => setActiveTab("saved")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left border-l-4 ${activeTab === "saved"
                                    ? "border-teal bg-teal/5 text-teal font-medium"
                                    : "border-transparent text-muted-foreground hover:bg-secondary/50"
                                    }`}
                            >
                                <Heart className="w-5 h-5" />
                                Saved
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left text-muted-foreground hover:bg-secondary/50 mt-4"
                            >
                                <LogOut className="w-5 h-5" />
                                Log out
                            </button>
                        </nav>
                    </aside>

                    {/* CONTENT AREA */}
                    <main className="flex-1 min-h-[500px] border border-border/50 rounded-2xl p-6 bg-card/30">

                        {/* APPOINTMENTS TAB */}
                        {activeTab === "appointments" && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">Your Bookings & Requests</h2>

                                {appointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {appointments.map((appt: any) => (
                                            <div
                                                key={appt._id}
                                                className="flex flex-col sm:flex-row items-center gap-4 bg-background p-4 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow relative"
                                            >
                                                {/* Status Badge */}
                                                <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full capitalize ${appt.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    appt.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {appt.status}
                                                </div>

                                                <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
                                                    <h3 className="font-semibold text-lg">{appt.spaceName || 'Workspace Request'}</h3>
                                                    <div className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-4 mt-1 flex-wrap">
                                                        {appt.type && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-medium text-navy">{appt.type}</span>
                                                            </div>
                                                        )}
                                                        {appt.date && (
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3.5 h-3.5" /> {appt.date} {appt.time}
                                                            </div>
                                                        )}
                                                        {appt.seats && (
                                                            <div className="flex items-center gap-1">
                                                                <User className="w-3.5 h-3.5" /> {appt.seats} Seats
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                                    <Button variant="outline" className="flex-1 sm:flex-none" disabled>
                                                        Details
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-muted-foreground">
                                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>No upcoming appointments found.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SAVED TAB */}
                        {activeTab === "saved" && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">Saved <span className="text-red-500">FLICKS</span></h2>

                                {savedSpaces.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {savedSpaces.map((workspace) => (
                                            <OfficeCard
                                                key={workspace.id}
                                                id={String(workspace.id)}
                                                image={workspace.images[0]}
                                                name={workspace.name}
                                                location={workspace.location}
                                                price={workspace.price}
                                                seats={workspace.seats}
                                                isFeatured={false} // Clean look for dashboard
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border/50">
                                        <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p className="text-lg font-medium">No saved spaces yet</p>
                                        <p className="text-sm mb-6">Start exploring to save your favorite workspaces!</p>
                                        <Link to="/#categories">
                                            <Button variant="teal">Explore Workspaces</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* EDIT PROFILE TAB (Placeholder) */}
                        {activeTab === "profile" && (
                            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                                <User className="w-16 h-16 mb-4 opacity-20" />
                                <h3 className="text-xl font-semibold">Profile Settings</h3>
                                <p>Profile editing is coming soon.</p>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
