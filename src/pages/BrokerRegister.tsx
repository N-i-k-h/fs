import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight, User, Mail, Lock, Building2, Compass, Monitor, Zap, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const BrokerRegister = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "broker"
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
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4 pt-24 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-[1100px] min-h-[700px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
                >
                    {/* Left Side: Branding */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="hidden md:flex md:w-5/12 bg-teal p-12 flex-col justify-between relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full -ml-32 -mt-32 blur-3xl opacity-50" />
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-navy/20 rounded-full -mr-32 -mb-32 blur-3xl opacity-50" />

                        <div className="relative z-10">
                            <h1 className="text-4xl font-bold text-navy mb-4 tracking-tight leading-tight uppercase italic">Become a <br /><span className="text-white text-5xl">Partner.</span></h1>
                            <p className="text-navy/70 text-lg leading-relaxed max-w-[280px]">
                                List your property and start receiving qualified leads from corporate clients.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            {[
                                { icon: Compass, label: "Explore SFT", desc: "Premium workspace discovery." },
                                { icon: Monitor, label: "Studio SFT", desc: "Design & layout intelligence." },
                                { icon: Zap, label: "RFP Platform", desc: "Instant corporate generation." },
                                { icon: BarChart3, label: "Market Intel", desc: "Real-time pricing data." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 + (i * 0.1) }}
                                    className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20 group hover:bg-white/20 transition-all cursor-default"
                                >
                                    <h4 className="text-navy font-bold flex items-center gap-2 mb-1 uppercase tracking-wider text-xs">
                                        <item.icon className="w-4 h-4 text-white" /> {item.label}
                                    </h4>
                                    <p className="text-navy/60 text-[11px] font-bold">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="max-w-md mx-auto w-full"
                        >
                            <div className="mb-10 text-center md:text-left">
                                <h2 className="text-3xl font-black text-navy mb-2 tracking-tight uppercase italic">Partner Sign Up</h2>
                                <p className="text-gray-400 font-medium">
                                    Create your broker profile & start listing.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name / Company</Label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        <Input
                                            name="name"
                                            placeholder="Ambience Group / John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl pl-14 focus:ring-teal"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Business Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="leasing@partner.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl pl-14 focus:ring-teal"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        <Input
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl pl-14 focus:ring-teal"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 py-2">
                                    <div className="w-5 h-5 rounded border-2 border-teal/20 mt-0.5" />
                                    <p className="text-[11px] text-gray-400 font-medium">I agree to FlickSpace's data privacy and partner compliance policy.</p>
                                </div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button type="submit" disabled={loading} className="w-full h-16 text-lg font-black bg-navy hover:bg-teal text-white rounded-2xl shadow-xl shadow-navy/10 hover:shadow-teal/20 transition-all flex items-center justify-center gap-3 border-none capitalize italic">
                                        {loading ? "Creating..." : <><ArrowRight className="w-6 h-6" /> Complete Registration</>}
                                    </Button>
                                </motion.div>

                                <div className="text-center pt-8">
                                    <p className="text-gray-400 text-sm font-medium">
                                        Already a verified partner?{" "}
                                        <Link to="/broker/login" className="text-teal font-black hover:underline decoration-teal decoration-2 underline-offset-4 ml-1">
                                            Login Here
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BrokerRegister;
