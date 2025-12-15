import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import FeaturedSpaces from "@/components/FeaturedSpaces";
import WorkspaceCategories from "@/components/WorkspaceCategories"; // Import the new component
import HowItWorks from "@/components/HowItWorks";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Optional top label */}
        <div className="text-center py-2 text-sm text-muted-foreground hidden">
          Find your perfect workspace
        </div>
        
        {/* 1. Hero Section with ChatBot & Search Bar */}
        <HeroSection />

        {/* 2. Workspace Categories (Private Cabin, Hot Desk, etc.) */}
        <WorkspaceCategories />

        {/* 3. Featured Individual Spaces */}
        <FeaturedSpaces />

        {/* 4. Process & CTA */}
        <HowItWorks />
        <CTABand />
      </main>
      <Footer />
    </div>
  );
};

export default Index;