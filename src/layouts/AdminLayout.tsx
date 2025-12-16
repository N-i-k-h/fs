import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FileText, PlusCircle, LogOut, Building2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const isAdmin = localStorage.getItem("adminAuth");
        if (isAdmin !== "true") {
            navigate("/admin/login");
        }
    }, [navigate]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const menuItems = [
        { icon: LayoutDashboard, label: "Analysis", path: "/admin" },
        { icon: FileText, label: "Requests", path: "/admin/requests" },
        { icon: Building2, label: "Spaces", path: "/admin/spaces" },
        { icon: Users, label: "Users", path: "/admin/users" },
        { icon: PlusCircle, label: "Add Space", path: "/admin/add-space" },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center font-bold text-xl text-white">F</div>
                    <span className="font-bold text-xl tracking-tight text-white">FlickSpace<span className="text-teal">.</span></span>
                </Link>
                {/* Mobile Close Button */}
                <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="px-6 py-2">
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Admin Portal</div>
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
                        localStorage.removeItem("adminAuth");
                        navigate("/");
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout Admin</span>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* --- MOBILE TOP BAR --- */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-navy z-40 flex items-center justify-between px-4 border-b border-white/10 shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center font-bold text-lg text-white">F</div>
                    <span className="font-bold text-lg text-white">Admin</span>
                </div>
                <button onClick={() => setIsSidebarOpen(true)} className="text-white p-2">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden md:flex w-64 bg-navy text-white flex-col fixed h-full z-50 shadow-xl border-r border-white/5">
                <SidebarContent />
            </aside>

            {/* --- MOBILE SIDEBAR DRAWER --- */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    {/* Drawer Panel */}
                    <aside className="absolute top-0 bottom-0 left-0 w-3/4 max-w-xs bg-navy text-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 ml-0 md:ml-64 h-full overflow-y-auto pt-16 md:pt-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
