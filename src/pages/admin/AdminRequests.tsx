import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Trash2, Mail, Phone, Users, Download } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

interface RequestItem {
    _id: string;
    user: string;
    email: string;
    phone: string;
    seats: number;
    space: string;
    spaceName?: string; // Handle legacy field name
    date: string;
    time: string;
    status: string;
    createdAt?: string;
}

const AdminRequests = () => {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/requests');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await axios.put(`http://localhost:5000/api/requests/${id}/status`, { status: newStatus });
            setRequests(prev => prev.map(req => req._id === id ? { ...req, status: newStatus } : req));
            toast.success(`Request marked as ${newStatus}`);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const downloadCSV = () => {
        if (requests.length === 0) {
            toast.error("No data to download");
            return;
        }

        const headers = ["User Name", "Email", "Phone", "Space", "Date", "Time", "Seats", "Status", "Request Date"];
        const csvContent = [
            headers.join(","),
            ...requests.map(req => {
                return [
                    `"${req.user}"`,
                    `"${req.email}"`,
                    `"${req.phone}"`,
                    `"${req.space || req.spaceName || 'N/A'}"`,
                    `"${req.date}"`,
                    `"${req.time}"`,
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
        link.setAttribute("download", `tour_requests_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-navy">Requests & Inquiries</h1>
                    <p className="text-muted-foreground mt-1">Manage tour requests and callbacks.</p>
                </div>
                <Button onClick={downloadCSV} variant="outline" className="border-teal text-teal hover:bg-teal/10">
                    <Download className="w-4 h-4 mr-2" /> Download CSV
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="py-8 text-center">Loading requests...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">User Details</th>
                                        <th className="px-6 py-3">Space Interest</th>
                                        <th className="px-6 py-3">Seats</th>
                                        <th className="px-6 py-3">Date & Time</th>
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
                                            <td className="px-6 py-4 text-gray-600 font-medium">{req.spaceName || req.space || "N/A"}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-gray-600">
                                                    <Users className="w-3 h-3 mr-1.5" />
                                                    {req.seats}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {req.date} <br /> <span className="text-gray-400 text-xs">{req.time}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {req.status === 'pending' && <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>}
                                                {req.status === 'approved' && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>}
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
                                                    <span className="text-xs text-muted-foreground italic">Processed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {requests.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-muted-foreground">No requests found.</td>
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

export default AdminRequests;
