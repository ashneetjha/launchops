# 🚀 LaunchOps — AI-Powered Founder Command Center

LaunchOps is a full-stack AI platform that converts **unstructured startup documents** into **structured financial and operational intelligence**.

It enables founders to understand **revenue, burn rate, runway, and risk** in real time by combining **document ingestion**, **large-language models**, and **analytics**.

LaunchOps is designed to function as a **Founder Operating System** — a single source of truth across financial data, documents, and AI-generated insights.

---

## 📌 Product Overview

Early-stage founders typically manage:

- Financial spreadsheets  
- Pitch decks  
- Legal and compliance documents  
- Revenue and expense reports  

These artifacts are usually scattered across tools and formats, making unified analysis difficult.

**LaunchOps ingests these documents and uses AI to generate:**

- Revenue and burn metrics  
- Runway calculations  
- Risk signals  
- Natural-language answers about the company  

All outputs are presented through a **real-time interactive dashboard**.

---

## 🏗️ System Architecture



Frontend (React + Vite)
|
|  REST API (Axios)
|
Backend (Node.js + Express)
|
|  JWT Authentication
|
MongoDB Atlas
|
|  User data, documents, metrics
|
Groq LLM API



## 🧰 Technology Stack

### Frontend
- React (Vite)
- React Router
- Framer Motion (animations)
- Recharts (data visualization)
- Lucide Icons
- Custom dark / light theming

### Backend
- Node.js
- Express
- MongoDB (Atlas)
- JWT authentication
- bcrypt password hashing
- Cloudinary file storage
- Groq LLM API

---

## ✨ Core Features

### 🔐 Authentication & User Management
- Secure registration and login
- Password hashing using bcrypt
- JWT-based session handling
- Onboarding flow for new users

### 📄 Document Intelligence
- File upload and secure storage
- Documents linked to individual projects
- AI-powered document reading and parsing

### 🧠 AI Command Center
- Ask natural-language questions about the company
- AI analyzes all uploaded documents
- Generates financial insights and risk summaries

### 📊 Founder Dashboard
- Revenue tracking
- Monthly burn calculation
- Runway estimation
- Risk level assessment
- Growth projections via charts

### 📁 Project & Work Item Management
- Each startup modeled as a work item
- Documents, metrics, and insights scoped per project

---

## 🔒 Security Model

- Passwords are **never** stored in plaintext
- bcrypt hashing for credential storage
- JWT tokens protect all private routes
- All sensitive keys stored in environment variables
- Database access restricted to authenticated users only

---

## 🌐 API Endpoints

| Route | Description |
|------|-------------|
| POST `/api/auth/register` | Create account |
| POST `/api/auth/login` | Authenticate user |
| GET `/api/work` | List projects |
| POST `/api/documents` | Upload documents |
| GET `/api/documents` | Retrieve documents |
| POST `/api/ai/analyze` | Ask AI questions |
| POST `/api/ai/extract-metrics` | Generate dashboard metrics |
| POST `/api/ai/alerts` | Run risk analysis |
| GET `/api/dashboard` | Aggregated analytics |

---

## 🛠️ Running Locally

### 1️⃣ Clone the Repository

git clone https://github.com/ashneetjha/launchops.git
cd launchops


### 2️⃣ Backend Setup

cd backend
npm install
npm run dev

Create a `.env` file inside `/backend`:

env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_api_key



### 3️⃣ Frontend Setup


cd frontend
npm install
npm run dev


## 🎯 Intended Use

LaunchOps is designed for:

* Startup founders
* Finance teams
* Early-stage investors
* Incubators and accelerators

The platform enables **rapid understanding of a company’s financial health** without manually analyzing spreadsheets, pitch decks, or compliance documents.


## 📈 Vision

LaunchOps aims to become a **default operating layer for founders**, where strategy, finance, documents, and intelligence converge into one AI-driven command center.
