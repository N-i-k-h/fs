import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { 
  ArrowLeft, MapPin, Users, IndianRupee, CheckCircle, Car, Wifi, Coffee, 
  Phone, Calendar, User, Printer, Zap, Shield, Tv,
  X, ChevronLeft, ChevronRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { workspaces } from "@/data/workspaces"; 
import { cn } from "@/lib/utils";

// --- HELPER: AMENITY ICONS ---
const getAmenityIcon = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("wifi")) return Wifi;
  if (lower.includes("park")) return Car;
  if (lower.includes("cafe") || lower.includes("coffee") || lower.includes("food")) return Coffee;
  if (lower.includes("meet") || lower.includes("projector")) return Users; 
  if (lower.includes("print")) return Printer;
  if (lower.includes("power") || lower.includes("backup")) return Zap;
  if (lower.includes("security") || lower.includes("access")) return Shield;
  if (lower.includes("tv") || lower.includes("av")) return Tv;
  return CheckCircle; 
};

// --- COMPONENT: MAGNIFIER INSIDE LIGHTBOX ---
const MagnifierContent = ({ src }) => {
    const [zoomState, setZoomState] = useState({ show: false, x: 0, y: 0, bgX: 0, bgY: 0 });
    const magSize = 250; // Size of the lens (px)

    const handleMove = (e) => {
        const { top, left, width, height } = e.currentTarget.getBoundingClientRect();
        
        // Calculate cursor position inside the image
        const x = e.clientX - left;
        const y = e.clientY - top;

        // Calculate percentage position for the background image
        // 0% is left/top, 100% is right/bottom
        const bgX = (x / width) * 100;
        const bgY = (y / height) * 100;

        setZoomState({
            show: true,
            x: e.clientX, // Screen X for lens position
            y: e.clientY, // Screen Y for lens position
            bgX,
            bgY
        });
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <img 
                src={src} 
                className="max-w-full max-h-full object-contain cursor-crosshair shadow-2xl" 
                onMouseEnter={() => setZoomState(prev => ({ ...prev, show: true }))}
                onMouseLeave={() => setZoomState(prev => ({ ...prev, show: false }))}
                onMouseMove={handleMove}
                alt="Zoom Detail"
            />
            
            {zoomState.show && (
                <div 
                    className="fixed pointer-events-none z-[60] border-4 border-white shadow-2xl rounded-full hidden md:block"
                    style={{
                        left: `${zoomState.x}px`,
                        top: `${zoomState.y}px`,
                        width: `${magSize}px`,
                        height: `${magSize}px`,
                        // Center the lens on the mouse cursor
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        
                        // --- ZOOM MAGIC ---
                        backgroundImage: `url('${src}')`,
                        backgroundRepeat: 'no-repeat',
                        // FIX: Use a much larger percentage to guarantee zoom-in effect.
                        // If the image is large on screen, 200% might just look 1:1. 
                        // 500% ensures we are blowing up the pixels significantly.
                        backgroundSize: '500%', 
                        backgroundPosition: `${zoomState.bgX}% ${zoomState.bgY}%`
                    }}
                />
            )}
        </div>
    );
};


