import { useState, useEffect } from "react";
import { Handshake, MapPin, Users, Calendar, Mail, Phone, Building2, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";

const AdminHandshakes = () => {
    const [handshakes, setHandshakes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHandshakes = async () => {
            try {
                const res = await axios.get('/api/requests/admin-handshakes');
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
                <h1 className="text-3xl font-bold text-navy">Successful <span className="text-teal">Handshakes</span></h1>
                <p className="text-gray-500">Overview of all direct client-to-partner connections.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />
                    ))}
                </div>
            ) : handshakes.length > 0 ? (
                <div className="space-y-6">
                    {handshakes.map((h) => (
                        <Card key={h._id} className="border-none shadow-sm rounded-3xl overflow-hidden border border-gray-100">
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Client Side */}
                                    <div className="flex-1 p-8 bg-white">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">C</div>
                                            <div>
                                                <h3 className="font-bold text-navy">{h.user}</h3>
                                                <p className="text-xs text-gray-400">Corporate Client</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-4 h-4 text-gray-400" /> {h.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4 text-gray-400" /> {h.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Users className="w-4 h-4 text-gray-400" /> {h.seats} Seats
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-400" /> {h.timeline}
                                            </div>
                                        </div>
                                    </div>

                                    {/* The "Handshake" Bridge */}
                                    <div className="bg-gray-50 lg:w-24 flex items-center justify-center py-4 lg:py-0">
                                        <div className="w-12 h-12 rounded-full bg-teal text-white flex items-center justify-center shadow-lg shadow-teal/20 animate-pulse">
                                            <Handshake className="w-6 h-6" />
                                        </div>
                                    </div>

                                    {/* Partner/Office Side */}
                                    <div className="flex-1 p-8 bg-white border-t lg:border-t-0 lg:border-l border-gray-100">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal font-bold">P</div>
                                            <div>
                                                <h3 className="font-bold text-navy">{h.brokerInfo?.name || "Unknown Partner"}</h3>
                                                <p className="text-xs text-gray-400">Workspace Partner</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-2xl mb-4">
                                            <div className="flex items-start gap-3">
                                                <Building2 className="w-5 h-5 text-teal mt-0.5" />
                                                <div>
                                                    <p className="font-bold text-navy text-sm">{h.space}</p>
                                                    <p className="text-xs text-gray-500">{h.spaceInfo?.location}, {h.spaceInfo?.city}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {h.brokerInfo?.email || 'N/A'}</div>
                                            <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {h.brokerInfo?.phone || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center bg-white rounded-3xl border border-gray-100">
                    <Handshake className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-navy">No Handshakes processed yet</h3>
                    <p className="text-gray-400 max-w-md mx-auto">Successful direct connections between corporate clients and workspace partners will be logged here for your oversight.</p>
                </div>
            )}
        </div>
    );
};

export default AdminHandshakes;
