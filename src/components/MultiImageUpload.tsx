import { useState, useRef } from "react";
import { Upload, X, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

interface MultiImageUploadProps {
    onUploadComplete: (urls: string[]) => void;
    currentImages?: string[];
    label?: string;
    maxImages?: number;
    maxSizeMB?: number;
    acceptedFormats?: string[];
}

const MultiImageUpload = ({
    onUploadComplete,
    currentImages = [],
    label = "Upload Images",
    maxImages = 10,
    maxSizeMB = 5,
    acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"]
}: MultiImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>(currentImages);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Check if adding these files would exceed max images
        if (images.length + files.length > maxImages) {
            toast.error(`You can only upload up to ${maxImages} images`);
            return;
        }

        setUploading(true);
        const uploadedUrls: string[] = [];

        try {
            for (const file of files) {
                // Validate file type
                if (!acceptedFormats.includes(file.type)) {
                    toast.error(`${file.name} is not a valid image format`);
                    continue;
                }

                // Validate file size
                const fileSizeMB = file.size / (1024 * 1024);
                if (fileSizeMB > maxSizeMB) {
                    toast.error(`${file.name} exceeds ${maxSizeMB}MB`);
                    continue;
                }

                // Upload to Cloudinary
                const formData = new FormData();
                formData.append("image", file);

                try {
                    const response = await axios.post("/api/upload", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    uploadedUrls.push(response.data.url);
                } catch (error) {
                    console.error(`Error uploading ${file.name}:`, error);
                    toast.error(`Failed to upload ${file.name}`);
                }
            }

            if (uploadedUrls.length > 0) {
                const newImages = [...images, ...uploadedUrls];
                setImages(newImages);
                onUploadComplete(newImages);
                toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
            }
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        onUploadComplete(newImages);
        toast.success("Image removed");
    };

    const handleReorder = (fromIndex: number, toIndex: number) => {
        const newImages = [...images];
        const [movedImage] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, movedImage);
        setImages(newImages);
        onUploadComplete(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-xs text-gray-500">
                    {images.length} / {maxImages} images
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveImage(index)}
                                disabled={uploading}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        {index === 0 && (
                            <div className="absolute top-2 left-2 bg-teal text-white text-xs px-2 py-1 rounded">
                                Primary
                            </div>
                        )}
                    </div>
                ))}

                {images.length < maxImages && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal transition-colors bg-gray-50 hover:bg-gray-100"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-6 h-6 text-teal animate-spin mb-1" />
                                <p className="text-xs text-gray-500">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <Plus className="w-6 h-6 text-gray-400 mb-1" />
                                <p className="text-xs text-gray-600 font-medium">Add Image</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.join(",")}
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
                multiple
            />

            <p className="text-xs text-gray-500">
                Upload up to {maxImages} images. Max size: {maxSizeMB}MB per image. The first image will be the primary image.
            </p>
        </div>
    );
};

export default MultiImageUpload;
