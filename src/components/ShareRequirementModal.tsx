import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MessageCircle, Mail, MapPin, X } from "lucide-react";
import { toast } from "sonner";

interface ShareRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareRequirementModal: React.FC<ShareRequirementModalProps> = ({ isOpen, onClose }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Callback Requested!", {
      description: "Our workspace experts will reach out to you within 30 minutes.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Form */}
          <div className="flex-1 p-8 md:p-12 bg-white">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-3xl font-bold text-navy mb-2">Share your requirement</DialogTitle>
              <p className="text-gray-500 font-medium">We'd love to hear from you!</p>
              <p className="text-xs text-gray-400 mt-1">Tell us your requirements and our workspace experts will reach out to you at the earliest.</p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-navy">Name*</Label>
                  <Input id="name" placeholder="Your Name" required className="bg-gray-50 border-gray-100 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold text-navy">Mobile number*</Label>
                  <Input id="phone" placeholder="+91 00000 00000" required className="bg-gray-50 border-gray-100 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-navy">Email*</Label>
                  <Input id="email" type="email" placeholder="name@company.com" required className="bg-gray-50 border-gray-100 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-navy">I am interested in</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-100 rounded-xl h-12">
                      <SelectValue placeholder="Select interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="managed">Managed Office</SelectItem>
                      <SelectItem value="coworking">Coworking Space</SelectItem>
                      <SelectItem value="enterprise">Enterprise Solution</SelectItem>
                      <SelectItem value="built-to-suit">Built to Suit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-bold text-navy">Company Name</Label>
                  <Input id="company" placeholder="Organization Name" className="bg-gray-50 border-gray-100 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-navy">Select team size</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-100 rounded-xl h-12">
                      <SelectValue placeholder="Team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 Seats</SelectItem>
                      <SelectItem value="10-50">10-50 Seats</SelectItem>
                      <SelectItem value="50-100">50-100 Seats</SelectItem>
                      <SelectItem value="100+">100+ Seats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* --- RFP FIELDS --- */}
                <div className="col-span-full pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-gray-100"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Requirement Details (RFP)</span>
                    <div className="h-px flex-1 bg-gray-100"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-bold text-navy">Preferred Location</Label>
                  <Input id="location" placeholder="e.g. HSR Layout, Bangalore" className="bg-gray-50 border-gray-100 rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-bold text-navy">Budget per seat</Label>
                  <Input id="budget" placeholder="e.g. 15,000" className="bg-gray-50 border-gray-100 rounded-xl h-12" />
                </div>
                <div className="space-y-2 col-span-full">
                  <Label className="text-sm font-bold text-navy">Expected Move-in</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-50 border-gray-100 rounded-xl h-12">
                      <SelectValue placeholder="When do you plan to move?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="1-month">Within 1 Month</SelectItem>
                      <SelectItem value="3-months">Within 3 Months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold h-14 rounded-xl text-lg mt-4 shadow-lg shadow-blue-200">
                Submit RFP & Request Callback
              </Button>
            </form>
          </div>

          {/* Right Side: Contact Info */}
          <div className="w-full md:w-[320px] bg-slate-50 p-8 md:p-10 border-l border-gray-100">
            <div className="space-y-10">
              <div className="group">
                <div className="flex items-center gap-3 text-navy font-bold mb-2">
                  <Phone className="w-5 h-5 text-blue-700" />
                  <h4>Call us</h4>
                </div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">(Mon - Sat, 10 am to 8 pm)</p>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">Reach out to our sales team directly for any details, pricing or availability</p>
                <a href="tel:+919205006361" className="text-sm font-bold text-blue-700 hover:underline">+91 9205006361</a>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 text-navy font-bold mb-2">
                  <MessageCircle className="w-5 h-5 text-blue-700" />
                  <h4>Chat with experts</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">Need help deciding or experiencing issues using the product? We're here to help</p>
                <button className="text-sm font-bold text-blue-700 hover:underline flex items-center gap-2">
                   Chat now
                </button>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 text-navy font-bold mb-2">
                  <Mail className="w-5 h-5 text-blue-700" />
                  <h4>Email us</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">For sales queries, partnerships, feedback, etc. Drop us an email</p>
                <a href="mailto:office@myhq.in" className="text-sm font-bold text-blue-700 hover:underline">office@sft.in</a>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 text-navy font-bold mb-2">
                  <MapPin className="w-5 h-5 text-blue-700" />
                  <h4>Address</h4>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed font-medium">
                  1002, 10th Floor, B Wing, ONE BKC, G Block Bandra Kurla Complex, Mumbai - 400 051
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareRequirementModal;
