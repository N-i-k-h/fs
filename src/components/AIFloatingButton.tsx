import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const AIFloatingButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide on admin routes
    if (location.pathname.startsWith("/admin")) return null;

    return (
        <button
            onClick={() => navigate("/ai-assistant")}
            className="fixed bottom-6 right-6 z-50 group flex items-center justify-center p-4 bg-[#002b4d] text-white rounded-full shadow-2xl hover:scale-105 hover:bg-teal transition-all duration-300 animate-in fade-in zoom-in"
        >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pl-0 group-hover:pl-2 font-bold text-sm">
                Ask AI Assistant
            </span>
        </button>
    );
};
