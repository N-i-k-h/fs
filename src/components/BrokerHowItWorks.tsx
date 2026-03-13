import { PlusCircle, Search, Handshake, CheckCircle } from "lucide-react";

const BrokerHowItWorks = () => {
    const steps = [
        {
            icon: PlusCircle,
            title: "List Your Properties",
            desc: "Register and add your buildings with detailed technical and commercial specs. The more detail, the better the match."
        },
        {
            icon: Search,
            title: "Browse Live RFPs",
            desc: "Access a live feed of corporate requirements and workspace requests within your micro-markets."
        },
        {
            icon: Handshake,
            title: "The Handshake",
            desc: "Propose your space to specific RFPs. Our Handshake algorithm ensures a direct connection with the decision-maker."
        },
        {
            icon: CheckCircle,
            title: "Close Success",
            desc: "Coordinate visits, share technical brochures, and close the deal without any intermediary friction."
        }
    ];

    return (
        <section className="py-24 bg-navy text-white relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl text-left">
                        <span className="text-teal font-bold uppercase tracking-[0.2em] text-sm mb-4 block">The Process</span>
                        <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                            Simple & Direct <br />
                            <span className="text-teal/80">Occupancy Growth</span>
                        </h2>
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-gray-400 max-w-xs text-sm leading-relaxed border-l-2 border-teal/30 pl-6 italic">
                            Streamlining the connection between verified space owners and high-intent corporate occupants.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:border-teal/30">
                            <div className="mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-teal/20 flex items-center justify-center text-teal group-hover:scale-110 transition-all duration-500">
                                    <step.icon className="w-7 h-7" />
                                </div>
                            </div>
                            <div className="absolute top-8 right-8 text-4xl font-black text-white/5 group-hover:text-teal/20 transition-colors">
                                0{idx + 1}
                            </div>
                            <h3 className="text-xl font-bold mb-4 group-hover:text-teal transition-colors">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrokerHowItWorks;
