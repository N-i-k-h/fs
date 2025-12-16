import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero.png";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";

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
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            login(res.data.token, res.data.user);
            toast.success("Welcome back!");
            navigate(res.data.user.role === 'admin' ? '/admin' : '/');
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
                // Fetch profile using access_token
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
            const res = await axios.post('http://localhost:5000/api/auth/google-data', {
                element: profile
            });
            login(res.data.token, res.data.user);
            toast.success("Welcome back!");
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error("Google Auth Error");
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="min-h-screen flex w-full pt-16 lg:pt-0">
                {/* Left Side - Image */}
                <div className="hidden lg:flex w-1/2 bg-navy relative items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-80"
                        style={{ backgroundImage: `url(${heroBg})` }}
                    />
                    <div className="relative z-10 text-white p-12 max-w-lg">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">Hello<br />FlickSpace! 👋</h1>
                        <p className="text-lg opacity-90 leading-relaxed">
                            Skip repetitive and manual searching. Get highly productive through our AI-powered platform and save tons of time!
                        </p>
                    </div>
                    <div className="absolute inset-0 bg-navy/40 mix-blend-multiply" />
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
                    <div className="w-full max-w-md space-y-8 pt-8 lg:pt-0">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-foreground">Welcome Back!</h2>
                            <p className="text-muted-foreground">
                                Don't have an account?{" "}
                                <Link to="/register" className="text-teal font-medium hover:underline">
                                    Create a new account now
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="h-12 bg-secondary/30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="h-12 bg-secondary/30"
                                    />
                                </div>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold bg-navy hover:bg-navy/90 text-white">
                                {loading ? "Logging in..." : "Login Now"}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or login with</span>
                                </div>
                            </div>

                            <Button variant="outline" type="button" onClick={() => googleLogin()} className="w-full h-12 font-medium border-border hover:bg-secondary">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" alt="Google" />
                                Login with Google
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">Forget password? </span>
                                <button type="button" className="font-bold text-foreground hover:underline">Click here</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
