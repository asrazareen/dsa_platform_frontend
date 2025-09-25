import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchMe } from "../services/api";
import { useAuth } from "../context/AuthContest";

export default function Profile() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetchMe();
        setUser(res.data?.user);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user info");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [token]);

  if (loading)
    return <div className="p-4 text-center text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Profile
      </h2>
      <div className="space-y-4">
        <motion.p
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gray-50 p-3 rounded shadow-sm"
        >
          <span className="font-semibold">Name:</span> {user.username}
        </motion.p>
        <motion.p
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gray-50 p-3 rounded shadow-sm"
        >
          <span className="font-semibold">Email:</span> {user.email}
        </motion.p>
        <motion.p
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gray-50 p-3 rounded shadow-sm"
        >
          <span className="font-semibold">Joined On:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </motion.p>
      </div>
    </motion.div>
  );
}
