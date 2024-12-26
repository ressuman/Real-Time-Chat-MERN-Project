# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# QuickChat Real-Time Chat App (Client)

This is the client-side application for **QuickChat**, a real-time chat platform. It is built with React, Redux, and Socket.IO to provide a seamless chat experience.

---

## Features

- **Authentication**: User signup, login, and protected routes.
- **Real-Time Messaging**: Powered by Socket.IO for instant updates.
- **Typing Indicators**: Know when someone is typing.
- **Media Support**: Send and view images.
- **User Profiles**: View and edit user details.
- **Responsive Design**: Optimized for various screen sizes.

---

## Project Structure

```
📁client
├── 📁public
│   ├── chat.svg
│   ├── 📁images
│   │   └── quick-chat-app-background.jpg
│   └── vite.svg
├── 📁src
│   ├── 📁api
│   │   ├── auth.js        # API calls for authentication
│   │   ├── chat.js        # API calls for chat-related actions
│   │   ├── index.js       # Centralized API exports
│   │   ├── message.js     # API calls for message-related actions
│   │   └── users.js       # API calls for user-related actions
│   ├── App.css            # Global CSS
│   ├── App.jsx            # Root component
│   ├── 📁assets           # Static assets (e.g., SVGs)
│   │   └── react.svg
│   ├── 📁components
│   │   ├── Loader.jsx     # Loader component
│   │   └── ProtectedRoute.jsx # Route protection wrapper
│   ├── index.css          # Global CSS styles
│   ├── main.jsx           # Application entry point
│   ├── 📁pages            # Pages
│   │   ├── 📁home         # Home/Chat page
│   │   │   ├── 📁components
│   │   │   │   ├── chat.jsx       # Chat area component
│   │   │   │   ├── header.jsx     # Header component
│   │   │   │   ├── search.jsx     # Search bar component
│   │   │   │   ├── sidebar.jsx    # Sidebar component
│   │   │   │   └── usersList.jsx  # User list component
│   │   │   └── index.jsx   # Home page entry
│   │   ├── 📁login         # Login page
│   │   │   └── index.jsx
│   │   ├── 📁not-found     # 404 page
│   │   │   └── index.jsx
│   │   ├── 📁profile       # User profile page
│   │   │   └── index.jsx
│   │   └── 📁signup        # Signup page
│   │       └── index.jsx
│   ├── 📁redux            # State management
│   │   ├── 📁slice
│   │   │   ├── loaderSlice.js  # Loader state
│   │   │   └── usersSlice.js   # User state
│   │   ├── 📁store
│   │   │   └── store.js     # Redux store
│   ├── 📁utils            # Utility functions
│   │   ├── camelCase.js   # Converts text to camelCase
│   │   └── name.js        # Name formatting
├── .env                   # Environment variables
├── .gitignore             # Git ignore rules
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry point
├── package-lock.json      # Lockfile for dependencies
├── package.json           # Project metadata and dependencies
├── README.md              # Project documentation
├── vite.config.js         # Vite configuration
```

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/quik-chat.git
   cd quik-chat/client
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and configure the following variables:

   ```env
   VITE_API_BASE_URL=http://localhost:4292/api/v1
   VITE_SOCKET_URL=http://localhost:4292
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the application for production.
- **`npm run lint`**: Runs ESLint to check for code issues.
- **`npm run preview`**: Previews the production build.

---

## Technologies Used

- **React**: UI library for building the interface.
- **Redux**: State management.
- **Socket.IO**: Real-time communication.
- **Vite**: Fast build tool.
- **CSS**: Styling.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

---

## Contact

For inquiries or support, contact [your.email@example.com](mailto:your.email@example.com).
