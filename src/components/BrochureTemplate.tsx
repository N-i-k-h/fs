import { useRef, forwardRef } from "react";
import { CheckCircle, Wifi, Zap, Coffee, Shield, MapPin, Printer, Users } from "lucide-react";
import logo from "/logo.png"; // Assuming logo exists, or we use a fallback

const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("wifi")) return <Wifi className="w-5 h-5 text-teal-600 mb-2" />;
    if (lower.includes("power") || lower.includes("backup")) return <Zap className="w-5 h-5 text-teal-600 mb-2" />;
    if (lower.includes("cafe") || lower.includes("coffee")) return <Coffee className="w-5 h-5 text-teal-600 mb-2" />;
    if (lower.includes("security")) return <Shield className="w-5 h-5 text-teal-600 mb-2" />;
    if (lower.includes("print")) return <Printer className="w-5 h-5 text-teal-600 mb-2" />;
    if (lower.includes("meet")) return <Users className="w-5 h-5 text-teal-600 mb-2" />;
    return <CheckCircle className="w-5 h-5 text-teal-600 mb-2" />;
};

interface BrochureTemplateProps {
    space: any;
}

export const BrochureTemplate = forwardRef<HTMLDivElement, BrochureTemplateProps>(({ space }, ref) => {
    if (!space) return null;

    const snapshot = space.snapshot || { capacity: "100+", area: "10,000", lock_in: "12 Mo" };

    return (
        <div ref={ref} className="w-[800px] h-auto bg-white text-slate-800 font-sans absolute top-[-9999px] left-[-9999px] p-8" id="brochure-content">
            {/* HERDER */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    {/* Brand Logo Placeholder */}
                    <div className="w-8 h-8 bg-blue-600 rounded-md transform rotate-45 flex items-center justify-center">
                        <div className="w-4 h-4 bg-white transform -rotate-45" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">FlickSpace</span>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded uppercase">Download PDF</span>
                </div>
            </div>

            {/* HERO IMAGE */}
            <div className="relative w-full h-[350px] rounded-2xl overflow-hidden mb-8">
                <img src={space.images[0]} className="w-full h-full object-cover" alt="Hero" crossOrigin="anonymous" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                    <span className="bg-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">Premium Office Space</span>
                    <h1 className="text-4xl font-bold mb-1">{space.name}</h1>
                    <p className="text-lg opacity-90">{space.location}, {space.city}</p>
                </div>
                <div className="absolute bottom-6 right-6 text-white text-right">
                    <p className="text-[10px] uppercase font-bold opacity-70">Listed By</p>
                    <p className="text-sm font-bold">FlickSpace Corporate</p>
                </div>
            </div>

            {/* OVERVIEW */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Property Overview</h2>
                <div className="flex gap-8 items-start">
                    <p className="flex-1 text-sm text-slate-600 leading-relaxed">
                        {space.description} This premier A-Grade commercial destination is located in the heart of {space.city}'s CBD.
                        Offering meticulously designed workspaces with panoramic city views and unrivaled connectivity.
                    </p>
                    <div className="flex gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl min-w-[120px]">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Total Area</p>
                            <p className="text-xl font-bold text-slate-900">{snapshot.area}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl min-w-[120px]">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Workstations</p>
                            <p className="text-xl font-bold text-slate-900">{snapshot.capacity}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FLOOR PLANS (MOCKED) */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Floor Plans & Layouts</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <div className="h-40 bg-slate-100 rounded-xl mb-2 flex items-center justify-center border border-slate-200">
                            {/* Placeholder for blueprint */}
                            <div className="opacity-20 text-4xl">📐</div>
                        </div>
                        <h4 className="font-bold text-sm">Level 4 - Main Floor Plan</h4>
                        <p className="text-xs text-slate-500">Open layout with 120 workstations.</p>
                    </div>
                    <div>
                        <div className="h-40 overflow-hidden rounded-xl mb-2">
                            <img src={space.images[1] || space.images[0]} className="w-full h-full object-cover" crossOrigin="anonymous" />
                        </div>
                        <h4 className="font-bold text-sm">Module A - Private Studio</h4>
                        <p className="text-xs text-slate-500">12-seater executive suite.</p>
                    </div>
                </div>
            </div>

            {/* COMMERCIAL BREAKDOWN */}
            <div className="mb-10 bg-slate-50 p-6 rounded-2xl">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Commercial Breakdown</h2>
                <table className="w-full text-sm text-left">
                    <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-200">
                        <tr>
                            <th className="pb-3">Inventory Type</th>
                            <th className="pb-3">Pricing (Monthly)</th>
                            <th className="pb-3">Deposit</th>
                            <th className="pb-3">Availability</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700 font-medium">
                        <tr className="border-b border-slate-100 last:border-0">
                            <td className="py-4">Hot Desk (Flexible)</td>
                            <td className="py-4">₹8,000 / seat</td>
                            <td className="py-4">1 Month</td>
                            <td className="py-4"><span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold">IMMEDIATE</span></td>
                        </tr>
                        <tr className="border-b border-slate-100 last:border-0">
                            <td className="py-4">Fixed Workstation</td>
                            <td className="py-4">₹{space.price} / seat</td>
                            <td className="py-4">2 Months</td>
                            <td className="py-4"><span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold">IMMEDIATE</span></td>
                        </tr>
                        <tr className="border-b border-slate-100 last:border-0">
                            <td className="py-4">Private Office (10-20 Seats)</td>
                            <td className="py-4">₹{(space.price * 1.2).toFixed(0)} / seat</td>
                            <td className="py-4">3 Months</td>
                            <td className="py-4"><span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded font-bold">OCT 2026</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* AMENITIES & MAP */}
            <div className="grid grid-cols-2 gap-8 mb-8 text-left">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4">World-Class Amenities</h2>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        {space.amenities.slice(0, 6).map((am: string, i: number) => (
                            <div key={i} className="flex flex-col items-start">
                                {getAmenityIcon(am)}
                                <span className="text-xs font-bold text-slate-900">{am}</span>
                                <span className="text-[10px] text-slate-500">Premium Standard</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Prime Location</h2>
                    <div className="h-48 bg-slate-200 rounded-xl mb-4 overflow-hidden relative">
                        {/* Static Map Image Mock */}
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">Map Visualization</div>
                    </div>
                    <div className="space-y-2 text-xs font-medium text-slate-600">
                        <div className="flex justify-between"><span>Metro Station</span> <span className="text-slate-900 font-bold">5 mins walk</span></div>
                        <div className="flex justify-between"><span>International Airport</span> <span className="text-slate-900 font-bold">45 mins drive</span></div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-blue-600 rounded transform rotate-45 flex items-center justify-center"><div className="w-3 h-3 bg-white transform -rotate-45" /></div>
                        <span className="font-bold">FlickSpace</span>
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">AI-Powered Leasing Advisor</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-bold text-cyan-400">Alex Chen</p>
                        <p className="text-[10px] text-slate-400">Senior Advisor<br />+91 98765 43210</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
                        {/* Avatar Mock */}
                        <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600" />
                    </div>
                </div>
            </div>
            <p className="text-[8px] text-center text-slate-400 mt-4 italic">This brochure was automatically generated by FlickSpace AI. Data as of 2026.</p>
        </div>
    );
});
