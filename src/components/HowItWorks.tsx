import { Search, Eye, CalendarCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    id: "01",
    icon: Search,
    title: "Search & Discover",
    description: "Tell our AI what you need or use advanced filters to pinpoint your ideal location and budget.",
  },
  {
    id: "02",
    icon: Eye,
    title: "View Details",
    description: "Browse immersive photos, check amenities, and compare pricing with complete transparency.",
  },
  {
    id: "03",
    icon: CalendarCheck,
    title: "Book & Move In",
    description: "Schedule a tour instantly or request a callback to finalize the deal. It's that simple.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block py-1 px-3 rounded-full bg-teal/10 text-teal text-sm font-bold tracking-wide uppercase mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy mb-6 tracking-tight">
            Your Workspace in <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy to-teal">3 Steps</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            We've stripped away the complexity. From browsing to booking, experience a seamless journey to your new office.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-gray-200 via-teal/30 to-gray-200 -translate-y-1/2 z-0 dashed-line" />

          {steps.map((step, index) => (
            <div 
              key={index} 
              className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-teal/10 transition-all duration-500 hover:-translate-y-2 z-10"
            >
              {/* Large Background Number */}
              <div className="absolute -top-6 -right-6 text-[120px] font-black text-gray-50 group-hover:text-teal/5 transition-colors duration-500 select-none leading-none z-0">
                {step.id}
              </div>

              {/* Icon Container */}
              <div className="relative z-10 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-navy text-white flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 group-hover:bg-gradient-to-br group-hover:from-teal group-hover:to-emerald-500">
                  <step.icon className="w-9 h-9" strokeWidth={1.5} />
                </div>
                
                {/* Connector Arrow for Mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute -bottom-12 left-1/2 -translate-x-1/2 text-gray-300">
                    <ArrowRight className="w-6 h-6 rotate-90" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-navy mb-3 group-hover:text-teal transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Background Decor Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-teal/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-navy/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />
    </section>
  );
};

export default HowItWorks;