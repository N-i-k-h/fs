
import { TrendingUp, Users, Clock, BarChart3 } from "lucide-react";



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
    <section className="pt-12 pb-0 md:py-24 bg-white">
      <div className="container mx-auto px-4 text-center">

        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">
            Find Your Ideal <span className="text-teal">Workspace Solution</span>
          </h2>
          <div className="w-20 h-1.5 bg-teal mx-auto rounded-full mb-6" />
        </div>


        {/* Market Statistics */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-teal/5 backdrop-blur-sm border border-teal/10 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-px flex-1 bg-teal/10 max-w-20" />
              <h3 className="text-sm uppercase tracking-widest font-bold text-teal">Market Insights</h3>
              <div className="h-px flex-1 bg-teal/10 max-w-20" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {marketStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-4 border border-teal/10 hover:border-teal/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal/5">
                  <stat.icon className="w-6 h-6 text-teal mx-auto mb-2" />
                  <p className="text-xs text-navy/40 uppercase tracking-wide font-semibold mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-navy mb-0.5">{stat.value}</p>
                  <p className="text-[10px] text-navy/30 font-medium">{stat.subtext}</p>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Key Benefits Highlight */}
        <div className="mt-16 max-w-4xl mx-auto hidden md:block">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-teal/5 backdrop-blur-sm border border-teal/10 rounded-xl p-6 text-left hover:border-teal/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h4 className="text-navy font-bold mb-2">Direct Landlord Access</h4>
                  <p className="text-navy/60 text-sm leading-relaxed">
                    Connect directly with property owners. No middlemen, no hidden fees—just transparent, faster negotiations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-teal/5 backdrop-blur-sm border border-teal/10 rounded-xl p-6 text-left hover:border-teal/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h4 className="text-navy font-bold mb-2">Smart Comparison Tools</h4>
                  <p className="text-navy/60 text-sm leading-relaxed">
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