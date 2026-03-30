import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, X, Bot, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// --- CONTENT DATA ---
const INITIAL_MESSAGES = [
  { id: 1, text: "Welcome to FlickSpace! 👋", isBot: true },
  { id: 2, text: "How can I help you today?", isBot: true }
];

const QUICK_ACTIONS = [
  { label: "I am looking for a workspace", value: "search" },
  { label: "I want to list my space", value: "list" },
  { label: "Request a Quote", value: "quote" },
  { label: "Something Else", value: "other" }
];

const questions = [
  "What's your name?", // 0: Name
  "Nice to meet you, {name}! Which city are you looking for? (e.g. Bangalore, Mumbai)", // 1: Location (City)
  "Which specific area are you looking for? (e.g. Indiranagar, HSR Layout, Cyber City)", // 2: Area (Market)
  "How many seats does your team need?", // 3: Seats
  "What is your preferred budget per seat?", // 4: Budget
];

const CITY_MAPPING: Record<string, string> = {
  "banglore": "bangalore",
  "bengaluru": "bangalore",
  "blr": "bangalore",
  "gurugram": "gurgaon",
  "bombay": "mumbai",
  "hyd": "hyderabad",
  "delhi ncr": "delhi"
};

// Convert raw user input to SearchPage-compatible filter values
const normalizeSeats = (raw: string): string => {
  const num = parseInt(raw);
  if (isNaN(num)) return "";
  if (num <= 5) return "1-5";
  if (num <= 10) return "6-10";
  if (num <= 20) return "11-20";
  return "20-plus";
};

const normalizeBudget = (raw: string): string => {
  const cleaned = raw.toLowerCase().replace(/[₹,\s]/g, "");
  let num = parseFloat(cleaned);
  if (isNaN(num)) return "";
  if (cleaned.includes("k")) num *= 1000;
  if (num < 10000) return "below-10k";
  if (num <= 20000) return "10k-20k";
  if (num <= 50000) return "20k-50k";
  return "50k-plus";
};

