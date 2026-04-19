import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const isAdminAuth = localStorage.getItem("adminAuth") === "true";
        if (!isAdminAuth && (!user || user.role !== 'admin')) {
            navigate("/admin/login");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <Header mode="broker" />

            {/* Main Content with Page Transitions */}
            <main className="h-full overflow-y-auto pt-24">
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
