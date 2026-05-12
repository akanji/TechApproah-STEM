import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  ChevronRight, 
  Zap, 
  BookOpen, 
  CheckCircle2, 
  Search, 
  ArrowLeft,
  X,
  ExternalLink
} from "lucide-react";
import resourcesData from "../resources.json";
import { useUser } from "./UserContext";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";

interface Resource {
  id: string;
  title: string;
  description: string;
  insights: {
    summary: string[];
    deep_dive: string[];
  };
}

const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-blue-500/20 text-blue-300 rounded-sm px-0.5">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export function ResourceHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Resource | null>(null);
  const { user, progress } = useUser();

  const filteredResources = resourcesData.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWatch = async (video: Resource) => {
    setSelectedVideo(video);
    if (user) {
      const progressRef = doc(db, 'users', user.uid, 'progress', video.id);
      try {
        await setDoc(progressRef, {
          labId: video.id,
          userId: user.uid,
          completed: true,
          score: 100,
          watched: true,
          lastAttemptAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/progress/${video.id}`);
      }
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="text-blue-400" /> Resource Hub
        </h2>
        <span className="text-[10px] font-bold text-[#484f58] uppercase tracking-widest bg-[#161b22] px-3 py-1 rounded-full border border-[#30363d]">
          NotebookLM Layer Active
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484f58]" size={16} />
        <input 
          placeholder="Search study modules..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500/40 transition-all" 
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredResources.map(video => {
          const isWatched = progress[video.id]?.completed || progress[video.id]?.watched;
          return (
            <motion.div 
              key={video.id}
              layoutId={video.id}
              onClick={() => handleWatch(video)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden ${
                isWatched 
                  ? "bg-[#161b22] border-emerald-500/20" 
                  : "bg-[#161b22] border-[#30363d] hover:border-blue-500/30"
              }`}
            >
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#0d162d] border border-blue-500/10 flex items-center justify-center relative flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Play size={24} fill="currentColor" className="text-blue-400 translate-x-0.5" />
                  {isWatched && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-[#161b22]">
                      <CheckCircle2 size={10} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold group-hover:text-blue-400 transition-colors uppercase tracking-tight text-sm">
                    <HighlightText text={video.title} highlight={searchQuery} />
                  </h3>
                  <p className="text-[#8b949e] text-xs mt-1 leading-relaxed line-clamp-2">
                    <HighlightText text={video.description} highlight={searchQuery} />
                  </p>
                  
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    Watch & Take AI Notes <ChevronRight size={12} />
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#484f58] group-hover:text-blue-400 mt-1 transition-colors group-hover:hidden" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex flex-col bg-[#0d1117]">
            <div className="flex items-center justify-between p-4 border-b border-[#30363d]">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="flex items-center gap-2 text-[#8b949e] hover:text-white transition-colors uppercase font-bold text-[10px] tracking-widest"
              >
                <ArrowLeft size={16} /> Close Study
              </button>
              <h1 className="text-xs font-bold text-white uppercase tracking-tighter">{selectedVideo.title}</h1>
              <div className="w-20" /> {/* Spacer */}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
                {/* Video Player */}
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-[#30363d]">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                    title={selectedVideo.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  />
                </div>

                {/* AI Notes Layer */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      <Zap size={20} fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold uppercase tracking-widest text-xs">NotebookLM Reasoning Layer</h3>
                      <p className="text-[10px] text-[#484f58] font-mono">Source Insight Pass • 2026 AI Verified</p>
                    </div>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 space-y-6 shadow-xl">
                    <section className="space-y-4">
                      <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Source Summary</h4>
                      <ul className="space-y-3">
                        {selectedVideo.insights.summary.map((point, i) => (
                          <li key={i} className="flex gap-3 text-sm text-[#8b949e] leading-relaxed">
                            <span className="text-emerald-500 font-bold flex-shrink-0">✓</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="space-y-4 pt-6 border-t border-[#30363d]">
                      <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Deep Dive Questions</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedVideo.insights.deep_dive.map((q, i) => (
                          <div key={i} className="p-4 bg-[#0d162d] border border-blue-500/10 rounded-2xl group hover:border-blue-500/30 transition-all">
                            <p className="text-white text-xs font-medium leading-relaxed italic">"{q}"</p>
                            <button className="mt-3 text-[9px] font-bold text-blue-400 flex items-center gap-1 uppercase tracking-widest group-hover:gap-2 transition-all">
                              Ask AI Expert <ChevronRight size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <button 
                    onClick={() => setSelectedVideo(null)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} /> Mark as Mastered
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
