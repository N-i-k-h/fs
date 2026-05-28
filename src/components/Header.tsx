// Version: 2026-03-20_2311
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Search, Monitor, FileText, BarChart2, Phone, Building2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import ContactModal from "@/components/ContactModal";
import { useAuth } from "@/context/AuthContext";
import MarketRibbon from "@/components/MarketRibbon";
import { toast } from "sonner";

interface NavItem {
  label: string;
  path: string;
  icon: any;
  action?: string;
}

const CLIENT_NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/", icon: Home },
  { label: "ExploreSFT", path: "/search", icon: Search },
  { label: "StudioSFT", path: "#", icon: Monitor },
  { label: "RFP Platform", path: "/rfp-form", icon: FileText },
  { label: "Market Intel", path: "#", icon: BarChart2 },
  { label: "Contact", path: "#", icon: Phone, action: "contact" },
];

const BROKER_NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/broker", icon: Home },
  { label: "Dashboard", path: "/broker/dashboard", icon: Building2 },
  { label: "My Spaces", path: "/broker/spaces", icon: Building2 },
  { label: "Feature Bids", path: "/broker/feature-bids", icon: Building2 },
  { label: "Client RFPs", path: "/broker/requests", icon: FileText },
  { label: "Handshakes", path: "/broker/handshakes", icon: MessageSquare },
  { label: "Contact", path: "#", icon: Phone, action: "contact" },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Home", path: "/admin", icon: Home },
  { label: "Dashboard", path: "/admin/dashboard", icon: BarChart2 },
  { label: "Revenue", path: "/admin/payments", icon: Monitor },
  { label: "Spaces", path: "/admin/spaces", icon: Building2 },
  { label: "RFPs", path: "/admin/rfps", icon: MessageSquare },
  { label: "Feature Bids", path: "/admin/feature-bids", icon: Monitor },
  { label: "Proposals", path: "/admin/broker-proposals", icon: Building2 },
  { label: "Users", path: "/admin/users", icon: Search },
];




const Header = ({ mode }: { mode?: "client" | "broker" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isAdminAuth = localStorage.getItem("adminAuth") === "true";
  // Only use the mock admin user if no real user is logged in
  const mockAdminUser = (isAdminAuth && !user) ? { name: "Super Admin", role: "admin", email: "nikhilkashyapkn@gmail.com" } : null;
  const activeUser = user || mockAdminUser;

  const isAdminPath = location.pathname.startsWith('/admin');
  const isBrokerPath = location.pathname.startsWith('/broker');
  const isBroker = user?.role === 'broker';
  // Only use adminAuth from localStorage when no real JWT user is logged in
  const isAdmin = user ? user.role === 'admin' : isAdminAuth;
  const isBrokerMode = mode === "broker" || isBrokerPath || isAdminPath || isBroker || isAdmin;
  
  // Nav items: path takes priority, then user role
  let NAV_ITEMS = CLIENT_NAV_ITEMS;
  if (isAdminPath || isAdmin) {
    NAV_ITEMS = ADMIN_NAV_ITEMS;
  } else if (isBrokerPath || isBroker) {
    NAV_ITEMS = BROKER_NAV_ITEMS;
  }


  // Filter items for unauthenticated users
  if (!activeUser) {
    NAV_ITEMS = NAV_ITEMS.filter(item => ["Home", "Contact"].includes(item.label));
  }

  useEffect(() => {
    console.log("✅ Header v2.311 Loaded");
  }, []);

  useEffect(() => {
    if (isMenuOpen || isContactOpen) {
      const width = window.innerWidth - document.documentElement.clientWidth;
      setScrollbarWidth(width);
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${width}px`;
      if (isMenuOpen) document.body.classList.add("menu-open");
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "0px";
      setScrollbarWidth(0);
      document.body.classList.remove("menu-open");
    }
  }, [isMenuOpen, isContactOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300 px-6", isScrolled ? "bg-white py-3 shadow-md border-b border-gray-100" : "bg-white/80 backdrop-blur-md py-4 shadow-sm")}>
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group relative z-50 transition-transform active:scale-95">
            <span className="text-xl md:text-2xl font-black tracking-tight font-outfit text-navy group-hover:text-teal">
              <span className="text-teal">Xplore</span> SFT
            </span>
            {isBrokerMode && (
              <span className="text-[10px] font-black text-white p-1 bg-teal rounded-md tracking-widest leading-none">
                {isAdmin ? "ADMIN" : isBroker ? "PARTNER" : "CLIENT"}
              </span>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const content = (
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
              );
              if (item.action === "contact") {
                return (
                  <button 
                    key={item.label} 
                    onClick={() => setIsContactOpen(true)} 
                    className="text-sm font-bold transition-all hover:scale-105 text-navy hover:text-teal"
                  >
                    {content}
                  </button>
                );
              }
              return (
                <Link 
                  key={item.label} 
                  to={item.path} 
                  className="text-sm font-bold transition-all hover:scale-105 text-navy hover:text-teal"
                >
                  {content}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            {activeUser ? (
               <div className="relative" ref={profileRef}>
                 <div 
                   onClick={() => setIsProfileOpen(!isProfileOpen)} 
                   className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold cursor-pointer hover:shadow-lg transition-shadow border-2 border-gray-100"
                 >
                   {activeUser.name.charAt(0).toUpperCase()}
                 </div>
                 {isProfileOpen && (
                   <div className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                     <div className="px-4 pb-3 border-b border-gray-100">
                       <p className="text-sm font-bold text-navy truncate">{activeUser.name}</p>
                       <p className="text-xs text-gray-400 truncate">{activeUser.email}</p>
                       <span className="inline-block mt-1.5 text-[9px] font-black text-white bg-teal px-2 py-0.5 rounded-full uppercase tracking-wider">
                         {isAdmin ? "Admin" : isBroker ? "Partner" : "Client"}
                       </span>
                     </div>
                     <button
                       onClick={() => {
                         setIsProfileOpen(false);
                         navigate(isAdminPath ? '/admin' : ((isBrokerPath || isBroker) ? '/broker' : (isAdmin ? '/admin' : '/dashboard')));
                       }}
                       className="w-full text-left px-4 py-2.5 text-sm font-medium text-navy hover:bg-gray-50 transition-colors flex items-center gap-2"
                     >
                       Dashboard
                     </button>
                     <button
                       onClick={() => {
                         setIsProfileOpen(false);
                         localStorage.removeItem("adminAuth");
                         logout();
                         navigate('/');
                       }}
                       className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                     >
                       Logout
                     </button>
                   </div>
                 )}
               </div>
            ) : null}
          </div>

          <button className="md:hidden text-navy" onClick={() => setIsMenuOpen(true)}>
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
            <div className="flex flex-col gap-8 flex-1 overflow-y-auto">
               {NAV_ITEMS.map((item) => {
                 const Icon = item.icon;
                 return (
                    <Link 
                      key={item.label} 
                      to={item.path} 
                      onClick={() => {
                        if (item.action === "contact") {
                          setIsContactOpen(true);
                        }
                        setIsMenuOpen(false);
                      }} 
                      className="text-2xl font-black text-navy border-b border-gray-100 pb-2 flex items-center gap-4"
                    >
                      <Icon className="w-6 h-6 text-teal" />
                      {item.label}
                    </Link>
                 );
               })}
               
               {activeUser ? <button onClick={() => { 
                 localStorage.removeItem("adminAuth");
                 logout(); 
                 setIsMenuOpen(false); 
               }} className="text-2xl font-black text-red-500 text-left mt-auto">Logout</button> : null}
            </div>
          </div>
        </div>
      )}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Header;