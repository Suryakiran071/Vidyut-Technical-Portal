import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import logo2 from '../assets/Vidyut-25-logo2.png'; // Import your logo

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

      // ✨ Immediately redirect to Home page
      navigate("/");

    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", err);
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      setSuccess(`Welcome, ${user.displayName}`);
      setError("");

      // ✨ Immediately redirect to Home page
      navigate("/");

    } catch (err) {
      setError("Google login failed. Please try again.");
      console.error("Google login error", err);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-screen-xl mx-auto">
        {/* Left Side with Logo */}
        <div className="w-1/2 flex flex-col justify-center items-center text-white p-8">
          <div
            style={{
              backgroundImage: `url(${logo2})`,
              backgroundSize: "50%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              position: "absolute",
              top: 100,
              left: 0,
              right: 700,
              bottom: 0,
              opacity: 0.5,
              filter: "invert(1)",
              zIndex: -1,
            }}
          ></div>
        </div>

        {/* Vertical Line */}
        <div className="w-0.3 px-1 bg-gray-600"></div>

        {/* Right Side with Login Form */}
        <div className="ml-40 w-1/3 bg-gray-300 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>

          {/* Show error or success message */}
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          {success && <p className="text-center text-green-500 mb-4">{success}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-gray-200 text-black placeholder-gray-600 outline-none focus:ring-2 focus:ring-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 rounded bg-gray-200 text-black placeholder-gray-600 outline-none focus:ring-2 focus:ring-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Eye icon */}
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-800 mt-4 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-800 hover:underline">
              Click here to sign up
            </Link>
          </p>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-600" />
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-600" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-3 border border-gray-500 py-3 rounded text-black hover:bg-gray-400 transition"
          >
            <FcGoogle className="text-xl" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
