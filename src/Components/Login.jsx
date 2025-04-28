import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import paperTexture from '../assets/paper-texture.jpg'; // Paper texture background
import logo from '../assets/Vidyut-25-logo-black.png';   // Vidyut logo

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      setSuccess(`Welcome back, ${user.email}`);
      setError("");

      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center relative p-4"
      style={{
        backgroundImage: `url(${paperTexture})`,
      }}
    >
      {/* Vidyut Logo */}
      <div className="mt-10 mb-4">
        <img src={logo} alt="Vidyut Logo" className="h-24 mx-auto" />
      </div>

      {/* Glassy Login Box */}
      <div className="w-full max-w-sm bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Login</h2>

        {/* Show error or success messages */}
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        {success && <p className="text-center text-green-500 mb-4">{success}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-100 bg-opacity-70 text-black placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded bg-gray-100 bg-opacity-70 text-black placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? (
                <FaEyeSlash className="text-gray-600 mt-1" />
              ) : (
                <FaEye className="text-gray-600 mt-1" />
              )}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Link to Sign Up */}
        <p className="text-center text-gray-700 mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-700 hover:underline font-semibold">
            Click here to sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
