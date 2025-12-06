# 🗂️ TaskFlow – Dynamic Task Management App

TaskFlow is a Trello-like task management system where users can create lists, add cards, drag-and-drop tasks, and manage their workflow easily.

---

## 🚀 Live Demo

👉 **Frontend:** https://taskflow-chja.onrender.com  
👉 **Backend API:** https://trello-server-1yvk.onrender.com

---

## ✨ Features

- User Authentication (Login/Register)
- Create Lists & Cards
- Drag and Drop cards between lists
- Update & Delete cards
- Protected routes
- Responsive UI
- Hosted on Render (Frontend + Backend)

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Redux Toolkit
- Axios
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- CORS

---

## 📁 Project Structure
trello/
├── client/ # React + Vite Frontend
├── server/ # Node + Express Backend
├── .gitignore
└── README.md


---

## ⚙️ Environment Variables

### Frontend (`client/.env`)

VITE_API_URL=https://trello-server-1yvk.onrender.com/api

### Backend (`server/.env`)
PORT=5000
MONGO_URI=your-mongo-url
JWT_SECRET=your-secret

## 📦 Installation & Setup

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```
Install dependencies
Client
```
cd client
npm install
npm run dev
```
Server
```
cd server
npm install
npm start
```
🚀 Deployment Instructions
Frontend (Render – Static Site)

📌 Settings:
```
Build Command: npm install && npm run build
Publish Directory: dist
```
Backend (Render – Web Service)

📌 Settings:
```
Build Command: npm install
Start Command: npm start
```
Add environment variables in Render. 

🤝 Contributing
Contributions are welcome! Please open an issue to discuss any major changes before making a pull request.

1: Fork the Project

2: Create your Feature Branch (git checkout -b feature/AmazingFeature)

3: Commit your Changes (git commit -m 'Add some AmazingFeature')

4: Push to the Branch (git push origin feature/AmazingFeature)

5: Open a Pull Request

👨‍💻 Author
Aman Rawat

B.Tech CSE

⭐ Show Support
If you like this project, please consider giving it a ⭐ on GitHub!


