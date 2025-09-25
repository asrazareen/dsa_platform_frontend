import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContest";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="fixed top-0 w-full bg-blue-600 text-white shadow-md flex justify-between items-center px-6 py-3 z-10">
        <h1 className="text-xl font-bold">DSA Dashboard</h1>
        <div className="flex space-x-6 items-center relative">
          {["profile", "topics", "progress"].map((tab) => (
            <NavLink
              key={tab}
              to={tab}
              className={({ isActive }) =>
                `relative pb-1 transition ${
                  isActive
                    ? "text-yellow-300 font-semibold"
                    : "hover:text-gray-200"
                }`
              }
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}

              {location.pathname.includes(tab) && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 bottom-0 w-full h-0.5 bg-yellow-300"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="pt-20 max-w-5xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-80 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-around">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
