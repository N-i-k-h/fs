import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Send, 
  Bot, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  RotateCcw, 
  Edit3,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

interface Field {
  key: string;
  label: string;
  question: string;
  required: boolean;
  type?: string;
}

const RFP_FIELDS: Field[] = [
  { key: "companyName", label: "Company Name", question: "What is the legal name of your company?", required: false },
  { key: "clientName", label: "Client Name", question: "Who is the authorized person (SPOC) for this requirement?", required: false },
  { key: "phone", label: "Contact Number", question: "Please provide a valid contact number for updates.", required: true },
  { key: "totalSeats", label: "Seats Needed", question: "How many seats are you looking for in total?", required: false },
  { key: "region", label: "Preferred Area", question: "Which location or micro-market do you prefer? (e.g., Koramangala, HSR)", required: false },
  { key: "budgetRange", label: "Budget Range", question: "What is your approximate budget range (per seat)?", required: true },
  { key: "expectedMoveIn", label: "Move-in Date", question: "When are you planning to move into the new workspace?", required: true },
  { key: "additionalNotes", label: "Additional Notes", question: "Any other specific requirements or notes you'd like to add?", required: false },
];

const SFTBotPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    const greet = async () => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000));
      setMessages([
        { 
          id: 1, 
          text: `Hi ${user?.name || 'there'}! 👋 I'm your SFT (Service Fulfillment Team) Assistant.`, 
          isBot: true 
        },
        { 
          id: 2, 
          text: "I'll help you create a professional RFP Brief in minutes. Let's get started!", 
          isBot: true 
        }
      ]);
      setIsTyping(false);
      
      await new Promise(r => setTimeout(r, 500));
      askNextQuestion(0);
    };
    greet();
  }, []);

  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isSummaryMode]);



  const askNextQuestion = (index: number) => {
    if (index < RFP_FIELDS.length) {
      const field = RFP_FIELDS[index];
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now(), 
            text: field.question + (field.required ? " (Required)" : " (You can type 'skip')"), 
            isBot: true 
          }
        ]);
        setIsTyping(false);
      }, 800);
    } else {
      showSummary();
    }
  };

  const showSummary = () => {
    setIsSummaryMode(true);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          text: "Perfect! I've gathered all the details. Here's a summary of your requirement.", 
          isBot: true 
        },
        { 
          id: Date.now() + 1, 
          text: "If you want to edit anything, just tell me like 'Change budget to 8000' or click the edit icon. If everything looks good, type 'submit'.", 
          isBot: true 
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isSubmitting) return;

    const userText = inputValue.trim();
    setMessages(prev => [...prev, { id: Date.now(), text: userText, isBot: false }]);
    setInputValue("");

    if (isSummaryMode) {
      handleSummaryChat(userText);
    } else {
      handleFlowChat(userText);
    }
  };

  const handleFlowChat = (text: string) => {
    const currentField = RFP_FIELDS[currentFieldIndex];
    const isSkip = text.toLowerCase() === "skip";

    if (isSkip && currentField.required) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), text: "Sorry, this field is mandatory. Please provide a value to proceed.", isBot: true }]);
        setIsTyping(false);
      }, 500);
      return;
    }

    // Save data
    setFormData(prev => ({
      ...prev,
      [currentField.key]: isSkip ? "N/A" : text
    }));

    const nextIndex = currentFieldIndex + 1;
    setCurrentFieldIndex(nextIndex);
    askNextQuestion(nextIndex);
  };

  const handleSummaryChat = (text: string) => {
    const input = text.toLowerCase();
    
    if (input === "submit" || input === "done" || input === "finish") {
      submitRFP();
      return;
    }

    // Basic NLP for editing
    // "change company name to Google" -> field: companyName, value: Google
    // Search for keywords
    let foundField = null;
    let newValue = text;

    for (const field of RFP_FIELDS) {
      if (input.includes(field.label.toLowerCase()) || input.includes(field.key.toLowerCase())) {
        foundField = field;
        // Try to extract value: "change budget to 10000" -> 10000
        const parts = input.split(field.label.toLowerCase());
        if (parts.length > 1) {
            newValue = text.substring(text.toLowerCase().indexOf(field.label.toLowerCase()) + field.label.length).replace(/to|is|as/g, "").trim();
        }
        break;
      }
    }

    if (foundField) {
      setFormData(prev => ({ ...prev, [foundField.key]: newValue }));
      setMessages(prev => [...prev, { id: Date.now(), text: `Updated ${foundField.label} to "${newValue}".`, isBot: true }]);
    } else {
      setMessages(prev => [...prev, { id: Date.now(), text: "I didn't quite catch that. You can say something like 'Change budget to 15000' or type 'submit' to finish.", isBot: true }]);
    }
  };

  const submitRFP = async () => {
    if (!formData.budgetRange || !formData.expectedMoveIn || !formData.phone) {
        setMessages(prev => [...prev, { id: Date.now(), text: "Wait! Some mandatory fields are missing. Please make sure Phone, Budget, and Move-in Date are filled.", isBot: true }]);
        return;
    }

    setIsSubmitting(true);
    setIsTyping(true);

    try {
      const res = await axios.post('/api/requests/rfp', {
        formData,
        email: user?.email || "anonymous@flickspace.com",
        user: user?.name || formData.clientName || "Anonymous User"
      });

      if (res.status === 201) {
        setMessages(prev => [...prev, { id: Date.now(), text: "🎉 Success! Your RFP has been submitted and shared with our verified partners.", isBot: true }]);
        toast.success("RFP Submitted Successfully!");
        setTimeout(() => navigate("/dashboard"), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now(), text: "Oops! Something went wrong while submitting. Please try again or type 'submit' to retry.", isBot: true }]);
    } finally {
      setIsSubmitting(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 pt-20 pb-6 px-4 md:px-8 flex justify-center items-center">
        <div className="w-full max-w-4xl h-[85vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
          
          {/* Left Panel: Progress & Info */}
          <div className="w-full md:w-80 bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="relative z-10">
              <Button 
                variant="ghost" 
                className="text-gray-400 hover:text-white mb-8 -ml-2 hover:bg-white/5"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
                SFT <span className="text-teal-400">Assistant</span>
              </h2>
              <p className="text-gray-400 text-sm font-medium mb-10">Conversational RFP Builder</p>
              
              <div className="space-y-6">
                {RFP_FIELDS.map((f, idx) => (
                  <div key={f.key} className="flex items-center gap-4 group">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                      idx < currentFieldIndex || formData[f.key] ? "bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]" : 
                      idx === currentFieldIndex ? "bg-white text-navy scale-110 shadow-lg" : "bg-white/10 text-gray-500"
                    )}>
                      {idx < currentFieldIndex || formData[f.key] ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={cn(
                      "text-sm font-bold uppercase tracking-widest transition-colors",
                      idx === currentFieldIndex ? "text-white" : "text-gray-500"
                    )}>
                      {f.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-8 border-t border-white/10">
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">System Status</p>
                  <p className="text-xs font-bold text-teal-400">Assistant Ready</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Chat Interface */}
          <div className="flex-1 flex flex-col bg-gray-50/50 relative">
            
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6 md:p-10" ref={scrollRef}>
              <div className="space-y-6 max-w-2xl mx-auto">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex items-end gap-3 animate-in slide-in-from-bottom-2 duration-300",
                      msg.isBot ? "justify-start" : "justify-end"
                    )}
                  >
                    {msg.isBot && (
                      <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0 shadow-md">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={cn(
                      "max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                      msg.isBot 
                        ? "bg-white text-gray-800 rounded-bl-none border border-gray-100" 
                        : "bg-teal-600 text-white rounded-br-none shadow-teal-900/10"
                    )}>
                      {msg.text}
                    </div>
                    {!msg.isBot && (
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-teal-600" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center animate-pulse">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white p-4 rounded-3xl rounded-bl-none border border-gray-100 flex gap-1 h-12 items-center px-6 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}

                {isSummaryMode && !isTyping && (
                  <div className="animate-in fade-in zoom-in-95 duration-700 mt-8">
                    <div className="bg-white rounded-[2rem] border border-teal-100 overflow-hidden shadow-xl shadow-teal-900/5">
                      <div className="bg-teal-50 px-8 py-4 border-b border-teal-100 flex justify-between items-center">
                        <h3 className="font-black text-navy uppercase text-sm tracking-widest italic">Requirement Summary</h3>
                        <CheckCircle2 className="w-5 h-5 text-teal-500" />
                      </div>
                      <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                          {RFP_FIELDS.map((f, i) => (
                            <div key={f.key} className="flex flex-col gap-1 border-b border-gray-100 pb-3 group relative">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                  <span className="w-5 h-5 bg-navy/5 rounded flex items-center justify-center text-navy/40">0{i + 1}</span> 
                                  {f.label}
                                  {f.required && <span className="text-red-400 font-bold">*</span>}
                                </span>
                                <button 
                                  onClick={() => {
                                    setMessages(prev => [...prev, { id: Date.now(), text: `I want to edit ${f.label}`, isBot: false }]);
                                    setIsSummaryMode(false);
                                    setCurrentFieldIndex(RFP_FIELDS.findIndex(x => x.key === f.key));
                                    setIsTyping(true);
                                    setTimeout(() => {
                                        setMessages(prev => [...prev, { id: Date.now(), text: `Sure! Let's update your ${f.label}. ${f.question}`, isBot: true }]);
                                        setIsTyping(false);
                                    }, 600);
                                  }}
                                  className="p-1.5 hover:bg-teal-50 rounded-lg transition-colors"
                                  title="Edit field"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                                </button>
                              </div>
                              <div className="mt-1">
                                <span className={cn(
                                  "text-sm font-bold",
                                  !formData[f.key] || formData[f.key] === "N/A" ? "text-gray-300 italic" : "text-navy"
                                )}>
                                  {formData[f.key] || "Not provided"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-10 flex gap-4">
                          <Button 
                            onClick={submitRFP}
                            disabled={isSubmitting}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-lg shadow-teal-500/20"
                          >
                            {isSubmitting ? "Submitting..." : "Submit Requirement"}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                                setFormData({});
                                setCurrentFieldIndex(0);
                                setIsSummaryMode(false);
                                setMessages([]);
                                askNextQuestion(0);
                            }}
                            className="border-gray-200 text-gray-400 hover:text-navy hover:bg-white rounded-2xl h-14 px-6"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} className="h-4" />
              </div>
            </ScrollArea>


            {/* Chat Input */}
            <div className="p-6 md:p-10 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex gap-4 relative">
                <div className="relative flex-1">
                  <Input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isSummaryMode ? "Type 'submit' or describe changes..." : "Type your answer..."}
                    className="h-16 pl-6 pr-16 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 rounded-2xl text-base font-medium shadow-inner transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <kbd className="hidden md:inline-flex h-6 items-center gap-1 rounded border bg-white px-1.5 font-sans text-[10px] font-medium text-gray-400">
                      <span>Enter</span>
                    </kbd>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={!inputValue.trim() || isSubmitting}
                  className="w-16 h-16 rounded-2xl bg-navy hover:bg-teal-600 text-white shadow-xl shadow-navy/20 transition-all flex items-center justify-center group shrink-0"
                >
                  <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-6">
                Xplore SFT Assistant • Professional Connect Platform
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SFTBotPage;
