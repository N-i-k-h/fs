import { useState, useEffect } from "react";
import { Building2, Search, Plus, MoreVertical, Edit2, Trash2, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";

const BrokerSpaces = () => {
    const navigate = useNavigate();
    const [spaces, setSpaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchMySpaces = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/spaces/my-spaces');
            setSpaces(res.data);
        } catch (err) {
            console.error("Failed to fetch spaces:", err);
            toast.error("Could not load your buildings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMySpaces();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property?")) return;
        try {
            await axios.delete(`/api/spaces/${id}`);
            toast.success("Space deleted successfully");
            fetchMySpaces();
        } catch (err) {
            toast.error("Failed to delete space");
        }
    };

    const filteredSpaces = spaces.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 10 },
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                damping: 20,
                stiffness: 100
            }
        },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-8"
        >
            <motion.div variants={cardVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-navy tracking-tight">My <span className="text-teal">Buildings</span></h1>
                    <p className="text-gray-500 font-medium">Manage your property portfolio and technical specs.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <motion.div whileFocus={{ scale: 1.02 }} className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search properties..."
                            className="pl-10 h-12 bg-white border-gray-100 rounded-2xl shadow-sm focus:ring-navy"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => navigate("/broker/submit-property")} className="bg-navy hover:bg-teal text-white font-bold rounded-2xl h-12 px-6 shadow-xl shadow-navy/10 border-none transition-all">
                            <Plus className="w-5 h-5 mr-1" /> Add Building
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-[2.5rem]" />
                    ))}
                </div>
            ) : filteredSpaces.length > 0 ? (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredSpaces.map((space) => (
                            <motion.div
                                layout
                                key={space._id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                            >
                                <Card className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden group bg-white">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <motion.img
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            src={space.images?.[0] || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"}
                                            alt={space.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-6 right-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="h-10 w-10 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-navy shadow-lg border-none"
                                                    >
                                                        <MoreVertical className="w-5 h-5" />
                                                    </motion.button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]">
                                                    <DropdownMenuItem onClick={() => navigate(`/broker/edit-space/${space._id}`)} className="rounded-xl gap-3 py-3 font-semibold cursor-pointer">
                                                        <Edit2 className="w-4 h-4 text-teal" /> Edit Specs
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(space._id)} className="rounded-xl text-red-600 focus:text-red-600 gap-3 py-3 font-semibold cursor-pointer">
                                                        <Trash2 className="w-4 h-4" /> Remove Building
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="absolute bottom-6 left-6">
                                            <Badge className="bg-navy text-white px-4 py-1.5 rounded-xl border-none text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                {space.type?.[0] || 'Premium Office'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-8">
                                        <h3 className="text-xl font-black text-navy mb-2 line-clamp-1 group-hover:text-teal transition-colors">{space.name}</h3>
                                        <div className="flex items-center text-sm font-medium text-gray-400 mb-6 gap-2">
                                            <MapPin className="w-4 h-4 text-teal" /> {space.location}, {space.city}
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase font-black text-teal tracking-widest mb-1">Market Standard</span>
                                                <span className="text-2xl font-black text-navy">₹{space.price}<span className="text-xs font-medium text-gray-400 uppercase ml-1 tracking-tighter">/ sq.ft</span></span>
                                            </div>
                                            <motion.button
                                                whileHover={{ rotate: 15, scale: 1.1 }}
                                                className="h-12 w-12 rounded-2xl bg-teal/10 flex items-center justify-center text-teal hover:bg-teal hover:text-white transition-all duration-300"
                                                onClick={() => window.open(space.googleMapUrl, '_blank')}
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                            </motion.button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner"
                >
                    <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-8 relative">
                        <Building2 className="w-10 h-10 text-gray-200" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 bg-teal/10 rounded-full"
                        />
                    </div>
                    <h3 className="text-2xl font-black text-navy mb-2">Portfolio Empty</h3>
                    <p className="text-gray-400 font-medium mb-10 max-w-xs text-center">Start by listing your first property to began receiving enterprise leads.</p>
                    <Button onClick={() => navigate("/broker/submit-property")} className="bg-teal hover:bg-navy text-white font-black rounded-2xl px-10 h-14 text-lg shadow-xl shadow-teal/20 transition-all border-none">
                        GET STARTED NOW
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default BrokerSpaces;
