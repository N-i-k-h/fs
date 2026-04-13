import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Briefcase, Lock, CheckCircle, ArrowRight, Compass, Monitor, Zap, BarChart3 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        password: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        upper: false,
        lower: false,
        special: false,
        number: false,
    });

    const validatePassword = (pass: string) => {
        const api = {
            length: pass.length >= 8,
            upper: /[A-Z]/.test(pass),
            lower: /[a-z]/.test(pass),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass),
            number: /[0-9]/.test(pass),
        };
        setPasswordCriteria(api);
        return Object.values(api).every(Boolean);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            validatePassword(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!validatePassword(formData.password)) {
            newErrors.password = "Please meet all password criteria.";
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Phone number must be exactly 10 digits.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const res = await axios.post('/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role || 'user'
            });
            login(res.data.token, res.data.user);
            toast.success("Welcome to Xplore SFT!");
            navigate("/");
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Registration failed");
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
                    className="w-full max-w-[1100px] min-h-[750px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
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
                            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight uppercase italic">Join The <br /><span className="text-teal text-5xl">Network.</span></h1>
                            <p className="text-white/60 text-lg leading-relaxed max-w-[280px]">
                                Unlocking premium workspace access and market-first insights for your business.
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
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <item.icon className="text-teal w-5 h-5" />
                                    </div>
                                    <div className="text-white/80 font-medium group-hover:text-teal transition-colors text-sm uppercase tracking-wider">{item.label}</div>
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
                            className="max-w-[500px] mx-auto w-full"
                        >
                            <div className="mb-10 text-center md:text-left">
                                <h2 className="text-3xl font-black text-navy mb-2 tracking-tight uppercase italic">Create Client Account</h2>
                                <p className="text-gray-400 font-medium font-outfit">
                                    Join the smartest workspace discovery ecosystem.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                        <Input
                                            name="name"
                                            placeholder="John Wick"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl pl-14 focus:ring-teal"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Business Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                            <Input
                                                name="email"
                                                type="email"
                                                placeholder="john@wick.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl pl-14 focus:ring-teal text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                            <Input
                                                name="phone"
                                                type="tel"
                                                placeholder="9876543210"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="h-14 bg-gray-50/50 border-gray-100 rounded-2xl pl-14 focus:ring-teal text-sm"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">I am a</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 z-10" />
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            className="flex h-14 w-full items-center rounded-2xl border border-gray-100 bg-gray-50/50 pl-14 pr-4 py-2 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-teal appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Select your role</option>
                                            <option value="founder">Founder / CEO</option>
                                            <option value="manager">Operations Manager</option>
                                            <option value="employee">Decision Maker</option>
                                            <option value="user">Individual Professional</option>
                                        </select>
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
                                    <div className="flex flex-wrap gap-2 mt-2 ml-1">
                                        {[
                                            { key: "length", label: "8+ Chars" },
                                            { key: "upper", label: "Uppercase" },
                                            { key: "number", label: "Number" },
                                            { key: "special", label: "Special" }
                                        ].map((c) => (
                                            <span key={c.key} className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full transition-colors ${passwordCriteria[c.key as keyof typeof passwordCriteria] ? 'bg-teal/10 text-teal' : 'bg-gray-100 text-gray-300'}`}>
                                                {c.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                                    <Button type="submit" className="w-full h-16 text-lg font-black bg-navy hover:bg-teal text-white rounded-2xl shadow-xl shadow-navy/10 hover:shadow-teal/20 transition-all flex items-center justify-center gap-3">
                                        CREATE ACCOUNT <ArrowRight className="w-6 h-6" />
                                    </Button>
                                </motion.div>

                                <div className="text-center pt-8">
                                    <p className="text-gray-400 text-sm font-medium">
                                        Already a member?{" "}
                                        <Link to="/login" className="text-teal font-black hover:underline decoration-teal decoration-2 underline-offset-4 ml-1">
                                            Login Now
                                        </Link>
                                    </p>
                                    <p className="text-gray-400 text-[10px] font-black mt-4 uppercase tracking-[0.2em]">
                                        Are you a partner?{" "}
                                        <Link to="/broker/register" className="text-navy hover:text-teal transition-colors">
                                            Register as Partner
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

export default Register;
