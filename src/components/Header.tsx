import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Workspaces", path: "#categories" },
  { label: "Contact", path: "#contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    if (isMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      setScrollbarWidth(scrollbarWidth);
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
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
          {/* Added 'ml-4 md:ml-8' to push the logo section to the right */}
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
                  className="relative text-sm font-medium text-white/90 hover:text-white transition-colors group py-2"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal transition-all duration-300 ease-out group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <Button 
                variant="ghost" 
                className="h-9 text-sm text-white/90 hover:text-white hover:bg-white/5 font-medium transition-all"
              >
                Log In
              </Button>

              <Button 
                className="h-9 text-sm bg-teal hover:bg-teal/90 text-white font-semibold rounded-full px-5 shadow-lg shadow-teal/20 hover:shadow-teal/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                Book Tour
              </Button>
            </div>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <button
            className="md:hidden relative z-50 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-navy/95 backdrop-blur-2xl md:hidden transition-all duration-500 flex flex-col justify-center items-center",
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <nav className="flex flex-col items-center gap-8 relative z-10 w-full px-8">
          {NAV_ITEMS.map((item, idx) => (
            <a
              key={item.label}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "text-2xl font-bold text-white hover:text-teal transition-all duration-300 transform",
                isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {item.label}
            </a>
          ))}

          <div 
            className={cn(
              "w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4 transition-all duration-500",
               isMenuOpen ? "scale-x-100" : "scale-x-0"
            )} 
          />

          <div 
            className={cn(
              "flex flex-col w-full max-w-xs gap-4 transition-all duration-500 delay-300",
              isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            <Button 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white h-12 text-lg rounded-xl"
            >
              Log In
            </Button>
            <Button 
              className="w-full bg-teal text-white h-12 text-lg font-bold rounded-xl shadow-xl shadow-teal/20"
            >
              Book Tour <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;