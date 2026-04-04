import { Shield, TrendingUp, Users, Zap, CheckCircle2, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PartnerBenefits = () => {
    const benefits = [
        {
            icon: TrendingUp,
            title: "Corporate Lead Generation",
            desc: "Get direct access to corporate RFPs and enterprise-grade workspace requirements from top global firms."
        },
        {
            icon: Users,
            title: "Verified Client Access",
            desc: "Interact with verified decision-makers. No more spam leads, just quality engagement through our Handshake system."
        },
        {
            icon: Zap,
            title: "Real-time RFP Dashboard",
            desc: "View live requirements and instantly propose your spaces. Closing deals has never been faster."
        },
        {
            icon: Shield,
            title: "Zero Commission",
            desc: "Our platform connects you directly. We don't take a cut, we provide the tech to scale your occupancy."
        },
        {
            icon: Globe,
            title: "Pan-India Visibility",
            desc: "List your technical specs once and get visibility across all major micro-markets in Bangalore, Mumbai, and Delhi."
        },
        {
            icon: CheckCircle2,
            title: "Instant Verification",
            desc: "Get the 'Connect Verified' badge on your listings once your technical and commercial specs are validated."
        },
    ];

    return (
        <section id="benefits" className="py-24 bg-white relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-navy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        Partner Benefits
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
                        Why Choose <span className="text-teal">Xplore</span> SFT for Your Office?
                    </h2>
                    <p className="text-lg text-gray-500">
                        We empower space owners with enterprise-grade tools to manage listings and secure corporate tenancies through the industry's first live RFP platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, idx) => (
                        <Card key={idx} className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] group hover:-translate-y-2 bg-gray-50/50">
                            <CardContent className="p-10">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-teal mb-8 group-hover:bg-teal group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                                    <benefit.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-teal transition-colors">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {benefit.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnerBenefits;
