import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchProgress, fetchTopics } from "../services/api";

export default function Progress() {
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [topicsRes, progressRes] = await Promise.all([
          fetchTopics(),
          fetchProgress(),
        ]);
        setTopics(topicsRes.data);
        setProgress(progressRes.data.progress);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  const allProblems = topics.flatMap((t) =>
    t.subtopics.flatMap((sub) =>
      sub.problems.map((p) => ({
        ...p,
        completed: progress.includes(p._id),
      }))
    )
  );

  const difficultyCounts = ["Easy", "Medium", "Hard"].map((level) => {
    const total = allProblems.filter((p) => p.level === level).length;
    const solved = allProblems.filter(
      (p) => p.level === level && p.completed
    ).length;
    return {
      level,
      total,
      solved,
      percentage: total ? Math.round((solved / total) * 100) : 0,
      problems: allProblems
        .filter((p) => p.level === level && p.completed)
        .map((p) => p.name),
    };
  });

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Progress Report
      </h2>

      <div className="space-y-6">
        {difficultyCounts.map((d, index) => (
          <div key={d.level}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">{d.level}</span>
              <span>
                {d.percentage}% ({d.solved}/{d.total})
              </span>
            </div>

            {/* Animated progress bar */}
            <div className="w-full bg-gray-200 rounded h-4 relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.percentage}%` }}
                transition={{
                  duration: 1,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                className={`h-4 rounded bg-gradient-to-r ${
                  d.level === "Easy"
                    ? "from-green-400 to-green-600"
                    : d.level === "Medium"
                    ? "from-yellow-400 to-yellow-600"
                    : "from-red-400 to-red-600"
                }`}
              ></motion.div>
            </div>

            {d.problems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.2, staggerChildren: 0.05 }}
                className="mt-1 text-gray-700 text-sm space-y-1"
              >
                {d.problems.map((p, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="hover:bg-gray-100 rounded px-2 py-1 transition-all duration-200"
                  >
                    {p}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