const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [space, setSpace] = useState(null);

  // --- LIGHTBOX STATE ---
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const foundSpace = workspaces.find((w) => w.id === parseInt(id));
    if (foundSpace) setSpace(foundSpace);
  }, [id, navigate]);

  // --- HANDLERS ---
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const nextImage = useCallback((e) => {
    e?.stopPropagation();
    if (space) setCurrentImageIndex((prev) => (prev + 1) % space.images.length);
  }, [space]);

  const prevImage = useCallback((e) => {
    e?.stopPropagation();
    if (space) setCurrentImageIndex((prev) => (prev - 1 + space.images.length) % space.images.length);
  }, [space]);

  // Keyboard Support
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);


  if (!space) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Results</span>
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* --- GALLERY GRID --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden shadow-card h-80">
                <div className="md:col-span-1 h-full cursor-pointer overflow-hidden group" onClick={() => openLightbox(0)}>
                    <img src={space.images[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                </div>
                <div className="hidden md:grid grid-rows-2 gap-2 h-full">
                    <div className="relative h-full overflow-hidden cursor-pointer group" onClick={() => openLightbox(1)}>
                        <img src={space.images[1] || space.images[0]} alt="Side 1" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                    </div>
                    <div className="relative h-full overflow-hidden cursor-pointer group" onClick={() => openLightbox(2)}>
                        <img src={space.images[2] || space.images[0]} alt="Side 2" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                        {space.images.length > 3 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                                <span className="text-white font-bold text-lg">+{space.images.length - 3} Photos</span>
                            </div>
                        )}
                    </div>
                </div>
              </div>

              {/* Title & Details */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{space.name}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 text-teal" />
                          <span>{space.address}</span>
                        </div>
                    </div>
                    <div className="bg-teal/10 text-teal px-3 py-1 rounded-full font-bold text-sm">★ {space.rating}</div>
                </div>
                <p className="mt-4 text-muted-foreground leading-relaxed">{space.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                  <div className="flex flex-col items-center p-4 bg-secondary rounded-xl">
                    <IndianRupee className="w-5 h-5 text-teal mb-1" />
                    <span className="font-bold text-foreground">₹{space.price.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Starting Price</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-secondary rounded-xl">
                    <Users className="w-5 h-5 text-teal mb-1" />
                    <span className="font-bold text-foreground">{space.seats}</span>
                    <span className="text-xs text-muted-foreground">Total Seats</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-secondary rounded-xl">
                    <CheckCircle className="w-5 h-5 text-teal mb-1" />
                    <span className="font-bold text-foreground capitalize">{space.type.replace("-", " ")}</span>
                    <span className="text-xs text-muted-foreground">Space Type</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-secondary rounded-xl">
                    <Car className="w-5 h-5 text-teal mb-1" />
                    <span className="font-bold text-foreground">{space.parking}+</span>
                    <span className="text-xs text-muted-foreground">Parking Spots</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-teal rounded-full"></span>Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {space.amenities.map((amenity) => {
                    const IconComp = getAmenityIcon(amenity);
                    return (
                        <div key={amenity} className="flex items-center gap-3 p-3 bg-secondary rounded-xl border border-border/50">
                          <IconComp className="w-5 h-5 text-teal" />
                          <span className="text-sm font-medium text-foreground">{amenity}</span>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-teal rounded-full"></span>Location Map</h2>
                <div className="h-64 bg-secondary rounded-xl flex items-center justify-center border border-border overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-20" alt="map bg" />
                  <div className="text-center text-muted-foreground relative z-10 bg-white/80 p-4 rounded-xl backdrop-blur-sm">
                    <MapPin className="w-10 h-10 mx-auto mb-2 text-teal" />
                    <p className="font-semibold text-navy">{space.address}</p>
                    <Button variant="link" className="text-teal mt-2 h-auto p-0">View on Google Maps</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column – Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1"><span className="text-3xl font-bold text-teal">₹{space.price.toLocaleString()}</span><span className="text-muted-foreground">/mo</span></div>
                  <p className="text-sm text-muted-foreground mt-1">Ref ID: FLICK-{space.id}0{space.id}</p>
                </div>
                <div className="space-y-3">
                  <Button variant="teal" className="w-full h-12 font-semibold text-base shadow-lg shadow-teal/20"><Calendar className="w-5 h-5 mr-2" />Schedule Tour</Button>
                  <Button variant="outline" className="w-full h-12 font-semibold border-border hover:bg-secondary"><Phone className="w-5 h-5 mr-2" />Request Callback</Button>
                  <Button variant="outline" className="w-full h-12 font-semibold border-border hover:bg-secondary"><User className="w-5 h-5 mr-2" />Contact {space.operator}</Button>
                </div>
                <div className="mt-6 p-4 bg-teal/5 rounded-xl border border-teal/10">
                    <h4 className="text-sm font-bold text-navy mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-teal" />FlickSpace Guarantee</h4>
                    <p className="text-xs text-muted-foreground">Best price guaranteed. Verified listing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- LIGHTBOX OVERLAY --- */}
      {lightboxOpen && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
            onClick={closeLightbox}
        >
            {/* Nav Controls */}
            <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="absolute top-4 right-4 bg-white/10 hover:bg-red-500/80 transition-colors p-2 rounded-full text-white z-50">
                <X className="w-6 h-6" />
            </button>
            <button onClick={prevImage} className="absolute left-4 p-3 bg-white/10 hover:bg-teal transition-colors rounded-full text-white z-50">
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={nextImage} className="absolute right-4 p-3 bg-white/10 hover:bg-teal transition-colors rounded-full text-white z-50">
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Container for Magnifier */}
            <div className="relative w-[90vw] h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <MagnifierContent src={space.images[currentImageIndex]} />
            </div>

            <div className="absolute bottom-6 bg-black/50 px-4 py-2 rounded-full text-white text-sm backdrop-blur-md">
                {currentImageIndex + 1} / {space.images.length}
            </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SpaceDetail;