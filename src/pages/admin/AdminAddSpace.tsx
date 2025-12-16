import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Save } from "lucide-react";

const AdminAddSpace = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-navy">Add New Workspace</h1>
                    <p className="text-muted-foreground mt-1">List a new coworking space on the platform.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button className="bg-teal hover:bg-teal/90 text-white"><Save className="w-4 h-4 mr-2" /> Publish Space</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Space Name</Label>
                                    <Input id="name" placeholder="e.g. WeWork Galaxy" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Space Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="private-office">Private Office</SelectItem>
                                            <SelectItem value="hot-desk">Hot Desk</SelectItem>
                                            <SelectItem value="meeting-room">Meeting Room</SelectItem>
                                            <SelectItem value="coworking">Coworking</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" placeholder="Describe the workspace, vibe, and community..." className="h-32" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Full Address</Label>
                                <Input id="address" placeholder="e.g. 43, Residency Rd, Ashok Nagar" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select City" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bangalore">Bangalore</SelectItem>
                                            <SelectItem value="mumbai">Mumbai</SelectItem>
                                            <SelectItem value="delhi">Delhi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="area">Micro Market (Area)</Label>
                                    <Input id="area" placeholder="e.g. Koramangala" />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="mapLink">Google Maps Link</Label>
                                <Input id="mapLink" placeholder="e.g. https://maps.app.goo.gl/..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="lat">Latitude</Label>
                                    <Input id="lat" placeholder="e.g. 12.9716" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lng">Longitude</Label>
                                    <Input id="lng" placeholder="e.g. 77.5946" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Capacity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (Monthly)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                        <Input id="price" type="number" className="pl-8" placeholder="10000" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Total Seats</Label>
                                    <Input id="capacity" type="number" placeholder="50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="size">Size (sq ft)</Label>
                                    <Input id="size" type="number" placeholder="2500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parking">Parking Spots</Label>
                                    <Input id="parking" type="number" placeholder="e.g. 10" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Media & Amenities */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {['Wifi', 'AC', 'Parking', 'Coffee', 'Meeting Rooms', 'Power Backup', 'Reception', 'Printers'].map((amenity) => (
                                    <div key={amenity} className="flex items-center space-x-2">
                                        <input type="checkbox" id={amenity} className="rounded border-gray-300 text-teal focus:ring-teal" />
                                        <label htmlFor={amenity} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {amenity}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-teal/10 flex items-center justify-center mb-3">
                                    <Upload className="w-6 h-6 text-teal" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Click to upload</p>
                                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            </div>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded border">
                                    <span className="truncate max-w-[150px]">office_front.jpg</span>
                                    <span className="text-green-600 text-xs font-bold">100%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Location Map Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                                    <Upload className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Upload Map Image</p>
                                <p className="text-xs text-muted-foreground mt-1">Custom map view (optional)</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminAddSpace;
