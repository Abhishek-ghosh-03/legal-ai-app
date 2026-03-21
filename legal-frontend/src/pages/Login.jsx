import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import bg from "../assets/bg.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
      className="flex items-center justify-center"
    >

      <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[90%] sm:w-[400px]">


        <div className="flex justify-center mb-4">
          <div className="bg-blue-500 p-3 rounded-xl">
            <span className="text-white text-xl">🔒</span>
          </div>
        </div>


        <h2 className="text-2xl font-bold text-center text-blue-600">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign in to your account
        </p>


        <label className="text-sm font-medium">Email</label>
        <input
          className="border p-2 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />


        <label className="text-sm font-medium">Password</label>
        <input
          className="border p-2 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password"
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
        />


        <button
          onClick={handleLogin}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white w-full py-2 rounded-lg hover:opacity-90 transition"
        >
          Sign In
        </button>


        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>


        <div className="flex gap-2">
          <button className="border w-full py-2 rounded-lg hover:bg-gray-100">
            Google
          </button>
          <button className="border w-full py-2 rounded-lg hover:bg-gray-100">
            GitHub
          </button>
        </div>


        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}