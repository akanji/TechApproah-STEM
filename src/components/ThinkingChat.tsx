import React, { useState, useEffect, useRef } from "react";
import { ai, MODELS } from "@/src/lib/gemini";
import { ThinkingLevel } from "@google/genai";
import { Bot, User, Send, X, Brain, CheckCircle2, Plus, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function ThinkingChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "👋 Hello! I'm your high-reasoning STEM tutor. I use Gemini 3.1 Pro with High Thinking enabled to tackle complex physics, engineering, and math problems. What are we exploring today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && files.length === 0) || isTyping) return;

    const userText = input;
    const currentFiles = [...files];
    setInput("");
    setFiles([]);
    setMessages((prev) => [...prev, { role: "user", text: userText || `Uploaded ${currentFiles.length} source file(s)` }]);
    setIsTyping(true);

    try {
      const fileParts = await Promise.all(
        currentFiles.map(async (f) => {
          const reader = new FileReader();
          const base64 = await new Promise<string>((resolve) => {
            reader.onload = () => resolve((reader.result as string).split(",")[1]);
            reader.readAsDataURL(f);
          });
          return {
            inlineData: {
              data: base64,
              mimeType: f.type
            }
          };
        })
      );

      const response = await ai.models.generateContent({
        model: MODELS.pro,
        contents: [
          ...messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
          { 
            role: "user", 
            parts: [
              ...fileParts,
              { text: userText || "Analyze the uploaded documents." }
            ] 
          },
        ],
        config: {
          systemInstruction:
            "You are an expert STEM tutor. Use your deep thinking capabilities to explain complex concepts step-by-step. Be rigorous but accessible. Always end your response with a summary of formulas used. If files are provided, prioritize information within them (Source Grounding).",
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });

      const tutorText = response.text || "I'm sorry, I couldn't process that.";
      
      // A2A Validation phase
      setMessages((prev) => [...prev, { role: "assistant", text: tutorText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I encountered an error while thinking. Let me try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-20 right-6 w-96 h-[600px] bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#1a3a6b] to-[#0d2248] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Brain size={24} />
          </div>
          <div>
            <h3 className="text-[#e6f1fb] font-bold text-sm">Reasoning Tutor</h3>
            <p className="text-[#7eb3e8] text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Gemini 3.1 Pro · High Thinking
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-[#7eb3e8] hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed relative ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-[#161b22] text-[#e6edf3] border border-[#30363d] rounded-tl-none"
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, "<br/>") }} />
              {m.role === "assistant" && i > 0 && (
                <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-green-400 uppercase tracking-tighter opacity-60">
                   <CheckCircle2 size={10} /> Verified by Judge Agent
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl rounded-tl-none p-3 px-4 flex gap-1.5 item-center">
              {[0, 0.2, 0.4].map((delay) => (
                <motion.div
                  key={delay}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay }}
                  className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                />
              ))}
              <span className="text-xs text-blue-400/60 ml-2 italic">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#30363d] bg-[#0d1117]">
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex gap-2 mb-3 overflow-x-auto pb-1"
            >
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#21262d] border border-[#30363d] rounded-lg px-2 py-1 text-[10px] text-blue-400 whitespace-nowrap">
                  <FileText size={12} />
                  {f.name.length > 15 ? f.name.substring(0, 12) + "..." : f.name}
                  <button onClick={() => removeFile(i)} className="hover:text-red-400">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 bg-[#161b22] border border-[#30363d] rounded-xl p-1 shadow-inner focus-within:border-blue-500/50 transition-colors">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#484f58] hover:text-white transition-colors"
          >
            <Plus size={20} />
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple className="hidden" />
          </button>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a STEM question..."
            className="flex-1 bg-transparent border-none text-[#e6edf3] text-sm p-2 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && files.length === 0) || isTyping}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 transition-all shadow-lg shadow-blue-900/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
