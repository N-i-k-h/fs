# FlickSpace 🚀

**The Modern Workspace Booking Platform**

FlickSpace is a premium, full-stack web application designed to simplify the process of finding and booking flexible office spaces. Whether you're a freelancer looking for a hot desk or a startup needing a private office, FlickSpace connects you with the perfect environment.

Built with a focus on aesthetics, user experience, and robust administration, FlickSpace features a responsive React frontend and a scalable Node.js/Express backend.

---

## ✨ Key Features

### 🏢 For Users
- **Smart Search & Filtering**: Find workspaces by City, Location (Market), Type (Private Office, Dedicated Desk, etc.), Price, and Capacity.
- **AI Workspace Assistant**: An interactive ChatBot that guides users to their ideal workspace based on natural language inputs.
- **Interactive Maps**: (Optional) Integrated map view to visualize workspace locations.
- **Detailed Listings**: High-quality image galleries, amenity lists, and live pricing for every space.
- **Seamless Booking**: Easy inquiry and tour booking process.
- **Google Authentication**: Secure and quick login/signup using Google.

### 🛡️ For Admins
- **Comprehensive Dashboard**: Real-time analytics on Revenue, Active Users, Pending Requests, and Total Spaces.
- **Visual Analytics**: Interactive charts and trend lines for booking data.
- **Request Management**: Approve or Reject booking requests with automated email notifications.
- **Space Management**: Full Create, Read, Update, Delete (CRUD) capabilities for workspace listings.
- **User Management**: View and manage registered users.
- **Mobile-First Admin Panel**: Fully responsive admin interface with drawer navigation for on-the-go management.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Shadcn UI (`@components/ui`)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Context API (AuthContext)
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens), Google OAuth
- **Email Service**: Brevo (formerly Sendinblue) / Nodemailer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB Connection URI
- Google OAuth Credentials
- Brevo/SMTP API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flickspace.git
   cd flickspace
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   Create a `.env` file in the `server/` directory with the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   BREVO_USER=your_brevo_email
   BREVO_PASS=your_brevo_smtp_key
   ```

### Running Locally

You can run both frontend and backend concurrently (if setup) or in separate terminals.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev  # or node index.js
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Visit `http://localhost:5173` to view the app!

---

## ☁️ Deployment (Render)

This project is configured for monolithic deployment on **Render**.

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. **Build Command**: `./render-build.sh` (This script installs dependencies for both folders and builds the React app).
4. **Start Command**: `node server/index.js`
5. Add your Environment Variables in the Render dashboard.

The backend is configured to serve the static Frontend build files in production, making it a unified deployment.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
