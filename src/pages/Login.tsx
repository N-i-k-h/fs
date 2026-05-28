import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";
import { Search, Sparkles, ArrowRight, Compass, Monitor, Zap, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
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
            const res = await axios.post('/api/auth/login', formData);
            login(res.data.token, res.data.user);
            toast.success("Welcome back!");
            if (res.data.user.role === 'admin') navigate('/admin');
            else if (res.data.user.role === 'broker') navigate('/broker');
            else navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                loginWithProfile(userInfo.data);
            } catch (error) {
                console.error(error);
                toast.error("Google Login Failed");
            }
        },
        onError: () => toast.error("Google Login Failed"),
    });

    const loginWithProfile = async (profile: any) => {
        try {
            const res = await axios.post('/api/auth/google-data', {
                element: profile
            });
            login(res.data.token, res.data.user);
            toast.success("Welcome back!");
            const userRole = res.data.user.role;
            if (userRole === 'admin') navigate('/admin');
            else if (userRole === 'broker') navigate('/broker');
            else navigate('/dashboard');
        } catch (err) {
            console.error(err);
            toast.error("Google Auth Error");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4 pt-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-[1000px] min-h-[660px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
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
                            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">Client <br /><span className="text-teal text-5xl">Portal.</span></h1>
                            <p className="text-white/60 text-lg leading-relaxed max-w-[240px]">
                                Your enterprise-grade AI assistant for smart workspace discovery.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            {[
                                { icon: Compass, label: "Explore SFT" },
                                { icon: Monitor, label: "Studio SFT" },
                                { icon: Zap, label: "RFP Platform" },
                                { icon: BarChart3, label: "Market Intel" }
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
                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="max-w-md mx-auto w-full"
                        >
                            <div className="mb-10 text-center md:text-left">
                                <h2 className="text-3xl font-black text-navy mb-2 tracking-tight">Client Login</h2>
                                <p className="text-gray-400 font-medium">
                                    Welcome back! Access your tailored dashboard.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-teal focus:border-teal px-6 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center mr-1">
                                        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Password</Label>
                                        <Link to="/forgot-password" title="Click to reset password" className="text-xs text-teal font-black hover:underline tracking-tight">FORGOT?</Link>
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

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-100" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-gray-400 font-bold tracking-widest">Or</span>
                                    </div>
                                </div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button variant="outline" type="button" onClick={() => googleLogin()} className="w-full h-14 font-black border-2 border-gray-100 hover:bg-teal hover:text-white hover:border-teal rounded-2xl transition-all">
                                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-3" alt="Google" />
                                        LOGIN WITH GOOGLE
                                    </Button>
                                </motion.div>

                                <div className="text-center pt-8">
                                    <p className="text-gray-400 text-sm font-medium">
                                        Don't have an account?{" "}
                                        <Link to="/register" className="text-teal font-black hover:underline decoration-teal decoration-2 underline-offset-4 ml-1">
                                            Create Now
                                        </Link>
                                    </p>
                                    <p className="text-gray-400 text-xs font-bold mt-4 uppercase tracking-widest">
                                        Are you a partner?{" "}
                                        <Link to="/broker/login" className="text-navy hover:text-teal font-black transition-colors">
                                            Switch to Partner Portal
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

export default Login;
