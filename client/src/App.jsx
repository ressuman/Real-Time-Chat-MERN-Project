import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Signup from "./pages/signup";
import NotFound from "./pages/not-found";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              // <ProtectedRoute>
              <Home />
              //</ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              //<ProtectedRoute>
              <Profile />
              //</ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
