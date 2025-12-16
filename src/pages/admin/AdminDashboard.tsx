import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Building2, CalendarCheck, TrendingUp, Activity, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState<number | null>(null);
    const [analytics, setAnalytics] = useState<any>({
        totalRevenue: 0,
        pendingCount: 0,
        chartData: [],
        recentActivity: []
    });
    const [spaceCount, setSpaceCount] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Feature 1: User Count
                const userRes = await axios.get('http://localhost:5000/api/users/count');
                setUserCount(userRes.data.count);

                // Feature 2: Space Count
                const spaceRes = await axios.get('http://localhost:5000/api/spaces');
                setSpaceCount(spaceRes.data.length);

                // Feature 3: Advanced Analytics (Revenue, Chart, Activity)
                const analyticsRes = await axios.get('http://localhost:5000/api/requests/analytics');
                setAnalytics(analyticsRes.data);

            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();

        // Clock timer
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format chart data if empty (fallback)
    const chartData = analytics.chartData.length > 0 ? analytics.chartData : [
        { name: 'No Data', bookings: 0 }
    ];

    const StatCard = ({ title, value, subtext, icon: Icon, colorClass, borderClass }: any) => (
        <Card className={cn("overflow-hidden hover:shadow-md transition-shadow duration-300 border-l-4", borderClass)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</CardTitle>
                <div className={cn("p-2 rounded-full", colorClass.replace('text-', 'bg-').replace('600', '100').replace('500', '100'))}>
                    <Icon className={cn("h-4 w-4", colorClass)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-navy">{value}</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{subtext}</p>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-navy tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-2 text-sm max-w-lg">
                        Welcome back, Admin. Here's what's happening with your workspace platform today.
                    </p>
                </div>
                <div className="text-right">
                    <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-2xl font-mono font-bold text-teal">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider text-right">
                            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${analytics.totalRevenue.toLocaleString()}`}
                    subtext="From confirmed bookings"
                    icon={DollarSign}
                    colorClass="text-emerald-600"
                    borderClass="border-l-emerald-500"
                />
                <StatCard
                    title="Active Users"
                    value={userCount !== null ? userCount : '...'}
                    subtext="Total registered accounts"
                    icon={Users}
                    colorClass="text-blue-600"
                    borderClass="border-l-blue-500"
                />
                <StatCard
                    title="Pending Requests"
                    value={analytics.pendingCount}
                    subtext="Requires immediate attention"
                    icon={CalendarCheck}
                    colorClass="text-orange-600"
                    borderClass="border-l-orange-500"
                />
                <StatCard
                    title="Total Spaces"
                    value={spaceCount !== null ? spaceCount : '...'}
                    subtext="Live workspaces listed"
                    icon={Building2}
                    colorClass="text-purple-600"
                    borderClass="border-l-purple-500"
                />
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">

                {/* Main Graph */}
                <Card className="col-span-1 lg:col-span-4 shadow-md border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-navy">Booking Trends</CardTitle>
                        <CardDescription>Monthly overview of workspace bookings</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: '#6B7280' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                        tick={{ fill: '#6B7280' }}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            backgroundColor: '#1E293B',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar
                                        dataKey="bookings"
                                        fill="#0F766E"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity List */}
                <Card className="col-span-1 lg:col-span-3 shadow-md border-gray-200 flex flex-col">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-navy">Recent Activity</CardTitle>
                                <CardDescription>Latest approved bookings & revenue</CardDescription>
                            </div>
                            <Activity className="w-4 h-4 text-teal animate-pulse" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto pr-2 custom-scrollbar">
                        <div className="space-y-6">
                            {analytics.recentActivity.length > 0 ? (
                                analytics.recentActivity.map((activity: any, i: number) => (
                                    <div key={i} className="flex items-start gap-3 group relative">
                                        <div className="absolute left-[11px] top-8 bottom-[-24px] w-px bg-gray-100 last:hidden" />
                                        <div className="w-6 h-6 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0 z-10 group-hover:scale-110 transition-transform">
                                            <div className="w-2 h-2 rounded-full bg-teal" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-semibold text-navy leading-none">{activity.user}</p>
                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                    +₹{(activity.totalAmount || 0).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                Booked <span className="text-navy font-medium">{activity.spaceName || activity.space}</span>
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-medium">
                                                {new Date(activity.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground ring-1 ring-gray-100 rounded-lg bg-gray-50/50">
                                    <CalendarCheck className="w-8 h-8 mb-2 opacity-20" />
                                    <p className="text-sm">No recent approved bookings found.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