const ChatBot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [teaserText, setTeaserText] = useState("");

  // Chat State
  const [messages, setMessages] = useState(() => {
    return INITIAL_MESSAGES;
  });

  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(-1); // -1 means initial state/quick actions
  const [showQuickActions, setShowQuickActions] = useState(true);

  // DATA STORE
  const leadDataRef = useRef({
    name: user?.name || "", location: "", area: "", seats: "", budget: ""
  });

  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Refs
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- 1. AUTO SCROLL ---
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
      if (!showQuickActions) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [messages, isOpen, isTyping, showQuickActions]);

  // --- 2. ACTION HANDLERS ---
  const handleAction = (action: { label: string; value: string }) => {
    setShowQuickActions(false);
    setMessages(prev => [...prev, { id: Date.now(), text: action.label, isBot: false }]);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (action.value === "search") {
        setCurrentStep(0);
        setMessages(prev => [...prev, { id: Date.now() + 1, text: questions[0], isBot: true }]);
      } else if (action.value === "list") {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "Great! Our team will help you list your space. Redirecting to the property submission form...", isBot: true }]);
        setTimeout(() => navigate("/broker/submit-property"), 2000);
      } else if (action.value === "quote") {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sure! Let me take you to the quote request page.", isBot: true }]);
        setTimeout(() => navigate("/search"), 1500); // Or specific quote page
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "How else can I assist you? Feel free to type your query below.", isBot: true }]);
      }
    }, 1000);
  };

  // --- 3. SUBMIT HANDLER ---
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isComplete) return;

    const userText = inputValue.trim();
    setShowQuickActions(false);

    // 1. Add User Message
    setMessages((prev) => [...prev, { id: Date.now(), text: userText, isBot: false }]);
    setInputValue("");
    setIsTyping(true);

    // 2. Bot Reply Logic
    setTimeout(() => {
      setIsTyping(false);

      if (currentStep === -1) {
        // Free-form chat (could be AI integrated, for now simple response)
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          text: "I've noted that down. One of our experts will get back to you soon!", 
          isBot: true 
        }]);
        return;
      }

      // Save Data for Lead Step
      const keys = ["name", "location", "area", "seats", "budget"];
      if (currentStep < keys.length) {
        leadDataRef.current[keys[currentStep]] = userText;
      }

      if (currentStep < questions.length - 1) {
        // --- NEXT QUESTION ---
        const nextQRaw = questions[currentStep + 1];
        let nextQFormatted = nextQRaw.replace("{name}", leadDataRef.current.name || "there");
        
        // Dynamic refinement
        if (currentStep === 1) {
          nextQFormatted = nextQFormatted.replace("Which specific area", `Great! Which specific area in ${userText}`);
        }

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: nextQFormatted, isBot: true },
        ]);
        setCurrentStep((prev) => prev + 1);

      } else {
        // --- CHAT COMPLETE ---
        const finalData = leadDataRef.current;
        const normalizedLocation = CITY_MAPPING[finalData.location.toLowerCase().trim()] || finalData.location;
        
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: `Perfect, ${finalData.name}! 🎉 Finding the best workspaces in ${finalData.area}, ${normalizedLocation.charAt(0).toUpperCase() + normalizedLocation.slice(1)}...`,
            isBot: true,
          },
        ]);
        setIsComplete(true);

        setTimeout(() => {
          const params = new URLSearchParams();
          params.append("location", normalizedLocation.toLowerCase());
          if (finalData.area) params.append("market", finalData.area.toLowerCase().trim());
          
          navigate(`/search?${params.toString()}`);
        }, 2000);
      }
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
      
      {/* --- CHAT WINDOW --- */}
      {isOpen && (
        <div className="w-[380px] h-[550px] max-h-[80vh] flex flex-col overflow-hidden shadow-2xl rounded-3xl border border-white/20 bg-white ring-1 ring-black/5 animate-in slide-in-from-bottom-12 fade-in zoom-in-95 duration-500 ease-out-expo origin-bottom-right">

          {/* Premium Header */}
          <div className="bg-gradient-to-br from-[#1a365d] via-[#1e3a8a] to-[#2563eb] px-6 py-6 flex flex-col gap-4 relative overflow-hidden">
            {/* Abstract Background Element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg tracking-tight">SFT Bot</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    <span className="text-xs text-blue-100/80 font-medium">Always Active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 border border-white/10 group backdrop-blur-sm"
              >
                <X className="w-5 h-5 text-white/80 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc] scroll-smooth custom-scrollbar"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full animate-in slide-in-from-bottom-2 fade-in duration-300",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                {message.isBot && (
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0 border border-blue-200 shadow-sm">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-sm relative font-medium",
                    message.isBot
                      ? "bg-white text-slate-700 rounded-2xl rounded-tl-none border border-slate-100"
                      : "bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-blue-200/50"
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0 animate-pulse">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-1.5 h-[42px]">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {showQuickActions && !isTyping && (
              <div className="flex flex-col gap-2 pt-2 items-end">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAction(action)}
                    className="px-4 py-2 bg-white border border-blue-100 text-blue-700 rounded-full text-sm font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm animate-in slide-in-from-right-4 fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white border-t border-slate-100"
          >
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isComplete ? "Redirecting..." : "Type your message and hit 'Enter'"}
                disabled={isComplete || isTyping}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 rounded-2xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white focus:border-blue-400 border border-slate-200 transition-all duration-300 shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isComplete || isTyping}
                className={cn(
                  "absolute right-1.5 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md",
                  !inputValue.trim() || isComplete || isTyping
                    ? "bg-slate-100 text-slate-300"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95"
                )}
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">Powered by SFT Bot</p>
          </form>
        </div>
      )}

      {/* --- TRIGGER AREA --- */}
      <div className="flex items-center gap-3">
        {/* Teaser Text Bubble */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="bg-white rounded-xl shadow-lg px-4 py-2.5 cursor-pointer hover:shadow-xl transition-shadow border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-500 max-w-[220px]"
          >
            <p className="text-sm font-bold text-slate-800 leading-tight">We're Online!</p>
            <p className="text-xs text-slate-500 leading-tight mt-0.5 truncate">How may I help you today...</p>
          </div>
        )}

        {/* Icon Button + Label */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-500 group relative",
              isOpen
                ? "bg-white border border-gray-200"
                : "bg-[#3b46a8] hover:scale-110 active:scale-95"
            )}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-[#3b46a8]" />
            ) : (
              <MessageCircle className="w-7 h-7 text-white fill-white" />
            )}

            {!isOpen && (
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            )}
          </button>
          {!isOpen && (
            <span className="text-[11px] font-bold text-[#3b46a8] tracking-wide">SFT Bot</span>
          )}
        </div>
      </div>

    </div>
  );
};

export default ChatBot;