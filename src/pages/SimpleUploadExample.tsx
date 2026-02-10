import { useState } from "react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

/**
 * Simple example showing how to use the useImageUpload hook
 * This is a minimal implementation without the full UI components
 */
const SimpleUploadExample = () => {
    const [imageUrl, setImageUrl] = useState<string>("");

    const { uploading, uploadImage } = useImageUpload({
        maxSizeMB: 5,
        onSuccess: (url) => {
            console.log("Image uploaded successfully:", url);
            setImageUrl(url);
        },
        onError: (error) => {
            console.error("Upload error:", error);
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadImage(file);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Simple Upload Example</h2>

            <div className="space-y-4">
                <div>
                    <label className="block mb-2">
                        <span className="text-sm font-medium">Upload Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            className="block w-full mt-1 text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-teal file:text-white
                hover:file:bg-teal/90
                disabled:opacity-50"
                        />
                    </label>
                </div>

                {uploading && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                    </div>
                )}

                {imageUrl && (
                    <div className="space-y-2">
                        <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <div className="p-2 bg-green-50 border border-green-200 rounded text-xs break-all">
                            <strong>URL:</strong> {imageUrl}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-sm mb-2">Hook Usage:</h3>
                <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                    {`const { uploading, uploadImage } = useImageUpload({
  maxSizeMB: 5,
  onSuccess: (url) => setImageUrl(url)
});

const handleFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (file) {
    await uploadImage(file);
  }
};`}
                </pre>
            </div>
        </div>
    );
};

export default SimpleUploadExample;
