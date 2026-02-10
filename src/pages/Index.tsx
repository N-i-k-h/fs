import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
// import SearchSection from "@/components/SearchSection"; 
import FeaturedSpaces from "@/components/FeaturedSpaces";
import WorkspaceCategories from "@/components/WorkspaceCategories";
import HowItWorks from "@/components/HowItWorks";
import Industries from "@/components/Industries";
import ContactSection from "@/components/ContactSection";
import Testimonials from "@/components/Testimonials";
// import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";
import SearchDirectly from "@/components/SearchDirectly";
import OurRegions from "@/components/OurRegions";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main>
        {/* 1. Hero Section Includes Search */}
        <HeroSection />

        {/* 2. Structured Search Directly (Overlapping Hero) */}
        <SearchDirectly />

        {/* 2.5. Our Regions */}
        <OurRegions />

        {/* 3. Workspace Categories (Solutions) */}
        <div className="relative z-10">
          <WorkspaceCategories />
        </div>

        {/* 3. Featured Individual Spaces */}
        <FeaturedSpaces />

        {/* 4. Streamline Process */}
        <HowItWorks />

        {/* 5. Industries We Serve */}
        <Industries />

        {/* 6. Contact & Testimonials */}
        <ContactSection />
        <Testimonials />

      </main>
      <Footer />
    </div>
  );
};

export default Index;