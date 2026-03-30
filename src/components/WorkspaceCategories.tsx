// Version: 2026-03-20_2311
import { useNavigate } from "react-router-dom";
import { Search, Settings, Rocket, MoveRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

const categories = [
    {
        id: 1,
        title: "Rent",
        subtitle: "Find your perfect private office, coworking desk, or managed space in top locations.",
        image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800",
        filter: "coworking",
        icon: Search,
        color: "bg-blue-500"
    },
    {
        id: 2,
        title: "Manage",
        subtitle: "Streamline your team's workspace usage with our enterprise-grade management tools.",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
        filter: "managed",
        icon: Settings,
        color: "bg-teal"
    },
    {
        id: 3,
        title: "Promote",
        subtitle: "List your space and connect with high-intent corporate clients instantly via our RFP platform.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
        filter: "broker",
        icon: Rocket,
        color: "bg-navy"
    }
];

const WorkspaceCategories = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("✅ WorkspaceCategories v2.311 Loaded");
    }, []);

    return (
        <section id="services" className="py-24 bg-gray-50/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        Our Services
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
                        Workspace <span className="text-teal">Simplified</span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Whether you're looking for a new office, managing a global team, or listing a prime property, we've got you covered.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {categories.map((cat) => (
                        <Card 
                            key={cat.id} 
                            className="group overflow-hidden rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white"
                            onClick={() => navigate(cat.title === 'Promote' ? '/broker/register' : `/search?type=${cat.filter}`)}
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src={cat.image} 
                                    alt={cat.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/10 transition-colors" />
                                <div className={`absolute top-6 left-6 w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-500`}>
                                    <cat.icon className="w-7 h-7" />
                                </div>
                            </div>
                            <CardContent className="p-8">
                                <h3 className="text-2xl font-bold text-navy mb-3 group-hover:text-teal transition-colors">
                                    {cat.title}
                                </h3>
                                <p className="text-gray-500 mb-6 leading-relaxed">
                                    {cat.subtitle}
                                </p>
                                <div className="flex items-center text-teal font-bold group-hover:translate-x-2 transition-transform duration-300">
                                    Get Started <MoveRight className="ml-2 w-5 h-5" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorkspaceCategories;
