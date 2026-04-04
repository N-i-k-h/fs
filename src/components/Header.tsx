// Version: 2026-03-20_2311
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ContactModal from "@/components/ContactModal";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface NavItem {
  label: string;
  path: string;
  action?: string;
}

const CLIENT_NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Contact", path: "#", action: "contact" },
];

const BROKER_NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Register Office", path: "/broker/submit-property" },
];

const Header = ({ mode }: { mode?: "client" | "broker" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const isBrokerPath = location.pathname.startsWith('/broker') || location.pathname.startsWith('/admin');
  const isBrokerMode = mode === "broker" || isBrokerPath;
  const NAV_ITEMS = isBrokerMode ? BROKER_NAV_ITEMS : CLIENT_NAV_ITEMS;

  useEffect(() => {
    console.log("✅ Header v2.311 Loaded");
  }, []);

  useEffect(() => {
    if (isMenuOpen || isContactOpen) {
      const width = window.innerWidth - document.documentElement.clientWidth;
      setScrollbarWidth(width);
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${width}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "0px";
      setScrollbarWidth(0);
    }
  }, [isMenuOpen, isContactOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300 px-6", isBrokerMode ? "bg-teal py-4 shadow-md" : (isScrolled ? "bg-white py-3 shadow-md border-b border-gray-100" : "bg-white/80 backdrop-blur-md py-4 shadow-sm"))}>
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group relative z-50 transition-transform active:scale-95">
            <span className={cn("text-xl md:text-2xl font-black tracking-tight font-outfit", isBrokerMode ? "text-white" : "text-navy group-hover:text-teal")}>
              <span className="text-teal">Xplore</span> SFT
            </span>
            {isBrokerMode && <span className="text-[10px] font-black text-teal p-1 bg-white rounded-md tracking-widest leading-none">PARTNER</span>}
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              if (item.action === "contact") {
                return <button key={item.label} onClick={() => setIsContactOpen(true)} className={cn("text-sm font-bold transition-all hover:scale-105", isBrokerMode ? "text-white/90 hover:text-white" : "text-navy hover:text-teal")}>{item.label}</button>;
              }
              return <Link key={item.label} to={item.path} className={cn("text-sm font-bold transition-all hover:scale-105", isBrokerMode ? "text-white/90 hover:text-white" : "text-navy hover:text-teal")}>{item.label}</Link>;
            })}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
               <div className="flex items-center gap-3">
                 <span className={cn("text-xs font-black", isBrokerMode ? "text-white" : "text-navy")}>{user.name}</span>
                 <div onClick={() => navigate(user.role === 'admin' ? '/admin' : (user.role === 'broker' ? '/broker' : '/dashboard'))} className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold cursor-pointer hover:shadow-lg transition-shadow border-2 border-white">{user.name.charAt(0).toUpperCase()}</div>
               </div>
            ) : (
               <Link to="/login" className={cn("text-sm font-bold px-6 py-2 rounded-xl transition-all", isBrokerMode ? "bg-white text-teal hover:bg-teal-50" : "bg-teal text-white hover:bg-navy shadow-lg shadow-teal/20")}>Login</Link>
            )}
          </div>

          <button className={cn("md:hidden", isBrokerMode ? "text-white" : "text-navy")} onClick={() => setIsMenuOpen(true)}>
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white animate-in slide-in-from-right duration-500">
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-12">
               <span className="text-2xl font-black font-outfit text-navy">
                  <span className="text-teal">Xplore</span> SFT
               </span>
               <button onClick={() => setIsMenuOpen(false)}><X className="w-8 h-8" /></button>
            </div>
            <div className="flex flex-col gap-8 flex-1">
               {NAV_ITEMS.map((item) => (
                 <Link key={item.label} to={item.path} onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-navy border-b border-gray-100 pb-2">{item.label}</Link>
               ))}
               {user ? <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-2xl font-black text-red-500 text-left mt-auto">Logout</button> : <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-teal mt-auto">Login</Link>}
            </div>
          </div>
        </div>
      )}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Header;