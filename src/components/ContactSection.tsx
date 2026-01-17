import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle } from "lucide-react";

const ContactSection = () => {
    return (
        <section className="py-20 bg-navy">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Get in <span className="text-teal">Touch</span>
                    </h2>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Apply to find your next office on this journey here and our consultants will reach out within 2 hours.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <Input placeholder="Full Name" className="h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <Input placeholder="Email Address" type="email" className="h-12 bg-gray-50 border-gray-100 focus:bg-white transition-colors rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <Textarea placeholder="Message / Requirements" className="min-h-[150px] bg-gray-50 border-gray-100 focus:bg-white transition-colors rounded-lg resize-none" />
                            </div>

                            <Button className="w-full h-12 bg-navy hover:bg-navy-light text-white font-bold rounded-lg shadow-lg">
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* Contact Details */}
                    <div className="lg:pl-12 pt-4">

                        {/* Mobile: Row of Icons */}
                        <div className="flex md:hidden items-center justify-between gap-4">
                            <a href="mailto:info@flickspace.com" className="flex flex-col items-center gap-2 group">
                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-teal shadow-md group-hover:scale-110 transition-transform">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <span className="text-white text-xs font-medium">Email</span>
                            </a>
                            <a href="https://wa.me/15551234567" className="flex flex-col items-center gap-2 group">
                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-teal shadow-md group-hover:scale-110 transition-transform">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <span className="text-white text-xs font-medium">WhatsApp</span>
                            </a>
                            <a href="tel:+15559876543" className="flex flex-col items-center gap-2 group">
                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-teal shadow-md group-hover:scale-110 transition-transform">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <span className="text-white text-xs font-medium">Call</span>
                            </a>
                        </div>

                        {/* Desktop: Detailed List */}
                        <div className="hidden md:block space-y-8">
                            {/* Email */}
                            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy text-lg">Email</h3>
                                    <p className="text-gray-500">info@flickspace.com</p>
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy text-lg">WhatsApp</h3>
                                    <p className="text-gray-500">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-navy text-lg">Phone Call</h3>
                                    <p className="text-gray-500">+1 (555) 987-6543</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;
