import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface UseImageUploadOptions {
    maxSizeMB?: number;
    acceptedFormats?: string[];
    onSuccess?: (url: string) => void;
    onError?: (error: Error) => void;
}

interface UseImageUploadReturn {
    uploading: boolean;
    uploadImage: (file: File) => Promise<string | null>;
    uploadMultipleImages: (files: File[]) => Promise<string[]>;
    error: Error | null;
}

/**
 * Custom hook for uploading images to Cloudinary
 * 
 * @example
 * const { uploading, uploadImage } = useImageUpload({
 *   maxSizeMB: 5,
 *   onSuccess: (url) => console.log('Uploaded:', url)
 * });
 * 
 * const handleFileChange = async (e) => {
 *   const file = e.target.files[0];
 *   const url = await uploadImage(file);
 *   if (url) {
 *     // Use the uploaded image URL
 *   }
 * };
 */
export const useImageUpload = (options: UseImageUploadOptions = {}): UseImageUploadReturn => {
    const {
        maxSizeMB = 5,
        acceptedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"],
        onSuccess,
        onError,
    } = options;

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const validateFile = (file: File): boolean => {
        // Validate file type
        if (!acceptedFormats.includes(file.type)) {
            const errorMsg = `Invalid file type. Accepted formats: ${acceptedFormats.join(", ")}`;
            const err = new Error(errorMsg);
            setError(err);
            toast.error(errorMsg);
            onError?.(err);
            return false;
        }

        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            const errorMsg = `File size must be less than ${maxSizeMB}MB`;
            const err = new Error(errorMsg);
            setError(err);
            toast.error(errorMsg);
            onError?.(err);
            return false;
        }

        return true;
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        if (!validateFile(file)) {
            return null;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await axios.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const imageUrl = response.data.url;
            toast.success("Image uploaded successfully!");
            onSuccess?.(imageUrl);
            return imageUrl;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("Upload failed");
            setError(error);
            toast.error("Failed to upload image");
            onError?.(error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
        setUploading(true);
        setError(null);

        const uploadedUrls: string[] = [];
        const failedFiles: string[] = [];

        for (const file of files) {
            if (!validateFile(file)) {
                failedFiles.push(file.name);
                continue;
            }

            try {
                const formData = new FormData();
                formData.append("image", file);

                const response = await axios.post("/api/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                uploadedUrls.push(response.data.url);
            } catch (err) {
                console.error(`Error uploading ${file.name}:`, err);
                failedFiles.push(file.name);
            }
        }

        setUploading(false);

        if (uploadedUrls.length > 0) {
            toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
        }

        if (failedFiles.length > 0) {
            toast.error(`Failed to upload: ${failedFiles.join(", ")}`);
        }

        return uploadedUrls;
    };

    return {
        uploading,
        uploadImage,
        uploadMultipleImages,
        error,
    };
};

export default useImageUpload;
