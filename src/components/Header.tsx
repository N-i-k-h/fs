import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
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
  { label: "Workspaces", path: "/search" },
  { label: "Featured Space", path: "/#featured" },
  { label: "Dashboard", path: "/dashboard" },
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

  const isHomePage = location.pathname === "/";
  const isBrokerPath = location.pathname.startsWith('/broker') || location.pathname.startsWith('/admin');

  // ONLY switch to broker mode if explicitly on a broker path or if mode="broker" is passed (from toggle)
  // Stop auto-switching just because the user HAS a broker role - let them browse as a client too!
  const isBrokerMode = mode === "broker" || isBrokerPath;

  const NAV_ITEMS = isBrokerMode ? BROKER_NAV_ITEMS : CLIENT_NAV_ITEMS;

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
          isBrokerMode
            ? "bg-navy shadow-md py-4 border-b border-white/10"
            : "bg-white shadow-sm py-3 border-b border-gray-100"
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">

          {/* --- LOGO SECTION --- */}
          <Link to="/" className="flex items-center gap-2 group relative z-50">
            <div className="flex flex-col">
              <span className={cn("text-2xl font-bold tracking-tight", isBrokerMode ? "text-white" : "text-navy")}>
                SFT
              </span>
              {isBrokerMode && (
                <span className="text-[10px] font-black text-teal tracking-[0.2em] leading-none text-center">PARTNER</span>
              )}
            </div>
          </Link>

          {/* --- DESKTOP NAVIGATION (CENTERED) --- */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <nav className="flex items-center gap-8">
              {NAV_ITEMS.map((item) => {
                let path = item.path;
                if (item.label === "Dashboard" && user) {
                  if (user.role === 'admin') path = "/admin";
                  else if (user.role === 'broker') path = "/broker";
                }

                if (item.action === "contact") {
                  return (
                    <button
                      key={item.label}
                      onClick={() => setIsContactOpen(true)}
                      className={cn(
                        "relative text-sm font-medium transition-colors group py-1",
                        isBrokerMode ? "text-white/90 hover:text-white" : "text-navy hover:text-navy",
                        "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-teal after:transition-all after:duration-300 hover:after:w-full"
                      )}
                    >
                      {item.label}
                    </button>
                  );
                }

                // Make "Register Office" stand out in Broker Mode
                if (isBrokerMode && item.label === "Register Office") {
                  return (
                    <Link
                      key={item.label}
                      to={path}
                      className="bg-teal text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-teal/20 hover:scale-105 transition-all"
                      onClick={(e) => {
                        if (!user || (user.role !== 'broker' && user.role !== 'admin')) {
                          e.preventDefault();
                          toast.info("Please login to register the office.");
                          navigate("/broker/login");
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={path}
                    onClick={(e) => {
                      if (isScrolled) setIsMenuOpen(false); // Close mobile if open (though this is desktop)

                      if (isBrokerMode && (!user || user.role !== 'broker' && user.role !== 'admin') && (item.label === "Register Office" || item.label === "Request")) {
                        e.preventDefault();
                        toast.info("Please login to register or view requests.", {
                          description: "You need a partner account to access these features."
                        });
                        navigate("/broker/login");
                      }
                    }}
                    className={cn(
                      "relative text-sm font-medium transition-colors group py-1",
                      "after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-teal after:transition-all after:duration-300 hover:after:w-full",
                      isBrokerMode ? "text-white/90 hover:text-white" : "text-navy hover:text-navy"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* --- RIGHT ACTIONS (Login / List Space) --- */}
          <div className="hidden md:flex items-center gap-4">
            {user && user.name ? (
              <div className="flex items-center gap-3">
                <span className={cn("text-sm font-medium hidden lg:block", isBrokerMode ? "text-white" : "text-navy")}>
                  {user.name}
                  {user.role === 'broker' && <span className="ml-2 text-[10px] bg-teal text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Partner</span>}
                </span>
                <div
                  className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center overflow-hidden cursor-pointer border border-teal/20"
                  onClick={() => {
                    if (user.role === 'admin') navigate('/admin');
                    else if (user.role === 'broker') navigate('/broker');
                    else navigate('/dashboard');
                  }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-teal font-bold">{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to={isBrokerMode ? "/broker/login" : "/login"}
                className={cn("text-sm font-medium transition-colors", isBrokerMode ? "text-white/90 hover:text-teal" : "text-navy hover:text-teal")}
              >
                Login
              </Link>
            )}

            {/* Removed List Space Button */}
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button
            className={cn(
              "md:hidden relative z-50 w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors",
              isBrokerMode ? "text-white" : "text-navy"
            )}
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

          {/* Menu Panel - Dynamic Theme */}
          <div className={cn(
            "relative w-full h-[70vh] rounded-b-[3rem] flex flex-col animate-in slide-in-from-top duration-500 ease-out shadow-2xl overflow-hidden",
            isBrokerMode ? "bg-navy text-white" : "bg-white text-navy"
          )}>

            {/* Header: Logo & Close Button */}
            <div className="flex items-center justify-between px-8 py-6">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className={cn("text-xl font-extrabold tracking-tight", isBrokerMode ? "text-white" : "text-navy")}>
                    SFT
                  </span>
                  {isBrokerMode && <span className="text-[8px] font-black text-teal tracking-[0.2em] leading-none text-center">PARTNER</span>}
                </div>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className={cn("group p-2 rounded-full transition-colors", isBrokerMode ? "hover:bg-white/10" : "hover:bg-gray-100")}
              >
                <X className={cn("w-8 h-8 group-hover:scale-110 transition-transform", isBrokerMode ? "text-white" : "text-navy")} />
              </button>
            </div>

            {/* Navigation Links - Centered & Large */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
              {NAV_ITEMS.map((item) => {
                let path = item.path;
                if (item.label === "Dashboard" && user) {
                  if (user.role === 'admin') path = "/admin";
                  else if (user.role === 'broker') path = "/broker";
                }

                if (item.action === "contact") {
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setIsContactOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "text-2xl font-semibold hover:text-teal hover:scale-105 transition-all duration-300 relative group",
                        isBrokerMode ? "text-white" : "text-navy"
                      )}
                    >
                      {item.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={path}
                    onClick={(e) => {
                      if (isScrolled) setIsMenuOpen(false);

                      if (isBrokerMode && (!user || user.role !== 'broker' && user.role !== 'admin') && (item.label === "Register Office" || item.label === "Request")) {
                        e.preventDefault();
                        toast.info("Please login to register or view requests.", {
                          description: "You need a partner account to access these features."
                        });
                        setIsMenuOpen(false);
                        navigate("/broker/login");
                      } else {
                        setIsMenuOpen(false);
                      }
                    }}
                    className={cn(
                      "text-2xl font-semibold hover:text-teal hover:scale-105 transition-all duration-300 relative group",
                      isBrokerMode ? "text-white" : "text-navy"
                    )}
                  >
                    {item.label}
                    <span className="absolute -bottom-2 left-1/2 w-0 h-1 bg-teal -translate-x-1/2 transition-all duration-300 group-hover:w-full rounded-full"></span>
                  </Link>
                );
              })}

              {/* User / Login Section */}
              <div className="mt-8 flex flex-col items-center gap-6">
                {user ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 border-teal/20",
                      isBrokerMode ? "bg-white/10" : "bg-teal/10"
                    )}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-teal">{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="text-center">
                      <p className={cn("text-lg font-bold", isBrokerMode ? "text-white" : "text-navy")}>{user.name}</p>
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
                      href={isBrokerMode ? "/broker/login" : "/login"}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-xl font-medium text-navy/70 hover:text-teal transition-colors"
                    >
                      Log In
                    </a>
                  </div>
                )}

                {!isBrokerMode && (
                  <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-teal hover:bg-teal/90 text-white font-bold text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                      Find Your Space
                    </Button>
                  </Link>
                )}
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