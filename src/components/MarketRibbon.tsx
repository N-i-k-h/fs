import { Search, Video, FileText, BarChart3, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const ribbonItems = [
    {
        id: "explore",
        label: "ExploreSFT",
        description: "Search 500+ premium offices",
        icon: Search,
        path: "/search"
    },
    {
        id: "studio",
        label: "StudioSFT",
        description: "Live Video Tour & Walkthroughs",
        icon: Video,
        path: "#"
    },
    {
        id: "rfp",
        label: "RFP Platform",
        description: "Request For Proposal",
        icon: FileText,
        path: "/rfp-form"
    },
    {
        id: "intel",
        label: "Market Intel",
        description: "Reports of all IPC's",
        icon: BarChart3,
        path: "#"
    }
];

const MarketRibbon = ({ className }: { className?: string }) => {
    const navigate = useNavigate();

    return (
        <div className={cn("relative z-20 px-6 max-w-7xl mx-auto", className)}>
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 flex flex-wrap lg:flex-nowrap items-stretch divide-x divide-gray-50 overflow-hidden">
                {ribbonItems.map((item) => (
                    <div 
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className="group flex-1 min-w-[200px] p-6 md:p-8 hover:bg-teal transition-all duration-500 cursor-pointer flex flex-col gap-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-teal/5 group-hover:bg-white/20 flex items-center justify-center text-teal group-hover:text-white transition-all duration-500 shadow-sm">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <MoveRight className="w-4 h-4 text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-black text-navy group-hover:text-white transition-colors duration-300">
                                {item.label}
                            </h3>
                            <p className="text-xs font-medium text-gray-500 group-hover:text-white/70 transition-colors duration-300 leading-tight">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketRibbon;
