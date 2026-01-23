import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Mail, Phone, Download, FileText } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface RequestItem {
    _id: string;
    user: string;
    email: string;
    phone: string;
    seats: number;
    space: string;
    spaceName?: string;
    status: string;
    createdAt?: string;
    type?: string;
    isBrochureDownloaded?: boolean;
}

const AdminBrochures = () => {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/api/requests');
            // Filter for Brochures (currently derived from Quote Requests)
            const brochures = res.data.filter((req: any) => req.isBrochureDownloaded || req.type === 'Quote Request');
            setRequests(brochures);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load brochures");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const downloadCSV = () => {
        if (requests.length === 0) {
            toast.error("No data to download");
            return;
        }

        const headers = ["User Name", "Email", "Phone", "Target Space", "Downloaded At"];
        const csvContent = [
            headers.join(","),
            ...requests.map(req => {
                return [
                    `"${req.user}"`,
                    `"${req.email}"`,
                    `"${req.phone}"`,
                    `"${req.space || req.spaceName || 'N/A'}"`,
                    `"${new Date(req.createdAt || '').toLocaleString()}"`
                ].join(",");
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `brochure_downloads_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-navy">Brochure Downloads</h1>
                    <p className="text-muted-foreground mt-1">Track who has downloaded brochures and price estimates.</p>
                </div>
                <Button onClick={downloadCSV} variant="outline" className="border-teal text-teal hover:bg-teal/10">
                    <Download className="w-4 h-4 mr-2" /> Download CSV
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Download History</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="py-8 text-center">Loading downloads...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">User Details</th>
                                        <th className="px-6 py-3">Space Brochure</th>
                                        <th className="px-6 py-3">Details</th>
                                        <th className="px-6 py-3">Download Date</th>
                                        <th className="px-6 py-3 text-right">Activity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {requests.map((req) => (
                                        <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{req.user}</span>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                                        <Mail className="w-3 h-3 mr-1" /> {req.email}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                                        <Phone className="w-3 h-3 mr-1" /> {req.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-navy font-medium">
                                                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                                                    {req.spaceName || req.space || "N/A"} Brochure
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {req.seats ? `${req.seats} Seats Interest` : 'General Inquiry'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(req.createdAt || '').toLocaleDateString()}
                                                <div className="text-xs text-gray-400">{new Date(req.createdAt || '').toLocaleTimeString()}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Downloaded
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-muted-foreground">No downloads found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminBrochures;
