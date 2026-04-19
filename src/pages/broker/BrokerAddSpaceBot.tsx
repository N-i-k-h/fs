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
  Check,
  ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import MultiImageUpload from "@/components/MultiImageUpload";

interface Field {
  key: string;
  label: string;
  question: string;
  required: boolean;
  type?: string;
  validation?: (v: string) => boolean;
}

const PROPERTY_FIELDS: Field[] = [
  { key: "name", label: "Space Name", question: "What's the name of your workspace?", required: true },
  { key: "type", label: "Workspace Type", question: "What type of workspace is it? (e.g., Coworking, Private Office, Managed Office)", required: true },
  { key: "city", label: "City", question: "Which city is this property located in?", required: true },
  { key: "location", label: "Micro Market", question: "What's the specific micro-market or area? (e.g., Koramangala, BKC)", required: true },
  { key: "price", label: "Price / Seat", question: "What is the monthly price per seat?", required: true, validation: (v: string) => !isNaN(Number(v)) && Number(v) > 0 },
  { key: "seats", label: "Total Capacity", question: "What is the total seating capacity?", required: true, validation: (v: string) => !isNaN(Number(v)) && Number(v) >= 0 },
  { key: "availableSeats", label: "Available Seats", question: "How many seats are currently available for booking?", required: true, validation: (v: string) => !isNaN(Number(v)) && Number(v) >= 0 },
  { key: "description", label: "Description", question: "Can you provide a brief description of the space?", required: false },
  { key: "amenities", label: "Amenities", question: "What are the key amenities provided? (e.g., WiFi, Coffee, Meeting Rooms)", required: false },
  { key: "images", label: "Visuals", question: "Almost done! Please upload high-quality photos of your workspace below.", required: false },
];

