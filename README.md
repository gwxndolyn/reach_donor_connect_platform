# 🌟 Reach Donor Connect Platform

A comprehensive web platform that strengthens engagement between **donors** and **beneficiaries** through real-time messaging, progress tracking, journal sharing, and gamified donation features. Built to create meaningful connections and transparency in charitable giving.

![Platform Demo](https://via.placeholder.com/800x400/0EA5E9/FFFFFF?text=Reach+Donor+Connect+Platform)

## 🚀 Key Features

### 💬 **Real-time Donor-Student Messaging**
- Instagram-style inbox with unread notification badges
- Real-time message synchronization
- Automatic read status updates when scrolling through messages
- Responsive chat interface with avatar support

### 📊 **Student Progress Tracking**
- Comprehensive learning reports with detailed scoring
- Progress updates from educators
- Subject-specific skill tracking (reading, writing, math, etc.)
- Overall performance scoring system

### 📓 **Digital Journal Sharing**
- Students can upload journal entries with images
- OCR processing for handwritten text extraction
- Staff can add journal topics and organize content
- Visual journal timeline for donors

### 🎯 **Donation Management**
- Secure donation processing
- One-time and recurring donation options
- Real-time donation tracking and history
- Child sponsorship linking system

### 🏆 **Gamified Experience**
- Region-based donor leaderboards
- Achievement badges and streak tracking
- Progress visualization with milestones
- Community engagement features

### 🔐 **Multi-role Authentication**
- Donor authentication and onboarding
- Staff member management system
- Role-based access control
- Secure session management with Supabase

## 🛠 Tech Stack

### **Frontend**
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible components
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icons
- **[Supabase Client](https://supabase.com/)** - Real-time database integration

### **Backend**
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern Python web framework
- **[Uvicorn](https://www.uvicorn.org/)** - Lightning-fast ASGI server
- **[Pytesseract](https://pypi.org/project/pytesseract/)** - OCR text extraction
- **[Pillow](https://pillow.readthedocs.io/)** - Image processing
- **[Pydantic](https://pydantic.dev/)** - Data validation
- **[Supabase Python Client](https://supabase.com/)** - Database operations

### **Database & Services**
- **[Supabase](https://supabase.com/)** - PostgreSQL database with real-time features
- **[Supabase Auth](https://supabase.com/auth)** - User authentication
- **[Supabase Storage](https://supabase.com/storage)** - File uploads and storage

## 📂 Project Structure

```
reach_donor_connect_platform/
├── 📁 frontend/                    # Next.js React application
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── 📁 (auth)/          # Protected routes
│   │   │   │   ├── 📁 home/        # Dashboard and inbox
│   │   │   │   ├── 📁 donations/   # Donation management
│   │   │   │   ├── 📁 leaderboard/ # Community rankings
│   │   │   │   └── 📁 staff/       # Staff management tools
│   │   │   ├── 📁 (public)/        # Public routes
│   │   │   │   ├── 📁 login/       # Authentication pages
│   │   │   │   └── 📁 signup/      # User registration
│   │   │   └── layout.tsx          # Root layout
│   │   ├── � components/          # Reusable UI components
│   │   ├── 📁 contexts/            # React contexts
│   │   ├── 📁 lib/                 # Utilities and configurations
│   │   └── 📁 utils/               # Helper functions
│   ├── 📄 package.json
│   └── 📄 next.config.ts
├── 📁 backend/                     # FastAPI Python application
│   ├── 📁 app/
│   │   ├── 📁 routes/              # API endpoints
│   │   │   ├── 📄 donor.py         # Donor-related operations
│   │   │   ├── 📄 student.py       # Student data management
│   │   │   └── 📄 notes.py         # Journal and notes handling
│   │   ├── 📁 services/            # Business logic
│   │   │   └── 📄 supabase_service.py  # Database operations
│   │   ├── 📁 models/              # Data models
│   │   └── 📄 main.py              # FastAPI application entry
│   └── 📄 requirements.txt
└── 📄 README.md
```

## ⚙️ Quick Start

### 1. **Clone the Repository**
```bash
git clone https://github.com/shelialia/reach_donor_connect_platform.git
cd reach_donor_connect_platform
```

### 2. **Backend Setup (FastAPI)**
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
python -m uvicorn app.main:app --reload
```
🚀 Backend runs at **http://localhost:8000**

### 3. **Frontend Setup (Next.js)**
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
🚀 Frontend runs at **http://localhost:3000**

### 4. **Environment Configuration**

Create `.env.local` in the `frontend/` directory:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create `.env` in the `backend/` directory:
```bash
# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-service-role-key

# Optional: AI Services
OPENAI_API_KEY=your-openai-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

## 🗄️ Database Schema

The platform uses Supabase (PostgreSQL) with the following key tables:

- **`donors`** - Donor profiles and authentication
- **`students`** - Student information and progress
- **`student_donor_links`** - Relationships between donors and students
- **`donations`** - Transaction records and history
- **`notifications`** - Real-time messaging system
- **`staff`** - Staff member management
- **`children`** - Child profiles for sponsorship

## 🌐 API Endpoints

### **Donor Operations**
- `GET /donor/get_all_children/{donor_id}` - Get linked students
- `GET /donor/get_all_notifications/{donor_id}/{student_id}` - Fetch messages
- `POST /donor/mark_notifications_read/{donor_id}/{student_id}` - Mark as read
- `GET /donor/unread_count/{donor_id}/{student_id}` - Get unread count

### **Student Operations**
- `POST /student/upload_journal` - Upload journal entries
- `GET /student/get_progress/{student_id}` - Get learning progress

### **Notes & Journal**
- `POST /notes/upload` - Process journal uploads with OCR
- `GET /notes/extract_text` - Extract text from images

## 🚀 Deployment

### **Frontend (Vercel)**
```bash
npm run build
# Deploy to Vercel or your preferred platform
```

### **Backend (Railway/Heroku)**
```bash
# Add Procfile for Heroku
echo "web: uvicorn app.main:app --host=0.0.0.0 --port=\$PORT" > Procfile
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for meaningful donor-beneficiary connections
- Special thanks to the Supabase team for the amazing platform
- UI components powered by shadcn/ui and Radix UI

---

**Made with 💙 to bridge the gap between donors and the communities they support**
