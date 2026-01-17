import { useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";
import office1 from "@/assets/office-1.jpg";
import office5 from "@/assets/office-5.jpg";

const categories = [
    {
        id: 1,
        title: "Co-Working Spaces",
        image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800",
        filter: "coworking",
    },
    {
        id: 2,
        title: "Managed Offices",
        image: office5,
        filter: "managed",
    },
    {
        id: 3,
        title: "Enterprise Solutions",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
        filter: "enterprise",
    },
    {
        id: 4,
        title: "Day Passes",
        image: office1,
        filter: "day-pass",
    },
    {
        id: 5,
        title: "Private Offices",
        image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800",
        filter: "private",
    },
    {
        id: 6,
        title: "Built-to-Suit Offices",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
        filter: "built-to-suit",
    }
];

const WorkspaceCategories = () => {
    const navigate = useNavigate();

    // Reusable Card Component for consistency
    const CategoryCard = ({ title, image, filter, className, heightClass = "h-64" }: any) => (
        <div
            onClick={() => navigate(`/search?type=${filter}`)}
            className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 w-full ${heightClass} ${className}`}
        >
            {/* Background Image */}
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/30 transition-colors" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-wide uppercase">{title}</h3>

                <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="inline-flex items-center text-navy text-sm font-bold uppercase tracking-wider bg-white backdrop-blur-md px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                        Explore <MoveRight className="w-4 h-4 ml-2" />
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <section id="categories" className="pt-0 pb-0 bg-gray-50">
            <div className="container mx-auto px-4">

                <div className="text-center mb-0">
                    <h2 className="text-4xl font-bold text-navy">
                        Explore Workspace <span className="text-teal">Solutions</span>
                    </h2>
                    <p className="text-gray-500 mt-4">
                        Premium workspaces designed for the way you work.
                    </p>
                </div>

                {/* --- MOBILE VIEW (Grid of Icons) --- */}
                <div className="md:hidden mt-6">
                    <div className="grid grid-cols-3 gap-4">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => navigate(`/search?type=${cat.filter}`)}
                                className="flex flex-col items-center gap-2 cursor-pointer group"
                            >
                                <div className="w-full aspect-square bg-teal/10 rounded-2xl p-3 flex items-center justify-center transition-colors group-hover:bg-teal/20">
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="w-full h-full object-cover rounded-xl shadow-sm"
                                    />
                                </div>
                                <h3 className="text-[11px] font-bold text-navy text-center leading-tight">
                                    {cat.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                    {/* View All Details Button for Mobile */}
                    <div className="text-center mt-6">
                        <span className="text-teal text-sm font-semibold cursor-pointer" onClick={() => navigate('/search')}>View All Categories</span>
                    </div>
                </div>

                {/* --- DESKTOP VIEW (Bento Grid) --- */}
                <div className="hidden md:flex max-w-7xl mx-auto flex-col gap-6">

                    {/* Top Row: 3 Columns (Tall - Stacked - Tall) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Left: Co-Working (Tall) */}
                        <CategoryCard
                            title="Co-Working Spaces"
                            image="https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800"
                            filter="coworking"
                            heightClass="h-[425px] md:h-[625px]"
                        />

                        {/* Middle: Stacked (Managed + Enterprise) */}
                        <div className="flex flex-col gap-6 h-full">
                            <CategoryCard
                                title="Managed Offices"
                                image={office5}
                                filter="managed"
                                heightClass="h-[180px] md:flex-1"
                            />
                            <CategoryCard
                                title="Enterprise Solutions"
                                image="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"
                                filter="enterprise"
                                heightClass="h-[180px] md:flex-1"
                            />
                        </div>

                        {/* Right: Day Passes (Tall) */}
                        <CategoryCard
                            title="Day Passes"
                            image={office1}
                            filter="day-pass"
                            heightClass="h-[425px] md:h-[625px]"
                        />
                    </div>

                    {/* Bottom Row: 2 Columns (Wide) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CategoryCard
                            title="Private Offices"
                            image="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800"
                            filter="private"
                            heightClass="h-[200px]"
                        />
                        <CategoryCard
                            title="Built-to-Suit Offices"
                            image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"
                            filter="built-to-suit"
                            heightClass="h-[200px]"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default WorkspaceCategories;
