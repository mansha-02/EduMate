# EduMate – Personalized Education Platform 🎓🤖

EduMate is an AI-powered personalized education platform built to revolutionize the way students study. It combines intelligent study planning, smart content curation, document analysis, and productivity tools to help learners achieve their academic goals efficiently.

<img src="https://github.com/user-attachments/assets/07377481-6aaf-4c58-9d76-001bba50a741" width="500" />


---


## 🚀 Features

### 🔍 AI-Powered Study Planner
- Personalized schedules based on subjects, exam dates, and user preferences.
- Weekly milestones and daily task breakdowns.
- Dynamic updates to accommodate changing timelines.

<img src="https://github.com/user-attachments/assets/6befd93c-4d6c-4e71-a0a2-d20cf31e606c" width="500" />

### 📚 Smart Resource Curation
- Integrated with **Tavily API** for high-quality content discovery.
- Ranks content using a quality scoring algorithm.
- Supports video tutorials, articles, documentation, and more.

  <img src="https://github.com/user-attachments/assets/4f9163d7-d128-4026-9f29-612c489e2f38" width="500" />

### 📄 Interactive PDF Chat Assistant
- Upload PDFs and ask context-aware questions.
- Receive intelligent responses with source references.
- Navigate and query documents with an AI-integrated chat interface.

  <img src="https://github.com/user-attachments/assets/72d5ad9f-5d88-4a04-936e-03242a72bf34" width="500" />

### ⏱️ Productivity Tools
- Pomodoro timer with adjustable intervals.
- Session history to track and improve study patterns.
- Notes management system for organized learning.

<img src="https://github.com/user-attachments/assets/ffa4a8d4-3e2c-46fd-8f2f-a3becf64fc5d" width="500" />

<img src="https://github.com/user-attachments/assets/69e0bd09-95cb-4aea-8b38-1b76c6649ce9" width="500" />

---

## 🧑‍💻 Tech Stack

### Frontend
- **Next.js 14** with App Router (SSR & SSG)
- **TypeScript** for static typing
- **Tailwind CSS** for utility-first styling
- **Shadcn UI** for modern component design
- **Zustand + React Query** for state management & data fetching
- **React-PDF + PDF.js** for PDF interaction

### Backend
- **Node.js** with **Express** for server logic
- **MongoDB** + **Mongoose ODM** for flexible NoSQL data handling
- **JWT Authentication** for secure access
- **Rate Limiting** to prevent abuse

  <img src="https://github.com/user-attachments/assets/f4f4b7b5-7f57-42a7-9816-c04d576d58eb1" width="500" />
  


### AI & APIs
- **Groq API** – Generates personalized study plans
- **Tavily API** – Finds and ranks educational resources
- **Hugging Face** – Embedding-powered PDF comprehension

---

## 🧠 System Architecture

- **Frontend Layer**: Interactive UI and PDF tools.
- **Backend Layer**: API handling, authentication, AI integration.
- **Database Layer**: User data, study plans, notes.
- **AI Services**: Study planner, resource curation, document Q&A.

---
![dfd1](https://github.com/user-attachments/assets/fe4d814d-d951-4ee8-b68f-3e83ca7307a2)



---
## Installation
### 1. Clone the Repository

```git clone https://github.com/mansha-02/EduMate```

```cd EduMate```
### 2. Install Dependencies
Frontend:

```npm install```

Backend:

```cd server```

```npm install```
### 3. Set Up Environment Variables
Frontend (.env.local in root directory):

#### Frontend Environment Variables

```NEXT_PUBLIC_API_URL=http://localhost:5000```

```NEXTAUTH_URL=http://localhost:3000```

```NEXTAUTH_SECRET=your-secret-key```

#### Database

```MONGODB_URI=your-mongodb-uri```
Backend (server/.env):

```PORT=5000```

```MONGODB_URI=your-mongodb-uri```

```GROQ_API_KEY=your-groq-api-key```

```TAVILY_API_KEY=your-tavily-api-key```

```HUGGINGFACE_API_KEY=your-huggingface-api-key```

```JWT_SECRET=your-jwt-secret```

### 4. Start the Development Servers
Frontend:

```npm run dev```

Backend:

```cd server```

```npm run dev```

## Usage Guide
### Study Plan Generation
1. Navigate to the Edu-Planner section.
2. Enter your subject and exam date.
3. Click "Generate".
4. View your personalized study schedule
### Pomodoro Timer
1. Start a focused 25-minute study session.
2. Follow automated prompts for short and long breaks.
3. Track your session history and productivity stats.
4. Customize timer intervals based on your personal focus patterns.
### PDF Chat Assistant
1. Upload any PDF document for analysis.
2. Ask context-aware questions about the content.
3. View cited source pages and relevant excerpts in real-time.
4. Seamlessly navigate the document while interacting with the AI.
5. Access and revisit chat history for ongoing reference.
### Notes Section
1. Create new notes with rich text formatting for better clarity.
2. Organize notes by subjects or topics.
3. Seamlessly access your notes across devices anytime.
