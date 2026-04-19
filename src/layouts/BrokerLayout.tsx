import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import ContactModal from "@/components/ContactModal";
import Header from "@/components/Header";

const BrokerLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isContactOpen, setIsContactOpen] = useState(false);

    useEffect(() => {
        if (!user || (user.role !== 'broker' && user.role !== 'admin')) {
            toast.error("Please login to access the partner portal.");
            navigate("/broker/login");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header mode="broker" />

            {/* Main Content with Page Transitions */}
            <main className="h-full overflow-y-auto pt-24">
                <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </div>
    );
};

export default BrokerLayout;
