import { Building2, Users, Handshake, Globe } from "lucide-react";

const BrokerStats = () => {
    const stats = [
        { icon: Building2, count: "5000+", label: "Total Space Listings" },
        { icon: Users, count: "10,000+", label: "Verified Corporate Users" },
        { icon: Handshake, count: "12,000+", label: "Handshakes Initiated" },
        { icon: Globe, count: "50+", label: "Tier 1 Cities Covered" },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 bg-white rounded-[4rem] px-12 py-20 border-2 border-gray-100 shadow-xl shadow-gray-100 animate-in fade-in duration-700">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 rounded-3xl bg-teal/5 flex items-center justify-center text-teal mb-6 group-hover:bg-teal group-hover:text-white transition-all duration-500 shadow-sm border border-teal/10">
                                <stat.icon className="w-10 h-10" />
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-navy mb-2 tracking-tight group-hover:scale-110 transition-transform duration-500">
                                {stat.count}
                            </h3>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-teal transition-colors">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrokerStats;
