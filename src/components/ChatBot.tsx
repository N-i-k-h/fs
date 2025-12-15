import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, X, Sparkles, Bot, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- ONLY REQUIRED QUESTIONS ---
const questions = [
  "Hi! 👋 I'm your workspace assistant. What's your name?",
  "Nice to meet you, {name}! Which city are you looking for? (e.g. Bangalore, Mumbai)",
  "How many seats does your team need?",
  "Do you have a specific budget per seat?",
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
  const [isOpen, setIsOpen] = useState(false);
  const [teaserText, setTeaserText] = useState("");
  const [messages, setMessages] = useState([{ id: 1, text: questions[0], isBot: true }]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const leadDataRef = useRef({ name: "", location: "", seats: "", budget: "" });
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // --- 1. TEASER TYPING EFFECT ---
  useEffect(() => {
    if (isOpen) { setTeaserText(""); return; }
    const fullText = " Hi! Need help finding a workspace?";
    let currentIndex = 0;
    setTeaserText("");
    const intervalId = setInterval(() => {
      currentIndex++;
      setTeaserText(fullText.slice(0, currentIndex));
      if (currentIndex >= fullText.length) clearInterval(intervalId);
    }, 50);
    return () => clearInterval(intervalId);
  }, [isOpen]);

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
    setMessages((prev) => [...prev, { id: Date.now(), text: userText, isBot: false }]);
    setInputValue("");
    setIsTyping(true);

    if (currentStep < STEP_KEYS.length) {
        leadDataRef.current[STEP_KEYS[currentStep]] = userText;
    }

    setTimeout(() => {
      setIsTyping(false);
      if (currentStep < questions.length - 1) {
        const nextQRaw = questions[currentStep + 1];
        const nextQFormatted = nextQRaw.replace("{name}", leadDataRef.current.name || "there");
        setMessages((prev) => [...prev, { id: Date.now() + 1, text: nextQFormatted, isBot: true }]);
        setCurrentStep((prev) => prev + 1);
      } else {
        const finalData = leadDataRef.current;
        let rawLoc = finalData.location.toLowerCase();
        const mainCity = CITY_MAPPING[rawLoc] || rawLoc; 
        const displayCity = mainCity.charAt(0).toUpperCase() + mainCity.slice(1);

        setMessages((prev) => [...prev, {
            id: Date.now() + 1,
            text: `Perfect, ${finalData.name}! 🎉 Redirecting you to all workspaces in ${displayCity}...`,
            isBot: true,
        }]);
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
    <div className="w-full max-w-md mx-auto relative z-20">
      
      {/* --- TEASER BAR --- */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          // FIXED: Removed 'hover:scale-[1.02]' and 'transition-all duration-300'
          className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl border border-gray-200 cursor-pointer group flex items-center justify-between gap-4 animate-in fade-in zoom-in-95"
        >
           <div className="flex items-center gap-3 pl-2">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy to-teal flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-teal uppercase tracking-wider mb-0.5">AI Assistant</span>
                <p className="text-sm font-medium text-navy min-w-[220px] h-5 overflow-hidden whitespace-nowrap">
                   {teaserText}
                </p>
             </div>
           </div>
           
           <div className="hidden md:flex w-10 h-10 rounded-full bg-gray-50 group-hover:bg-teal group-hover:text-white text-gray-400 items-center justify-center transition-colors">
              <ChevronRight className="w-5 h-5" />
           </div>
        </div>
      )}

      {/* --- FULL CHAT CARD --- */}
      {isOpen && (
        <div className="w-full flex flex-col overflow-hidden shadow-2xl rounded-2xl border border-gray-200 bg-white ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-300">
          
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

          <div
            ref={messagesContainerRef}
            className="h-72 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
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

          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
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