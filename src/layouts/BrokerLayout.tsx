import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, PlusCircle, LogOut, Building2, Menu, X, Users, MessageSquare, Handshake, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

import { toast } from "sonner";

const BrokerLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!user || (user.role !== 'broker' && user.role !== 'admin')) {
            toast.error("Please login to access the partner portal.");
            navigate("/broker/login");
        }
    }, [user, navigate]);

    // ...

    // Close mobile menu on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/broker" },
        { icon: Building2, label: "My Spaces", path: "/broker/spaces" },
        { icon: MessageSquare, label: "Handshake Responses", path: "/broker/handshakes" },
        { icon: FileText, label: "Client RFPs", path: "/broker/requests" },
        { icon: PlusCircle, label: "Add New Office", path: "/broker/submit-property" },
        { icon: User, label: "My Profile", path: "/broker/profile" },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center font-bold text-xl text-white">F</div>
                    <span className="font-bold text-xl tracking-tight text-white">FlickSpace<span className="text-teal">.</span></span>
                </Link>
                <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="px-6 py-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center text-teal font-bold border border-teal/20">
                        {user?.name?.[0] || 'B'}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white leading-tight">{user?.name}</div>
                        <div className="text-[10px] text-teal font-bold uppercase tracking-widest mt-0.5">Verified Broker</div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                            location.pathname === item.path
                                ? "bg-teal text-white shadow-lg shadow-teal/20"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-white" : "text-gray-400 group-hover:text-teal")} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div
                    onClick={() => {
                        logout();
                        navigate("/");
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout Broker</span>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* MOBILE TOP BAR */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-navy z-40 flex items-center justify-between px-4 border-b border-white/10 shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center font-bold text-lg text-white">F</div>
                    <span className="font-bold text-lg text-white">Partner Portal</span>
                </div>
                <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex w-64 bg-navy text-white flex-col fixed h-full z-50 shadow-xl border-r border-white/5">
                <SidebarContent />
            </aside>

            {/* MOBILE SIDEBAR DRAWER */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                    <aside className="absolute top-0 bottom-0 left-0 w-3/4 max-w-xs bg-navy text-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 ml-0 md:ml-64 h-full overflow-y-auto pt-16 md:pt-0">
                <div className="p-4 md:p-10 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default BrokerLayout;
