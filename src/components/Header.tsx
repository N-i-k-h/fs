import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import ContactModal from "@/components/ContactModal";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Workspaces", path: "/#categories" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Contact", path: "#", action: "contact" },
];

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

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

  return (
    <>
      <header
        style={{ paddingRight: isMenuOpen ? `${scrollbarWidth}px` : "0px" }}
        className={cn(
          "fixed inset-x-0 top-0 z-30",
          "bg-navy/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-navy/20",
          "py-2"
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">

          {/* --- LOGO SECTION --- */}
          <a href="/" className="flex items-center gap-3 group relative z-50 ml-4 md:ml-12">
            <div className="relative group-hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-teal/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src={logo}
                alt="FlickSpace Logo"
                className="h-8 md:h-9 w-auto object-contain relative z-10"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold tracking-tight leading-none">
                <span className="text-white">Flick</span>
                <span className="text-teal">Space</span>
              </span>
            </div>
          </a>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-10">
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
                  className="relative text-sm font-medium text-white/90 hover:text-white transition-colors group py-2 cursor-pointer"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal transition-all duration-300 ease-out group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end mr-2 hidden lg:flex">
                    <span className="text-sm font-medium text-white">{user.name}</span>
                    <span className="text-xs text-teal/80 capitalize">{user.role}</span>
                  </div>
                  <div className="relative group">
                    <div
                      className="w-10 h-10 rounded-full bg-teal/20 border border-teal/50 flex items-center justify-center overflow-hidden transition-all group-hover:border-teal cursor-pointer"
                      onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-teal font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    {/* Hover Dropdown for Logout */}
                    <div className="absolute top-12 right-0 bg-navy p-2 rounded-md shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pt-2">
                      <button
                        onClick={logout}
                        className="text-xs text-white whitespace-nowrap hover:text-red-400 px-2 py-1"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="h-9 text-sm text-white/90 hover:text-white hover:bg-white/5 font-medium transition-all"
                  >
                    Log In
                  </Button>
                </Link>
              )}

              <Link to="/search">
                <Button
                  className="h-9 text-sm bg-teal hover:bg-teal/90 text-white font-semibold rounded-full px-5 shadow-lg shadow-teal/20 hover:shadow-teal/40 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Book Tour
                </Button>
              </Link>
            </div>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button
            className="md:hidden relative z-50 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* --- MOBILE DROP-DOWN MENU --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col">

          {/* 1. Backdrop (Click to close) */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* 2. Dropdown Panel */}
          <div className="relative w-full bg-[#002b4d] text-white flex flex-col shadow-2xl animate-in slide-in-from-top duration-300 border-b border-white/10">

            {/* Header Row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-7 w-auto object-contain" />
                <span className="text-lg font-bold">
                  <span className="text-white">Flick</span><span className="text-teal">Space</span>
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white/80 hover:text-white" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 flex flex-col items-start px-6 pt-6 gap-6 pb-6">
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
                  className="text-lg font-medium text-white/90 hover:text-teal hover:pl-2 transition-all duration-200 block w-full cursor-pointer"
                >
                  {item.label}
                </a>
              ))}

              {user ? (
                <div className="border-t border-white/10 pt-4 mt-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-teal/20 border border-teal/50 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-teal font-bold">{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-xs text-white/60">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="text-lg font-medium text-red-400 hover:text-red-300 transition-all duration-200 block w-full text-left"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium text-white/90 hover:text-teal hover:pl-2 transition-all duration-200 block w-full"
                >
                  Log In
                </a>
              )}
            </div>

            {/* Bottom Button */}
            <div className="p-6 border-t border-white/10 bg-black/10">
              <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                <Button
                  className="w-full bg-teal hover:bg-teal/90 text-white font-bold text-lg h-12 rounded-lg shadow-lg"
                >
                  Book Tour
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default Header;