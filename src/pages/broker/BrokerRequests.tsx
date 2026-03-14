import { useState, useEffect } from "react";
import { FileText, Handshake, MapPin, Users, Calendar, CheckCircle2, Download, Send, X, Building2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BrokerRequests = () => {
    const { user } = useAuth();
    const [rfps, setRfps] = useState<any[]>([]);
    const [mySpaces, setMySpaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Proposal Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRfp, setSelectedRfp] = useState<any>(null);
    const [proposalData, setProposalData] = useState({
        spaceId: "",
        message: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetching all RFPs
                const res = await axios.get('/api/requests');
                setRfps(res.data.filter((r: any) => r.type === 'RFP' || r.type === 'Detailed RFP'));

                // 2. Fetching my spaces for proposal
                const spaceRes = await axios.get('/api/spaces');
                // Filter spaces owned by this broker
                const mine = spaceRes.data.filter((s: any) =>
                    s.owner && (s.owner._id === user?.id || s.owner === user?.id || s.owner === user?.email)
                );
                setMySpaces(mine);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    const handleOpenProposal = (rfp: any) => {
        if (mySpaces.length === 0) {
            toast.error("You don't have any spaces listed to propose!");
            return;
        }
        setSelectedRfp(rfp);
        setIsModalOpen(true);
    };

    const submitProposal = async () => {
        if (!proposalData.spaceId) {
            toast.error("Please select a space to propose");
            return;
        }

        try {
            await axios.post('/api/requests/proposal', {
                rfpId: selectedRfp._id,
                brokerId: user?.id,
                spaceId: proposalData.spaceId,
                message: proposalData.message
            });

            toast.success("Proposal Sent Successfully!", {
                description: "Super Admin will contact you very soon to coordinate with the client.",
                duration: 5000
            });
            setIsModalOpen(false);
            setProposalData({ spaceId: "", message: "" });
        } catch (err) {
            toast.error("Failed to send proposal");
        }
    };

    const downloadRFPPDF = (rfp: any) => {
        try {
            const doc = new jsPDF();
            const date = new Date(rfp.createdAt).toLocaleDateString();

            // Header
            doc.setFillColor(15, 118, 110);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.text("SFT RFP Brief", 20, 25);

            doc.setFontSize(10);
            const refId = rfp._id ? rfp._id.toUpperCase() : "REQ-OFFLINE";
            doc.text(`Reference: ${refId}`, 140, 20);
            doc.text(`Date: ${date}`, 140, 26);

            doc.setTextColor(40, 40, 40);
            doc.setFontSize(14);
            doc.text("Client Information", 20, 55);
            doc.line(20, 58, 190, 58);

            doc.setFontSize(10);
            doc.text(`Organization: ${rfp.companyName || "Confidential Client"}`, 25, 68);
            doc.text(`Contact Person: ${rfp.clientName || rfp.user || "N/A"}`, 25, 75);

            doc.setFontSize(14);
            doc.text("Space Requirements", 20, 100);
            doc.line(20, 103, 190, 103);

            doc.setFontSize(10);
            doc.text(`Capacity Needed: ${rfp.seats} Seats`, 25, 113);
            doc.text(`Target Location: ${rfp.micromarket}`, 25, 120);

            doc.save(`SFT_Brief_${refId.slice(-6)}.pdf`);
            toast.success("RFP Brief Downloaded!");
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-teal">Client <span className="text-navy">RFPs</span></h1>
                <p className="text-gray-500">Corporate requirements waiting for your proposal.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />)}
                </div>
            ) : rfps.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {rfps.map((rfp) => (
                        <Card key={rfp._id} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-md transition-all">
                            <CardContent className="p-0 flex flex-col md:flex-row">
                                <div className="p-8 flex-1">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-navy/10 flex-shrink-0 flex items-center justify-center text-navy font-bold text-xl">
                                                {rfp.clientName?.[0] || 'C'}
                                            </div>
                                            <div>
                                                <h3 className="text-lg md:text-xl font-bold text-teal">{rfp.companyName || "Confidential Client"}</h3>
                                                <Badge variant="outline" className="text-[10px] uppercase text-gray-400 font-bold border-gray-100">
                                                    {rfp.details?.fundingStatus || 'Verified'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                                            <span className="text-sm font-bold text-navy block">₹{rfp.budget || 'TBD'}</span>
                                            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Budget</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-4 bg-gray-50 rounded-2xl">
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Location</span>
                                            <div className="flex items-center gap-1.5 text-teal font-bold text-sm">
                                                <MapPin className="w-3.5 h-3.5 text-navy" /> {rfp.micromarket}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Seats</span>
                                            <div className="flex items-center gap-1.5 text-teal font-bold text-sm">
                                                <Users className="w-3.5 h-3.5 text-navy" /> {rfp.seats} Pax
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Timeline</span>
                                            <div className="flex items-center gap-1.5 text-teal font-bold text-sm">
                                                <Calendar className="w-3.5 h-3.5 text-navy" /> {rfp.timeline}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Status</span>
                                            <div className="flex items-center gap-1.5 text-navy font-bold text-sm">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Open
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-gray-50 pt-6">
                                        <Button
                                            onClick={() => handleOpenProposal(rfp)}
                                            className="w-full sm:w-auto bg-navy hover:bg-navy/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-navy/10 flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-4 h-4" /> Send Direct Proposal
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => downloadRFPPDF(rfp)}
                                            className="w-full sm:w-auto text-teal font-bold hover:bg-teal/5 flex items-center justify-center gap-2 border border-teal/10 rounded-xl h-12 px-6"
                                        >
                                            <Download className="w-4 h-4" /> Download RFP Brief
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center bg-white rounded-3xl border border-gray-100">
                    <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-teal">No active RFPs</h3>
                    <p className="text-gray-400">Requirements from corporate clients will appear here.</p>
                </div>
            )}

            {/* Proposal Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-teal">Propose a Space</DialogTitle>
                        <DialogDescription>
                            Select one of your spaces to propose for <strong>{selectedRfp?.companyName}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Select Office Space</Label>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {mySpaces.map((space) => (
                                    <div
                                        key={space._id}
                                        onClick={() => setProposalData({ ...proposalData, spaceId: space._id })}
                                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${proposalData.spaceId === space._id ? 'border-navy bg-navy/5' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-teal">{space.name}</p>
                                            <p className="text-[10px] text-gray-500">{space.location}, {space.city}</p>
                                        </div>
                                        {proposalData.spaceId === space._id && <CheckCircle2 className="w-5 h-5 text-navy" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Message to Admin (Optional)</Label>
                            <Textarea
                                placeholder="Any specific details or notes about this match..."
                                value={proposalData.message}
                                onChange={(e) => setProposalData({ ...proposalData, message: e.target.value })}
                                className="rounded-xl min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <Button
                            onClick={submitProposal}
                            className="w-full bg-teal hover:bg-teal/90 text-white font-bold h-12 rounded-xl"
                        >
                            Submit Proposal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BrokerRequests;
