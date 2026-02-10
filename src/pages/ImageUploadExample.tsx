import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const ImageUploadExample = () => {
    const navigate = useNavigate();
    const [singleImage, setSingleImage] = useState<string>("");
    const [multipleImages, setMultipleImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!singleImage && multipleImages.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

        try {
            // Example: Submit form data with images
            const data = {
                name: formData.name,
                description: formData.description,
                primaryImage: singleImage,
                images: multipleImages,
            };

            console.log("Form data to submit:", data);

            // You can send this data to your backend
            // await axios.post("/api/your-endpoint", data);

            toast.success("Form submitted successfully!");
            // navigate("/success");
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Failed to submit form");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">
                            Image Upload Example
                        </h1>
                        <p className="text-gray-600">
                            Upload images to Cloudinary using our custom components
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Form Fields */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-navy mb-4">Basic Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal transition-colors"
                                        placeholder="Enter name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal transition-colors"
                                        placeholder="Enter description"
                                        rows={4}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Single Image Upload */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-navy mb-4">Primary Image</h2>
                            <ImageUpload
                                label="Upload a primary image"
                                currentImage={singleImage}
                                onUploadComplete={setSingleImage}
                                maxSizeMB={5}
                            />
                            {singleImage && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-700">
                                        <strong>Uploaded URL:</strong> {singleImage}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Multiple Images Upload */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-navy mb-4">Gallery Images</h2>
                            <MultiImageUpload
                                label="Upload multiple images"
                                currentImages={multipleImages}
                                onUploadComplete={setMultipleImages}
                                maxImages={10}
                                maxSizeMB={5}
                            />
                            {multipleImages.length > 0 && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-700 font-medium mb-2">
                                        Uploaded {multipleImages.length} image(s):
                                    </p>
                                    <ul className="text-xs text-blue-600 space-y-1">
                                        {multipleImages.map((url, index) => (
                                            <li key={index} className="truncate">
                                                {index + 1}. {url}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-[#002b4d] hover:bg-teal text-white"
                            >
                                Submit Form
                            </Button>
                        </div>
                    </form>

                    {/* Usage Instructions */}
                    <div className="mt-12 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="text-lg font-bold text-navy mb-4">How to Use</h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            <div>
                                <strong className="text-navy">Single Image Upload:</strong>
                                <p className="mt-1">Use the <code className="bg-white px-2 py-1 rounded text-xs">ImageUpload</code> component for uploading a single image with preview and remove functionality.</p>
                            </div>
                            <div>
                                <strong className="text-navy">Multiple Images Upload:</strong>
                                <p className="mt-1">Use the <code className="bg-white px-2 py-1 rounded text-xs">MultiImageUpload</code> component for uploading multiple images with a grid preview.</p>
                            </div>
                            <div>
                                <strong className="text-navy">Integration:</strong>
                                <p className="mt-1">Both components automatically upload to Cloudinary and return the CDN URLs that you can store in your database.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ImageUploadExample;
