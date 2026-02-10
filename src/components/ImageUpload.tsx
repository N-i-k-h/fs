import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    currentImage?: string;
    label?: string;
    maxSizeMB?: number;
    acceptedFormats?: string[];
}

const ImageUpload = ({
    onUploadComplete,
    currentImage,
    label = "Upload Image",
    maxSizeMB = 5,
    acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"]
}: ImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(currentImage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!acceptedFormats.includes(file.type)) {
            toast.error(`Please upload a valid image file (${acceptedFormats.join(", ")})`);
            return;
        }

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            toast.error(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        setUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const imageUrl = response.data.url;
            onUploadComplete(imageUrl);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image. Please try again.");
            setPreview(currentImage);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setPreview(undefined);
        onUploadComplete("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>

            <div className="relative">
                {preview ? (
                    <div className="relative group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Change
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleRemoveImage}
                                disabled={uploading}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal transition-colors bg-gray-50 hover:bg-gray-100"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-8 h-8 text-teal animate-spin mb-2" />
                                <p className="text-sm text-gray-500">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Max size: {maxSizeMB}MB
                                </p>
                            </>
                        )}
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedFormats.join(",")}
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                />
            </div>

            {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-teal h-full animate-pulse" style={{ width: "100%" }} />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
