import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft, MapPin, Users, IndianRupee, CheckCircle, Car, Wifi, Coffee,
  Phone, Calendar, User, Printer, Zap, Shield, Tv,
  X, ChevronLeft, ChevronRight, Heart
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import ContactModal from "@/components/ContactModal";
import axios from "axios";
import { toast } from "sonner";

// --- HELPER: AMENITY ICONS ---
const getAmenityIcon = (name: string) => {
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
import mapPlaceholder from "@/assets/map-placeholder.png";

// --- COMPONENT: MAGNIFIER INSIDE LIGHTBOX ---
const MagnifierContent = ({ src }: { src: string }) => {
  const [zoomState, setZoomState] = useState({ show: false, x: 0, y: 0, bgX: 0, bgY: 0 });
  const magSize = 200;

  const updateMagnifier = (clientX: number, clientY: number, currentTarget: EventTarget & HTMLDivElement) => {
    const { top, left, width, height } = currentTarget.getBoundingClientRect();

    if (clientX < left || clientX > left + width || clientY < top || clientY > top + height) {
      setZoomState(prev => ({ ...prev, show: false }));
      return;
    }

    const x = clientX - left;
    const y = clientY - top;
    const bgX = (x / width) * 100;
    const bgY = (y / height) * 100;

    setZoomState({
      show: true,
      x: clientX,
      y: clientY,
      bgX,
      bgY
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => updateMagnifier(e.clientX, e.clientY, e.currentTarget);
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    updateMagnifier(touch.clientX, touch.clientY, e.currentTarget);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={src}
        className="max-w-full max-h-full object-contain cursor-crosshair shadow-2xl touch-none select-none"
        onMouseEnter={() => setZoomState(prev => ({ ...prev, show: true }))}
        onMouseLeave={() => setZoomState(prev => ({ ...prev, show: false }))}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => handleTouchMove(e)}
        onTouchMove={(e) => handleTouchMove(e)}
        onTouchEnd={() => setZoomState(prev => ({ ...prev, show: false }))}
        alt="Zoom Detail"
        draggable={false}
      />

      {zoomState.show && (
        <div
          className="fixed pointer-events-none z-[70] border-4 border-white shadow-2xl rounded-full"
          style={{
            left: `${zoomState.x}px`,
            top: `${zoomState.y}px`,
            width: `${magSize}px`,
            height: `${magSize}px`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            backgroundImage: `url('${src}')`,
            backgroundRepeat: 'no-repeat',
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
  const [space, setSpace] = useState<any>(null);

  // --- LIGHTBOX STATE ---
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTourForm, setShowTourForm] = useState(false);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const fetchSpace = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/spaces/${id}`);
        setSpace(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load space details");
      }
    };
    fetchSpace();
  }, [id]);

  // --- SAVE LOGIC ---
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    if (!id) return;
    const savedIds = JSON.parse(localStorage.getItem("savedSpaces") || "[]");
    setIsSaved(savedIds.includes(String(id)) || savedIds.includes(Number(id)));
  }, [id]);

  const toggleSave = () => {
    const savedIds = JSON.parse(localStorage.getItem("savedSpaces") || "[]");
    const strId = String(id);
    const numId = Number(id);

    let newSavedIds;
    if (isSaved) {
      newSavedIds = savedIds.filter((sid: any) => String(sid) !== strId && Number(sid) !== numId);
    } else {
      newSavedIds = [...savedIds, id];
    }

    localStorage.setItem("savedSpaces", JSON.stringify(newSavedIds));
    setIsSaved(!isSaved);
    window.dispatchEvent(new Event('savedSpacesUpdated'));
  };

  // --- HANDLERS ---
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const nextImage = useCallback((e?: any) => {
    e?.stopPropagation();
    if (space) setCurrentImageIndex((prev) => (prev + 1) % space.images.length);
  }, [space]);

  const prevImage = useCallback((e?: any) => {
    e?.stopPropagation();
    if (space) setCurrentImageIndex((prev) => (prev - 1 + space.images.length) % space.images.length);
  }, [space]);

  const selectImage = (index: number, e: any) => {
    e?.stopPropagation();
    setCurrentImageIndex(index);
  }

  // Keyboard Support
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);


  if (!space) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  const displayAddress = space.address || `${space.location}, ${space.city}`;
  const mapImage = mapPlaceholder;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress + " " + space.name)}`;

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

              {/* --- NEW GALLERY (MAIN + THUMBNAILS) --- */}
              <div className="space-y-4">
                {/* Main Large Image */}
                <div
                  className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-card cursor-pointer border border-border/50 group"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={space.images[currentImageIndex]}
                    alt="Main View"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />

                  {/* Inline Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-teal text-white backdrop-blur-sm border border-white/20 transition-all opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-teal text-white backdrop-blur-sm border border-white/20 transition-all opacity-0 group-hover:opacity-100 translate-x-[10px] group-hover:translate-x-0"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Thumbnails Row */}
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {space.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      onClick={(e) => selectImage(idx, e)}
                      className={cn(
                        "relative min-w-[100px] h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:scale-105 shadow-sm",
                        currentImageIndex === idx ? "border-teal opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Title & Details */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                      {space.name}
                      <button
                        onClick={toggleSave}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isSaved
                          ? "bg-red-50 border-red-200 text-red-500"
                          : "bg-background border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-teal" />
                      <span>{space.address}</span>
                    </div>
                  </div>
                  <div className="bg-teal/10 text-teal px-3 py-1 rounded-full font-bold text-sm shrink-0">★ {space.rating}</div>
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
                    <span className="font-bold text-foreground">Coming Soon</span>
                    <span className="text-xs text-muted-foreground">Parking</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-teal rounded-full"></span>Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {space.amenities.map((amenity: string) => {
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

                <div className="h-64 bg-secondary rounded-xl overflow-hidden relative mb-5 border border-border group">
                  <img src={mapImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="map bg" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors">
                    <div className="bg-white/90 p-3 rounded-full shadow-lg backdrop-blur-sm">
                      <MapPin className="w-8 h-8 text-teal fill-teal/20" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-xl border border-border/50">
                    <MapPin className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-foreground leading-relaxed">{displayAddress}</span>
                  </div>

                  <Button
                    asChild
                    className="w-full h-12 text-base bg-teal hover:bg-teal/90 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                      View on Google Maps
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column – Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1"><span className="text-3xl font-bold text-teal">₹{space.price.toLocaleString()}</span><span className="text-muted-foreground">/mo</span></div>
                  <p className="text-sm text-muted-foreground mt-1">Ref ID: FLICK-{space.id}</p>
                </div>

                {!showTourForm ? (
                  <div className="space-y-3">
                    <Button onClick={() => setShowTourForm(true)} variant="teal" className="w-full h-12 font-semibold text-base shadow-lg shadow-teal/20"><Calendar className="w-5 h-5 mr-2" />Schedule Tour</Button>
                    <Button onClick={() => setShowContact(true)} variant="outline" className="w-full h-12 font-semibold border-border hover:bg-secondary"><User className="w-5 h-5 mr-2" />Contact</Button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      // TODO: Send to backend
                      const tourData = {
                        user: formData.get("name"),
                        email: formData.get("email"),
                        phone: formData.get("phone"),
                        space: space.name,
                        spaceName: space.name, // Sending both for compatibility
                        date: formData.get("date"),
                        time: formData.get("time"),
                        seats: formData.get("seats"),
                        status: "pending",
                        type: "Tour Request"
                      };

                      try {
                        await axios.post('http://localhost:5000/api/requests/tour', tourData);
                        toast.success("Tour requested successfully! Our team will contact you shortly.");
                        setShowTourForm(false);
                      } catch (err) {
                        console.error(err);
                        toast.error("Failed to schedule tour. Please try again.");
                      }
                    }}
                    className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-navy">Book a Visit</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowTourForm(false)} className="h-8 w-8 p-0"><X className="w-4 h-4" /></Button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Name</label>
                      <input name="name" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Your Name" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <input name="email" type="email" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Phone</label>
                      <input name="phone" type="tel" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="+91 98765 43210" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Date</label>
                        <input name="date" type="date" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Time</label>
                        <input name="time" type="time" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Number of Seats</label>
                      <input name="seats" type="number" min="1" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="1" />
                    </div>

                    <Button type="submit" variant="teal" className="w-full h-12 font-semibold text-base shadow-lg shadow-teal/20 mt-2">
                      <Calendar className="w-5 h-5 mr-2" /> Confirm Booking
                    </Button>
                  </form>
                )}

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
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* 1. Main Content Area */}
          <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden p-4 pb-24" onClick={(e) => e.stopPropagation()}>
            <MagnifierContent src={space.images[currentImageIndex]} />
          </div>

          {/* 2. CONTROLS LAYER */}

          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 bg-black/50 hover:bg-red-500/80 transition-colors p-3 rounded-full text-white z-[110] border border-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous */}
          <button
            onClick={prevImage}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-teal transition-all rounded-full text-white z-[110] border border-white/10 backdrop-blur-sm shadow-xl"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Next */}
          <button
            onClick={nextImage}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-teal transition-all rounded-full text-white z-[110] border border-white/10 backdrop-blur-sm shadow-xl"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* 3. THUMBNAIL STRIP (FILMSTRIP) */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 bg-black/60 rounded-2xl backdrop-blur-md border border-white/10 overflow-x-auto max-w-[90vw] z-[110]"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking strip background
          >
            {space.images.map((img: string, idx: number) => (
              <div
                key={idx}
                onClick={(e) => selectImage(idx, e)}
                className={cn(
                  "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300",
                  currentImageIndex === idx
                    ? "border-teal scale-110 shadow-lg shadow-teal/20"
                    : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                )}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />

      <Footer />
    </div>
  );
};

export default SpaceDetail;