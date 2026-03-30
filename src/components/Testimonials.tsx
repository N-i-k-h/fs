
const testimonials = [
    {
        text: "Finding a 10-person workspace in Koramangala was seamless. With SFT, we were moved in within 3 days!",
        author: "Aditi Rao",
        role: "Ops Lead, TechStack"
    },
    {
        text: "SFT helped us save 40% on overheads. We found a managed office in Whitefield that fit our budget perfectly.",
        author: "Vikram Malhotra",
        role: "Director, V-Prop"
    },
    {
        text: "The flexibility offered by SFT is unmatched. We expanded our team in HSR Layout without any long-term lease stress.",
        author: "Neha Sharma",
        role: "Founder, Bloomly"
    },
    {
        text: "Best platform for finding short-term office rentals in Bangalore. The support team actually understands business needs.",
        author: "Rahul Verma",
        role: "Independent Consultant"
    }
];

const Testimonials = () => {
    // Duplicate for infinite scroll
    const loopTestimonials = [...testimonials, ...testimonials];

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4 mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-navy">
                    What our <span className="text-teal">clients say</span>
                </h2>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="flex gap-4 md:gap-8 animate-marquee pl-4">
                    {loopTestimonials.map((item, index) => (
                        <div
                            key={index}
                            className="bg-teal p-6 md:p-8 rounded-2xl md:rounded-3xl text-white relative flex flex-col justify-between shadow-xl flex-shrink-0 w-[280px] sm:w-[350px] md:w-[400px]"
                        >
                            {/* Quote Icon (Optional Decor) */}
                            <div className="text-4xl md:text-6xl text-white/20 font-serif absolute top-2 left-4 md:top-4 md:left-6">"</div>

                            <p className="text-base md:text-lg font-medium leading-relaxed mb-6 md:mb-8 relative z-10 pt-2 md:pt-4">
                                {item.text}
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <div>
                                    <h4 className="font-bold text-base md:text-lg">{item.author}</h4>
                                    <p className="text-teal-100 text-xs md:text-sm">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
