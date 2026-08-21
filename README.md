<div align="center">
  <img src="./frontend/public/favicon.svg" alt="Animal Guardian Logo" width="120" />
  <h1>🐾 Animal Guardian</h1>
  <p><strong>Rescue aid for every injured and endangered animal.</strong></p>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=nodedotjs" alt="Node.js" /></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  </p>
</div>

<br />

## 📖 Overview

**Animal Guardian** is a full-stack web application designed to connect citizens, NGOs, volunteers, and local authorities to efficiently report and manage animal emergencies. Our platform empowers communities to quickly report incidents, track the status of rescues, and visualize ongoing efforts on a live interactive map.

---

## ✨ Key Features

- **🚨 Quick Emergency Reporting** <br/>
  Submit detailed incident reports with severity levels, animal types, photo evidence, and precise GPS locations.
  
- **🗺️ Live Community Map** <br/>
  Explore an interactive map (powered by Leaflet) displaying all reported incidents and their real-time status across your area.

- **🔄 Real-time Status Tracking** <br/>
  Experience seamless updates with WebSockets as your report transitions from *Submitted* ➔ *Under Review* ➔ *Accepted* ➔ *Rescue in Progress*.

- **📱 Mobile Responsive & Modern UI** <br/>
  Enjoy a carefully crafted interface featuring Framer Motion animations, Lucide icons, and full dark mode support, optimized for any device.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Styling & UI:** Custom Modern CSS (Dark Mode), Framer Motion, Lucide React
- **Forms & Validation:** React Hook Form, Zod
- **Mapping & Charts:** Leaflet, React-Leaflet, Recharts
- **State & Data:** Axios, Socket.io-client

### Backend
- **Runtime & Framework:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Real-Time Engine:** Socket.io

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB installed locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection string.

### 2. Clone & Install

Clone the repository and install dependencies for both the frontend and backend:

```bash
# Clone the repository
git clone https://github.com/yourusername/Animal_Love.git
cd Animal_Love

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables

Create `.env` files in both the frontend and backend directories.

**Backend (`backend/.env`)**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

**Frontend (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the Application

Open two separate terminals to start the servers concurrently:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The frontend will now be running at `http://localhost:5173`.

---

## 🌍 Deployment

- **Frontend:** Deployed globally via [Vercel](https://vercel.com/)
- **Backend:** Hosted securely on [Render](https://render.com/)

> **Note:** Ensure that the `VITE_API_URL` environment variable in your Vercel project settings correctly points to your live Render backend URL!

---

## 🤝 Contributing

We welcome contributions from the community! 
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

<div align="center">
  <sub>Built with ❤️ for animals everywhere.</sub>
</div>
