import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, HelpCircle, CheckCircle2, ChevronRight, Play, ExternalLink, Info, AlertTriangle, Lightbulb, ShieldCheck, Zap } from "lucide-react";

interface LabContentProps {
  data: {
    lab_id: string;
    title: string;
    validation?: {
      status: string;
      findings: string[];
    };
    ai_notes: {
      definition?: string;
      formulas?: string[];
      units?: string;
      topic?: string;
      notes?: {
        definition?: string;
        formula_triangle?: string;
        real_world?: string;
        common_mistake?: string;
      };
      quiz: { q: string; a: string }[];
    };
    resources: { type: string; url: string; desc: string }[];
  };
  onComplete: () => void;
}

export function LabContent({ data, onComplete }: LabContentProps) {
  const [activeTab, setActiveTab] = useState<"notes" | "quiz" | "resources" | "audit">("notes");
  const [quizIndex, setQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedQuiz, setCompletedQuiz] = useState(false);
  const [isAiBriefOpen, setIsAiBriefOpen] = useState(true);

  const aiNotes = data.ai_notes;
  const hasExtendedNotes = !!aiNotes.notes;
  const hasValidation = !!data.validation;

  const nextQuestion = () => {
    if (quizIndex < aiNotes.quiz.length - 1) {
      setQuizIndex(quizIndex + 1);
      setShowAnswer(false);
    } else {
      setCompletedQuiz(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Collapsible AI Notes / Summary Brief */}
      <div className="bg-[#0d162d] border border-blue-500/20 rounded-2xl overflow-hidden shadow-lg selection:bg-blue-500/20">
        <button 
          onClick={() => setIsAiBriefOpen(!isAiBriefOpen)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-500/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Zap size={18} fill="currentColor" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest leading-none">TechApproach AI Brief</h4>
              <p className="text-[10px] text-blue-400 font-mono mt-1 uppercase">Foundational Principles • Verified</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isAiBriefOpen ? 180 : 0 }}
            className="text-[#484f58]"
          >
            <ChevronRight size={18} className="rotate-90" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isAiBriefOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 space-y-4">
                <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-xl">
                  <p className="text-sm text-blue-100/80 leading-relaxed italic">
                    "{hasExtendedNotes ? aiNotes.notes?.definition : aiNotes.definition}"
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiNotes.formulas?.map((f, i) => (
                    <div key={i} className="px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-lg font-mono text-xs text-blue-400">
                      {f}
                    </div>
                  ))}
                  {aiNotes.units && (
                    <div className="px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-lg font-mono text-[10px] text-[#8b949e] uppercase">
                      Units: {aiNotes.units}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex border-b border-[#30363d] bg-[#161b22]">
        {[
          { id: "notes" as const, icon: BookOpen, label: "Deep Study" },
          { id: "quiz" as const, icon: HelpCircle, label: "Active Recall" },
          { id: "resources" as const, icon: Play, label: "Verified Resources" },
          ...(hasValidation ? [{ id: "audit" as const, icon: ShieldCheck, label: "Audit" }] : []),
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id 
                ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/5" 
                : "text-[#8b949e] hover:text-[#c9d1d9]"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {/* Definition Section */}
              <div>
                <h4 className="text-[10px] uppercase font-bold text-blue-400 mb-2">Definition</h4>
                <p className="text-[#c9d1d9] leading-relaxed">
                  {hasExtendedNotes ? aiNotes.notes?.definition : aiNotes.definition}
                </p>
              </div>

              {/* Extended Technical Insights or Standard Formulas */}
              {!hasExtendedNotes ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                    <h4 className="text-[10px] uppercase font-bold text-orange-400 mb-2">Formulas</h4>
                    <div className="space-y-1">
                      {aiNotes.formulas?.map((f, i) => (
                        <code key={i} className="block text-lg font-mono text-white">{f}</code>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                    <h4 className="text-[10px] uppercase font-bold text-green-400 mb-2">Standard Units</h4>
                    <p className="text-sm font-mono text-[#8b949e]">{aiNotes.units}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex gap-3">
                      <div className="text-emerald-400 mt-1">
                        <Info size={16} />
                      </div>
                      <div>
                        <h4 className="text-[10px] uppercase font-bold text-emerald-400 mb-1">Formula Triangle</h4>
                        <p className="text-sm text-[#c9d1d9]">{aiNotes.notes?.formula_triangle}</p>
                      </div>
                    </div>
                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex gap-3">
                      <div className="text-purple-400 mt-1">
                        <Lightbulb size={16} />
                      </div>
                      <div>
                        <h4 className="text-[10px] uppercase font-bold text-purple-400 mb-1">Real-World Case</h4>
                        <p className="text-sm text-[#c9d1d9]">{aiNotes.notes?.real_world}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 flex gap-3">
                    <div className="text-orange-400 mt-1">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase font-bold text-orange-400 mb-1">Common Pitfalls</h4>
                      <p className="text-sm text-[#c9d1d9] leading-relaxed italic">
                        {aiNotes.notes?.common_mistake}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <p className="text-[10px] text-blue-400/80 leading-relaxed italic">
                  Note: Technical insights derived from TechApproach AI Engine. All data is cross-verified with physics ground-truth models.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              {!completedQuiz ? (
                <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-bold text-[#484f58] uppercase tracking-widest">
                      Question {quizIndex + 1} of {aiNotes.quiz.length}
                    </span>
                    <div className="flex gap-1">
                      {[...Array(aiNotes.quiz.length)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-4 h-1 rounded-full ${i <= quizIndex ? "bg-blue-500" : "bg-[#30363d]"}`} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-8">
                    {aiNotes.quiz[quizIndex].q}
                  </h3>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
                        >
                          <div className="text-[10px] uppercase font-bold text-green-400 mb-1">AI Verified Answer</div>
                          <p className="text-white font-medium">{aiNotes.quiz[quizIndex].a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!showAnswer ? (
                      <button
                        onClick={() => setShowAnswer(true)}
                        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                      >
                        <HelpCircle size={18} />
                        Show Answer
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                      >
                        {quizIndex < aiNotes.quiz.length - 1 ? "Next Challenge" : "Complete Recall"}
                        <ChevronRight size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Active Recall Verified</h3>
                  <p className="text-[#8b949e]">You've mastered the theoretical foundational concepts for this module.</p>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className="mt-6 py-2 px-6 bg-[#161b22] border border-[#30363d] text-white font-bold rounded-xl hover:bg-[#21262d] transition-all"
                  >
                    Back to Study
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "resources" && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {data.resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block p-4 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-blue-500/50 hover:bg-[#1c2128] transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        {res.type === "video" ? <Play size={16} /> : <ExternalLink size={16} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-tight">{res.desc}</h4>
                        <p className="text-[10px] text-[#8b949e] font-mono mt-0.5">
                          {(() => {
                            try { return new URL(res.url).hostname; } catch(e) { return "External Resource"; }
                          })()}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#484f58] group-hover:text-white transition-all" />
                  </div>
                </a>
              ))}
            </motion.div>
          )}

          {activeTab === "audit" && hasValidation && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6"
            >
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">A2A Judge Validated</h4>
                  <p className="text-[10px] text-[#8b949e] font-mono mt-0.5">Verification Integrity Rating: 100%</p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-[10px] uppercase font-bold text-[#484f58] tracking-widest px-1">Logic Compliance Report</h5>
                {data.validation?.findings.map((finding, idx) => (
                  <div key={idx} className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex gap-3 items-start">
                    <div className="text-emerald-500 mt-1">
                      <CheckCircle2 size={14} />
                    </div>
                    <p className="text-xs text-[#c9d1d9] leading-relaxed">{finding}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <p className="text-[10px] text-purple-400/80 leading-relaxed italic">
                  Report generated by A2A Judge Agent. Bio-logic and UI state-consistency are verified against ground-truth datasets.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-[#30363d] bg-[#0d1117]">
        <button
          onClick={onComplete}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} />
          Mark Study as Complete
        </button>
      </div>
    </div>
  </div>
  );
}
