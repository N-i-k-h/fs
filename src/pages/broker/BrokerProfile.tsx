import { useState, useEffect } from "react";
import { User, Mail, Phone, Building2, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";

const BrokerProfile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        phone: (user as any)?.phone || "",
        company: (user as any)?.company || "",
        location: (user as any)?.location || ""
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                phone: (user as any).phone || "",
                company: (user as any).company || "",
                location: (user as any).location || ""
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/users/profile', profileData, {
                headers: { 'x-auth-token': token }
            });
            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold text-navy">My <span className="text-teal">Profile</span></h1>
                <p className="text-gray-500">Manage your partner identity and contact coordinates.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card className="lg:col-span-1 border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
                    <CardContent className="pt-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-teal/10 flex items-center justify-center text-teal text-3xl font-black border-2 border-teal/20 mb-6">
                            {user?.name?.[0] || 'B'}
                        </div>
                        <h2 className="text-xl font-bold text-navy">{user?.name}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <ShieldCheck className="w-4 h-4 text-teal" />
                            <span className="text-xs font-black text-teal uppercase tracking-widest">Verified Partner</span>
                        </div>

                        <div className="w-full mt-10 pt-8 border-t border-gray-50 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 font-medium">Buildings Listed</span>
                                <span className="text-navy font-bold">12</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400 font-medium">Joined Date</span>
                                <span className="text-navy font-bold">Oct 2023</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Card */}
                <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] bg-white">
                    <CardHeader className="p-8 border-b border-gray-50">
                        <CardTitle className="text-lg font-bold text-navy">Edit Identity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Office Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all"
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Brokerage Agency</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            value={profileData.company}
                                            onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                            className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all"
                                            placeholder="Agency Name"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Primary Market</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            value={profileData.location}
                                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                            className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all"
                                            placeholder="e.g. Gurugram, India"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black text-gray-400 tracking-widest pl-1">Registered Email (Read-only)</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <Input
                                        value={user?.email}
                                        disabled
                                        className="h-12 pl-12 rounded-xl border-gray-50 bg-gray-50 text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    disabled={loading}
                                    className="bg-navy hover:bg-teal text-white font-bold h-12 px-10 rounded-xl transition-all shadow-lg shadow-navy/20"
                                >
                                    {loading ? "Saving..." : "Save Profile Details"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BrokerProfile;
