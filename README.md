# 🌍 TravelBuddy – Travel Companion Finder Web App

**TravelBuddy** is a full-stack web application that helps users find and connect with travel companions from around the world. Designed for both solo travelers and travel agencies, users can create or join trips based on preferences like destination, dates, and categories — and collaborate through a built-in real-time group chat once accepted into a trip.

> 🚧 _In-progress collaborative project_ — “Travel Match Platform”  
> Built with React, Node.js, and real-time APIs (Socket.io)

---

## ✨ Key Features

- 🧭 **Trip Discovery & Matching**  
  Users can filter and search for trips based on destination, departure/return dates, categories, and more.

- ✍️ **Trip Creation & Management**  
  Authenticated users can create detailed travel itineraries with media uploads and edit or delete them later.

- 🔐 **Authentication & Security**  
  JWT-based secure authentication, password encryption using bcrypt, and middleware protection.

- 📷 **Media Uploads**  
  Images and other media are handled via Cloudinary integration.

- 🧠 **Smart Trip Ranking**  
  MongoDB pipeline logic used to sort and fetch trips based on ranking and custom criteria.

- ✈️ **Flight Input Enhancement**  
  Airport data was preprocessed from CSV to JSON using Python (Pandas) for seamless IATA code lookups on user input.

- 💬 **Real-time Group Chat**  
  Once a user’s join request is approved, they are added to a Socket.io-powered chatroom with other trip participants.

---

## 👨‍💻 My Role in the Team

As a **full-stack developer**, I was responsible for designing and implementing the majority of the application:

### 🔧 Backend (Node.js + Express + MongoDB)
- Architected and structured the entire backend using a clean MVC pattern (`routes`, `controllers`, `models`, `middleware`, `utils`)
- Built all **MongoDB models** with static and instance methods for security and logic
- Created advanced aggregation pipelines for **trip ranking & filtering**
- Set up **JWT authentication middleware** and **role-based route protection**
- Integrated **Cloudinary** for handling media uploads
- Managed file uploads using **Multer**
- Designed real-time server logic with **Socket.io**

### 🎨 Frontend (React + Redux + TanStack Query)
- Developed all trip matching and discovery UIs with filtering
- Built forms using **Formik** and validation with **Yup**
- Integrated custom APIs for **airport lookup and IATA code fetching**
- Created user interfaces for trip creation, editing, and join requests
- Implemented real-time **chat UI**, room joining logic, and message syncing using Socket.io client

### ❌ Removed
- Blog and Admin panels — these were incomplete and not maintained, so they were removed from the cleaned version

---

## 🛠️ Tech Stack

### Frontend
- **React**, **Redux Toolkit**, **TanStack Query**
- **Formik** & **Yup** for forms & validation
- **Axios** for HTTP requests
- **Socket.io-client** for real-time messaging

### Backend
- **Node.js**, **Express**, **MongoDB**
- **Socket.io** for real-time communication
- **Cloudinary**, **Multer** for media handling
- **JWT**, **bcrypt** for authentication & security
- **Axios** for internal and external API calls

---

## 🚀 Getting Started

To run this project locally:

1. **Download the project**
   - Clone the repo or download the ZIP from GitHub

2. **Install dependencies**
   ```bash
   cd backend
   npm install

   cd ../frontend
   npm install
  
3. **Run the project**
   # From backend/
   npm run dev
   # From frontend/
   npm start

## Deployment
    The project will also be deployed online via Render or Vercel
    → Link coming soon in this README

## 📌 Future Work
  Admin dashboard for user and trip moderation
  Notification system for new messages and join approvals
  Trip rating and review system
  Mobile responsiveness & PWA support

## 🙌 Acknowledgments
Thanks to the project team for the initial collaborative input. The cleaned version is curated to highlight core working features for portfolio purposes.
