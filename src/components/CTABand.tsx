import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const CTABand = () => {
  return (
    <section id="contact" className="py-16 bg-navy">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-h2 text-primary-foreground mb-3">
            Ready to find your space?
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Join hundreds of businesses that found their perfect workspace through FlickSpace
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              Start Your Search
            </Button>
            <Button variant="whatsapp" size="lg" className="gap-2">
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABand;
