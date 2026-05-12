import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AdminFeatureBids = () => {
    const [bids, setBids] = useState<any[]>([]);

    const fetchBids = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("/api/feature-bids/all", { headers: { "x-auth-token": token } });
            setBids(res.data);
        } catch (error) {
            console.error("Error fetching bids:", error);
        }
    };

    useEffect(() => {
        fetchBids();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`/api/feature-bids/${id}/status`, { status }, { headers: { "x-auth-token": token } });
            toast.success(`Bid ${status}`);
            fetchBids();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-teal">Feature Space <span className="text-navy">Bids</span></h1>
            
            <div className="grid gap-4">
                {bids.map(bid => (
                    <Card key={bid._id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{bid.spaceId?.name || 'Unknown Space'}</h3>
                                <p className="text-sm">Partner: {bid.partnerId?.name} ({bid.partnerId?.companyName})</p>
                                <p className="text-gray-500">Bid Amount: ₹{bid.bidAmount}</p>
                                <p className="text-xs text-gray-400">Date: {new Date(bid.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right space-y-2 flex flex-col items-end">
                                <Badge>{bid.status.toUpperCase()}</Badge>
                                <div className="mt-2 space-x-2">
                                    {bid.status === 'pending' && (
                                        <>
                                            <Button onClick={() => updateStatus(bid._id, 'accepted')} size="sm" className="bg-green-600 hover:bg-green-700 text-white">Accept</Button>
                                            <Button onClick={() => updateStatus(bid._id, 'rejected')} size="sm" variant="destructive">Reject</Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {bids.length === 0 && <p className="text-gray-500">No feature bids yet.</p>}
            </div>
        </div>
    );
};

export default AdminFeatureBids;
