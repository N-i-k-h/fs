
import { FileText, Target, Key, TrendingUp, Users, Clock, BarChart3 } from "lucide-react";

const steps = [
  {
    id: "01",
    icon: FileText,
    title: "Define Your Requirements",
    description: "Specify your workspace needs with precision—team size, location preferences, and budget parameters. Our platform analyzes your requirements to identify optimal solutions.",
  },
  {
    id: "02",
    icon: Target,
    title: "Connect Directly with Landlords",
    description: "Skip intermediaries and connect directly with property owners. Faster decisions, transparent pricing, and direct negotiations for your ideal workspace solution.",
  },
  {
    id: "03",
    icon: Key,
    title: "Compare & Decide",
    description: "Save properties to your wishlist for side-by-side comparison. Analyze costs, evaluate cashflow impact, and make data-driven decisions with confidence.",
  },
];

const marketStats = [
  {
    icon: BarChart3,
    label: "Avg. Rent/Seat",
    value: "₹8,500",
    subtext: "Market Average"
  },
  {
    icon: TrendingUp,
    label: "Escalation",
    value: "~6%",
    subtext: "Annual Increase"
  },
  {
    icon: Clock,
    label: "Lock-in Period",
    value: "24 Months",
    subtext: "Typical Duration"
  },
  {
    icon: Users,
    label: "Avg. Tenure",
    value: "3 Years",
    subtext: "Client Retention"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-navy">
      <div className="container mx-auto px-4 text-center">

        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Ideal <span className="text-teal">Workspace Solution</span>
          </h2>
          <div className="w-20 h-1.5 bg-teal mx-auto rounded-full mb-6" />
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Make informed decisions with transparent market data, direct landlord connections, and powerful comparison tools.
            We help you find the perfect workspace—not just browse listings.
          </p>
        </div>

        {/* Market Statistics */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-px flex-1 bg-white/10 max-w-20" />
              <h3 className="text-sm uppercase tracking-widest font-bold text-teal">Market Insights</h3>
              <div className="h-px flex-1 bg-white/10 max-w-20" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {marketStats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-teal/50 transition-all duration-300 hover:bg-white/10">
                  <stat.icon className="w-6 h-6 text-teal mx-auto mb-2" />
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mb-0.5">{stat.value}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{stat.subtext}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible gap-8 md:gap-12 max-w-6xl mx-auto pb-8 md:pb-0 snap-x snap-mandatory px-4 md:px-0 -mx-4 md:mx-auto no-scrollbar">
          {steps.map((step, index) => (
            <div key={index} className="flex-none w-[85vw] md:w-auto flex flex-col items-center snap-center">

              {/* Icon / Number Combo */}
              <div className="relative mb-8">
                <span className="absolute -top-6 -right-8 text-8xl font-black text-white/5 z-0 select-none">
                  {step.id}
                </span>
                <div className="relative z-10 w-20 h-20 bg-teal rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal/20">
                  <step.icon className="w-10 h-10" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

            </div>
          ))}
        </div>

        {/* Key Benefits Highlight */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-teal/10 backdrop-blur-sm border border-teal/20 rounded-xl p-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Direct Landlord Access</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Connect directly with property owners. No middlemen, no hidden fees—just transparent, faster negotiations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-teal/10 backdrop-blur-sm border border-teal/20 rounded-xl p-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Smart Comparison Tools</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Save properties to your wishlist. Compare costs, analyze cashflow impact, and make informed decisions backed by data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;