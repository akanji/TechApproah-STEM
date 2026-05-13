import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight,
  RotateCcw,
  FileText
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from "recharts";

export function KineticEnergyLab() {
  const [mass, setMass] = useState(2); // kg
  const [velocity, setVelocity] = useState(5); // m/s
  const [quizStep, setQuizStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Kinetic Energy Calculation
  const ke = 0.5 * mass * Math.pow(velocity, 2);

  // Generate Graph Data
  const graphData = useMemo(() => {
    const data = [];
    for (let v = 0; v <= 20; v += 1) {
      data.push({
        v,
        vSq: Math.pow(v, 2),
        ke: 0.5 * mass * Math.pow(v, 2)
      });
    }
    return data;
  }, [mass]);

  const quizQuestions = [
    {
      q: "If an object's velocity is tripled, what happens to its Kinetic Energy?",
      options: ["Triples (3x)", "Increases by 6x", "Increases by 9x", "Remains the same"],
      correct: 2
    },
    {
      q: "The Work-Energy Theorem states that the Net Work done on an object equals:",
      options: ["Total Momentum", "Change in Potential Energy", "Force times Mass", "Change in Kinetic Energy"],
      correct: 3
    },
    {
      q: "Which graph represents a Linear relationship for an object with constant mass?",
      options: ["KE vs Velocity", "KE vs Velocity²", "Velocity vs Time", "Force vs Velocity"],
      correct: 1
    }
  ];

  const handleAnswer = (idx: number) => {
    const newAnswers = [...userAnswers, idx];
    setUserAnswers(newAnswers);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setUserAnswers([]);
    setShowQuizResult(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header & Hero Stat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Activity size={18} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#8b949e]">Kinetic Energy Analyzer</h2>
            </div>
            <div className="flex items-baseline gap-4 mb-4">
              <div className="text-6xl font-mono text-white font-black tracking-tighter">
                {ke.toFixed(1)}
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-yellow-500 italic">Joules (J)</span>
                <span className="text-[10px] text-[#484f58] uppercase font-bold tracking-widest">Calculated Real-Time</span>
              </div>
            </div>

            {/* Simulation Track */}
            <div className="relative h-12 bg-black/40 rounded-xl border border-white/5 mb-8 overflow-hidden flex items-center px-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,transparent_100%)] opacity-20" />
              <motion.div 
                animate={{ 
                  x: [0, 200, 0],
                }}
                transition={{ 
                  duration: Math.max(0.5, 4 / (velocity || 0.1)), 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-8 h-4 bg-blue-500 rounded-sm shadow-[0_0_15px_rgba(59,130,246,0.6)] relative"
              >
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
              </motion.div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">
                  <span>Mass (m)</span>
                  <span className="text-white">{mass} kg</span>
                </div>
                <input 
                  type="range" min="0.5" max="10" step="0.5" value={mass} 
                  onChange={(e) => setMass(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-[#30363d] h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold text-[#8b949e] uppercase tracking-widest">
                  <span>Velocity (v)</span>
                  <span className="text-white">{velocity} m/s</span>
                </div>
                <input 
                  type="range" min="0" max="20" step="0.5" value={velocity} 
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="w-full accent-yellow-500 bg-[#30363d] h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-6 flex flex-col justify-between">
           <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">
                <BookOpen size={14} className="text-blue-400" />
                AI Briefing Notes
              </h4>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                  <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Fundamentals</h5>
                  <p className="text-xs text-[#c9d1d9] leading-relaxed">
                    <strong className="text-white">Definition:</strong> Kinetic Energy ($KE$) is the energy an object possesses due to its motion.
                  </p>
                  <p className="text-xs text-[#c9d1d9] leading-relaxed">
                    <strong className="text-white">The Equation:</strong> $KE = \frac{1}{2}mv^2$, where $m$ is mass and $v$ is velocity.
                  </p>
                </div>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2 text-[10px]">
                  <h5 className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest mb-1">Proportionality</h5>
                  <ul className="space-y-2 text-[#8b949e]">
                    <li className="flex items-start gap-2">
                       <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0" />
                       <span className="text-[#c9d1d9]"><strong className="text-white">Mass:</strong> Doubling mass doubles the energy (Linear).</span>
                    </li>
                    <li className="flex items-start gap-2">
                       <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0" />
                       <span className="text-[#c9d1d9]"><strong className="text-white">Velocity:</strong> Doubling speed quadruples the energy (Squared).</span>
                    </li>
                    <li className="flex items-start gap-2 pt-2 border-t border-white/5">
                       <TrendingUp size={12} className="text-blue-400 mt-0.5 shrink-0" />
                       <span className="text-[#c9d1d9]"><strong className="text-white">Work-Energy Theorem:</strong> $W = \Delta KE$. Work done equals energy change.</span>
                    </li>
                  </ul>
                </div>
              </div>
           </div>
           <p className="text-[9px] text-[#484f58] uppercase font-bold tracking-tighter mt-4">
              EduTech Era // Module PH-04
           </p>
        </div>
      </div>

      {/* Graphs - Data Linearization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] flex items-center gap-2">
              <TrendingUp size={14} className="text-yellow-500" />
              Parabolic: KE vs Velocity
            </h4>
            <span className="text-[9px] px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20 font-bold uppercase">Non-Linear</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#161b22" />
                <XAxis dataKey="v" stroke="#484f58" fontSize={10} label={{ value: 'Velocity (m/s)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#484f58' }} />
                <YAxis stroke="#484f58" fontSize={10} label={{ value: 'Energy (J)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#484f58' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', fontSize: '10px' }}
                />
                <Line type="monotone" dataKey="ke" stroke="#eab308" strokeWidth={3} dot={false} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e] flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-500" />
              Linear: KE vs Velocity²
            </h4>
            <span className="text-[9px] px-2 py-1 bg-blue-500/10 text-blue-500 rounded border border-blue-500/20 font-bold uppercase">Linearized</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#161b22" />
                <XAxis dataKey="vSq" stroke="#484f58" fontSize={10} label={{ value: 'Velocity² (m²/s²)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#484f58' }} />
                <YAxis stroke="#484f58" fontSize={10} hide />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', fontSize: '10px' }}
                />
                <Line type="monotone" dataKey="ke" stroke="#3b82f6" strokeWidth={3} dot={false} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lab Videos & Quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lab Video Summaries */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-2">
              <PlayCircle size={16} className="text-red-500" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8b949e]">Curated Demonstrations</h4>
           </div>
           {[
             { title: "Kinetic Energy Modeling", duration: "3:15", desc: "Modeling instruction lab exploring the KE-Velocity relationship.", url: "https://www.youtube.com/embed/jOeUlYaikJ4" },
             { title: "Potential vs Kinetic Energy", duration: "4:50", desc: "Energy Ramp Lab calculating conversion for varied heights.", url: "https://www.youtube.com/embed/DfzBYhO8aoY" }
           ].map((v, i) => (
             <div key={i} className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl flex gap-4 items-center group cursor-pointer hover:bg-[#30363d]/30 transition-all overflow-hidden" 
                  onClick={() => window.open(v.url.replace('/embed/', '/watch?v='), '_blank')}>
                <div className="w-16 h-10 rounded-lg bg-black flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform shrink-0">
                  <PlayCircle size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white truncate">{v.title}</span>
                    <span className="text-[10px] text-[#484f58] font-mono shrink-0 ml-2">{v.duration}</span>
                  </div>
                  <p className="text-[10px] text-[#8b949e] line-clamp-1">{v.desc}</p>
                </div>
             </div>
           ))}
           <div className="aspect-video w-full rounded-2xl border border-[#30363d] overflow-hidden bg-black mt-4">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/jOeUlYaikJ4"
                title="Kinetic Energy Demonstration"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="opacity-70"
              />
           </div>
        </div>

        {/* Mini Quiz */}
        <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-8 relative flex flex-col justify-center min-h-[400px]">
          {/* Action Buttons & Code Snippet */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="flex items-center justify-center gap-2 py-3 bg-[#161b22] border border-[#30363d] rounded-xl font-bold text-[10px] uppercase tracking-widest text-white hover:bg-[#30363d] transition-all"
              onClick={() => {
                const script = `import matplotlib.pyplot as plt\nimport numpy as np\n\nm = ${mass}\nv = np.linspace(0, 20, 100)\nke = 0.5 * m * v**2\n\nplt.figure(figsize=(10, 5))\nplt.subplot(1, 2, 1)\nplt.plot(v, ke)\nplt.title('KE vs Velocity')\n\nplt.subplot(1, 2, 2)\nplt.plot(v**2, ke)\nplt.title('KE vs Velocity Squared')\nplt.show()`;
                navigator.clipboard.writeText(script);
                alert("Python Analysis Script copied to clipboard!");
              }}
            >
              <FileText size={16} className="text-blue-400" />
              Copy Python Script
            </button>
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3 flex items-center justify-center gap-2 text-[9px] font-mono text-[#8b949e]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Formula Engine Active
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showQuizResult ? (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-yellow-500">
                     <HelpCircle size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Checkpoint Quiz</span>
                   </div>
                   <span className="text-[10px] font-mono text-[#484f58]">Question {quizStep + 1} / 3</span>
                </div>
                
                <h3 className="text-lg font-bold text-white leading-snug">
                  {quizQuestions[quizStep].q}
                </h3>

                <div className="space-y-3">
                  {quizQuestions[quizStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="w-full text-left p-4 rounded-xl border border-[#30363d] bg-black/40 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-xs text-[#c9d1d9] group flex justify-between items-center"
                    >
                      {opt}
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto text-green-500">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white italic">Lab Completion Verified</h3>
                  <p className="text-xs text-[#8b949e] mt-1 uppercase tracking-widest font-bold">Work-Energy Proficiency: 100%</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-black/40 p-4 rounded-xl border border-[#30363d]">
                    <div className="text-[10px] font-bold text-[#484f58] uppercase mb-1">XP Earned</div>
                    <div className="text-xl font-mono text-yellow-500">+1,250</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-[#30363d]">
                    <div className="text-[10px] font-bold text-[#484f58] uppercase mb-1">Rank</div>
                    <div className="text-xl font-mono text-blue-400">Junior Physicist</div>
                  </div>
                </div>
                <button 
                  onClick={resetQuiz}
                  className="flex items-center gap-2 mx-auto text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors"
                >
                  <RotateCcw size={12} />
                  Retake Assessment
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
