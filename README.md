# 🐾 Animal Guardian

> Rescue aid for every injured and endangered animal.

Animal Guardian is a full-stack web application designed to connect citizens, NGOs, volunteers, and authorities to report and manage animal emergencies. It allows users to quickly report incidents, track rescue statuses, and view a live community map of all ongoing rescue efforts.

## ✨ Features

- **🚨 Quick Emergency Reporting**: Submit incident reports with severity levels, animal types, and specific locations.
- **🗺️ Live Community Map**: Interactive map (powered by Leaflet) displaying all reported incidents and their real-time status.
- **🔄 Real-time Status Tracking**: Watch a report move from *Submitted* -> *Under review* -> *Accepted* -> *On the way* with live WebSocket updates.
- **📱 Mobile Responsive**: Carefully designed UI that works beautifully on both desktop and mobile devices.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- CSS (Custom modern styling with Dark Mode support)
- Axios (API requests)
- Leaflet & React-Leaflet (Interactive Maps)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose (Database)
- Socket.io (Real-time WebSocket communication)

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js installed
- MongoDB installed locally, or a MongoDB Atlas connection string

### 2. Clone & Install

Clone the repository and install dependencies for both the frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables

**Backend (`backend/.env`)**
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

**Frontend (`frontend/.env`)**
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the App

Open two separate terminals:

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

The frontend will be available at `http://localhost:5173`.

## 🌍 Deployment

- **Frontend**: Deployed on [Vercel](https://vercel.com/)
- **Backend**: Deployed on [Render](https://render.com/)

*(Ensure that the Vercel `VITE_API_URL` environment variable is pointing to the live Render backend URL!)*

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License.
