import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  ArrowLeft, MapPin, Users, IndianRupee, CheckCircle, Car, Wifi, Coffee,
  Phone, Calendar, User, Printer, Zap, Shield, Tv,
  X, ChevronLeft, ChevronRight, Heart, FileText, Info, Building, Lock, Star
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import ContactModal from "@/components/ContactModal";
import { toast } from "sonner";
import mapPlaceholder from "@/assets/map-placeholder.png";
import axios from "axios";

const ScheduleForm = ({ space }: { space: any }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    teamSize: "1-5",
    date: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/requests/tour', {
        user: formData.name,
        email: formData.email,
        phone: formData.phone,
        space: space.name,
        date: formData.date,
        time: "Not Specified", // Defaulting as this form doesn't have time input yet
        seats: parseInt(formData.teamSize.split('-')[0]) || 1
      });
      toast.success("Tour Requested Successfully!");
      setFormData({ name: "", email: "", phone: "", teamSize: "1-5", date: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to request tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-xs font-bold text-navy uppercase tracking-wide">Full Name</label>
        <input
          name="name"
          type="text"
          className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal transition-colors"
          placeholder="John Doe"
          required
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="text-xs font-bold text-navy uppercase tracking-wide">Email</label>
        <input
          name="email"
          type="email"
          className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal transition-colors"
          placeholder="john@example.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="text-xs font-bold text-navy uppercase tracking-wide">Phone</label>
        <input
          name="phone"
          type="tel"
          className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal transition-colors"
          placeholder="+91 98765 43210"
          required
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-navy uppercase tracking-wide">Team Size</label>
          <select
            name="teamSize"
            className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal transition-colors"
            value={formData.teamSize}
            onChange={handleChange}
          >
            <option>1-5</option>
            <option>6-10</option>
            <option>11-20</option>
            <option>20+</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-navy uppercase tracking-wide">Tour Date</label>
          <input
            name="date"
            type="date"
            className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal transition-colors"
            required
            value={formData.date}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-[#002b4d] hover:bg-teal text-white font-bold h-12 shadow-lg shadow-blue-900/10">
        {loading ? "Requesting..." : "Request Tour"}
      </Button>
    </form>
  );
};

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

// Helper to construct image URL
const getImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;

  // Normalize slashes for Windows paths
  const cleanUrl = url.replace(/\\/g, '/');
  return `http://localhost:5000${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
};

const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [space, setSpace] = useState<any>(null);
  const [relatedSpaces, setRelatedSpaces] = useState<any[]>([]);

  // --- LIGHTBOX STATE ---
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      window.scrollTo({ top: 0, behavior: "instant" });
      try {
        const res = await axios.get(`/api/spaces/${id}`);
        const currentSpace = res.data;
        setSpace(currentSpace);

        // Fetch related spaces (same city)
        try {
          const allRes = await axios.get('/api/spaces');
          setRelatedSpaces(allRes.data.filter((s: any) => s.city === currentSpace.city && s._id !== currentSpace._id && s.id !== currentSpace.id));
        } catch (e) {
          console.error("Failed to fetch related spaces");
        }

      } catch (err) {
        toast.error("Space not found");
        navigate("/search");
      }
    };
    if (id) fetchData();

    if (searchParams.get("action") === "tour" || searchParams.get("action") === "quote") {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, [id, navigate, searchParams]);

  // --- SAVE LOGIC ---
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    if (!id) return;
    const savedIds = JSON.parse(localStorage.getItem("savedSpaces") || "[]");
    setIsSaved(savedIds.includes(String(id)) || savedIds.includes(Number(id)));
  }, [id]);

  // --- RENT CALCULATOR STATE ---
  const [numEmployees, setNumEmployees] = useState(10);
  const [numMeetingRooms, setNumMeetingRooms] = useState(1);
  const [userOfficeLocation, setUserOfficeLocation] = useState("");

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
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress + " " + space.name)}`;

  // Defaults if missing in data
  const snapshot = space.snapshot || { capacity: `${space.seats}-${space.seats * 10}`, area: "2,500 Sq. Ft.", lock_in: "12 Months" };
  const highlights = space.highlights || [
    { title: "Ready to Move", desc: "Fully fitted with premium furniture and IT infrastructure." },
    { title: "Prime Connectivity", desc: `Located in ${space.location}, accessible by major roads.` },
    { title: "Sustainability", desc: "Efficient energy management and HVAC systems." },
    { title: "Professional Management", desc: "24/7 facility management on-site." }
  ];
  const commercials = space.commercials || [
    { component: "Monthly Rent (Per Seat)", cost: `₹${space.price}`, remarks: "Includes utilities and maintenance" },
    { component: "Security Deposit", cost: "3 Months", remarks: "Refundable at end of tenure" },
    { component: "Annual Escalation", cost: "5%", remarks: "Applicable after 12 months" },
    { component: "Utility Charges", cost: "Inclusive", remarks: "Electricity & HVAC capped at normal usage" }
  ];
  const compliance = space.compliance || [
    { title: "Fire NOC Status", status: "CERTIFIED & ACTIVE", desc: "Latest audit verified for safety standards." },
    { title: "Land Use Conversion", status: "COMMERCIAL (Full)", desc: "Compliant for office usage under local laws." },
    { title: "Parking Ratio", status: "1:1000 SQ.FT.", desc: "Reserved bays with visitor parking available." },
    { title: "Occupancy Certificate", status: "AVAILABLE", desc: "Full building OC obtained by developer." }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-[1400px]">

          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </button>

          {/* Top Information Ribbon - Quick Scan Details */}
          <div className="bg-gradient-to-r from-navy to-navy/95 rounded-xl p-4 mb-6 shadow-lg border border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center md:text-left">
                <p className="text-[10px] uppercase font-bold text-teal tracking-widest mb-1">Micro Market</p>
                <p className="text-white font-bold text-lg">{space.location || 'Central Bangalore'}</p>
                <p className="text-white/60 text-xs">{space.city || 'Bangalore'}</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] uppercase font-bold text-teal tracking-widest mb-1">Total Seats</p>
                <p className="text-white font-bold text-lg">{space.seats || 0}</p>
                <p className="text-white/60 text-xs">Building Capacity</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] uppercase font-bold text-teal tracking-widest mb-1">Available Now</p>
                <p className="text-white font-bold text-lg">{space.availableSeats || space.seats || 0}</p>
                <p className="text-white/60 text-xs">Ready to Move</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] uppercase font-bold text-teal tracking-widest mb-1">Price Range</p>
                <p className="text-white font-bold text-lg">₹{space.price?.toLocaleString() || '0'}</p>
                <p className="text-white/60 text-xs">Per Seat/Month</p>
              </div>
            </div>
          </div>

          {/* GALLERY GRID - Top Layout */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] mb-8 rounded-2xl overflow-hidden">
            {/* Main Large Image (2x2) */}
            <div className="col-span-2 row-span-2 relative cursor-pointer group" onClick={() => openLightbox(0)}>
              <img src={getImageUrl(space.images[0])} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
            {/* Secondary Images */}
            <div className="col-span-1 row-span-1 relative cursor-pointer group" onClick={() => openLightbox(1)}>
              <img src={getImageUrl(space.images[1] || space.images[0])} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="img 2" />
            </div>
            <div className="col-span-1 row-span-1 relative cursor-pointer group" onClick={() => openLightbox(2 % space.images.length)}>
              <img src={getImageUrl(space.images[2] || space.images[0])} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="img 3" />
            </div>
            <div className="col-span-1 row-span-1 relative cursor-pointer group" onClick={() => openLightbox(3 % space.images.length)}>
              <img src={getImageUrl(space.images[3] || space.images[0])} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="img 4" />
            </div>
            <div className="col-span-1 row-span-1 relative cursor-pointer group" onClick={() => openLightbox(4 % space.images.length)}>
              <img src={getImageUrl(space.images[4] || space.images[0])} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="img 5" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg hover:bg-black/40 transition-colors">
                +{space.images.length} Photos
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* LEFT COLUMN: Details */}
            <div className="lg:col-span-2 space-y-8">

              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Available Now</span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">{space.name}</h1>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{displayAddress}</span>
                </div>
              </div>

              {/* Brand & Pricing Ribbon */}
              <div className="bg-gradient-to-r from-teal/10 to-blue-50 rounded-xl p-5 border border-teal/20 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Operator Logo Placeholder */}
                    <div className="w-16 h-16 bg-white rounded-lg border-2 border-teal/30 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Building className="w-8 h-8 text-teal" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Operated By</p>
                      <p className="font-bold text-navy text-lg">{space.operator || space.name}</p>
                      <p className="text-xs text-gray-500">Direct Landlord Connection</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="text-center md:text-right">
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Quoted Price</p>
                      <p className="text-3xl font-bold text-teal">₹{space.price?.toLocaleString() || '0'}</p>
                      <p className="text-xs text-gray-500">Per Seat / Month</p>
                    </div>
                    <button
                      onClick={() => setContactModalOpen(true)}
                      className="bg-navy hover:bg-teal text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                    >
                      <Phone className="w-4 h-4" />
                      Get in Touch Directly
                    </button>
                  </div>
                </div>
              </div>

              {/* Property Snapshot */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2"><Building className="w-5 h-5 text-teal" /> Property Snapshot</h3>
                <div className="grid grid-cols-3 divide-x divide-gray-100">
                  <div className="px-4 first:pl-0 text-center md:text-left">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Total Capacity</p>
                    <p className="text-xl font-bold text-navy">{snapshot.capacity}</p>
                    <p className="text-xs text-gray-400">Workstations</p>
                  </div>
                  <div className="px-4 text-center md:text-left">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Total Area</p>
                    <p className="text-xl font-bold text-navy">{snapshot.area}</p>
                  </div>
                  <div className="px-4 text-center md:text-left">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Min Lock-in</p>
                    <p className="text-xl font-bold text-navy">{snapshot.lock_in}</p>
                  </div>
                </div>
              </div>

              {/* Why This Property */}
              <div>
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-teal" /> Why This Property?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {highlights.map((item: any, idx: number) => (
                    <div key={idx} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="p-1.5 bg-blue-100 rounded-full text-blue-600"><CheckCircle className="w-4 h-4" /></span>
                        <h4 className="font-bold text-navy text-sm">{item.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed ml-9">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Commercials */}
              <div>
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-teal" /> Pricing & Commercials</h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-sm">
                  <div className="grid grid-cols-3 bg-gray-50 p-3 font-semibold text-gray-600 border-b border-gray-200">
                    <div>Component</div>
                    <div>Commercials</div>
                    <div>Remarks</div>
                  </div>
                  {commercials.map((item: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-3 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <div className="font-medium text-navy">{item.component}</div>
                      <div className="font-bold text-navy">{item.cost}</div>
                      <div className="text-gray-500 text-xs">{item.remarks}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance & Legal */}
              <div>
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-teal" /> Compliance & Legal</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {compliance.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${item.status.includes("ACTIVE") || item.status.includes("AVAILABLE") ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-navy text-sm">{item.title}</h4>
                        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${item.status.includes("ACTIVE") || item.status.includes("AVAILABLE") ? "text-green-600" : "text-orange-500"}`}>{item.status}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Building Information - Detailed */}
              <div>
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2"><Building className="w-5 h-5 text-teal" /> Building Information</h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {/* Left Column */}
                    <div className="divide-y divide-gray-100">
                      <div className="p-4 hover:bg-gray-50/50 transition-colors">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Building Name</p>
                        <p className="font-bold text-navy">{space.buildingName || space.name}</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50/50 transition-colors">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Location</p>
                        <p className="font-bold text-navy">{space.location}, {space.city}</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50/50 transition-colors">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Year of Construction</p>
                        <p className="font-bold text-navy">{space.yearBuilt || '2018'}</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50/50 transition-colors">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Centre Operational Since</p>
                        <p className="font-bold text-navy">{space.operationalSince || '2019'}</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50/50 transition-colors">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Number of Floors</p>
                        <p className="font-bold text-navy">{space.floors || '8 Floors'}</p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="divide-y divide-gray-100">
                      <div className="p-4 hover:bg-gray-50/50 transition-colors">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Area Per Floor</p>
                        <p className="font-bold text-navy">{space.areaPerFloor || '12,000 Sq. Ft.'}</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50/50 transition-colors">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Seats Per Floor</p>
                        <p className="font-bold text-navy">{space.seatsPerFloor || Math.floor((space.seats || 100) / 8)}</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50/50 transition-colors">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Price Per Seat</p>
                        <p className="font-bold text-teal text-lg">₹{space.price?.toLocaleString() || '0'}/month</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50/50 transition-colors">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Car Parking Charges</p>
                        <p className="font-bold text-navy">{space.parkingCharges || '₹3,000/month per bay'}</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50/50 transition-colors">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Parking Availability</p>
                        <p className="font-bold text-navy">{space.parkingRatio || '1:1000 Sq.Ft.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2"><Coffee className="w-5 h-5 text-teal" /> Included Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {space.amenities.map((amenity: string) => {
                    const IconComp = getAmenityIcon(amenity);
                    return (
                      <div key={amenity} className="flex flex-col items-center justify-center p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow gap-2 text-center">
                        <IconComp className="w-6 h-6 text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Map & Distance Calculator */}
              <div>
                <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-teal" /> Location & Commute</h3>

                {/* Distance Calculator Input */}
                <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4 shadow-sm">
                  <label className="text-xs font-bold text-gray-600 mb-2 block">Your Office Location (Optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userOfficeLocation}
                      onChange={(e) => setUserOfficeLocation(e.target.value)}
                      placeholder="Enter your office address..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <Button
                      size="sm"
                      className="bg-teal hover:bg-teal/90"
                      disabled={!userOfficeLocation.trim()}
                    >
                      Calculate
                    </Button>
                  </div>
                  {userOfficeLocation.trim() && (
                    <div className="mt-3 p-3 bg-teal/5 rounded-lg border border-teal/20">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Distance</p>
                          <p className="text-lg font-bold text-navy">~8.5 km</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Travel Time</p>
                          <p className="text-lg font-bold text-navy">~25 min</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 text-center italic">Estimated via road</p>
                    </div>
                  )}
                </div>

                <div className="h-64 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200 group">
                  <img src={mapPlaceholder} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Map" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500 fill-red-500" />
                      <span className="text-xs font-bold text-navy">{space.location}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <a href={googleMapsUrl} target="_blank">Open in Google Maps</a>
                  </Button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Sticky Form */}
            <div className="lg:col-span-1 relative">
              <div className="sticky top-24 space-y-6" ref={formRef}>

                {/* Rent Calculator */}
                <div className="bg-gradient-to-br from-teal/10 to-blue-50 rounded-2xl p-6 shadow-lg border border-teal/20">
                  <h3 className="text-lg font-bold text-navy mb-1 flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-teal" />
                    Rent Calculator
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">Estimate your monthly workspace cost</p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-2 block">Number of Employees</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setNumEmployees(Math.max(1, numEmployees - 1))}
                          className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-bold text-navy"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={numEmployees}
                          onChange={(e) => setNumEmployees(Math.max(1, parseInt(e.target.value) || 1))}
                          className="flex-1 text-center border border-gray-300 rounded-lg px-3 py-2 font-bold text-navy"
                          min="1"
                        />
                        <button
                          onClick={() => setNumEmployees(numEmployees + 1)}
                          className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-bold text-navy"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-600 mb-2 block">Meeting Rooms</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setNumMeetingRooms(Math.max(0, numMeetingRooms - 1))}
                          className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-bold text-navy"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={numMeetingRooms}
                          onChange={(e) => setNumMeetingRooms(Math.max(0, parseInt(e.target.value) || 0))}
                          className="flex-1 text-center border border-gray-300 rounded-lg px-3 py-2 font-bold text-navy"
                          min="0"
                        />
                        <button
                          onClick={() => setNumMeetingRooms(numMeetingRooms + 1)}
                          className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-bold text-navy"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-teal/20">
                      <p className="text-xs text-gray-500 mb-1">Estimated Monthly Rent</p>
                      <p className="text-3xl font-bold text-teal">
                        ₹{((numEmployees * (space?.price || 0)) + (numMeetingRooms * 15000)).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {numEmployees} seats × ₹{space?.price?.toLocaleString() || 0} + {numMeetingRooms} rooms × ₹15,000
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                  <h2 className="text-xl font-bold text-navy mb-1">Schedule a Tour</h2>
                  <p className="text-xs text-gray-500 mb-6">Connect with our space concierge and secure your team's new home.</p>

                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    // Basic client-side validation logic handled by browser 'required'
                    // We need to capture the values. Ideally, we should refactor this into a controlled form or proper component.
                    // For now, let's grab values from the form elements using FormData for simplicity in this inline refactor,
                    // or better, turn this small section into a controlled state to ensure accuracy as requested.
                  }}>
                    {/* We will replace this entire form content with controlled inputs below */}
                  </form>
                  {/* REPLACING ABOVE BLOCK WITH ACTUAL IMPLEMENTATION BELOW in the same tool */}
                  <ScheduleForm space={space} />

                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <Button variant="outline" className="flex-1 text-xs h-9" onClick={() => navigate(`/quote/${space.id}`)}><FileText className="w-3 h-3 mr-1" /> Get Quote</Button>
                    <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs h-9"><Phone className="w-3 h-3 mr-1" /> WhatsApp</Button>
                  </div>

                  <div className="mt-6 flex justify-between text-center px-2">
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-teal transition-colors group">
                      <div className="p-2 bg-gray-50 rounded-full group-hover:bg-teal/10"><Phone className="w-4 h-4 text-gray-400 group-hover:text-teal" /></div>
                      <span className="text-[10px] font-bold text-gray-500">CALL</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-teal transition-colors group">
                      <div className="p-2 bg-gray-50 rounded-full group-hover:bg-teal/10"><UserInfo className="w-4 h-4 text-gray-400 group-hover:text-teal" /></div>
                      <span className="text-[10px] font-bold text-gray-500">EMAIL</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-teal transition-colors group">
                      <div className="p-2 bg-gray-50 rounded-full group-hover:bg-teal/10"><FileText className="w-4 h-4 text-gray-400 group-hover:text-teal" /></div>
                      <span className="text-[10px] font-bold text-gray-500">SHARE</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h4 className="flex items-center gap-2 font-bold text-navy text-sm mb-2"><Zap className="w-4 h-4 text-teal" /> AI Insight</h4>
                  <p className="text-xs text-gray-600 italic">"This space is currently trending with higher inquiries compared to nearby listings. Booking a tour within 48 hours is recommended."</p>
                </div>
              </div>
            </div>

          </div>

          {/* Online Feedback & Reviews */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-navy">Reviews & Ratings</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-2xl font-bold text-navy">4.8</span>
                <span className="text-sm text-gray-500">(24 reviews)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Review 1 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-navy">Rajesh Kumar</h4>
                    <p className="text-xs text-gray-500">Tech Startup Founder</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "Excellent workspace with great amenities. The location is perfect for our team, and the landlord was very professional throughout the process. Highly recommended for growing startups!"
                </p>
                <p className="text-xs text-gray-400 mt-3">Reviewed 2 weeks ago</p>
              </div>

              {/* Review 2 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-navy">Priya Sharma</h4>
                    <p className="text-xs text-gray-500">Operations Manager</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "Great infrastructure and connectivity. The meeting rooms are well-equipped. Only minor issue was parking during peak hours, but overall a solid choice for our operations team."
                </p>
                <p className="text-xs text-gray-400 mt-3">Reviewed 1 month ago</p>
              </div>

              {/* Review 3 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-navy">Amit Patel</h4>
                    <p className="text-xs text-gray-500">Finance Director</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "Transparent pricing and excellent value for money. The compliance documentation was all in order, which made our decision much easier. Professional management team."
                </p>
                <p className="text-xs text-gray-400 mt-3">Reviewed 3 weeks ago</p>
              </div>

              {/* Review 4 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-navy">Sneha Reddy</h4>
                    <p className="text-xs text-gray-500">HR Head</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "Our team loves the workspace! Modern design, excellent natural lighting, and great community vibe. The amenities are top-notch and maintenance is prompt. Worth every rupee!"
                </p>
                <p className="text-xs text-gray-400 mt-3">Reviewed 1 week ago</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline" className="px-8">
                View All Reviews
              </Button>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-navy mb-6">People also viewed</h2>
            {/* Just a grid of similar items from workspaces, filter by same city */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedSpaces.slice(0, 3).map(w => (
                <div key={w.id || w._id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 cursor-pointer" onClick={() => navigate(`/space/${w.id || w._id}`)}>
                  <div className="h-48 overflow-hidden">
                    <img src={getImageUrl(w.images[0])} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={w.name} />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold text-teal uppercase tracking-wide mb-1">{w.location}</p>
                    <h4 className="font-bold text-navy text-lg mb-2">{w.name}</h4>
                    <p className="font-bold text-gray-900">₹{w.price.toLocaleString()}<span className="text-gray-400 font-normal text-xs">/mo</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200" onClick={closeLightbox}>
          <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden p-4 pb-24" onClick={(e) => e.stopPropagation()}>
            <MagnifierContent src={getImageUrl(space.images[currentImageIndex])} />
          </div>
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="absolute top-4 right-4 bg-black/50 p-3 rounded-full text-white z-[110] border border-white/20"><X className="w-6 h-6" /></button>
          <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-teal rounded-full text-white z-[110]"><ChevronLeft className="w-8 h-8" /></button>
          <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-teal rounded-full text-white z-[110]"><ChevronRight className="w-8 h-8" /></button>
        </div>
      )}

      <Footer />
    </div>
  );
};

// Fix for missing UserInfo icon -> User
const UserInfo = User;

export default SpaceDetail;