import { useState, useEffect } from "react";
import { FileText, Handshake, MapPin, Users, Calendar, CheckCircle2, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { toast } from "sonner";

const BrokerRequests = () => {
    const [rfps, setRfps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRFPs = async () => {
            try {
                // Fetching all RFPs for brokers to bid on
                const res = await axios.get('/api/requests');
                setRfps(res.data.filter((r: any) => r.type === 'RFP' || r.type === 'Detailed RFP'));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRFPs();
    }, []);

    const handleHandshake = (id: string) => {
        toast.success("Proposal Sent Successfully!", {
            description: "Super Admin will contact you very soon to coordinate with the client.",
            duration: 5000
        });
        // Logic to link property to RFP
    };

    const downloadRFPPDF = (rfp: any) => {
        try {
            const doc = new jsPDF();
            const date = new Date(rfp.createdAt).toLocaleDateString();

            // Header
            doc.setFillColor(15, 118, 110); // Teal color
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text("FlickSpace RFP Brief", 20, 25);

            doc.setFontSize(10);
            const refId = rfp._id ? rfp._id.toUpperCase() : "REQ-OFFLINE";
            doc.text(`Reference: ${refId}`, 140, 20);
            doc.text(`Date: ${date}`, 140, 26);

            // Client Info Section
            doc.setTextColor(40, 40, 40);
            doc.setFontSize(14);
            doc.text("Client Information", 20, 55);
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 58, 190, 58);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Organization: ${rfp.companyName || "Confidential Client"}`, 25, 68);
            doc.text(`Contact Person: ${rfp.clientName || rfp.user || "N/A"}`, 25, 75);
            doc.text(`Industry: ${rfp.details?.companyDescription || "N/A"}`, 25, 82);

            // Requirement Section
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Space Requirements", 20, 100);
            doc.line(20, 103, 190, 103);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Capacity Needed: ${rfp.seats} Seats`, 25, 113);
            doc.text(`Target Location: ${rfp.micromarket}`, 25, 120);
            doc.text(`Target Budget: ${rfp.budget || "TBD"}`, 25, 127);
            doc.text(`Expected Move-in: ${rfp.timeline}`, 25, 134);

            // Layout & Specs
            if (rfp.details) {
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.text("Configuration Details", 20, 155);
                doc.line(20, 158, 190, 158);

                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                const specs = [
                    `Meeting Rooms: ${JSON.stringify(rfp.details.meetingRooms || {})}`,
                    `Manager Cabins: ${rfp.details.managerCabins || 0}`,
                    `Reception Required: ${rfp.details.receptionRequired ? "Yes" : "No"}`,
                    `Cafeteria Required: ${rfp.details.pantryRequired ? "Yes" : "No"}`
                ];

                let y = 168;
                specs.forEach(spec => {
                    doc.text(spec, 25, y);
                    y += 7;
                });
            }

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text("Proprietary & Confidential - FlickSpace India", 105, 285, { align: "center" });

            doc.save(`RFP_Brief_${refId.slice(-6)}.pdf`);
            toast.success("RFP Brief Downloaded!");
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-navy">Client <span className="text-teal">RFPs</span></h1>
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
                                            <div className="w-12 h-12 rounded-2xl bg-teal/10 flex-shrink-0 flex items-center justify-center text-teal font-bold text-xl">
                                                {rfp.clientName?.[0] || 'C'}
                                            </div>
                                            <div>
                                                <h3 className="text-lg md:text-xl font-bold text-navy">{rfp.companyName || "Confidential Client"}</h3>
                                                <Badge variant="outline" className="text-[10px] uppercase text-gray-400 font-bold border-gray-100">
                                                    {rfp.details?.fundingStatus || 'Verified'}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                                            <span className="text-sm font-bold text-teal block">₹{rfp.budget || 'TBD'}</span>
                                            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Budget</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-4 bg-gray-50 rounded-2xl">
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Location</span>
                                            <div className="flex items-center gap-1.5 text-navy font-bold text-sm">
                                                <MapPin className="w-3.5 h-3.5 text-teal" /> {rfp.micromarket}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Seats</span>
                                            <div className="flex items-center gap-1.5 text-navy font-bold text-sm">
                                                <Users className="w-3.5 h-3.5 text-teal" /> {rfp.seats} Pax
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Timeline</span>
                                            <div className="flex items-center gap-1.5 text-navy font-bold text-sm">
                                                <Calendar className="w-3.5 h-3.5 text-teal" /> {rfp.timeline}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Status</span>
                                            <div className="flex items-center gap-1.5 text-teal font-bold text-sm">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Open
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {Object.entries(rfp.details?.meetingRooms || {}).map(([key, val]) => (
                                            Number(val) > 0 && <Badge key={key} className="bg-white text-navy border-gray-100 font-medium px-3 py-1">{(val as string)}x {key.replace('pax', ' Pax')}</Badge>
                                        ))}
                                        {rfp.details?.managerCabins > 0 && <Badge className="bg-white text-navy border-gray-100 font-medium px-3 py-1">{rfp.details.managerCabins} Cabins</Badge>}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-gray-50 pt-6">
                                        <Button
                                            onClick={() => handleHandshake(rfp._id)}
                                            className="w-full sm:w-auto bg-teal hover:bg-teal/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-teal/10 flex items-center justify-center gap-2"
                                        >
                                            Send Direct Proposal
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => downloadRFPPDF(rfp)}
                                            className="w-full sm:w-auto text-navy font-bold hover:bg-navy/5 flex items-center justify-center gap-2 border border-navy/10 rounded-xl h-12 px-6"
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
                    <h3 className="text-xl font-bold text-navy">No active RFPs</h3>
                    <p className="text-gray-400">Requirements from corporate clients will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default BrokerRequests;
