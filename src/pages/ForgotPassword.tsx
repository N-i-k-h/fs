import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/auth/forgot-password", { email });
            setSubmitted(true);
            toast.success("Reset link sent!");
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-6 pt-32">
                <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl p-8 md:p-10 border border-gray-100">
                    {!submitted ? (
                        <>
                            <div className="mb-8">
                                <Link to="/login" className="text-gray-400 hover:text-navy transition-colors flex items-center gap-2 text-sm mb-6">
                                    <ArrowLeft size={16} /> Back to Login
                                </Link>
                                <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">Forgot Password?</h1>
                                <p className="text-gray-500 text-sm">Enter your email and we'll send you a link to reset your password.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-bold text-navy ml-1">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="h-14 pl-12 bg-gray-50 border-gray-100 rounded-2xl focus:bg-white transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="w-full h-14 rounded-2xl bg-navy hover:bg-navy/90 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {loading ? "Sending link..." : "Send Reset Link"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 text-teal">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-navy mb-3">Check your inbox</h2>
                            <p className="text-gray-500 text-sm mb-8">
                                We've sent a password reset link to <br/>
                                <span className="font-bold text-navy underline decoration-teal/30 underline-offset-4">{email}</span>
                            </p>
                            <Link to="/login">
                                <Button className="w-full h-14 rounded-2xl bg-navy text-white font-bold">
                                    Return to Login
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
