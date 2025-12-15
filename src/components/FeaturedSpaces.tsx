import OfficeCard from "@/components/OfficeCard";
import office1 from "@/assets/office-1.jpg";
import office2 from "@/assets/office-2.jpg";
import office3 from "@/assets/office-3.jpg";
import office4 from "@/assets/office-4.jpg";
import office5 from "@/assets/office-5.jpg";
import office6 from "@/assets/office-6.jpg";

const offices = [
  { id: "1", image: office1, name: "CoWrks RMZ Ecoworld", location: "Bellandur, Bangalore", price: 13500, seats: 55, isFeatured: true },
  { id: "2", image: office2, name: "WeWork Embassy Golf Links", location: "Koramangala, Bangalore", price: 18000, seats: 30, isFeatured: false },
  { id: "3", image: office3, name: "Smartworks Outer Ring Road", location: "HSR Layout, Bangalore", price: 12000, seats: 45, isFeatured: true },
  { id: "4", image: office4, name: "Awfis Whitefield", location: "Whitefield, Bangalore", price: 9500, seats: 20, isFeatured: false },
  { id: "5", image: office5, name: "91Springboard Indiranagar", location: "Indiranagar, Bangalore", price: 15000, seats: 35, isFeatured: false },
  { id: "6", image: office6, name: "Innov8 Brigade Road", location: "MG Road, Bangalore", price: 16500, seats: 25, isFeatured: true },
];

const FeaturedSpaces = () => {
  return (
    <section id="featured" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-teal/10 text-teal text-sm font-semibold rounded-full mb-4">
            Premium Workspaces
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Spaces
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked selection of premium coworking spaces across Bangalore
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offices.map((office) => (
            <OfficeCard key={office.id} {...office} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="h-12 px-8 rounded-lg border-2 border-teal text-teal bg-transparent hover:bg-teal hover:text-accent-foreground font-semibold transition-all duration-300">
            View All Spaces
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpaces;
