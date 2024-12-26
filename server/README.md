# QuickChat Realtime Chat Application - Server

This is the server-side implementation of QuickChat, a realtime chat application designed to support instant messaging, image sharing, and efficient user management. The server is built with Node.js, Express, and MongoDB and supports Socket.IO for realtime communication.

---

## Features

- User Authentication: Sign up, log in, and manage user sessions.
- Chat Management: Create, update, and retrieve chat conversations.
- Realtime Messaging: Exchange text and image messages instantly.
- Notifications: Realtime updates for new messages and typing indicators.
- Scalability: Built to handle multiple users and chats concurrently.

---

## Project Structure

```
server
├── 📁config
│   └── dbConfig.js       # Database connection setup
├── 📁controllers
│   ├── authControllers.js  # Handles user authentication logic
│   ├── chatControllers.js  # Handles chat-related logic
│   ├── messageControllers.js  # Handles message-related logic
│   └── userControllers.js  # Handles user profile and account logic
├── 📁middlewares
│   └── authMiddleware.js   # Middleware for authentication and authorization
├── 📁models
│   ├── chat.js         # Chat schema and model
│   ├── message.js      # Message schema and model
│   └── user.js         # User schema and model
├── 📁routes
│   ├── authRoutes.js   # Routes for authentication
│   ├── chatRoutes.js   # Routes for chat-related APIs
│   ├── messageRoutes.js   # Routes for message-related APIs
│   └── userRoutes.js   # Routes for user-related APIs
├── .gitignore          # Git ignore file
├── app.js              # Core application setup
├── cloudinary.js       # Cloudinary integration for image uploads
├── config.env          # Environment configuration file
├── package-lock.json   # Dependency lock file
├── package.json        # Project metadata and dependencies
└── server.js           # Entry point of the application
```

---

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **MongoDB**: Set up a MongoDB instance.
- **Cloudinary**: Create an account for image uploads.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/quickchat-server.git
   cd quickchat-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   PORT=4292
   MONGO_URI=your_mongo_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will start on `http://localhost:4292`.

---

## API Endpoints

### Authentication

- **POST** `/api/v1/auth/register` - Register a new user
- **POST** `/api/v1/auth/login` - Log in a user

### User

- **GET** `/api/v1/user/profile` - Get user profile
- **PUT** `/api/v1/user/update` - Update user details

### Chat

- **POST** `/api/v1/chat` - Create a new chat
- **GET** `/api/v1/chat/:userId` - Get all chats for a user

### Message

- **POST** `/api/v1/message` - Send a new message
- **GET** `/api/v1/message/:chatId` - Get all messages in a chat

---

## Realtime Communication

The server uses **Socket.IO** for realtime features. Key events:

- `send-message`: Send a new message
- `receive-message`: Listen for new messages
- `user-typing`: Notify when a user is typing
- `join-room`: Join a specific chat room
- `clear-unread-messages`: Clear unread message count

---

## Technologies Used

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **Socket.IO**: Realtime communication
- **Cloudinary**: Image hosting
- **JWT**: Authentication

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

## Author

[Your Name](https://github.com/yourusername)
