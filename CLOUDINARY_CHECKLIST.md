# Cloudinary Integration Checklist

Use this checklist to ensure your Cloudinary integration is properly set up and working.

## ✅ Setup Checklist

### 1. Backend Configuration

- [ ] **Cloudinary account created**
  - Sign up at [cloudinary.com](https://cloudinary.com)
  - Free tier is sufficient for development

- [ ] **Environment variables configured** (`server/.env`)
  - [ ] `CLOUDINARY_CLOUD_NAME` set to: `dqmfmhqzq`
  - [ ] `CLOUDINARY_API_KEY` set to: `G1VBm0r-A_MR3YXcBbf4dBB9fWs`
  - [ ] `CLOUDINARY_API_SECRET` set to: `your_actual_secret_here` ⚠️ **ACTION REQUIRED**

- [ ] **Dependencies installed**
  ```bash
  cd server
  npm install
  # Should have: cloudinary, multer, multer-storage-cloudinary
  ```

- [ ] **Cloudinary utility configured** (`server/utils/cloudinary.js`)
  - File exists ✓
  - Exports `upload` middleware ✓

- [ ] **Server updated** (`server/index.js`)
  - Imports cloudinary config ✓
  - Upload endpoint configured ✓
  - Returns Cloudinary URLs ✓

### 2. Frontend Components

- [ ] **ImageUpload component** (`src/components/ImageUpload.tsx`)
  - File exists ✓
  - Imports working ✓
  - Props documented ✓

- [ ] **MultiImageUpload component** (`src/components/MultiImageUpload.tsx`)
  - File exists ✓
  - Imports working ✓
  - Props documented ✓

- [ ] **useImageUpload hook** (`src/hooks/useImageUpload.ts`)
  - File exists ✓
  - Exports working ✓
  - TypeScript types defined ✓

### 3. Testing

- [ ] **Backend server running**
  ```bash
  cd server
  node index.js
  # Should see: "Server running on port 5000"
  ```

- [ ] **Frontend running**
  ```bash
  npm run dev
  # Should see: "Local: http://localhost:5173"
  ```

- [ ] **Upload endpoint accessible**
  - Test: `POST http://localhost:5000/api/upload`
  - Should accept multipart/form-data
  - Should return JSON with `url` field

- [ ] **Test single image upload**
  - Use ImageUpload component
  - Select an image
  - Verify upload completes
  - Check Cloudinary URL is returned
  - Verify image displays correctly

- [ ] **Test multiple image upload**
  - Use MultiImageUpload component
  - Select multiple images
  - Verify all upload successfully
  - Check all Cloudinary URLs are returned
  - Verify images display in grid

- [ ] **Test file validation**
  - Try uploading a non-image file (should fail)
  - Try uploading a file > max size (should fail)
  - Verify error messages appear

### 4. Integration

- [ ] **Choose integration method**
  - [ ] Option A: Use ImageUpload component
  - [ ] Option B: Use MultiImageUpload component
  - [ ] Option C: Use useImageUpload hook with custom UI

- [ ] **Add to your form/page**
  - Import component or hook
  - Add to JSX
  - Connect to state management
  - Handle uploaded URLs

- [ ] **Test in your application**
  - Upload images through your form
  - Verify URLs are saved correctly
  - Verify images display correctly
  - Test form submission with images

### 5. Production Readiness

- [ ] **Security**
  - [ ] `.env` file in `.gitignore` ✓
  - [ ] API Secret not committed to git ✓
  - [ ] Consider adding authentication to upload endpoint
  - [ ] Set up CORS properly for production

- [ ] **Cloudinary Settings**
  - [ ] Review upload presets (optional)
  - [ ] Configure folder structure (default: `flickspace/`)
  - [ ] Set up transformations (default: resize to 1920x1080)
  - [ ] Check storage limits

- [ ] **Error Handling**
  - [ ] Test error scenarios
  - [ ] Verify error messages are user-friendly
  - [ ] Check console logs for debugging info
  - [ ] Implement retry logic (optional)

- [ ] **Performance**
  - [ ] Images load quickly via CDN ✓
  - [ ] Transformations applied correctly ✓
  - [ ] Consider lazy loading for multiple images
  - [ ] Monitor Cloudinary usage/bandwidth

### 6. Documentation

- [ ] **Team documentation**
  - [ ] Share `CLOUDINARY_QUICKSTART.md` with team
  - [ ] Document any custom configurations
  - [ ] Add to project README

- [ ] **Code documentation**
  - [ ] Component props documented ✓
  - [ ] Hook usage documented ✓
  - [ ] Examples provided ✓

## 🚨 Common Issues Checklist

If something isn't working, check these:

- [ ] **Upload fails with 401 Unauthorized**
  - Check API Secret is correct in `.env`
  - Verify `.env` file is being loaded
  - Restart server after changing `.env`

- [ ] **Upload fails with 400 Bad Request**
  - Check file is being sent as `multipart/form-data`
  - Verify field name is `image`
  - Check file size is within limits

- [ ] **Images not displaying**
  - Verify Cloudinary URL is correct
  - Check browser console for CORS errors
  - Verify image URL is accessible in browser

- [ ] **Slow uploads**
  - Check internet connection
  - Verify file size is reasonable
  - Consider implementing progress indicators

- [ ] **TypeScript errors**
  - Verify all imports are correct
  - Check component props match interfaces
  - Run `npm install` to ensure types are installed

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] **Environment Variables**
  - [ ] Set Cloudinary credentials on hosting platform
  - [ ] Verify `.env` is not deployed
  - [ ] Test with production credentials

- [ ] **Build Process**
  - [ ] Frontend builds successfully
  - [ ] Backend starts without errors
  - [ ] All dependencies installed

- [ ] **Testing**
  - [ ] Test upload in production environment
  - [ ] Verify images load from Cloudinary CDN
  - [ ] Test error scenarios
  - [ ] Check mobile responsiveness

- [ ] **Monitoring**
  - [ ] Set up Cloudinary usage alerts
  - [ ] Monitor bandwidth usage
  - [ ] Track storage usage
  - [ ] Review transformation usage

## 🎯 Quick Verification

Run this quick test to verify everything is working:

1. **Start servers**
   ```bash
   # Terminal 1
   cd server && node index.js
   
   # Terminal 2
   npm run dev
   ```

2. **Open browser**
   - Navigate to your app
   - Find a form with image upload

3. **Upload test image**
   - Select an image
   - Wait for upload to complete
   - Verify success message
   - Check image displays correctly

4. **Verify Cloudinary**
   - Log in to [Cloudinary Console](https://cloudinary.com/console)
   - Check "Media Library"
   - Verify image appears in `flickspace/` folder

✅ If all steps pass, your integration is working correctly!

## 📞 Need Help?

- [ ] Checked `CLOUDINARY_SETUP.md` for detailed docs
- [ ] Reviewed example implementations
- [ ] Checked Cloudinary dashboard for errors
- [ ] Reviewed browser console for errors
- [ ] Checked server logs for errors

---

**Last Updated:** After Cloudinary integration
**Status:** Ready for use (pending API Secret configuration)
