import { Monitor, Briefcase, Camera, Heart, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const industries = [
    { name: "Tech & Devops", icon: Code2 },
    { name: "Finance & Legal", icon: Briefcase },
    { name: "Creative & Media", icon: Camera },
    { name: "Healthcare", icon: Heart },
    { name: "IT & Support", icon: Monitor },
];

const Industries = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12">
                    Industries <span className="text-teal">We Serve</span>
                </h2>

                <div className="flex flex-wrap justify-center gap-4">
                    {industries.map((item, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-center gap-3 px-8 py-4 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer",
                                "bg-white hover:bg-teal hover:text-white hover:shadow-lg hover:-translate-y-1 group"
                            )}
                        >
                            <item.icon className="w-5 h-5 text-teal group-hover:text-white transition-colors" />
                            <span className="font-semibold text-gray-700 group-hover:text-white transition-colors">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Industries;
