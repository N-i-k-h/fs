import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Mail, Phone, Users, Download, Banknote, MapPin } from "lucide-react";
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
    budget?: string;
    timeline?: string;
    micromarket?: string;
}

const AdminQuotes = () => {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/api/requests');
            // Filter for Quote Requests
            const quotes = res.data.filter((req: any) => req.type === 'Quote Request' || req.isBrochureDownloaded);
            setRequests(quotes);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load quotes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await axios.put(`/api/requests/${id}/status`, { status: newStatus });
            setRequests(prev => prev.map(req => req._id === id ? { ...req, status: newStatus } : req));
            toast.success(`Quote marked as ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const downloadCSV = () => {
        if (requests.length === 0) {
            toast.error("No data to download");
            return;
        }

        const headers = ["User Name", "Email", "Phone", "Space", "Budget", "Micromarket", "Timeline", "Seats", "Status", "Request Date"];
        const csvContent = [
            headers.join(","),
            ...requests.map(req => {
                return [
                    `"${req.user}"`,
                    `"${req.email}"`,
                    `"${req.phone}"`,
                    `"${req.space || req.spaceName || 'N/A'}"`,
                    `"${req.budget || 'N/A'}"`,
                    `"${req.micromarket || 'N/A'}"`,
                    `"${req.timeline || 'N/A'}"`,
                    req.seats,
                    req.status,
                    `"${new Date(req.createdAt || '').toLocaleString()}"`
                ].join(",");
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `user_quotes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-navy">User Quotes</h1>
                    <p className="text-muted-foreground mt-1">Manage requested quotes and estimates.</p>
                </div>
                <Button onClick={downloadCSV} variant="outline" className="border-teal text-teal hover:bg-teal/10">
                    <Download className="w-4 h-4 mr-2" /> Download CSV
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Quote Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="py-8 text-center">Loading quotes...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">User Details</th>
                                        <th className="px-6 py-3">Requirements (Budget, Loc)</th>
                                        <th className="px-6 py-3">Space Interest</th>
                                        <th className="px-6 py-3">Timeline</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
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
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center text-xs text-gray-600 font-medium">
                                                        <Banknote className="w-3 h-3 mr-1 text-green-600" />
                                                        {req.budget || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <MapPin className="w-3 h-3 mr-1 text-blue-500" />
                                                        {req.micromarket || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <Users className="w-3 h-3 mr-1" />
                                                        {req.seats} Seats
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-medium">{req.spaceName || req.space || "N/A"}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {req.timeline || 'Immediate'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {req.status === 'pending' && <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>}
                                                {req.status === 'approved' && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" /> Processed</Badge>}
                                                {req.status === 'rejected' && <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {req.status === 'pending' && (
                                                    <>
                                                        <Button onClick={() => updateStatus(req._id, 'approved')} size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full" title="Approve">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                        <Button onClick={() => updateStatus(req._id, 'rejected')} size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full" title="Reject">
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                {req.status !== 'pending' && (
                                                    <span className="text-xs text-muted-foreground italic">Done</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-muted-foreground">No quotes found.</td>
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

export default AdminQuotes;
