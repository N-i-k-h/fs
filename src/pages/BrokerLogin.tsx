import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { Building2, ShieldCheck, ArrowRight } from "lucide-react";

import { motion } from "framer-motion";

const BrokerLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/broker-login', formData);
            const user = res.data.user;

            login(res.data.token, user);
            localStorage.setItem("flickspace_mode", "broker");
            toast.success(`Welcome back, ${user.name}!`);
            navigate('/broker');
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4 pt-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-[1000px] min-h-[600px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
                >

                    {/* Left Side: Branding */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="hidden md:flex md:w-5/12 bg-navy p-12 flex-col justify-between relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal/10 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

                        <div className="relative z-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 15, delay: 0.4 }}
                                className="w-12 h-12 rounded-2xl bg-teal flex items-center justify-center font-bold text-2xl text-white mb-8 shadow-lg shadow-teal/20"
                            >
                                F
                            </motion.div>
                            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">Partner <br /><span className="text-teal text-5xl">Portal.</span></h1>
                            <p className="text-white/60 text-lg leading-relaxed max-w-[200px]">
                                Join India's fastest growing workspace network.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            {[
                                { icon: Building2, label: "List & Manage Spaces" },
                                { icon: ShieldCheck, label: "Verified Client Leads" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 + (i * 0.1) }}
                                    className="flex items-center gap-4 group cursor-default"
                                >
                                    <div className="p-3 bg-white/10 rounded-xl group-hover:bg-teal group-hover:text-white transition-all duration-300">
                                        <item.icon className="text-teal group-hover:text-white w-6 h-6 transition-colors" />
                                    </div>
                                    <div className="text-white font-medium group-hover:text-teal transition-colors">{item.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="max-w-md mx-auto w-full"
                        >
                            <div className="mb-10 text-center md:text-left">
                                <h2 className="text-3xl font-black text-navy mb-2 tracking-tight">Broker Login</h2>
                                <p className="text-gray-400 font-medium">
                                    Manage your workspace profile and client RFPs.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@business.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-teal focus:border-teal px-6 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center mr-1">
                                        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Password</Label>
                                        <button type="button" className="text-xs text-teal font-black hover:underline tracking-tight">FORGOT?</button>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-teal focus:border-teal px-6 transition-all"
                                    />
                                </div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-black bg-navy hover:bg-teal text-white rounded-2xl shadow-xl shadow-navy/10 hover:shadow-teal/20 transition-all flex items-center justify-center gap-2 border-none">
                                        {loading ? "Verifying..." : <><ArrowRight className="w-5 h-5" /> SIGN IN</>}
                                    </Button>
                                </motion.div>

                                <div className="text-center pt-8">
                                    <p className="text-gray-400 text-sm font-medium">
                                        Don't have a partner account?{" "}
                                        <br className="md:hidden" />
                                        <Link to="/broker/register" className="text-teal font-black hover:underline decoration-teal decoration-2 underline-offset-4 ml-1">
                                            Register for Free
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

export default BrokerLogin;
