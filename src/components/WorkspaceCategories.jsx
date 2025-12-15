import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const workspaceTypes = [
  {
    id: 1,
    title: "Private Cabin",
    description: "A fully furnished, lockable private office for your team to work without distractions.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    action: "Explore Cabins",
    filterType: "private-office"
  },
  {
    id: 2,
    title: "Dedicated Desk",
    description: "Your own fixed desk in a shared area. Leave your monitor and belongings safely.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
    action: "Explore Desks",
    filterType: "dedicated-desk"
  },
  {
    id: 3,
    title: "Hot Desk",
    description: "Flexible seating in a vibrant open workspace. Just bring your laptop and start working.",
    image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&q=80&w=800",
    action: "Find Hot Desks",
    filterType: "hot-desk"
  },
  {
    id: 4,
    title: "Meeting Rooms",
    description: "Professional conference rooms equipped with AV gear, available by the hour.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmJf686ctElZeqZ4MOidxz-VivxlU3sucLjw&s",
    action: "Book Room",
    filterType: "meeting-room"
  },
  {
    id: 5,
    title: "Event Space",
    description: "Versatile venues perfect for hosting workshops, product launches, and networking parties.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
    action: "Host Event",
    filterType: null,
    isDummy: true
  },
  {
    id: 6,
    title: "Director's Cabin",
    description: "Premium, private suites designed specifically for executives and senior leadership.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
    action: "View Suites",
    filterType: "private-office"
  }
];

const WorkspaceCategories = () => {
  const navigate = useNavigate();

  const handleExplore = (item) => {
    if (item.isDummy) {
      alert("Coming Soon! This feature is not yet available.");
    } else {
      navigate(`/search?type=${item.filterType}`);
    }
  };

  return (
    // ADDED id="categories" HERE so the Header link works
    <section id="categories" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Explore Workspace <span className="text-teal">Solutions</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Premium workspaces designed for the way you work.
          </p>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {workspaceTypes.map((type) => (
            <div 
              key={type.id} 
              onClick={() => handleExplore(type)}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
            >
              {/* Image Area */}
              <div className="h-60 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/0 transition-all duration-500 z-10" />
                <img 
                  src={type.image} 
                  alt={type.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-teal/10 rounded-lg">
                      <span className="text-teal font-bold text-xl">#</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{type.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {type.description}
                  </p>
                </div>

                <div className="mt-auto pt-4">
                  <Button 
                    className="w-full bg-white text-teal border-2 border-teal hover:bg-teal hover:text-white font-bold py-2 rounded-xl transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleExplore(type);
                    }}
                  >
                    {type.action}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WorkspaceCategories;