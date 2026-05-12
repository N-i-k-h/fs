import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BrokerFeatureBids = () => {
    const [spaces, setSpaces] = useState<any[]>([]);
    const [bids, setBids] = useState<any[]>([]);
    const [selectedSpace, setSelectedSpace] = useState("");
    const [bidAmount, setBidAmount] = useState("");

    const fetchBidsAndSpaces = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const bidsRes = await axios.get("/api/feature-bids/my-bids", { headers: { "x-auth-token": token } });
            setBids(bidsRes.data);
            
            const spacesRes = await axios.get("/api/spaces/my-spaces", { headers: { "x-auth-token": token } });
            setSpaces(spacesRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchBidsAndSpaces();
    }, []);

    const handleSubmitBid = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/feature-bids", { spaceId: selectedSpace, bidAmount: Number(bidAmount) }, { headers: { "x-auth-token": token } });
            toast.success("Bid submitted successfully!");
            setSelectedSpace("");
            setBidAmount("");
            fetchBidsAndSpaces();
        } catch (error) {
            toast.error("Failed to submit bid");
        }
    };

    const handlePay = async (bidId: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`/api/feature-bids/${bidId}/pay`, {}, { headers: { "x-auth-token": token } });
            toast.success("Payment successful! Space is now featured.");
            fetchBidsAndSpaces();
        } catch (error) {
            toast.error("Payment failed");
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-teal">Feature <span className="text-navy">Spaces</span></h1>
            <p className="text-gray-500">Bid to feature your space on the landing page.</p>
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Submit a Bid to Feature Your Space</h2>
                    <form onSubmit={handleSubmitBid} className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-bold mb-1">Select Space</label>
                            <select 
                                value={selectedSpace} 
                                onChange={(e) => setSelectedSpace(e.target.value)}
                                className="w-full border rounded-lg p-2"
                                required
                            >
                                <option value="">-- Choose a Space --</option>
                                {spaces.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Bid Amount (₹)</label>
                            <input 
                                type="number" 
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="w-full border rounded-lg p-2"
                                placeholder="e.g. 10000"
                                required
                            />
                        </div>
                        <Button type="submit" className="bg-teal hover:bg-teal/90 text-white w-full">Submit Bid</Button>
                    </form>
                </CardContent>
            </Card>

            <h2 className="text-2xl font-bold mt-8">Your Bids</h2>
            <div className="grid gap-4">
                {bids.map(bid => (
                    <Card key={bid._id}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{bid.spaceId?.name || 'Unknown Space'}</h3>
                                <p className="text-gray-500">Bid Amount: ₹{bid.bidAmount}</p>
                                <p className="text-xs text-gray-400">Date: {new Date(bid.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right space-y-2 flex flex-col items-end">
                                <Badge className={
                                    bid.status === 'accepted' ? 'bg-green-100 text-green-700' : 
                                    bid.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    bid.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }>{bid.status.toUpperCase()}</Badge>
                                {bid.status === 'accepted' && (
                                    <div className="mt-2">
                                        <Button onClick={() => handlePay(bid._id)} size="sm" className="bg-navy hover:bg-navy/90 text-white w-full">
                                            Pay Now
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {bids.length === 0 && <p className="text-gray-500">No bids submitted yet.</p>}
            </div>
        </div>
    );
};

export default BrokerFeatureBids;
