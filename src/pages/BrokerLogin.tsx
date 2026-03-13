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
            localStorage.setItem("flickspace_mode", "broker"); // Force broker mode on login
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-4 pt-24">
                <div className="w-full max-w-[1000px] h-[600px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row">

                    {/* Left Side: Branding */}
                    <div className="hidden md:flex md:w-5/12 bg-navy p-12 flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal/10 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-teal flex items-center justify-center font-bold text-2xl text-white mb-8 shadow-lg shadow-teal/20">F</div>
                            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Partner <span className="text-teal">Portal.</span></h1>
                            <p className="text-white/60 text-lg leading-relaxed">
                                Join India's fastest growing workspace procurement network.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-teal/20 transition-colors">
                                    <Building2 className="text-teal w-6 h-6" />
                                </div>
                                <div className="text-white font-medium">List & Manage Spaces</div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-teal/20 transition-colors">
                                    <ShieldCheck className="text-teal w-6 h-6" />
                                </div>
                                <div className="text-white font-medium">Verified Client Leads</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <div className="mb-10 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-navy mb-2">Broker Login</h2>
                                <p className="text-gray-400">
                                    Manage your workspace profile and client RFPs.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@business.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-teal px-6"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center mr-1">
                                        <Label htmlFor="password">Password</Label>
                                        <button type="button" className="text-xs text-teal font-bold hover:underline">Forgot?</button>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-teal px-6"
                                    />
                                </div>

                                <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-bold bg-teal hover:bg-teal/90 text-white rounded-2xl shadow-xl shadow-teal/10 transition-all flex items-center justify-center gap-2">
                                    {loading ? "Verifying..." : <><ArrowRight className="w-5 h-5" /> Sign In</>}
                                </Button>

                                <div className="text-center pt-8">
                                    <p className="text-gray-400 text-sm">
                                        Don't have a partner account?{" "}
                                        <Link to="/broker/register" className="text-navy font-bold hover:underline decoration-teal decoration-2 underline-offset-4">
                                            Register for Free
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

export default BrokerLogin;
