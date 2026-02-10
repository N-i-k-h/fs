# 🧪 Testing Cloudinary Image Upload - Step by Step

## Prerequisites

Before testing, make sure you have:
- ✅ Added your Cloudinary API Secret to `server/.env`
- ✅ Both backend and frontend servers running

## 🚀 Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd server
node index.js
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected
Serving uploads from: C:\Users\lenovo\OneDrive\Desktop\flickspacefrontend-master\server\uploads
```

✅ If you see this, the backend is ready!

## 🎨 Step 2: Start the Frontend Server

Open a **NEW** terminal (keep the backend running) and run:

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ If you see this, the frontend is ready!

## 🧪 Step 3: Test the Upload

### Option A: Full-Featured Test Page

1. Open your browser
2. Navigate to: **http://localhost:5173/test-upload**
3. You should see a page titled "Image Upload Example"

**What to test:**
- ✅ Upload a single image in the "Primary Image" section
- ✅ Upload multiple images in the "Gallery Images" section
- ✅ Try uploading a large file (should show error if > 5MB)
- ✅ Try uploading a non-image file (should show error)
- ✅ Check that the Cloudinary URL appears below the upload

### Option B: Simple Test Page

1. Navigate to: **http://localhost:5173/test-upload-simple**
2. You should see a minimal upload interface

**What to test:**
- ✅ Click "Choose File" and select an image
- ✅ Wait for upload to complete
- ✅ Verify the image appears below
- ✅ Check the Cloudinary URL is displayed

## 🔍 Step 4: Verify Upload Success

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for messages like:
   ```
   Image uploaded successfully: https://res.cloudinary.com/...
   ```

### Check Network Tab
1. In DevTools, go to Network tab
2. Upload an image
3. Look for a request to `/api/upload`
4. Click on it and check:
   - **Status:** Should be `200 OK`
   - **Response:** Should contain `{ "url": "https://res.cloudinary.com/...", "public_id": "..." }`

### Check Cloudinary Dashboard
1. Go to [cloudinary.com/console](https://cloudinary.com/console)
2. Click on "Media Library"
3. Look for the `flickspace` folder
4. Your uploaded images should appear there!

## ✅ Success Indicators

You'll know it's working when:

1. **Toast Notification:** Green success message appears
2. **Image Preview:** Uploaded image displays on the page
3. **URL Display:** Cloudinary URL is shown (starts with `https://res.cloudinary.com/`)
4. **Network Request:** `/api/upload` returns 200 status
5. **Cloudinary Dashboard:** Image appears in Media Library

## ❌ Troubleshooting

### Upload Fails with "Upload failed"

**Check Backend Console:**
```bash
# Look for errors in the terminal running the backend
# Common issues:
- "Invalid credentials" → Check API Secret in .env
- "File too large" → Reduce image size
- "CORS error" → Backend not running or wrong port
```

**Solutions:**
1. Verify API Secret is correct in `server/.env`
2. Restart backend server after changing `.env`
3. Check backend is running on port 5000

### "Failed to load workspace details" or similar

**Solution:**
- Make sure backend is running: `cd server && node index.js`
- Check MongoDB connection is successful

### Images Upload but Don't Display

**Check:**
1. Browser console for CORS errors
2. Cloudinary URL is accessible (paste in browser)
3. Network tab shows successful response

### TypeScript Errors in Console

**Solution:**
```bash
# Restart the dev server
npm run dev
```

## 📊 Test Checklist

- [ ] Backend server started successfully
- [ ] Frontend server started successfully
- [ ] Can access http://localhost:5173/test-upload
- [ ] Can upload a single image
- [ ] Single image preview appears
- [ ] Cloudinary URL is displayed
- [ ] Can upload multiple images
- [ ] Multiple images appear in grid
- [ ] File validation works (try large file)
- [ ] Error messages appear correctly
- [ ] Images appear in Cloudinary dashboard

## 🎯 Quick Test Commands

### Terminal 1 (Backend):
```bash
cd c:\Users\lenovo\OneDrive\Desktop\flickspacefrontend-master\server
node index.js
```

### Terminal 2 (Frontend):
```bash
cd c:\Users\lenovo\OneDrive\Desktop\flickspacefrontend-master
npm run dev
```

### Browser:
```
http://localhost:5173/test-upload
```

## 📸 What You Should See

### Test Upload Page:
1. Header: "Image Upload Example"
2. Form with name and description fields
3. "Primary Image" upload section
4. "Gallery Images" upload section
5. Submit button

### After Upload:
1. Green toast notification: "Image uploaded successfully!"
2. Image preview appears
3. Green box showing Cloudinary URL
4. For multiple images: Blue box showing all URLs

## 🔗 Test URLs

- **Full Test Page:** http://localhost:5173/test-upload
- **Simple Test Page:** http://localhost:5173/test-upload-simple
- **Backend API:** http://localhost:5000/api/upload (POST only)

## 📝 Notes

- First upload might take a few seconds
- Subsequent uploads are usually faster
- Images are stored permanently in Cloudinary
- You can delete test images from Cloudinary dashboard

---

**Need Help?** Check the main documentation in `CLOUDINARY_SETUP.md`
