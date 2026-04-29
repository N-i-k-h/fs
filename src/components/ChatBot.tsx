import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ChatBot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Only show on Home page for logged in users
  if (!user || location.pathname !== '/') return null;

  const handleClick = () => {
    // Navigate based on role
    if (user.role === 'broker' || user.role === 'admin') {
      navigate("/broker/add-space-bot");
    } else {
      navigate("/sft-bot");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 floating-chat-bot">
      {/* TRIGGER AREA */}
      <div className="flex items-center gap-3">
        {/* Teaser Text Bubble */}
        <div
          onClick={handleClick}
          className="bg-white rounded-xl shadow-lg px-4 py-2.5 cursor-pointer hover:shadow-xl transition-shadow border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500 max-w-[220px]"
        >
          <p className="text-sm font-bold text-slate-800 leading-tight">We're Online!</p>
          <p className="text-xs text-slate-500 leading-tight mt-0.5 truncate">How may I help you today...</p>
        </div>

        {/* Icon Button + Label */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleClick}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-500 group relative bg-[#3b46a8] hover:scale-110 active:scale-95"
          >
            <MessageCircle className="w-7 h-7 text-white fill-white" />
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </button>
          <span className="text-[11px] font-bold text-[#3b46a8] tracking-wide">Xplore SFT Bot</span>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;