import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero.png";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "", // Not used in backend yet but kept for form
        role: "", // Backend default is 'user' but can be overridden
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
            length: pass.length > 8,
            upper: /[A-Z]/.test(pass),
            lower: /[a-z]/.test(pass),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass),
            number: /[0-9]/.test(pass),
        };
        setPasswordCriteria(api);
        return Object.values(api).every(Boolean);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            validatePassword(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        // Password Validation
        const isPasswordValid = validatePassword(formData.password);
        if (!isPasswordValid) {
            newErrors.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
        }

        // Phone Validation
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
                password: formData.password
            });
            login(res.data.token, res.data.user);
            toast.success("Account created successfully!");
            navigate("/");
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Registration failed");
        }
    };


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
                        <h1 className="text-5xl font-bold mb-6 leading-tight">Join<br />FlickSpace!</h1>
                        <p className="text-lg opacity-90 leading-relaxed">
                            Create an account to unlock exclusive workspace deals and manage your bookings effortlessly.
                        </p>
                    </div>
                    <div className="absolute inset-0 bg-navy/40 mix-blend-multiply" />
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
                    <div className="w-full max-w-md space-y-8 my-auto pt-8 lg:pt-0">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
                            <p className="text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-teal font-medium hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="h-11 bg-secondary/30"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="h-11 bg-secondary/30"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="h-11 bg-secondary/30"
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">I am a</Label>
                                    <div className="relative">
                                        <select
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-secondary/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                        >
                                            <option value="" disabled>Select your role</option>
                                            <option value="user">User</option>
                                            <option value="founder">Founder</option>
                                            <option value="manager">Manager</option>
                                            <option value="employee">Employee</option>
                                        </select>
                                    </div>
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
                                        className="h-11 bg-secondary/30"
                                    />

                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 text-base font-semibold bg-navy hover:bg-navy/90 text-white mt-2">
                                Create Account
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or register with</span>
                                </div>
                            </div>

                            <Button variant="outline" type="button" className="w-full h-12 font-medium border-border hover:bg-secondary">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" alt="Google" />
                                Continue with Google
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
