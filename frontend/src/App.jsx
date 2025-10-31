import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile.jsx";

// ADD THIS LINE - Replace with your actual backend port
axios.defaults.baseURL = 'http://localhost:5000';
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const App = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await axios.get('/api/users/me');
          setUser(data);
        } catch (error) {
          localStorage.removeItem('token');
          setError(error)
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-screen">
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} error={error} />} />
        <Route path="/profile" element={user ? <Profile user={user} error={error} /> : <Navigate to ='/' />} />
        <Route path="/login" element={user ? <Navigate to ='/' /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to ='/' /> : <Register setUser={setUser} />} />
      </Routes>
    </div>
  );
};

export default App;
