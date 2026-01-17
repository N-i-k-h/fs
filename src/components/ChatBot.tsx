import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, X, Sparkles, Bot, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// --- ONLY REQUIRED QUESTIONS ---
const questions = [
  "Hi! 👋 I'm your workspace assistant. What's your name?", // 0: Name
  "Nice to meet you, {name}! Which city are you looking for? (e.g. Bangalore, Mumbai)", // 1: Location
  "How many seats does your team need?", // 2: Seats (Ignored for search)
  "Do you have a specific budget per seat?", // 3: Budget (Ignored for search)
];

const STEP_KEYS = ["name", "location", "seats", "budget"];

const CITY_MAPPING = {
  "banglore": "bangalore", "bengaluru": "bangalore", "blr": "bangalore",
  "indiranagar": "bangalore", "koramangala": "bangalore", "whitefield": "bangalore",
  "hsr layout": "bangalore", "jayanagar": "bangalore", "mg road": "bangalore",
  "electronic city": "bangalore", "marathahalli": "bangalore", "hebbal": "bangalore",
  "gurugram": "gurgaon", "cyber city": "gurgaon",
  "bk": "mumbai", "bandra": "mumbai", "andheri": "mumbai", "powai": "mumbai",
  "gachibowli": "hyderabad", "hitech city": "hyderabad", "jubilee hills": "hyderabad"
};

const ChatBot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [teaserText, setTeaserText] = useState("");

  // Chat State
  const [messages, setMessages] = useState(() => {
    if (user && user.name) {
      return [{
        id: 1,
        text: `Hi ${user.name}! 👋 Which city are you looking for? (e.g. Bangalore, Mumbai)`,
        isBot: true
      }];
    }
    return [{ id: 1, text: questions[0], isBot: true }];
  });

  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(user && user.name ? 1 : 0);

  // DATA STORE
  const leadDataRef = useRef({
    name: user?.name || "", location: "", seats: "", budget: ""
  });

  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Refs
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // --- 1. TEASER TYPING EFFECT ---
  useEffect(() => {
    if (isOpen) {
      setTeaserText("");
      return;
    }

    const fullText = user?.name
      ? ` Hi ${user.name}! Need help finding a workspace?`
      : " Hi! Need help finding a workspace?";

    let currentIndex = 0;
    setTeaserText("");

    const intervalId = setInterval(() => {
      currentIndex++;
      setTeaserText(fullText.slice(0, currentIndex));

      if (currentIndex >= fullText.length) {
        clearInterval(intervalId);
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [isOpen, user]);

  // --- 2. AUTO SCROLL ---
  useEffect(() => {
    if (isOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen, isTyping]);

  // --- 3. SUBMIT HANDLER ---
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isComplete) return;

    const userText = inputValue.trim();

    // 1. Add User Message
    setMessages((prev) => [...prev, { id: Date.now(), text: userText, isBot: false }]);
    setInputValue("");
    setIsTyping(true);

    // 2. Save Data
    if (currentStep < STEP_KEYS.length) {
      leadDataRef.current[STEP_KEYS[currentStep]] = userText;
    }

    // 3. Bot Reply Logic
    setTimeout(() => {
      setIsTyping(false);

      if (currentStep < questions.length - 1) {
        // --- NEXT QUESTION ---
        const nextQRaw = questions[currentStep + 1];
        const nextQFormatted = nextQRaw.replace("{name}", leadDataRef.current.name || "there");

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, text: nextQFormatted, isBot: true },
        ]);
        setCurrentStep((prev) => prev + 1);

      } else {
        // --- CHAT COMPLETE ---
        const finalData = leadDataRef.current;
        let rawLoc = finalData.location.toLowerCase();
        const mainCity = CITY_MAPPING[rawLoc] || rawLoc;
        const displayCity = mainCity.charAt(0).toUpperCase() + mainCity.slice(1);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: `Perfect, ${finalData.name}! 🎉 Redirecting you to all workspaces in ${displayCity}...`,
            isBot: true,
          },
        ]);
        setIsComplete(true);

        setTimeout(() => {
          const params = new URLSearchParams();
          if (mainCity) params.append("location", mainCity);
          navigate(`/search?${params.toString()}`);
        }, 2000);
      }
    }, 800);
  };

  return (
    <div className="relative z-20">

      {/* --- TEASER BAR --- */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="bg-gray-100/90 backdrop-blur-md p-2 pr-4 rounded-[3rem] shadow-2xl flex items-center gap-3 max-w-lg w-auto border border-white/20 cursor-pointer group"
        >
          {/* Icon Circle */}
          <div className="w-14 h-14 rounded-full bg-teal flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Search className="w-6 h-6 text-white relative z-10" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 px-2">
            <p className="text-teal font-bold text-[10px] uppercase tracking-wider mb-0.5">AI Assistant</p>
            <p className="text-navy text-base font-bold leading-tight whitespace-nowrap">
              {teaserText || "Hi! Need help finding a workspace?"}
            </p>
          </div>

          {/* Arrow Button */}
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md group-hover:bg-gray-50 transition-transform group-hover:scale-105 active:scale-95">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}

      {/* --- FULL CHAT CARD --- */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-80 md:w-96 flex flex-col overflow-hidden shadow-2xl rounded-2xl border border-gray-200 bg-white ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-300 origin-top-right z-50">

          {/* Header */}
          <div className="bg-gradient-to-r from-navy via-navy to-teal px-5 py-4 flex items-center justify-between shadow-md relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm tracking-wide">FlickSpace AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 border border-white/10 group"
            >
              <X className="w-4 h-4 text-white/80 group-hover:text-white" />
            </button>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="h-56 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
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
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-navy to-teal flex items-center justify-center mr-2 flex-shrink-0 shadow-md border border-white">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed shadow-sm relative",
                    message.isBot
                      ? "bg-white text-gray-700 rounded-2xl rounded-tl-none border border-gray-100"
                      : "bg-gradient-to-br from-teal to-teal-600 text-white rounded-2xl rounded-tr-none shadow-teal/20"
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-navy to-teal flex items-center justify-center mr-2 flex-shrink-0 shadow-md border border-white">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white px-3 py-2.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-1 h-[38px]">
                  <span className="w-1.5 h-1.5 bg-teal/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-teal/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-teal/60 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-gray-100"
          >
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isComplete ? "Redirecting..." : "Type here..."}
                disabled={isComplete || isTyping}
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 rounded-full text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:bg-white focus:border-teal/50 border border-gray-200 transition-all duration-300 shadow-inner"
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isComplete || isTyping}
                className={cn(
                  "absolute right-1 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm",
                  !inputValue.trim() || isComplete || isTyping
                    ? "bg-gray-200 text-gray-400"
                    : "bg-gradient-to-r from-teal to-emerald-500 text-white hover:scale-105"
                )}
              >
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;