const BrokerAddSpaceBot = () => {
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;

    // Security check
    if (!token || (user && user.role !== 'broker' && user.role !== 'admin')) {
      toast.error("Please login as a partner to list spaces.");
      navigate("/broker/login");
      return;
    }

    // Initial greeting
    const greet = async () => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000));
      setMessages([
        { 
          id: 1, 
          text: `Hi ${user?.name || 'Partner'}! 👋 I'm your SFT Onboarding Assistant.`, 
          isBot: true 
        },
        { 
          id: 2, 
          text: "I'll help you list your workspace on Xplore SFT in just a few minutes. Let's get started!", 
          isBot: true 
        }
      ]);
      setIsTyping(false);
      
      await new Promise(r => setTimeout(r, 500));
      askNextQuestion(0);
    };
    greet();
  }, [token, user, navigate, loading]);

  const bottomRef = useRef<HTMLDivElement>(null);

  const isImageStep = PROPERTY_FIELDS[currentFieldIndex]?.key === "images";

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, currentFieldIndex, isSummaryMode, isImageStep, images]);





  const askNextQuestion = (index: number) => {
    if (index < PROPERTY_FIELDS.length) {
      const field = PROPERTY_FIELDS[index];
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
          text: "Excellent! I've collected the core details. Please review them below.", 
          isBot: true 
        },
        { 
          id: Date.now() + 1, 
          text: "You can edit any field by telling me (e.g., 'Change price to 8000') or using the edit icons. Type 'submit' when ready!", 
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
    const currentField = PROPERTY_FIELDS[currentFieldIndex];
    const isSkip = text.toLowerCase() === "skip";

    if (isSkip && currentField.required) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), text: `Actually, the ${currentField.label} is mandatory for listing. Could you please provide it?`, isBot: true }]);
        setIsTyping(false);
      }, 500);
      return;
    }

    if (!isSkip && currentField.validation && !currentField.validation(text)) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), text: `That doesn't look like a valid ${currentField.label.toLowerCase()}. Please try again.`, isBot: true }]);
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
      handleSubmit();
      return;
    }

    let foundField = null;
    let newValue = text;

    for (const field of PROPERTY_FIELDS) {
      if (input.includes(field.label.toLowerCase()) || input.includes(field.key.toLowerCase())) {
        foundField = field;
        const parts = input.split(field.label.toLowerCase());
        if (parts.length > 1) {
            newValue = text.substring(text.toLowerCase().indexOf(field.label.toLowerCase()) + field.label.length).replace(/to|is|as/g, "").trim();
        }
        break;
      }
    }

    if (foundField) {
      setFormData(prev => ({ ...prev, [foundField.key]: newValue }));
      setMessages(prev => [...prev, { id: Date.now(), text: `Got it! I've updated the ${foundField.label} to "${newValue}".`, isBot: true }]);
    } else {
      setMessages(prev => [...prev, { id: Date.now(), text: "I didn't quite catch that. You can say 'Change name to XYZ' or type 'submit' to finish.", isBot: true }]);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
        setMessages(prev => [...prev, { id: Date.now(), text: "Wait! Some mandatory fields are missing. Please ensure Name and Price are filled.", isBot: true }]);
        return;
    }

    setIsSubmitting(true);
    setIsTyping(true);

    try {
      const numericId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
      const config = { headers: { 'x-auth-token': token } };
      
      const payload = {
          ...formData,
          id: numericId,
          type: [formData.type],
          amenities: typeof formData.amenities === 'string' ? formData.amenities.split(',').map(s => s.trim()) : [],
          images: images,
          price: Number(formData.price),
          seats: Number(formData.seats),
          availableSeats: Number(formData.availableSeats)
      };

      await axios.post('/api/spaces', payload, config);
      
      setMessages(prev => [...prev, { id: Date.now(), text: "🎉 Congratulations! Your workspace is now live on Xplore SFT. Redirecting you to your inventory...", isBot: true }]);
      toast.success("Workspace published successfully!");
      setTimeout(() => navigate("/broker/spaces"), 3000);

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now(), text: "Oops! Something went wrong while publishing. Please try again or type 'submit'.", isBot: true }]);
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
                className="text-gray-400 hover:text-white mb-4 -ml-2 hover:bg-white/5 h-8"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back
              </Button>
              
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-0.5">
                Partner <span className="text-teal-400">Assistant</span>
              </h2>
              <p className="text-gray-400 text-[10px] font-medium mb-4">Add Space Conversations</p>

              
              <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10 mb-4">
                <div className="w-7 h-7 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">System Status</p>
                  <p className="text-[10px] font-bold text-teal-400 leading-none">Assistant Ready</p>
                </div>
              </div>


              <div className="space-y-2">



                {PROPERTY_FIELDS.map((f, idx) => (
                  <div key={f.key} className="flex items-center gap-4 group">
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 shrink-0",
                      idx < currentFieldIndex || formData[f.key] ? "bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]" : 
                      idx === currentFieldIndex ? "bg-white text-navy scale-110 shadow-lg" : "bg-white/10 text-gray-500"
                    )}>
                      {idx < currentFieldIndex || formData[f.key] ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className={cn(
                      "text-[11px] font-bold uppercase tracking-widest transition-colors",
                      idx === currentFieldIndex ? "text-white" : "text-gray-500"
                    )}>
                      {f.label}
                    </span>
                  </div>
                ))}
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

                {isImageStep && !isSummaryMode && !isTyping && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-teal-100 shadow-xl shadow-teal-900/5">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-teal/10 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-teal" />
                        </div>
                        <h3 className="text-navy font-black uppercase tracking-tight italic text-sm">Workspace Gallery</h3>
                      </div>
                      <MultiImageUpload
                        currentImages={images}
                        onUploadComplete={(urls) => {
                          setImages(urls);
                          setFormData(prev => ({ ...prev, images: urls }));
                        }}
                        maxImages={10}
                        maxSizeMB={10}
                        label="UPLOAD PHOTOS"
                      />
                      <div className="mt-8">
                        <Button 
                          onClick={() => {
                            const nextIndex = currentFieldIndex + 1;
                            setCurrentFieldIndex(nextIndex);
                            askNextQuestion(nextIndex);
                          }}
                          className="w-full bg-navy hover:bg-teal text-white rounded-2xl h-14 font-black uppercase tracking-widest text-xs"
                        >
                          Continue to Summary
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {isSummaryMode && !isTyping && (
                  <div className="animate-in fade-in zoom-in-95 duration-700 mt-8">
                    <div className="bg-white rounded-[2rem] border border-teal-100 overflow-hidden shadow-xl shadow-teal-900/5">
                      <div className="bg-teal-50 px-8 py-4 border-b border-teal-100 flex justify-between items-center">
                        <h3 className="font-black text-navy uppercase text-sm tracking-widest italic">Space Details</h3>
                        <CheckCircle2 className="w-5 h-5 text-teal-500" />
                      </div>
                      <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                          {PROPERTY_FIELDS.filter(f => f.key !== "images").map((f, i) => (
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
                                    setCurrentFieldIndex(PROPERTY_FIELDS.findIndex(x => x.key === f.key));
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

                        {/* Image Review in Summary */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                           <div className="flex items-center justify-between mb-4">
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Uploaded Photos</span>
                             <span className="text-[10px] font-bold text-teal">{images.length} Images</span>
                           </div>
                           <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                              {images.map((url, i) => (
                                <img key={i} src={url} alt="Space" className="w-16 h-16 rounded-lg object-cover border border-gray-100 shadow-sm shrink-0" />
                              ))}
                              {images.length === 0 && <span className="text-xs text-gray-300 italic">No photos uploaded</span>}
                           </div>
                        </div>
                        
                        <div className="mt-10 flex gap-4">
                          <Button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-lg shadow-teal-500/20"
                          >
                            {isSubmitting ? "Publishing..." : "Publish Workspace"}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                                setFormData({});
                                setCurrentFieldIndex(0);
                                setIsSummaryMode(false);
                                setMessages([]);
                                setImages([]);
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
                  disabled={!inputValue.trim() || isSubmitting || isImageStep}
                  className="w-16 h-16 rounded-2xl bg-navy hover:bg-teal-600 text-white shadow-xl shadow-navy/20 transition-all flex items-center justify-center group shrink-0"
                >
                  <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-6">
                Xplore SFT Partner Assistant • Premium Onboarding
              </p>
            </div>
          </div>
 
        </div>
      </main>
    </div>
  );
};
 
export default BrokerAddSpaceBot;
