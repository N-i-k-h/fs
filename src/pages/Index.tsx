import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedSpaces from "@/components/FeaturedSpaces";
import WorkspaceCategories from "@/components/WorkspaceCategories";
import HowItWorks from "@/components/HowItWorks";
import Industries from "@/components/Industries";
import ContactSection from "@/components/ContactSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import SearchDirectly from "@/components/SearchDirectly";
import OurRegions from "@/components/OurRegions";
import PartnerBenefits from "@/components/PartnerBenefits";
import BrokerHowItWorks from "@/components/BrokerHowItWorks";
import BrokerLiveRequests from "@/components/BrokerLiveRequests";
import BrokerStats from "@/components/BrokerStats";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<"client" | "broker">(() => {
    const saved = localStorage.getItem("flickspace_mode") as "client" | "broker";
    return saved || "client";
  });
  const navigate = useNavigate();

  // Sync mode with user role on login
  useEffect(() => {
    if (user?.role === 'broker' || user?.role === 'admin') {
      setMode('broker');
      localStorage.setItem("flickspace_mode", "broker");
    }
  }, [user]);

  // Persist mode choice
  const handleSetMode = (newMode: "client" | "broker") => {
    setMode(newMode);
    localStorage.setItem("flickspace_mode", newMode);

    // If toggling to broker and not logged in as broker, go to login
    if (newMode === 'broker' && (!user || (user.role !== 'broker' && user.role !== 'admin'))) {
      navigate('/broker/login');
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header mode={mode} />
      <main>
        {/* Hero Section */}
        <HeroSection mode={mode} setMode={handleSetMode} />

        {mode === "client" ? (
          <>
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
          </>
        ) : (
          <div className="animate-in fade-in duration-1000">
            {/* Live Feed from Corporate Clients */}
            <BrokerLiveRequests />

            {/* Stats Checkpoint */}
            <BrokerStats />

            {/* Broker Specific Sections */}
            <WorkspaceCategories />
            <PartnerBenefits />
            <BrokerHowItWorks />

            {/* Final CTA for Brokers */}
            <section className="py-24 bg-white">
              <div className="container mx-auto px-6">
                <div className="bg-navy rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
                  {/* Background Accents */}
                  <div className="absolute top-0 left-0 w-96 h-96 bg-teal/10 rounded-full blur-[100px] -ml-40 -mt-40" />
                  <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mb-40" />

                  <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to grow your <span className="text-teal">occupancy?</span></h2>
                    <p className="text-xl text-gray-300 mb-12">Join 5,000+ landlords and workspace operators closing deals directly with high-intent corporate clients.</p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                      <Button
                        onClick={() => navigate("/broker/register")}
                        className="bg-teal hover:bg-teal/90 text-white font-bold h-16 px-12 rounded-2xl text-lg shadow-xl shadow-teal/20 transform hover:scale-105 transition-all"
                      >
                        Register for Free <MoveRight className="ml-2 w-6 h-6" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/broker/login")}
                        className="bg-white/10 border-white/20 text-white font-bold h-16 px-12 rounded-2xl text-lg hover:bg-white/20 backdrop-blur-sm"
                      >
                        Partner Login
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 6. Contact & Testimonials */}
        <ContactSection />
        <Testimonials />

      </main>
      <Footer />
    </div>
  );
};

export default Index;