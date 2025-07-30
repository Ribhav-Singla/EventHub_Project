## 🎉 EventHub – Your Ultimate Event Management Platform  

EventHub is a powerful and interactive platform designed for creating, managing, and exploring events effortlessly. It provides a seamless experience for event organizers and attendees with features like real-time chat, subscription-based event notifications, and dynamic scheduling.  

With **EventHub**, you can:  
✅ Create and manage events with ease  
✅ Get notified about the upcoming events you’re interested in  
✅ Engage in real-time chat with event organizers  
✅ Visualize event analytics and attendee distribution  
✅ Experience a smooth and interactive UI/UX  

Whether you’re hosting a small meetup or a large-scale conference, **EventHub** makes event management simple and efficient! 🚀  

## 📖 Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#Contributing)
- [License](#License)
- [Screenshots](#Screenshots)

## 🎯 Features  
✅ Create and manage events effortlessly  
✅ Subscribe to events and receive real-time notifications  
✅ Engage in **one-on-one** chat with event organizers  
✅ Visualize attendee distribution with interactive charts  
✅ Dynamic and user-friendly UI/UX for a seamless experience  

## ⚡ Installation  

### 🔧 Prerequisites:  
   - Node.js
   - PostgreSQL installed (or use Docker)  
   - Docker (optional, for containerized setup)  

### 📌 Steps (Without Docker):  
   1. **Clone the repository**  
      ```sh
      git clone https://github.com/yourusername/EventHub.git
      cd EventHub
      ```
   2. **Set up environment variables**  
      - Navigate to both `client/` and `server/` directories.  
      - Rename `.env.example` to `.env` in each directory.  
      - Fill in the required database, API keys, and other configurations.  

      ```sh
      mv client/.env.example client/.env
      mv server/.env.example server/.env
      ```

   3. **Install dependencies**  
      ```sh
      cd client && npm install
      cd ../server && npm install
      ```

   4. **Set up the PostgreSQL database**  
      ```sh
      createdb eventhub_db
      ```

   5. **Start the backend server**  
      ```sh
      cd server
      npm start
      ```

   6. **Start the frontend server**  
      ```sh
      cd ../client
      npm start
      ```

   7. Open **http://localhost:3000** in your browser 🚀  

---

### 🐳 Steps (Using Docker):  
   1. **Clone the repository**  
      ```sh
      git clone https://github.com/yourusername/EventHub.git
      cd EventHub
      ```

   2. **Set up environment variables**  
      - Rename `.env.example` to `.env` in both `client/` and `server/`.  
      - Ensure the `.env` files match your Docker configuration.  

   3. **Build and run with Docker Compose**  
      ```sh
      docker-compose up --build
      ```

   4. Open **http://localhost:3000** in your browser 🚀  
## 🚀 Usage  

1. **Create an Event**  
   - Navigate to the **Dashboard** → **Publish**.  
   - Fill in the event details (title, date, location, description, etc.).  
   - Click **Submit** to publish the event.  

2. **Event Analytics**  
   - Navigate to **Dashboard** → **Events**.  
   - Select an event and click **Event Analysis**.  
   - Load the interactive dashboard with **bar charts, pie charts, and line charts** to visualize event data.  

3. **Chat Section (Organizer View)**  
   - Organizers can see **real-time, one-on-one chats** from users with queries.  
   - Chats are updated instantly without page refresh.  

4. **Ticket Booking**  
   - Shows available tickets categorized as **General** or **VIP**.  
   - Add attendee details and proceed to **payment**.  
   - A **5-minute timer** ensures timely checkout.  
   - After successful payment, you can **download your ticket**.  

5. **Profile Section**  
   - Update **profile metadata** like name, email, and preferences.  
   - **Password reset & forgot password** functionality is available.  
## 🤝 Contributing  

Contributions are welcome! Follow these steps:  

   1. **Fork** the repository  
   2. **Create a new branch**  
      ```sh
      git checkout -b feature-branch
      ```
   3. **Commit your changes**  
      ```sh
      git commit -m "Added a new feature"
      ```
   4. **Push to your branch**  
      ```sh
      git push origin feature-branch
      ```
   5. **Open a Pull Request** 🚀  

## 📸 Screenshots  

### 💬 Real Time Chat
![Real Time Chat](https://github.com/Ribhav-Singla/EventHub_Project/blob/main/client/public/image10.png)  

### 📈 Event Analytics  
![Event Analytics](https://github.com/Ribhav-Singla/EventHub_Project/blob/main/client/public/image6.png)  
