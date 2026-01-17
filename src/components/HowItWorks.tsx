
import { FileText, Target, Key } from "lucide-react";

const steps = [
  {
    id: "01",
    icon: FileText,
    title: "Tell Us Your Needs",
    description: "Specify size, location, and budget requirements for your ideal workspace.",
  },
  {
    id: "02",
    icon: Target,
    title: "Get Fit Matches",
    description: "Our platform identifies the best science-based matches aligned with your unique company culture and needs.",
  },
  {
    id: "03",
    icon: Key,
    title: "Book & Move In",
    description: "Book meetings directly and manage your team without hassle. Move in securely and start!",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-navy">
      <div className="container mx-auto px-4 text-center">

        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Streamline <span className="text-teal">Your Search</span>
          </h2>
          <div className="w-20 h-1.5 bg-teal mx-auto rounded-full" />
        </div>

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

      </div>
    </section>
  );
};

export default HowItWorks;