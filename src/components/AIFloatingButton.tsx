import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const AIFloatingButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Hide on admin routes
    if (location.pathname.startsWith("/admin")) return null;

    return (
        <div
            onClick={() => navigate("/ai-assistant")}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 cursor-pointer group animate-in fade-in zoom-in"
        >
            <div className="flex items-center justify-center p-3 bg-[#002b4d] text-white rounded-full shadow-2xl group-hover:scale-110 group-hover:bg-teal transition-all duration-300">
                <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-navy bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-gray-100 whitespace-nowrap group-hover:text-teal transition-colors">
                AI Assistant
            </span>
        </div>
    );
};
