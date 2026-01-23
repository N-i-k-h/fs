import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import OfficeCard from "@/components/OfficeCard";
import { workspaces } from "@/data/workspaces";
import Header from "@/components/Header";

// Types
interface Message {
    id: number;
    sender: "ai" | "user";
    text: string;
    isTyping?: boolean;
}

const AIAssistantPage = () => {
    // State for Chat
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // State for Recommendations
    const [filteredWorkspaces, setFilteredWorkspaces] = useState<any[]>([]); // Start empty or with all
    const [showResults, setShowResults] = useState(false);

    // Auto-scroll chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // SEQUENTIAL CHAT LOGIC
    const [currentStep, setCurrentStep] = useState(0);
    const [userData, setUserData] = useState({ name: "", city: "", seats: "", budget: "" });

    const questions = [
        "Hi! 👋 I'm your workspace assistant. What's your name?",
        "Nice to meet you, {name}! Which city are you looking for? (e.g. Bangalore, Mumbai)",
        "How many seats does your team need?",
        "Do you have a specific budget per seat?",
    ];

    // Initial Message
    useEffect(() => {
        if (messages.length === 0 || (messages.length === 1 && messages[0].text !== questions[0])) {
            setMessages([{ id: 1, sender: "ai", text: questions[0] }]);
        }
    }, []);

    const processMessage = async (text: string) => {
        setIsTyping(true);
        const lowerText = text.toLowerCase();

        // Simulate AI Delay
        setTimeout(() => {
            let responseText = "";
            let nextStep = currentStep + 1;
            let updatedUserData = { ...userData };
            let newFilteredSpaces = [...filteredWorkspaces];

            // Handle User Input based on Current Step
            if (currentStep === 0) {
                // User provided Name
                updatedUserData.name = text;
                responseText = questions[1].replace("{name}", text);
            } else if (currentStep === 1) {
                // User provided City
                updatedUserData.city = text;
                // Immediate Filter by City
                const cityPattern = text.toLowerCase();
                if (cityPattern.includes("mumbai") || cityPattern.includes("bangalore") || cityPattern.includes("delhi") || cityPattern.includes("pune") || cityPattern.includes("hyderabad")) {
                    const city = workspaces.find(w => cityPattern.includes(w.city.toLowerCase()))?.city || "Mumbai"; // Default fallback if match logic strictly needs one
                    newFilteredSpaces = workspaces.filter(s => s.city.toLowerCase().includes(cityPattern));
                } else {
                    // Loose filter
                    newFilteredSpaces = workspaces.filter(s => s.location.toLowerCase().includes(cityPattern) || s.city.toLowerCase().includes(cityPattern));
                }

                if (newFilteredSpaces.length > 0) {
                    setFilteredWorkspaces(newFilteredSpaces);
                    setShowResults(true);
                } else {
                    // Reset if no matches found but keep flow? Or show all.
                    setFilteredWorkspaces(workspaces);
                    setShowResults(true);
                }
                responseText = questions[2];

            } else if (currentStep === 2) {
                // User provided Seats
                updatedUserData.seats = text;
                // Filter by seats if number provided
                const seatsNum = parseInt(text.match(/\d+/)?.[0] || "0");
                if (seatsNum > 0) {
                    // Filter logic: e.g. capacity >= seats
                    // Since our mock data might just be static, we'll do a loose filter or sort
                    // For now, let's just keep the city-filtered list or re-filter
                    if (newFilteredSpaces.length === 0) newFilteredSpaces = workspaces;
                    // Logic: prioritize spaces that can accommodate
                }
                responseText = questions[3];

            } else if (currentStep === 3) {
                // User provided Budget
                updatedUserData.budget = text;
                responseText = "Thanks! I've curated the best options regarding your preferences. Feel free to browse, Schedule a Tour, or Get a Quote.";
                // Final filtering could happen here
            } else {
                // Conversation ended or general query
                responseText = "Is there anything else I can help you with? You can ask about amenities, metro connectivity, etc.";
                nextStep = currentStep; // Stay on final step
            }

            setUserData(updatedUserData);
            setCurrentStep(nextStep);

            setMessages(prev => [
                ...prev,
                { id: Date.now(), sender: "ai", text: responseText }
            ]);
            setIsTyping(false);
        }, 1000);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add User Message
        const newUserMsg: Message = { id: Date.now(), sender: "user", text: inputValue };
        setMessages(prev => [...prev, newUserMsg]);

        const text = inputValue;
        setInputValue("");

        // Trigger AI Response
        processMessage(text);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 pt-20 container mx-auto px-4 pb-8 lg:h-[calc(100vh-80px)] h-auto">
                <div className="flex flex-col lg:flex-row h-full gap-6">

                    {/* LEFT PANEL: Chat Interface */}
                    <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden h-[500px] lg:h-full shrink-0">
                        {/* Chat Header */}
                        <div className="p-4 bg-[#002b4d] text-white flex items-center gap-3 shrink-0">
                            <div className="p-2 bg-white/10 rounded-full">
                                <Sparkles className="w-5 h-5 text-teal" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg leading-tight">FlickSpace AI</h2>
                                <p className="text-xs text-blue-200">Workspace Acquisition Assistant</p>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" ref={scrollRef}>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "ai" ? "bg-[#002b4d] text-white" : "bg-gray-200"}`}>
                                        {msg.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4 text-gray-600" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${msg.sender === "ai"
                                        ? "bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm"
                                        : "bg-[#002b4d] text-white rounded-tr-none shadow-md"
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#002b4d] flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your answer..."
                                    className="flex-1 bg-gray-100 border-0 rounded-xl px-4 text-sm focus:ring-2 focus:ring-teal focus:outline-none"
                                />
                                <Button type="submit" size="icon" className="bg-teal hover:bg-teal/90 rounded-xl w-10 h-10 shrink-0">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Recommendations */}
                    <div className="w-full lg:w-2/3 flex flex-col h-auto lg:h-full min-h-[500px]">
                        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
                                    {showResults ? `${filteredWorkspaces.length} Results Found` : "Top Recommendations"}
                                    {showResults && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-normal">Based on your chat</span>}
                                </h2>
                                <p className="text-sm text-gray-500">AI-curated list matches your requirements.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="text-xs">Best Match</Button>
                                <Button variant="ghost" size="sm" className="text-xs">Lowest Price</Button>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 pr-4 h-full">
                            {(!showResults && filteredWorkspaces.length === 0) ? (
                                // Empty State / Initial State
                                <div className="h-[300px] lg:h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                        <Sparkles className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h3 className="font-bold text-gray-400 text-lg">Waiting for inputs...</h3>
                                    <p className="text-gray-400 max-w-xs mx-auto">Chat with the AI assistant to specific your needs, and relevant workspaces will appear here instantly.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                    {(filteredWorkspaces.length > 0 ? filteredWorkspaces : workspaces.slice(0, 4)).map((space) => (
                                        <OfficeCard
                                            key={space.id}
                                            {...space}
                                        // We will override the buttons via the OfficeCard component if passed, 
                                        // but OfficeCard already has 'Request Tour' and 'Get Quote' built-in or similar.
                                        // The user asked specifically for those buttons to be present.
                                        // Our current OfficeCard has "Schedule Tour" and "Get Quote".
                                        />
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AIAssistantPage;
