import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Check,
  Zap,
  Delete,
  Shield,
  Clock,
  Terminal,
  BookOpen,
  User,
  Flag,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import CodeEditor from "../components/CodeEditor";
import { useAuth } from "../context/AuthContext";

export default function Arena() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [code, setCode] = useState(
    "function twoSum(nums, target) {\n  // Write your code here\n  \n}",
  );
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins
  const [isFrozen, setIsFrozen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Powerup state for visual feedback
  const [activePowerup, setActivePowerup] = useState(null);

  // Mock opponents
  const myScore = 0;
  const opponentScore = 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const executePowerup = (type) => {
    setActivePowerup(type);

    if (type === "freeze_opponent") {
      setTimeout(() => {
        // setIsFrozen(true);  ##checkpoint 1 
        setTimeout(() => setIsFrozen(false), 5000);
      }, 1000);
    }

    setTimeout(() => setActivePowerup(null), 2000);
  };

  const submitCode = () => {
    navigate("/result");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-[#0a0a0a] overflow-hidden text-gray-300 font-sans">
      {/* Powerup Overlay */}
      <AnimatePresence>
        {activePowerup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div
              className={`p-8 rounded-full border-4
                            ${activePowerup === "freeze_opponent" ? "border-primary bg-primary/20 glow-primary text-primary" : ""}
                            ${activePowerup === "delete_code" ? "border-danger bg-danger/20 glow-danger text-danger" : ""}
                            ${activePowerup === "shield" ? "border-success bg-success/20 glow-success text-success" : ""}
                        `}
            >
              {activePowerup === "freeze_opponent" && (
                <Zap className="w-24 h-24" />
              )}
              {activePowerup === "delete_code" && (
                <Delete className="w-24 h-24" />
              )}
              {activePowerup === "shield" && <Shield className="w-24 h-24" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Panel: Description, Abilities, Leaderboard */}
      <div className="w-[45%] lg:w-[40%] flex flex-col border-r border-dark-border bg-[#151515]">
        {/* Header Tabs */}
        <div className="flex border-b border-dark-border bg-[#1e1e1e] px-2 h-10 items-end">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "description" ? "border-primary text-white bg-[#151515]" : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a]"}`}
          >
            <BookOpen className="w-4 h-4" /> Description
          </button>
          <button
            onClick={() => setActiveTab("abilities")}
            className={`px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${activeTab === "abilities" ? "border-primary text-white bg-[#151515]" : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a]"}`}
          >
            <Zap className="w-4 h-4" /> Abilities
          </button>
        </div>

        {/* Left Panel Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "description" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  1. Two Sum
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-success/20 text-success">
                    Easy
                  </span>
                </div>
              </div>

              <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed">
                <p>
                  Given an array of integers{" "}
                  <code className="bg-[#2a2a2a] px-1.5 py-0.5 rounded text-primary">
                    nums
                  </code>{" "}
                  and an integer{" "}
                  <code className="bg-[#2a2a2a] px-1.5 py-0.5 rounded text-primary">
                    target
                  </code>
                  , return indices of the two numbers such that they add up to{" "}
                  <code className="bg-[#2a2a2a] px-1.5 py-0.5 rounded text-primary">
                    target
                  </code>
                  .
                </p>
                <p>
                  You may assume that each input would have{" "}
                  <strong>exactly one solution</strong>, and you may not use the
                  same element twice.
                </p>
                <p>You can return the answer in any order.</p>

                <div className="mt-8 mb-4">
                  <p className="font-bold text-white mb-2">Example 1:</p>
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border-l-2 border-dark-border font-mono text-sm leading-6">
                    <span className="text-gray-400">Input:</span> nums =
                    [2,7,11,15], target = 9<br />
                    <span className="text-gray-400">Output:</span> [0,1]
                    <br />
                    <span className="text-gray-400">Explanation:</span> Because
                    nums[0] + nums[1] == 9, we return [0, 1].
                  </div>
                </div>

                <div className="mt-6 mb-4">
                  <p className="font-bold text-white mb-2">Example 2:</p>
                  <div className="bg-[#1e1e1e] p-4 rounded-lg border-l-2 border-dark-border font-mono text-sm leading-6">
                    <span className="text-gray-400">Input:</span> nums =
                    [3,2,4], target = 6<br />
                    <span className="text-gray-400">Output:</span> [1,2]
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "abilities" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Tactical Abilities
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Use these abilities to gain an edge or disrupt your opponent.
                Each ability has a cooldown.
              </p>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => executePowerup("freeze_opponent")}
                  className="group flex items-center p-4 rounded-xl bg-[#1e1e1e] border border-dark-border hover:border-primary/50 transition-all hover:bg-primary/5"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-white mb-1">
                      Freeze
                    </span>
                    <span className="text-xs text-gray-400">
                      Locks opponent's editor for 5 seconds
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => executePowerup("delete_code")}
                  className="group flex items-center p-4 rounded-xl bg-[#1e1e1e] border border-dark-border hover:border-danger/50 transition-all hover:bg-danger/5"
                >
                  <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Delete className="w-6 h-6 text-danger" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-white mb-1">
                      Backspace
                    </span>
                    <span className="text-xs text-gray-400">
                      Deletes the last line of opponent's code
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => executePowerup("shield")}
                  className="group flex items-center p-4 rounded-xl bg-[#1e1e1e] border border-dark-border hover:border-success/50 transition-all hover:bg-success/5"
                >
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-success" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-white mb-1">
                      Shield
                    </span>
                    <span className="text-xs text-gray-400">
                      Protects you from the next incoming attack
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scores & Match Status (Bottom Left) */}
        <div className="border-t border-dark-border bg-[#1e1e1e] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-dark-border pb-3">
            <div className="text-xs font-mono text-gray-400 flex items-center gap-2">
              <Flag className="w-4 h-4 text-gray-500" /> Room: {roomId}
            </div>
            <div className="flex items-center gap-2 text-warning font-mono text-lg font-bold bg-warning/10 px-3 py-1 rounded border border-warning/20">
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="flex justify-between items-center text-sm font-bold">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-white">{user?.username || "You"}</span>
              <span className="bg-[#2a2a2a] px-2 py-0.5 rounded text-gray-300 ml-2">
                {myScore}
              </span>
            </div>
            <span className="text-gray-500 font-normal italic">vs</span>
            <div className="flex items-center gap-2">
              <span className="bg-[#2a2a2a] px-2 py-0.5 rounded text-gray-300 mr-2">
                {opponentScore}
              </span>
              <span className="text-white">Opponent</span>
              <div className="w-2 h-2 rounded-full bg-danger"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Editor (Top) & Terminal (Bottom) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col border-b border-dark-border">
          <div className="h-10 border-b border-dark-border bg-[#151515] flex items-center px-4 justify-between">
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-primary font-mono text-sm">&lt;/&gt;</span>
              <span className="text-sm font-medium text-gray-300">Code</span>
            </div>
            <select className="bg-[#2a2a2a] border border-dark-border rounded px-2 py-1 text-xs text-white outline-none focus:border-primary">
              <option>JavaScript</option>
              <option>Python</option>
              <option>C++</option>
            </select>
          </div>

          <div className="flex-1 relative bg-[#0d1117] overflow-hidden">
            <CodeEditor
              value={code}
              onChange={(val) => setCode(val)}
              isLocked={isFrozen}
            />
          </div>
        </div>

        {/* Console Section */}
        <div className="h-[250px] flex flex-col bg-[#1e1e1e]">
          <div className="h-10 border-b border-dark-border bg-[#151515] flex items-center px-4 justify-between">
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">
                Console Testcases
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="h-7 text-xs px-3 bg-[#2a2a2a] border-transparent hover:bg-[#333]"
              >
                <Play className="w-3 h-3 mr-1" /> Run
              </Button>
              <Button
                variant="success"
                size="sm"
                className="h-7 text-xs px-3 bg-green-600/20 text-green-500 hover:bg-green-600/30 border-transparent"
                onClick={submitCode}
              >
                <Check className="w-3 h-3 mr-1" /> Submit
              </Button>
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
            <div className="flex gap-2 mb-4">
              <button className="px-3 py-1 rounded bg-[#2a2a2a] text-white border border-transparent">
                Case 1
              </button>
              <button className="px-3 py-1 rounded bg-transparent text-gray-400 border border-[#2a2a2a] hover:text-white hover:bg-[#2a2a2a]">
                Case 2
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">nums =</div>
                <div className="bg-[#151515] p-2 rounded border border-dark-border text-gray-300">
                  [2,7,11,15]
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">target =</div>
                <div className="bg-[#151515] p-2 rounded border border-dark-border text-gray-300">
                  9
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
