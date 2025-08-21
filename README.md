This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Donor Connect Platform

A web platform that strengthens engagement between **donors** and **beneficiaries** through appreciation letters, progress tracking, and gamified leaderboards.  
Built with **React (TypeScript)**, **FastAPI (Python)**, **Supabase**, and an **OCR model** to process handwritten letters.  

---

## 🚀 Features
- 📜 **Appreciation Letters** – Beneficiaries upload handwritten notes; OCR extracts text for donors.  
- 📊 **Progress Reports** – Track language growth (grammar, vocabulary, sentence complexity).  
- 🏆 **Leaderboard** – Rank donors by amount or referrals, with badges for streaks.  
- 🌍 **Region-based Progress Bars** – Donations mapped to real-world milestones (e.g. books, lessons).  
- 🔐 **Supabase Integration** – Authentication & database for users, letters, and donations.  

---

## 🛠 Tech Stack
### Frontend
- [Next.js (React + TypeScript)](https://nextjs.org/)  
- [TailwindCSS](https://tailwindcss.com/) for styling  
- [Supabase JS](https://supabase.com/docs/reference/javascript) client  

### Backend
- [FastAPI](https://fastapi.tiangolo.com/)  
- [Uvicorn](https://www.uvicorn.org/) server  
- [Pytesseract](https://pypi.org/project/pytesseract/) + [Pillow](https://pillow.readthedocs.io/) for OCR  
- [Supabase Python client](https://supabase.com/docs/reference/python)  

---

## 📂 Project Structure

---
## ⚙️ Setup

### 1. Clone Repo
```bash
git clone https://github.com/YOUR_USERNAME/donor-connect-platform.git
cd donor-connect-platform
```

### 2. Backend (FastAPI + OCR)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend runs at http://localhost:8000

### 3. Frontend (React + TS + Supabase)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:3000

### 4. 🔑 Environment Variables

Create .env inside frontend/:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
