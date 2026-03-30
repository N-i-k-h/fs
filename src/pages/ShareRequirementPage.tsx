import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MessageCircle, Mail, MapPin, FileText, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { BANGALORE_REGIONS } from "@/data/regions";

const ALL_MICRO_LOCATIONS = BANGALORE_REGIONS.flatMap(r => r.microLocations).sort();

const ShareRequirementPage = () => {
  const { user: authUser, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mandate login for requirement sharing
  React.useEffect(() => {
    if (!loading && !authUser) {
      toast.info("Login required", {
        description: "Please login to share your workspace requirements."
      });
      navigate("/login");
    }
  }, [authUser, loading, navigate]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    company: "",
    teamSize: "",
    region: "",
    detailedRequirement: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Clean up team size to a number for the database (e.g. "10-50" -> 10, "100+" -> 100)
      const seatNumber = parseInt(formData.teamSize.split('-')[0].replace('+', '')) || 0;

      const payload = {
        formData: {
          clientName: formData.name,
          phone: formData.phone,
          decisionMakerEmail: formData.email,
          solutionType: [formData.interest],
          companyName: formData.company,
          totalSeats: seatNumber,
          region: formData.region,
          detailedRequirement: formData.detailedRequirement
        },
        email: authUser?.email || formData.email,
        user: authUser?.name || formData.name
      };

      const res = await axios.post('/api/requests/rfp', payload);

      if (res.status === 201) {
        toast.success("Requirement Submitted!", {
          description: "Saved to your dashboard. Redirecting...",
        });

        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err: any) {
      console.error("RFP Submission Error:", err);
      toast.error("Submission Failed", {
        description: err.response?.data?.message || "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          
          {/* Left Side: Form */}
          <div className="flex-1 p-8 md:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">Share your requirement</h1>
              <p className="text-gray-500 text-base font-medium">We'd love to hear from you!</p>
              <p className="text-xs text-gray-400 mt-2 max-w-md leading-relaxed">
                Tell us your requirements and our workspace experts will reach out to you at the earliest 
                with the best suited options for your team.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-navy ml-1">Name*</Label>
                  <Input id="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className="bg-gray-50 border-gray-100 rounded-2xl h-14 px-5 focus:bg-white transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold text-navy ml-1">Mobile number*</Label>
                  <Input id="phone" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" required className="bg-gray-50 border-gray-100 rounded-2xl h-14 px-5 focus:bg-white transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-navy ml-1">Email*</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="name@company.com" required className="bg-gray-50 border-gray-100 rounded-2xl h-14 px-5 focus:bg-white transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-navy ml-1">I am interested in</Label>
                  <Select onValueChange={(v) => handleSelectChange("interest", v)} value={formData.interest}>
                    <SelectTrigger className="bg-gray-50 border-gray-100 rounded-2xl h-14 px-5 shadow-sm">
                      <SelectValue placeholder="Select interest" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="managed">Managed Office</SelectItem>
                      <SelectItem value="coworking">Coworking Space</SelectItem>
                      <SelectItem value="enterprise">Enterprise Solution</SelectItem>
                      <SelectItem value="built-to-suit">Built to Suit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-bold text-navy ml-1">Company Name</Label>
                  <Input id="company" value={formData.company} onChange={handleChange} placeholder="Organization Name" className="bg-gray-50 border-gray-100 rounded-2xl h-14 px-5 shadow-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-navy ml-1">Select team size</Label>
                  <Select onValueChange={(v) => handleSelectChange("teamSize", v)} value={formData.teamSize}>
                    <SelectTrigger className="bg-gray-50 border-gray-100 rounded-2xl h-14 px-5 shadow-sm">
                      <SelectValue placeholder="Team size" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="1-10">1-10 Seats</SelectItem>
                      <SelectItem value="10-50">10-50 Seats</SelectItem>
                      <SelectItem value="50-100">50-100 Seats</SelectItem>
                      <SelectItem value="100+">100+ Seats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* --- RFP FIELDS --- */}
                <div className="col-span-full pt-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-px flex-1 bg-gray-100"></div>
                    <span className="text-xs font-black text-teal uppercase tracking-[0.3em] bg-teal/5 px-4 py-1.5 rounded-full border border-teal/10">Requirement Details (RFP)</span>
                    <div className="h-px flex-1 bg-gray-100"></div>
                  </div>
                </div>
                <div className="col-span-full space-y-2">
                  <Label className="text-sm font-bold text-navy ml-1">Preferred Region / Area*</Label>
                  <Select onValueChange={(v) => handleSelectChange("region", v)} value={formData.region}>
                    <SelectTrigger className="bg-gray-50 border-gray-100 rounded-2xl h-14 px-5 shadow-sm">
                      <SelectValue placeholder="e.g. Koramangala, HSR Layout" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl max-h-[250px]">
                      {ALL_MICRO_LOCATIONS.map(loc => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-full space-y-2">
                  <Label htmlFor="detailedRequirement" className="text-sm font-bold text-navy ml-1">
                    Tell us your exact requirement*
                  </Label>
                  <Textarea 
                    id="detailedRequirement" 
                    value={formData.detailedRequirement} 
                    onChange={handleChange} 
                    maxLength={2000}
                    placeholder="e.g. Need a 20-seater office in HSR layout Sector 2 with 2 cabins and 1 meeting room. Budget: 15-20k per seat. Move-in by next month."
                    required
                    className="bg-gray-50 border-gray-100 rounded-3xl min-h-[160px] p-5 focus:bg-white transition-all shadow-sm resize-none"
                  />
                  <div className="text-[10px] text-gray-400 text-right px-2">
                    {formData.detailedRequirement.length} / 2000 characters
                  </div>
                </div>
              </div>

              {/* Specialized Solution CTA */}
              <div className="mt-8 pt-8 border-t border-gray-100/50">
                  <div className="bg-slate-50/50 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
                      <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-110">
                          <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                          <h4 className="text-navy font-bold text-base mb-1">Looking for a <span className="text-teal">Specialized Solution</span>?</h4>
                          <p className="text-gray-400 text-xs font-medium leading-relaxed">Capturing complex technical specifications is better handled through our detailed RFP form.</p>
                      </div>
                      <Button 
                          type="button"
                          onClick={() => navigate("/rfp-form")}
                          variant="outline" 
                          className="h-10 px-5 rounded-lg border-navy text-navy hover:bg-navy hover:text-white transition-all font-black uppercase text-[10px] tracking-widest whitespace-nowrap flex items-center gap-2"
                      >
                          Detailed RFP <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                  </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-teal hover:bg-teal/90 text-white font-bold h-16 rounded-2xl text-xl mt-10 shadow-xl shadow-teal/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? "Submitting..." : "Submit your requirements"}
              </Button>
            </form>
          </div>

          {/* Right Side: Contact Info */}
          <div className="w-full md:w-[360px] bg-slate-50 p-6 md:p-10 border-l border-gray-100 flex flex-col justify-center">
            <div className="space-y-10">
              <div className="group">
                <div className="flex items-center gap-3 text-navy font-bold mb-3">
                  <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal border border-teal/10">
                    <Phone className="w-4 h-4" />
                  </div>
                  <h4 className="text-base tracking-tight">Call us</h4>
                </div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">(Mon - Sat, 10 am to 8 pm)</p>
                <p className="text-xs text-gray-600 mb-2 leading-relaxed">Reach out to our sales team directly for any details or pricing</p>
                <a href="tel:+919205006361" className="text-base font-bold text-teal hover:underline">+91 9205006361</a>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 text-navy font-bold mb-3">
                  <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal border border-teal/10">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h4 className="text-base tracking-tight">Email us</h4>
                </div>
                <p className="text-xs text-gray-600 mb-2 leading-relaxed">For sales queries and partnerships, drop us an email</p>
                <a href="mailto:office@sft.in" className="text-sm font-bold text-teal hover:underline whitespace-nowrap">office@sft.in</a>
              </div>

              <div className="group pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-navy font-bold mb-3">
                  <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal border border-teal/10">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h4 className="text-base tracking-tight">Address</h4>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                  1002, 10th Floor, B Wing, ONE BKC, G Block Bandra Kurla Complex, Mumbai - 400 051
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShareRequirementPage;
