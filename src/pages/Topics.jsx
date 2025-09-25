import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  fetchProgress,
  fetchTopics,
  markComplete,
  markUncomplete,
} from "../services/api";

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState([]);
  const [openTopic, setOpenTopic] = useState(null);

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
      }
    };
    init();
  }, []);

  const toggleProblem = async (problemId) => {
    try {
      if (progress.includes(problemId)) {
        await markUncomplete(problemId);
        setProgress(progress.filter((p) => p !== problemId));
      } else {
        await markComplete(problemId);
        setProgress([...progress, problemId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isCompleted = (problemId) => progress.includes(problemId);

  const getTopicStatus = (topic) => {
    const allProblems = topic.subtopics.flatMap((sub) => sub.problems);
    const completedCount = allProblems.filter((p) => isCompleted(p._id)).length;
    return completedCount === allProblems.length ? "Completed" : "In Progress";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
        DSA Topics
      </h2>

      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {topics.map((topic) => (
          <motion.div
            key={topic._id}
            variants={itemVariants}
            className="bg-white shadow-lg rounded-lg transform transition-all duration-500 ease-out"
          >
            <div
              className="cursor-pointer flex justify-between items-center bg-blue-100 px-6 py-3 rounded-t-lg transition-all"
              onClick={() =>
                setOpenTopic(openTopic === topic._id ? null : topic._id)
              }
            >
              <span className="font-semibold flex items-center gap-3">
                {topic.title}{" "}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    getTopicStatus(topic) === "Completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {getTopicStatus(topic)}
                </span>
              </span>
              <span className="text-sm text-gray-600">{topic.description}</span>
            </div>

            {/* Smooth collapse */}
            <div
              style={{
                maxHeight: openTopic === topic._id ? "2000px" : "0px",
              }}
              className="overflow-hidden transition-all duration-500"
            >
              <div className="p-6 space-y-6">
                {topic.subtopics.map((sub) => (
                  <div key={sub._id}>
                    <h3 className="font-semibold text-gray-700 mb-3 text-lg">
                      {sub.title}
                    </h3>
                    <table className="w-full text-left border-collapse shadow-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-3 text-sm">Done</th>
                          <th className="p-3 text-sm">Problem</th>
                          <th className="p-3 text-sm">Links</th>
                          <th className="p-3 text-sm">Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sub.problems.map((p) => (
                          <tr
                            key={p._id}
                            className="border-b hover:bg-blue-50 transition-colors duration-300"
                          >
                            <td className="p-2 text-center">
                              <input
                                type="checkbox"
                                checked={isCompleted(p._id)}
                                onChange={() => toggleProblem(p._id)}
                                className="w-5 h-5 accent-blue-500 cursor-pointer transition-transform duration-300 hover:scale-125"
                              />
                            </td>
                            <td className="p-2">{p.name}</td>
                            <td className="p-2 space-x-3 text-blue-600 underline">
                              {p.leetcodeLink && (
                                <a
                                  href={p.leetcodeLink}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  LeetCode
                                </a>
                              )}
                              {p.codeforcesLink && (
                                <a
                                  href={p.codeforcesLink}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  CF
                                </a>
                              )}
                              {p.youtubeLink && (
                                <a
                                  href={p.youtubeLink}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  YouTube
                                </a>
                              )}
                              {p.articleLink && (
                                <a
                                  href={p.articleLink}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Article
                                </a>
                              )}
                            </td>
                            <td className="p-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  p.level === "Easy"
                                    ? "bg-green-100 text-green-600"
                                    : p.level === "Medium"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {p.level}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
