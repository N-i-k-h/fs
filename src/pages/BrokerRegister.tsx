import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight, User, Building2, Mail, Lock } from "lucide-react";

const BrokerRegister = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "broker" // Explicitly setting broker role
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/register', formData);
            login(res.data.token, res.data.user);
            toast.success("Welcome! Let's register your first office.");
            navigate('/broker/submit-property');
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4 pt-24">
                <div className="w-full max-w-[1100px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">

                    {/* Left Side: Branding */}
                    <div className="hidden md:flex md:w-5/12 bg-teal p-12 flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full -ml-32 -mt-32 blur-3xl opacity-50" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-navy/20 rounded-full -mr-32 -mb-32 blur-3xl opacity-50" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center font-bold text-2xl text-white mb-8 shadow-lg">F</div>
                            <h1 className="text-4xl font-bold text-navy mb-4 tracking-tight">Become a <span className="text-white">Partner.</span></h1>
                            <p className="text-navy/70 text-lg leading-relaxed">
                                List your property and start receiving qualified leads from corporate clients.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20">
                                <h4 className="text-navy font-bold flex items-center gap-2 mb-2">
                                    <ShieldCheck className="w-5 h-5 text-white" /> Zero Listing Fees
                                </h4>
                                <p className="text-navy/60 text-sm">Post unlimited workspaces without any upfront cost.</p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20">
                                <h4 className="text-navy font-bold flex items-center gap-2 mb-2">
                                    <ShieldCheck className="w-5 h-5 text-white" /> Direct Dashboard
                                </h4>
                                <p className="text-navy/60 text-sm">Manage RFPs, bookings, and building specs easily.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <div className="mb-10 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-navy mb-2">Partner Registration</h2>
                                <p className="text-gray-400">
                                    Create your broker profile & start listing properties.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name / Company Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Ambience Group / John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-teal pl-14"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Business Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="leasing@partner.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-teal pl-14"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-teal pl-14"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 py-2">
                                    <div className="w-5 h-5 rounded border border-gray-200 mt-0.5" />
                                    <p className="text-[12px] text-gray-500 italic">I agree to FlickSpace's data privacy and partner compliance policy.</p>
                                </div>

                                <Button type="submit" disabled={loading} className="w-full h-15 text-lg font-bold bg-navy hover:bg-navy/90 text-white rounded-2xl shadow-xl shadow-navy/10 transition-all flex items-center justify-center gap-2 mb-6">
                                    {loading ? "Creating Account..." : <><ArrowRight className="w-5 h-5" /> Complete Registration</>}
                                </Button>

                                <div className="text-center">
                                    <p className="text-gray-400 text-sm font-medium">
                                        Already a verified partner?{" "}
                                        <Link to="/broker/login" className="text-teal font-extrabold hover:underline">
                                            Login Here
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrokerRegister;
