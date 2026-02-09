

const testimonials = [
    {
        text: "Finding a 10 person workspace in North Jakarta was hassle-free. With FlickSpace, we booked in 2 days.",
        author: "Sarah Jenkins",
        role: "Product Manager"
    },
    {
        text: "FlickSpace saved us huge! We managed to get an office for half the price we were paying previously.",
        author: "Marcus Yallow",
        role: "CEO, TechFlow"
    },
    {
        text: "Creating a 20 person workspace in South Jakarta was fast. FlickSpace works!",
        author: "David Chen",
        role: "Founder, D-Studio"
    },
    {
        text: "The flexibility offered by FlickSpace is unmatched. We expanded our team effortlessly.",
        author: "Elena Rodriguez",
        role: "COO, CreativeMinds"
    },
    {
        text: "Best platform for finding short-term office rentals. The support team is also fantastic.",
        author: "James Wilson",
        role: "Freelance Designer"
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
                <div className="flex gap-8 animate-marquee pl-4">
                    {loopTestimonials.map((item, index) => (
                        <div
                            key={index}
                            className="bg-teal p-8 rounded-3xl text-white relative flex flex-col justify-between shadow-xl flex-shrink-0 w-[350px] md:w-[400px]"
                        >
                            {/* Quote Icon (Optional Decor) */}
                            <div className="text-6xl text-white/20 font-serif absolute top-4 left-6">"</div>

                            <p className="text-lg font-medium leading-relaxed mb-8 relative z-10 pt-4">
                                {item.text}
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <div>
                                    <h4 className="font-bold text-lg">{item.author}</h4>
                                    <p className="text-teal-100 text-sm">{item.role}</p>
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
