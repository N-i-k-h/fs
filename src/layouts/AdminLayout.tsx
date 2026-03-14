import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FileText, PlusCircle, LogOut, Building2, Menu, X, DollarSign, Download, Handshake, CheckCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

import { motion, AnimatePresence } from "framer-motion";

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { user, logout } = useAuth();

    useEffect(() => {
        const isAdminAuth = localStorage.getItem("adminAuth") === "true";
        if (!isAdminAuth && (!user || user.role !== 'admin')) {
            navigate("/admin/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const menuItems = [
        { icon: LayoutDashboard, label: "Analysis", path: "/admin" },
        { icon: FileText, label: "Tour Requests", path: "/admin/requests" },
        { icon: MessageSquare, label: "Corporate RFPs", path: "/admin/rfps" },
        { icon: CheckCircle, label: "Successful Handshakes", path: "/admin/handshakes" },
        { icon: DollarSign, label: "User Quotes", path: "/admin/quotes" },
        { icon: Download, label: "Downloaded Brochures", path: "/admin/brochures" },
        { icon: Building2, label: "Spaces", path: "/admin/spaces" },
        { icon: Users, label: "Users", path: "/admin/users" },
        { icon: PlusCircle, label: "Add Space", path: "/admin/add-space" },
    ];

    const SidebarContent = () => (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border-b border-white/10 flex justify-between items-center"
            >
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center font-bold text-xl text-white">S</div>
                    <span className="font-bold text-xl tracking-tight text-gray-900">SFT<span className="text-teal">.</span></span>
                </Link>
                <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-6 h-6" />
                </button>
            </motion.div>
            <div className="px-6 py-2">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Admin Portal</div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={item.path}
                    >
                        <Link
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                location.pathname === item.path
                                    ? "bg-teal/10 text-teal shadow-none border-l-4 border-teal rounded-none"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-teal" : "text-gray-400 group-hover:text-teal")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    </motion.div>
                ))}
            </nav>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 border-t border-gray-100"
            >
                <div
                    onClick={() => {
                        localStorage.removeItem("adminAuth");
                        logout();
                        navigate("/");
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout Admin</span>
                </div>
            </motion.div>
        </>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
            {/* --- MOBILE TOP BAR --- */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white z-40 flex items-center justify-between px-4 border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center font-bold text-lg text-white">S</div>
                    <span className="font-bold text-lg text-gray-900">Admin</span>
                </div>
                <button onClick={() => setIsSidebarOpen(true)} className="text-gray-900 p-2">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden md:flex w-64 bg-white text-gray-900 flex-col fixed h-full z-50 shadow-xl border-r border-gray-100">
                <SidebarContent />
            </aside>

            {/* --- MOBILE SIDEBAR DRAWER --- */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 md:hidden"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        {/* Drawer Panel */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute top-0 bottom-0 left-0 w-3/4 max-w-xs bg-white text-gray-900 flex flex-col shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content with Page Transitions */}
            <main className="flex-1 ml-0 md:ml-64 h-full overflow-y-auto pt-16 md:pt-0">
                <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
