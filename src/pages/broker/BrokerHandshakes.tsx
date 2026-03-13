import { useState, useEffect } from "react";
import { Handshake, MapPin, Users, Calendar, Mail, Phone, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";

const BrokerHandshakes = () => {
    const [handshakes, setHandshakes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHandshakes = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/broker/handshakes', {
                    headers: { 'x-auth-token': token }
                });
                setHandshakes(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load handshakes");
            } finally {
                setLoading(false);
            }
        };
        fetchHandshakes();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-navy">Direct <span className="text-teal">Handshakes</span></h1>
                <p className="text-gray-500">Corporate clients who want to connect with you directly.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-3xl" />
                    ))}
                </div>
            ) : handshakes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {handshakes.map((h) => (
                        <Card key={h._id} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all border border-gray-100">
                            <CardContent className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center text-teal">
                                            <Handshake className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-navy">{h.user}</h3>
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold border-teal/20 text-teal">
                                                Direct Inquiry
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest block">Budget</span>
                                        <span className="text-sm font-bold text-navy">₹{h.budget || 'TBD'}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Building2 className="w-4 h-4 text-teal" />
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold leading-none mb-1">Office Space</p>
                                            <p className="text-sm font-bold text-navy">{h.space}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{h.seats} Seats</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-600">{h.timeline}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                                    <a href={`mailto:${h.email}`} className="flex items-center justify-center gap-2 py-3 bg-navy text-white rounded-xl text-sm font-bold hover:bg-navy/90 transition-colors">
                                        <Mail className="w-4 h-4" /> Email Client
                                    </a>
                                    <a href={`tel:${h.phone}`} className="flex items-center justify-center gap-2 py-3 border border-gray-200 text-navy rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
                                        <Phone className="w-4 h-4" /> Call Now
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <Handshake className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-navy">No Direct Handshakes yet</h3>
                    <p className="text-gray-400 max-w-sm mx-auto">When clients initiate a direct connection for your specific offices, they will appear here.</p>
                </div>
            )}
        </div>
    );
};

// Helper component for missing icon
import { Building2 } from "lucide-react";

export default BrokerHandshakes;
