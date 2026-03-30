import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

import { motion } from "framer-motion";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        if (localStorage.getItem("adminAuth") === "true") {
            navigate("/admin");
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (credentials.email.toLowerCase() === "nikhilkashyapkn@gmail.com" && credentials.password === "adminsft@2026") {
            localStorage.setItem("adminAuth", "true");
            toast.success("Welcome back, Super Admin!");
            navigate("/admin");
        } else {
            toast.error("Invalid Admin Credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-teal/5 -skew-x-12 transform origin-top translate-x-1/4 z-0" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="shadow-2xl border-none overflow-hidden rounded-[2rem]">
                    <div className="h-2 bg-teal w-full" />
                    <CardHeader className="text-center pt-10 pb-6 flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 15, delay: 0.2 }}
                            className="w-16 h-16 bg-navy rounded-[1.25rem] flex items-center justify-center mb-6 text-white shadow-xl shadow-navy/20 rotate-3"
                        >
                            <ShieldCheck className="w-8 h-8" />
                        </motion.div>
                        <CardTitle className="text-3xl font-black text-navy tracking-tight">Super <span className="text-teal">Admin</span></CardTitle>
                        <CardDescription className="text-gray-400 font-medium mt-2">Enter secure vault credentials</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-6 px-10 pb-8">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Admin Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@sft.com"
                                    className="h-12 border-gray-100 bg-gray-50/50 rounded-xl focus:ring-teal focus:border-teal transition-all"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Secure Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-12 border-gray-100 bg-gray-50/50 rounded-xl focus:ring-teal focus:border-teal transition-all"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="px-10 pb-10">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                                <Button type="submit" className="w-full bg-navy hover:bg-teal text-white h-14 rounded-2xl font-black text-lg shadow-xl shadow-navy/20 transition-all border-none">
                                    AUTHORIZE ACCESS
                                </Button>
                            </motion.div>
                        </CardFooter>
                    </form>
                </Card>
                <p className="text-center mt-8 text-gray-400 text-xs font-medium tracking-widest uppercase">
                    &copy; 2026 Space Finders Tech &bull; Secure Portal
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
