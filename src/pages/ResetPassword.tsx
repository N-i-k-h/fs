import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters long");
        }

        setLoading(true);
        try {
            await axios.post(`/api/auth/reset-password/${token}`, { password });
            setSubmitted(true);
            toast.success("Password reset successful!");
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Link expired or invalid. Please request a new one.");
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
                                <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">Create New Password</h1>
                                <p className="text-gray-500 text-sm">Please enter a new secure password for your account.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="password" title="At least 6 characters" className="text-sm font-bold text-navy ml-1">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-14 pl-12 bg-gray-50 border-gray-100 rounded-2xl focus:bg-white transition-all shadow-sm pr-12"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" title="Must match above password" className="text-sm font-bold text-navy ml-1">Confirm New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="h-14 pl-12 bg-gray-50 border-gray-100 rounded-2xl focus:bg-white transition-all shadow-sm pr-12"
                                        />
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="w-full h-14 rounded-2xl bg-navy hover:bg-navy/90 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 text-teal">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-navy mb-3">All Secure!</h2>
                            <p className="text-gray-500 text-sm mb-8">
                                Your password has been successfully updated. You can now log in with your new credentials.
                            </p>
                            <Link to="/login">
                                <Button className="w-full h-14 rounded-2xl bg-navy text-white font-bold">
                                    Go to Login
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
