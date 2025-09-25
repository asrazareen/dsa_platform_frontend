import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react"; // ⬅️ icons
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContest";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/dashboard/topics", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await loginUser({ email, password });
      login(data.token);
      navigate("/dashboard/topics", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-3xl blur-lg opacity-40 animate-pulse" />

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative bg-white rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Log in to continue your DSA journey 🚀
          </p>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center font-medium mb-4"
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Login
            </motion.button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Register
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
