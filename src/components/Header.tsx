import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import ContactModal from "@/components/ContactModal";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Workspaces", path: "/search" },
  { label: "Featured Space", path: "/#featured" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Contact", path: "#", action: "contact" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === "/";

  // --- Handle Scrollbar Jump & Body Lock ---
  useEffect(() => {
    if (isMenuOpen) {
      const width = window.innerWidth - document.documentElement.clientWidth;
      setScrollbarWidth(width);
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${width}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "0px";
      setScrollbarWidth(0);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "0px";
    };
  }, [isMenuOpen]);

  // --- Handle Scroll Detection ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // Trigger earlier
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        style={{ paddingRight: isMenuOpen ? `${scrollbarWidth}px` : "0px" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isHomePage
            ? "bg-white shadow-sm py-3 border-b border-gray-100"
            : "bg-white shadow-sm py-3 border-b border-gray-100"
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">

          {/* --- LOGO SECTION --- */}
          <a href="/" className="flex items-center gap-2 group relative z-50">
            <div className="flex flex-col">
              <span className={cn("text-2xl font-bold tracking-tight", isHomePage && !isScrolled ? "text-navy" : "text-navy")}>
                Flick<span className="text-teal">Space</span>
              </span>
            </div>
          </a>

          {/* --- DESKTOP NAVIGATION (CENTERED) --- */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <nav className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => {
                    if (item.action === "contact") {
                      e.preventDefault();
                      setIsContactOpen(true);
                    }
                  }}
                  className={cn(
                    "relative text-sm font-medium transition-colors group py-1",
                    "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#00C2FF] after:transition-all after:duration-300 hover:after:w-full",
                    isHomePage && !isScrolled ? "text-navy hover:text-navy" : "text-navy hover:text-navy" // Changed text color to mostly stay navy, as underlining is now the main effect
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* --- RIGHT ACTIONS (Login / List Space) --- */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className={cn("text-sm font-medium hidden lg:block", isHomePage && !isScrolled ? "text-navy" : "text-navy")}>{user.name}</span>
                <div
                  className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-teal font-bold">{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login" className={cn("text-sm font-medium transition-colors", isHomePage && !isScrolled ? "text-navy hover:text-teal" : "text-navy hover:text-teal")}>
                Login
              </Link>
            )}

            <Link to="/list-space">
              <Button
                className="bg-teal hover:bg-teal/90 text-white font-bold rounded-md px-6 shadow-md transition-all"
              >
                List Space
              </Button>
            </Link>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button
            className="md:hidden relative z-50 w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-navy"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* --- MOBILE DROP-DOWN MENU --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel - White, Clean, Centered */}
          <div className="relative w-full h-[70vh] rounded-b-[3rem] bg-white text-navy flex flex-col animate-in slide-in-from-top duration-500 ease-out shadow-2xl overflow-hidden">

            {/* Header: Logo & Close Button */}
            <div className="flex items-center justify-between px-8 py-6">
              <a href="/" className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                <span className="text-xl font-extrabold tracking-tight">
                  <span className="text-navy">Flick</span><span className="text-teal">Space</span>
                </span>
              </a>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="group p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-8 h-8 text-navy group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Navigation Links - Centered & Large */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => {
                    if (item.action === "contact") {
                      e.preventDefault();
                      setIsContactOpen(true);
                    }
                    setIsMenuOpen(false);
                  }}
                  className="text-2xl font-semibold text-navy hover:text-teal hover:scale-105 transition-all duration-300 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-2 left-1/2 w-0 h-1 bg-teal -translate-x-1/2 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              ))}

              {/* User / Login Section */}
              <div className="mt-8 flex flex-col items-center gap-6">
                {user ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center overflow-hidden border-2 border-teal/20">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-teal">{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-navy">{user.name}</p>
                      <button
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="text-sm text-red-500 hover:text-red-600 font-medium mt-1"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <a
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xl font-medium text-navy/70 hover:text-teal transition-colors"
                    >
                      Log In
                    </a>
                  </div>
                )}

                <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-teal hover:bg-teal/90 text-white font-bold text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    Find Your Space
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative Footer Element (Optional) */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-teal via-blue-500 to-teal opacity-50"></div>
          </div>
        </div>
      )}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Header;