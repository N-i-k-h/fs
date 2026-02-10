# Cloudinary Image Upload Integration

This project uses Cloudinary for cloud-based image storage and delivery. Images are automatically uploaded to Cloudinary's CDN, providing fast, reliable, and scalable image hosting.

## 🚀 Features

- ✅ Cloud-based image storage (no local server storage needed)
- ✅ Automatic image optimization and transformation
- ✅ CDN delivery for fast loading times
- ✅ Single and multiple image upload support
- ✅ Image preview before upload
- ✅ File size and format validation
- ✅ Drag-and-drop interface
- ✅ Progress indicators
- ✅ Reusable React components

## 📋 Prerequisites

1. A Cloudinary account (free tier available at [cloudinary.com](https://cloudinary.com))
2. Your Cloudinary credentials:
   - Cloud Name
   - API Key
   - API Secret

## ⚙️ Configuration

### 1. Environment Variables

Add your Cloudinary credentials to `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Current Configuration:**
- Cloud Name: `dqmfmhqzq`
- API Key: `G1VBm0r-A_MR3YXcBbf4dBB9fWs`
- API Secret: ⚠️ **IMPORTANT:** Replace `your_cloudinary_api_secret_here` with your actual API secret

### 2. Finding Your Cloudinary Credentials

1. Log in to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to **Dashboard** → **Account Details**
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret (click "Reveal" to see it)

## 🛠️ Backend Setup

### Files Created/Modified:

1. **`server/utils/cloudinary.js`** - Cloudinary configuration and multer setup
2. **`server/index.js`** - Updated to use Cloudinary storage
3. **`server/.env`** - Added Cloudinary credentials

### Upload Endpoint

**POST** `/api/upload`

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/flickspace/abc123.jpg",
  "public_id": "flickspace/abc123"
}
```

## 🎨 Frontend Components

### 1. ImageUpload Component

Single image upload with preview and validation.

**Location:** `src/components/ImageUpload.tsx`

**Usage:**
```tsx
import ImageUpload from "@/components/ImageUpload";

const [imageUrl, setImageUrl] = useState("");

<ImageUpload
  label="Upload Profile Picture"
  currentImage={imageUrl}
  onUploadComplete={setImageUrl}
  maxSizeMB={5}
  acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
/>
```

**Props:**
- `onUploadComplete: (url: string) => void` - Callback with uploaded image URL
- `currentImage?: string` - Current image URL for preview
- `label?: string` - Label text (default: "Upload Image")
- `maxSizeMB?: number` - Max file size in MB (default: 5)
- `acceptedFormats?: string[]` - Accepted MIME types

### 2. MultiImageUpload Component

Multiple image upload with grid preview.

**Location:** `src/components/MultiImageUpload.tsx`

**Usage:**
```tsx
import MultiImageUpload from "@/components/MultiImageUpload";

const [imageUrls, setImageUrls] = useState<string[]>([]);

<MultiImageUpload
  label="Upload Gallery Images"
  currentImages={imageUrls}
  onUploadComplete={setImageUrls}
  maxImages={10}
  maxSizeMB={5}
/>
```

**Props:**
- `onUploadComplete: (urls: string[]) => void` - Callback with array of uploaded URLs
- `currentImages?: string[]` - Current images for preview
- `label?: string` - Label text (default: "Upload Images")
- `maxImages?: number` - Maximum number of images (default: 10)
- `maxSizeMB?: number` - Max file size in MB per image (default: 5)
- `acceptedFormats?: string[]` - Accepted MIME types

## 📝 Example Implementation

See `src/pages/ImageUploadExample.tsx` for a complete working example.

**To view the example:**
1. Add the route to your router configuration
2. Navigate to `/image-upload-example`

## 🔧 Integration Examples

### Example 1: Add to Space Creation Form

```tsx
import MultiImageUpload from "@/components/MultiImageUpload";

const CreateSpace = () => {
  const [spaceData, setSpaceData] = useState({
    name: "",
    images: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit spaceData with Cloudinary URLs
    await axios.post("/api/spaces", spaceData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={spaceData.name}
        onChange={(e) => setSpaceData({ ...spaceData, name: e.target.value })}
      />
      
      <MultiImageUpload
        currentImages={spaceData.images}
        onUploadComplete={(urls) => setSpaceData({ ...spaceData, images: urls })}
      />
      
      <button type="submit">Create Space</button>
    </form>
  );
};
```

### Example 2: User Profile Picture

```tsx
import ImageUpload from "@/components/ImageUpload";

const UserProfile = () => {
  const [profilePic, setProfilePic] = useState("");

  const handleSave = async () => {
    await axios.patch("/api/users/profile", { avatar: profilePic });
  };

  return (
    <div>
      <ImageUpload
        label="Profile Picture"
        currentImage={profilePic}
        onUploadComplete={setProfilePic}
        maxSizeMB={2}
      />
      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
};
```

## 🎯 Image Transformations

Cloudinary automatically optimizes images. You can customize transformations in `server/utils/cloudinary.js`:

```javascript
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'flickspace',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' }, // Resize large images
      { quality: 'auto' }, // Auto quality
      { fetch_format: 'auto' } // Auto format (WebP for supported browsers)
    ]
  }
});
```

## 🔒 Security Best Practices

1. ✅ **Never commit `.env` files** - Already in `.gitignore`
2. ✅ **Use environment variables** - Credentials stored in `.env`
3. ✅ **Validate file types** - Components validate MIME types
4. ✅ **Limit file sizes** - Configurable max size per upload
5. ⚠️ **Add authentication** - Consider adding auth middleware to upload endpoint

### Optional: Secure Upload Endpoint

```javascript
// server/middleware/auth.js
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// In server/index.js
app.post('/api/upload', verifyToken, upload.single('image'), (req, res) => {
  // ... upload logic
});
```

## 📊 Cloudinary Dashboard

Monitor your uploads in the [Cloudinary Console](https://cloudinary.com/console):
- View all uploaded images
- Check storage usage
- Analyze bandwidth usage
- Configure upload presets
- Set up webhooks

## 🐛 Troubleshooting

### Issue: "Upload failed"
- ✅ Check that Cloudinary credentials are correct in `.env`
- ✅ Verify the server is running
- ✅ Check browser console for detailed error messages

### Issue: "File too large"
- ✅ Adjust `maxSizeMB` prop on the component
- ✅ Check Cloudinary account limits

### Issue: Images not displaying
- ✅ Verify the URL returned from upload is accessible
- ✅ Check CORS settings in Cloudinary dashboard
- ✅ Ensure the image URL is being saved correctly

## 📦 Dependencies

**Backend:**
- `cloudinary` - Cloudinary SDK
- `multer` - File upload middleware
- `multer-storage-cloudinary` - Cloudinary storage engine for Multer

**Frontend:**
- `axios` - HTTP client
- `lucide-react` - Icons
- `sonner` - Toast notifications

## 🚀 Deployment

When deploying to production:

1. Set environment variables on your hosting platform
2. Ensure `.env` is in `.gitignore`
3. Configure Cloudinary upload presets if needed
4. Consider setting up a CDN for your frontend

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Multer Documentation](https://github.com/expressjs/multer)
- [React File Upload Best Practices](https://react.dev/learn)

## ✅ Testing

Test the upload functionality:

1. Start the backend server: `cd server && node index.js`
2. Start the frontend: `npm run dev`
3. Navigate to the example page or any form with image upload
4. Upload an image and verify:
   - Preview appears correctly
   - Upload completes successfully
   - Cloudinary URL is returned
   - Image is accessible via the URL

---

**Need Help?** Check the example implementation in `src/pages/ImageUploadExample.tsx` or refer to the Cloudinary documentation.
