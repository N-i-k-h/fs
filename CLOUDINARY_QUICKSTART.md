# 🚀 Cloudinary Quick Start Guide

Get image uploads working in 5 minutes!

## Step 1: Get Your Cloudinary API Secret

1. Go to [cloudinary.com/console](https://cloudinary.com/console)
2. Log in to your account
3. Click on **Dashboard**
4. Find your **API Secret** (click "Reveal" to see it)
5. Copy the API Secret

## Step 2: Update Environment Variables

Open `server/.env` and replace the placeholder:

```env
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
```

With your actual API secret:

```env
CLOUDINARY_API_SECRET=abc123xyz789yourActualSecretHere
```

## Step 3: Start the Server

```bash
cd server
node index.js
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

## Step 4: Start the Frontend

In a new terminal:

```bash
npm run dev
```

## Step 5: Test It Out!

### Option A: Use the Example Page

1. Add this route to your router (e.g., `src/App.tsx` or router config):

```tsx
import ImageUploadExample from "@/pages/ImageUploadExample";

// In your routes:
<Route path="/image-upload-example" element={<ImageUploadExample />} />
```

2. Navigate to `http://localhost:5173/image-upload-example`
3. Upload an image and see it work!

### Option B: Add to Existing Form

```tsx
import ImageUpload from "@/components/ImageUpload";

const [imageUrl, setImageUrl] = useState("");

<ImageUpload
  onUploadComplete={setImageUrl}
  label="Upload Image"
/>
```

## 🎉 That's It!

Your images are now uploading to Cloudinary!

## Next Steps

- Read the full documentation: `CLOUDINARY_SETUP.md`
- Customize image transformations in `server/utils/cloudinary.js`
- Add authentication to the upload endpoint
- Integrate with your existing forms

## ⚠️ Important Notes

1. **Never commit your `.env` file** - It contains sensitive credentials
2. **Free tier limits** - Cloudinary free tier includes:
   - 25 GB storage
   - 25 GB bandwidth/month
   - 25,000 transformations/month

## 🐛 Troubleshooting

**Upload fails?**
- Check your API secret is correct
- Verify server is running on port 5000
- Check browser console for errors

**Images not showing?**
- Verify the URL returned is accessible
- Check network tab in browser dev tools

## 📚 Learn More

- Full documentation: `CLOUDINARY_SETUP.md`
- Cloudinary docs: [cloudinary.com/documentation](https://cloudinary.com/documentation)
