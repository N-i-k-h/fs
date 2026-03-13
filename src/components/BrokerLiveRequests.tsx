import { ArrowRight, Users, MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const BrokerLiveRequests = () => {
    const navigate = useNavigate();

    const sampleRequests = [
        {
            id: "1",
            company: "Tech Giant Corp",
            requirement: "Managed Office space for 1500+ seats",
            location: "Koramangala / HSR",
            budget: "₹18,000 - ₹22,000 / seat",
            urgency: "High"
        },
        {
            id: "2",
            company: "Unicorn Startup",
            requirement: "Private Cabin for 50 people",
            location: "Indiranagar",
            budget: "₹15,000 / seat",
            urgency: "Medium"
        },
        {
            id: "3",
            company: "Global IT Services",
            requirement: "Floor plate of 50,000 sq.ft.",
            location: "Whitefield",
            budget: "₹75 / sq.ft.",
            urgency: "High"
        }
    ];

    return (
        <section className="py-24 bg-gray-50/50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <Badge className="bg-teal/10 text-teal hover:bg-teal/10 border-none px-4 py-1 mb-4 uppercase tracking-widest text-[10px] font-bold">
                            Live Requirement Feed
                        </Badge>
                        <h2 className="text-4xl font-bold text-navy mb-4">
                            Corporate Clients Are <span className="text-teal">Searching Now</span>
                        </h2>
                        <p className="text-gray-500 text-lg">
                            Direct corporate requirements from decision-makers at Top MNCs and Startups. Propose your space to these live RFPs immediately.
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate("/broker/requests")}
                        className="bg-navy hover:bg-navy/90 text-white rounded-xl h-14 px-8 font-bold shadow-xl shadow-navy/20"
                    >
                        View All RFPs <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>

                <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 text-center max-w-4xl mx-auto">
                    <div className="w-20 h-20 bg-teal/10 rounded-3xl flex items-center justify-center text-teal mx-auto mb-8">
                        <Users className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-navy mb-4">Access Real-Time Corporate RFPs</h3>
                    <p className="text-gray-500 mb-10 max-w-xl mx-auto">
                        We connect verified workspace owners directly with corporate teams looking for space.
                        Register your office to start receiving detailed requirements and bidding on live mandates.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => navigate("/broker/register")}
                            className="bg-teal hover:bg-teal/90 text-white rounded-2xl h-14 px-10 font-bold shadow-xl shadow-teal/20"
                        >
                            Register Workspace <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/broker/login")}
                            className="rounded-2xl h-14 px-10 border-gray-200 text-navy font-bold hover:bg-gray-50"
                        >
                            Partner Login
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrokerLiveRequests;
