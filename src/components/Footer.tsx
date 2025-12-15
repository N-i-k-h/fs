import logo from "@/assets/logo.png"; // Ensure this path matches your file
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-navy pt-16 pb-8 text-white">
      <div className="container mx-auto px-6">
        
        {/* --- Top Section: 4 Columns --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand & About */}
          <div className="space-y-4">
            <a href="/" className="flex items-center gap-2 group">
              <img 
                src={logo} 
                alt="FlickSpace" 
                className="h-10 w-auto object-contain" 
              />
              <span className="text-2xl font-bold tracking-tight">
                Flick<span className="text-teal">Space</span>
              </span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed">
              Redefining how you work. Find the perfect workspace that matches your vibe, budget, and goals.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon icon={<Facebook className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Instagram className="w-5 h-5" />} href="#" />
              <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
            </div>
          </div>

          {/* 2. Company Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><FooterLink href="#">About Us</FooterLink></li>
              <li><FooterLink href="#">Careers</FooterLink></li>
              <li><FooterLink href="#">Press</FooterLink></li>
              <li><FooterLink href="#">Blog</FooterLink></li>
              <li><FooterLink href="#">Partners</FooterLink></li>
            </ul>
          </div>

          {/* 3. Explore Spaces */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Workspaces</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><FooterLink href="#">Private Cabins</FooterLink></li>
              <li><FooterLink href="#">Dedicated Desks</FooterLink></li>
              <li><FooterLink href="#">Meeting Rooms</FooterLink></li>
              <li><FooterLink href="#">Virtual Offices</FooterLink></li>
              <li><FooterLink href="#">Day Passes</FooterLink></li>
            </ul>
          </div>

          {/* 4. Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm text-gray-400 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal shrink-0" />
                <span>123 Startup Avenue, Indiranagar,<br/>Bangalore, India 560038</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal shrink-0" />
                <a href="mailto:hello@flickspace.com" className="hover:text-white transition-colors">hello@flickspace.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
            </ul>
          </div>

        </div>

        {/* --- Divider --- */}
        <div className="border-t border-white/10 my-8" />

        {/* --- Bottom Section --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2024 FlickSpace. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-teal transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-teal transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-teal transition-colors">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

// Helper Component for Links
const FooterLink = ({ href, children }) => (
  <a href={href} className="hover:text-teal transition-colors flex items-center gap-1 group">
    {children}
  </a>
);

// Helper Component for Social Icons
const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-teal hover:text-white transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;