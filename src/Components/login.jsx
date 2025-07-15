import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginPageImage } from "../assets/Images";
import { loginOrganizer, loginAdmin } from "../Services/api.js";
import { loginAuthor } from "../Services/author.js";
import { loginReviewer } from "../Services/reviewerService.js";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let result;
      let loggedInUserData;
      if (formData.role === "admin") {
        result = await loginAdmin(formData);
        console.log("Admin Login successful", result);
        if (result.jwt) {
          localStorage.setItem("jwt", result.jwt);
        }
        navigate("/AdminDashboard");
      } else if (formData.role === "organizer") {
        result = await loginOrganizer(formData);
        loggedInUserData = result.user;
        localStorage.setItem("userDetails", JSON.stringify(loggedInUserData));
        if (result.jwt) {
          localStorage.setItem("jwt", result.jwt);
        }
        console.log("Organizer Login successful", result.user);
        navigate("/OrganizerDashboard");
      } else if (formData.role === "author") {
        result = await loginAuthor(formData);
        loggedInUserData = result.user;
        localStorage.setItem("userDetails", JSON.stringify(loggedInUserData));
        if (result.jwt) {
          localStorage.setItem("jwt", result.jwt);
        }
        console.log("Author Login successful", result.user);
        navigate("/AuthorDashboard");
      } else if (formData.role === "reviewer") {
        result = await loginReviewer(formData);
        loggedInUserData = result.user;
        localStorage.setItem("userDetails", JSON.stringify(logedInUserData));
        if (result.jwt) {
          localStorage.setItem("jwt", result.jwt);
        }
        console.log("Reviewer Login successful", result.user);
        navigate("/ReviewerDashboard");
      } else {
        throw new Error("Invalid role selected. Please select a valid role and try again.");
      }
    } catch (error) {
      console.error("Login failed", error.response?.data?.message || error.message);
      alert("Login failed: " + (error.response?.data?.message || error.message || "An error occurred during login"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100 px-2">
      <div className="w-full max-w-4xl flex flex-col md:flex-row shadow-xl rounded-2xl overflow-hidden border border-gray-200 bg-white">
        {/* Left Side - Image & Highlights */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-purple-600 p-6 w-1/2 relative">
          <img
            src={LoginPageImage}
            alt="Academic Login Portal"
            className="w-48 h-48 md:w-60 md:h-60 object-contain rounded-2xl shadow-lg mb-4 border-4 border-white"
          />
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg">Academic Portal</h3>
          <p className="text-white/90 mb-4 text-center text-xs md:text-sm">Streamline your research and publication workflow</p>
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
              <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-blue-500 rounded-full">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              <span className="text-white text-xs">Multi-Role: Admin, Organizer, Reviewer, Author</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
              <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-green-500 rounded-full">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <span className="text-white text-xs">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
              <span className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-purple-500 rounded-full">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <span className="text-white text-xs">Fast & Efficient</span>
            </div>
          </div>
        </div>
        {/* Right Side - Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-xs sm:max-w-sm">
            <div className="mb-4 sm:mb-6 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Sign in to ConfHub</h2>
              <p className="text-gray-500 text-xs sm:text-sm">Access your dashboard</p>
            </div>
            <form onSubmit={handleLoginClick} className="space-y-3 sm:space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Login As</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm"
                  required
                >
                  <option value="" disabled>Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="organizer">Organizer</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="author">Author</option>
                </select>
              </div>
              {/* Username */}
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pl-10 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </div>
              {/* Password */}
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pl-10 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 text-sm"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </span>
              </div>
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-400 focus:ring-2"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <a href="#" className="text-xs text-blue-500 hover:underline">Forgot Password?</a>
              </div>
              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded shadow hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="text-white">Sign In</span>
                )}
              </button>
            </form>
            {/* Footer */}
            <div className="mt-3 sm:mt-4 text-center">
              <span className="text-xs text-gray-500">Don't have an account? </span>
              <button
                onClick={handleRegisterClick}
                className="text-white bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded text-xs font-semibold ml-1 shadow hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
              >
                Sign up here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;